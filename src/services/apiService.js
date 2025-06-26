import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores de red
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('Error de API:', error.message);
    return Promise.reject(error);
  }
);

// Verificar si hay conexión a internet
const checkOnlineStatus = () => {
  return navigator.onLine;
};

// Servicio para manejar las operaciones de API y sincronización offline/online
export const productService = {
  // Obtener todos los productos
  async getProducts() {
    try {
      if (!checkOnlineStatus()) {
        throw new Error('Sin conexión a internet');
      }
      
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.warn('No se pudo obtener productos del servidor, usando localStorage:', error.message);
      // Fallback a localStorage
      const storedProducts = localStorage.getItem('productos');
      return storedProducts ? JSON.parse(storedProducts) : [];
    }
  },

  // Crear un nuevo producto
  async createProduct(product) {
    try {
      if (!checkOnlineStatus()) {
        throw new Error('Sin conexión a internet');
      }
      
      const response = await apiClient.post('/products', product);
      
      // Guardar en localStorage como respaldo
      const storedProducts = JSON.parse(localStorage.getItem('productos') || '[]');
      storedProducts.push(response.data);
      localStorage.setItem('productos', JSON.stringify(storedProducts));
      
      return response.data;
    } catch (error) {
      console.warn('No se pudo crear producto en el servidor, guardando solo en localStorage:', error.message);
      
      // Guardar solo en localStorage
      const storedProducts = JSON.parse(localStorage.getItem('productos') || '[]');
      const newProduct = { ...product, id: Date.now(), fecha: new Date().toLocaleDateString() };
      storedProducts.push(newProduct);
      localStorage.setItem('productos', JSON.stringify(storedProducts));
      
      return newProduct;
    }
  },

  // Actualizar un producto
  async updateProduct(id, product) {
    try {
      if (!checkOnlineStatus()) {
        throw new Error('Sin conexión a internet');
      }
      
      const response = await apiClient.put(`/products/${id}`, product);
      
      // Actualizar en localStorage
      const storedProducts = JSON.parse(localStorage.getItem('productos') || '[]');
      const index = storedProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        storedProducts[index] = response.data;
        localStorage.setItem('productos', JSON.stringify(storedProducts));
      }
      
      return response.data;
    } catch (error) {
      console.warn('No se pudo actualizar producto en el servidor, actualizando solo en localStorage:', error.message);
      
      // Actualizar solo en localStorage
      const storedProducts = JSON.parse(localStorage.getItem('productos') || '[]');
      const index = storedProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        storedProducts[index] = { ...product, id, fecha: storedProducts[index].fecha };
        localStorage.setItem('productos', JSON.stringify(storedProducts));
        return storedProducts[index];
      }
      
      throw new Error('Producto no encontrado');
    }
  },

  // Eliminar un producto
  async deleteProduct(id) {
    try {
      if (!checkOnlineStatus()) {
        throw new Error('Sin conexión a internet');
      }
      
      await apiClient.delete(`/products/${id}`);
      
      // Eliminar de localStorage
      const storedProducts = JSON.parse(localStorage.getItem('productos') || '[]');
      const filteredProducts = storedProducts.filter(p => p.id !== id);
      localStorage.setItem('productos', JSON.stringify(filteredProducts));
      
      return true;
    } catch (error) {
      console.warn('No se pudo eliminar producto del servidor, eliminando solo de localStorage:', error.message);
      
      // Eliminar solo de localStorage
      const storedProducts = JSON.parse(localStorage.getItem('productos') || '[]');
      const filteredProducts = storedProducts.filter(p => p.id !== id);
      localStorage.setItem('productos', JSON.stringify(filteredProducts));
      
      return true;
    }
  },

  // Sincronizar productos pendientes cuando se recupera la conexión
  async syncPendingProducts() {
    const pendingProducts = JSON.parse(localStorage.getItem('pendingProducts') || '[]');
    
    if (pendingProducts.length === 0) return;
    
    try {
      if (!checkOnlineStatus()) {
        throw new Error('Sin conexión a internet');
      }
      
      // Procesar productos pendientes
      for (const pending of pendingProducts) {
        try {
          if (pending.action === 'create') {
            await this.createProduct(pending.product);
          } else if (pending.action === 'update') {
            await this.updateProduct(pending.product.id, pending.product);
          } else if (pending.action === 'delete') {
            await this.deleteProduct(pending.product.id);
          }
        } catch (error) {
          console.error('Error sincronizando producto pendiente:', error);
        }
      }
      
      // Limpiar productos pendientes
      localStorage.removeItem('pendingProducts');
      console.log('Sincronización completada');
    } catch (error) {
      console.warn('No se pudo sincronizar productos pendientes:', error.message);
    }
  }
};

// Servicio de sincronización - maneja la cola de operaciones pendientes
export const syncService = {
  // Agregar producto a la cola de sincronización
  addToPendingQueue(action, product) {
    const pendingProducts = JSON.parse(localStorage.getItem('pendingProducts') || '[]');
    pendingProducts.push({ action, product, timestamp: Date.now() });
    localStorage.setItem('pendingProducts', JSON.stringify(pendingProducts));
  },

  // Verificar y sincronizar cuando se recupera la conexión
  setupOnlineSync() {
    window.addEventListener('online', async () => {
      console.log('Conexión recuperada, sincronizando...');
      await productService.syncPendingProducts();
    });

    window.addEventListener('offline', () => {
      console.log('Conexión perdida, usando modo offline');
    });
  }
};

export default apiClient; 