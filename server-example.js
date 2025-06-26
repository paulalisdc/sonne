const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Almacenamiento en memoria (en producción usarías una base de datos)
let products = [];

// Rutas de la API
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { categoria, producto, cantidad, precio, imagenUrl } = req.body;
  
  const newProduct = {
    id: Date.now(),
    categoria,
    producto,
    cantidad: Number(cantidad),
    precio: Number(precio),
    imagenUrl: imagenUrl || '',
    fecha: new Date().toLocaleDateString()
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { categoria, producto, cantidad, precio, imagenUrl } = req.body;
  
  const productIndex = products.findIndex(p => p.id === Number(id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  const updatedProduct = {
    ...products[productIndex],
    categoria,
    producto,
    cantidad: Number(cantidad),
    precio: Number(precio),
    imagenUrl: imagenUrl || ''
  };
  
  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  const productIndex = products.findIndex(p => p.id === Number(id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  products.splice(productIndex, 1);
  res.status(204).send();
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
});

module.exports = app; 