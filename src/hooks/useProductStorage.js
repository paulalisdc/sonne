// Hook personalizado para manejar el almacenamiento y sincronización de productos
import { useState, useEffect, useCallback } from 'react';
import { productService, syncService } from '../services/apiService';

const useProductStorage = () => {
  // Estados para manejar productos, carga, errores y conexión
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Cargar productos al inicializar y configurar sincronización
  useEffect(() => {
    loadProducts();
    setupOnlineSync();
  }, []);

  // Configurar sincronización online/offline
  const setupOnlineSync = useCallback(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Conexión recuperada');
      // Intentar sincronizar productos pendientes
      productService.syncPendingProducts();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Conexión perdida');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Configurar el servicio de sincronización
    syncService.setupOnlineSync();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar productos desde el servidor o localStorage
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const products = await productService.getProducts();
      setProductos(products);
    } catch (err) {
      setError('Error al cargar productos');
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar un nuevo producto
  const agregarProducto = useCallback(async (producto) => {
    try {
      setError(null);
      
      const nuevoProducto = await productService.createProduct(producto);
      setProductos(prev => [...prev, nuevoProducto]);
      
      return { success: true, producto: nuevoProducto };
    } catch (err) {
      setError('Error al agregar producto');
      console.error('Error agregando producto:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Actualizar un producto existente
  const actualizarProducto = useCallback(async (id, producto) => {
    try {
      setError(null);
      
      const productoActualizado = await productService.updateProduct(id, producto);
      setProductos(prev => 
        prev.map(p => p.id === id ? productoActualizado : p)
      );
      
      return { success: true, producto: productoActualizado };
    } catch (err) {
      setError('Error al actualizar producto');
      console.error('Error actualizando producto:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Eliminar un producto
  const eliminarProducto = useCallback(async (id) => {
    try {
      setError(null);
      
      await productService.deleteProduct(id);
      setProductos(prev => prev.filter(p => p.id !== id));
      
      return { success: true };
    } catch (err) {
      setError('Error al eliminar producto');
      console.error('Error eliminando producto:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Limpiar todos los productos
  const limpiarProductos = useCallback(async () => {
    try {
      setError(null);
      
      // Eliminar todos los productos del servidor si hay conexión
      if (isOnline) {
        for (const producto of productos) {
          try {
            await productService.deleteProduct(producto.id);
          } catch (err) {
            console.warn(`No se pudo eliminar producto ${producto.id} del servidor:`, err);
          }
        }
      }
      
      // Limpiar localStorage
      localStorage.removeItem('productos');
      localStorage.removeItem('pendingProducts');
      
      setProductos([]);
      
      return { success: true };
    } catch (err) {
      setError('Error al limpiar productos');
      console.error('Error limpiando productos:', err);
      return { success: false, error: err.message };
    }
  }, [productos, isOnline]);

  // Sincronizar productos pendientes
  const sincronizarProductos = useCallback(async () => {
    try {
      setError(null);
      await productService.syncPendingProducts();
      await loadProducts(); // Recargar productos después de sincronizar
      return { success: true };
    } catch (err) {
      setError('Error al sincronizar productos');
      console.error('Error sincronizando productos:', err);
      return { success: false, error: err.message };
    }
  }, [loadProducts]);

  return {
    productos,
    loading,
    error,
    isOnline,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    limpiarProductos,
    sincronizarProductos,
    recargarProductos: loadProducts
  };
};

export default useProductStorage; 