import { useState } from "react";
import "./ProductForm.css";

const ProductForm = () => {

  //martina
  
  const [formulario, setFormulario] = useState({
    categoria: "",
    producto: "",
    cantidad: "",
    precio: "",
  });

  const [productos, setProductos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const agregarProducto = (e) => {
    e.preventDefault();

    if (
      formulario.categoria === "" ||
      formulario.producto === "" ||
      formulario.cantidad === "" ||
      formulario.precio === ""
    ) {
      alert("Por favor completá todos los campos.");
      return;
    }

    const nuevoProducto = {
      ...formulario,
      cantidad: Number(formulario.cantidad),
      precio: Number(formulario.precio),
    };

    setProductos([...productos, nuevoProducto]);

    // Limpia el formulario
    setFormulario({
      categoria: "",
      producto: "",
      cantidad: "",
      precio: "",
    });

    console.log("Producto agregado:", nuevoProducto);
  };
  //martina
    return (
      <form className="product-form" onSubmit={agregarProducto}> 
        <h2>Agregar producto al stock</h2>
  
        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <select id="categoria" name="categoria" className="form-select" value={formulario.categoria}
        onChange={handleChange}>
            
            <option value="">Seleccionar</option>
            <option value="Aros">Aros</option>
            <option value="Collares">Collares</option>
            <option value="Pulseras">Pulseras</option>
            <option value="Anillos">Anillos</option>
            <option value="Relojes">Relojes</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
  
        <div className="mb-3">
          <label htmlFor="producto" className="form-label">Producto</label>
          <input
            type="text"
            id="producto"
            name="producto"
            className="form-control"
            placeholder="Ej: Collar IRIS"
             value={formulario.producto}
            onChange={handleChange}
          />
        </div>
  
        <div className="mb-3">
          <label htmlFor="cantidad" className="form-label">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            className="form-control"
            placeholder="Ej: 10"
            value={formulario.cantidad}
            onChange={handleChange}
          />
        </div>
  
        <div className="mb-3">
          <label htmlFor="precio" className="form-label">Precio unitario ($)</label>
          <input
            type="number"
            id="precio"
            name="precio"
            className="form-control"
            placeholder="Ej: 2500"
            value={formulario.precio}
            onChange={handleChange}
          />
        </div>
  
        <button type="submit" className="btn btn-primary">Agregar</button>
      </form>
    );
  };
  
  export default ProductForm;
  
  
