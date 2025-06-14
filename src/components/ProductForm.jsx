import { useState } from "react";
import "./ProductForm.css";

const ProductForm = () => {
    return (
      <form className="product-form">
        <h2>Agregar producto al stock</h2>
  
        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <select id="categoria" name="categoria" className="form-select">
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
          />
        </div>
  
        <button type="submit" className="btn btn-primary">Agregar</button>
      </form>
    );
  };
  
  export default ProductForm;
  
  
