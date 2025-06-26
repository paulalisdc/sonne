import { useState } from "react";
import "./ProductForm.css";
import TablaProductos from "./TablaProductos";
import useLocalStorage from "../hooks/useLocalStorage";
import StorageInfo from "./StorageInfo";

const ProductForm = () => {
  const [formulario, setFormulario] = useState({
    categoria: "",
    producto: "",
    cantidad: "",
    precio: "",
    imagenUrl: "", // nuevo campo
  });

  const [productos, setProductos] = useLocalStorage("productos", []);
  const [errores, setErrores] = useState({});
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [mostrarExito, setMostrarExito] = useState(false);

  const iniciarEdicion = (index) => {
    const producto = productos[index];
    setFormulario({
      categoria: producto.categoria,
      producto: producto.producto,
      cantidad: producto.cantidad.toString(),
      precio: producto.precio.toString(),
      imagenUrl: producto.imagenUrl || "", // nuevo campo
    });
    setEditandoIndex(index);
  };

  const guardarEdicion = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const productoEditado = {
      ...formulario,
      producto: formulario.producto.trim(),
      cantidad: Number(formulario.cantidad),
      precio: Number(formulario.precio),
      fecha: productos[editandoIndex].fecha,
    };

    const nuevosProductos = [...productos];
    nuevosProductos[editandoIndex] = productoEditado;

    setProductos(nuevosProductos);
    setFormulario({
      categoria: "",
      producto: "",
      cantidad: "",
      precio: "",
      imagenUrl: "",
    });
    setErrores({});
    setEditandoIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorLimitado = value;

    if (name === "cantidad" && value.length > 3) {
      valorLimitado = value.slice(0, 3);
    } else if (name === "precio" && value.length > 5) {
      valorLimitado = value.slice(0, 5);
    }

    setFormulario({
      ...formulario,
      [name]: valorLimitado,
    });

    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: "",
      });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.categoria) {
      nuevosErrores.categoria = "Debe seleccionar una categoría";
    }

    if (!formulario.producto.trim()) {
      nuevosErrores.producto = "El nombre del producto es obligatorio";
    } else if (formulario.producto.trim().length < 2) {
      nuevosErrores.producto = "El nombre debe tener al menos 2 caracteres";
    } else if (formulario.producto.trim().length > 50) {
      nuevosErrores.producto = "El nombre no puede superar los 50 caracteres";
    } else if (!/^[a-zA-ZÀ-ÿ\s\d\-_]+$/.test(formulario.producto.trim())) {
      nuevosErrores.producto = "El nombre solo puede contener letras, números, espacios y guiones";
    }

    if (!formulario.cantidad) {
      nuevosErrores.cantidad = "La cantidad es obligatoria";
    } else {
      const cantidad = Number(formulario.cantidad);
      if (isNaN(cantidad) || cantidad <= 0) {
        nuevosErrores.cantidad = "La cantidad debe ser un número mayor a 0";
      } else if (cantidad > 200) {
        nuevosErrores.cantidad = "La cantidad no puede superar las 200 unidades";
      } else if (!Number.isInteger(cantidad)) {
        nuevosErrores.cantidad = "La cantidad debe ser un número entero";
      }
    }

    if (!formulario.precio) {
      nuevosErrores.precio = "El precio es obligatorio";
    } else {
      const precio = Number(formulario.precio);
      if (isNaN(precio) || precio <= 0) {
        nuevosErrores.precio = "El precio debe ser un número mayor a 0";
      } else if (precio > 10000) {
        nuevosErrores.precio = "El precio no puede superar $10,000";
      }
    }

    if (
      formulario.imagenUrl &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formulario.imagenUrl.trim())
    ) {
      nuevosErrores.imagenUrl = "Debe ser una URL válida de imagen (jpg, png, etc)";
    }

    const productoExistente = productos.find((p, index) => {
      const esMismoNombreYCategoria =
        p.categoria.toLowerCase() === formulario.categoria.toLowerCase() &&
        p.producto.toLowerCase().trim() === formulario.producto.toLowerCase().trim();

      const esOtroProducto = editandoIndex === null || index !== editandoIndex;

      return esMismoNombreYCategoria && esOtroProducto;
    });

    if (productoExistente) {
      nuevosErrores.producto = "Este producto ya existe en la categoría seleccionada";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const agregarProducto = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nuevoProducto = {
      ...formulario,
      producto: formulario.producto.trim(),
      cantidad: Number(formulario.cantidad),
      precio: Number(formulario.precio),
      fecha: new Date().toLocaleDateString(),
    };

    setProductos([...productos, nuevoProducto]);
    setFormulario({
      categoria: "",
      producto: "",
      cantidad: "",
      precio: "",
      imagenUrl: "",
    });
    setErrores({});
    setMostrarExito(true);
    setTimeout(() => setMostrarExito(false), 3000);
  };

  const limpiarStorage = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar todos los productos?")) {
      setProductos([]);
      setEditandoIndex(null);
      setFormulario({
        categoria: "",
        producto: "",
        cantidad: "",
        precio: "",
        imagenUrl: "",
      });
      setErrores({});
    }
  };

  return (
    <>
      <form
        className="product-form"
        onSubmit={editandoIndex === null ? agregarProducto : guardarEdicion}
      >
        <h2>Agregar producto al stock</h2>

        {mostrarExito && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <i className="fa fa-check-circle me-2" style={{ color: "#D8D7B2", fontSize: "1.2rem" }}></i>
            <span>¡Producto agregado exitosamente!</span>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            className={`form-select ${errores.categoria ? "is-invalid" : ""}`}
            value={formulario.categoria}
            onChange={handleChange}
          >
            <option value="">Seleccionar</option>
            <option value="Aros">Aros</option>
            <option value="Collares">Collares</option>
            <option value="Pulseras">Pulseras</option>
            <option value="Anillos">Anillos</option>
            <option value="Relojes">Relojes</option>
            <option value="Otros">Otros</option>
          </select>
          {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="producto" className="form-label">Producto</label>
          <input
            type="text"
            id="producto"
            name="producto"
            className={`form-control ${errores.producto ? "is-invalid" : ""}`}
            placeholder="Ej: Collar IRIS"
            value={formulario.producto}
            onChange={handleChange}
            maxLength={50}
          />
          {errores.producto && <div className="invalid-feedback">{errores.producto}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="cantidad" className="form-label">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            className={`form-control ${errores.cantidad ? "is-invalid" : ""}`}
            placeholder="Ej: 10"
            value={formulario.cantidad}
            onChange={handleChange}
            min="1"
            max="200"
          />
          {errores.cantidad && <div className="invalid-feedback">{errores.cantidad}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="precio" className="form-label">Precio unitario ($)</label>
          <input
            type="number"
            id="precio"
            name="precio"
            className={`form-control ${errores.precio ? "is-invalid" : ""}`}
            placeholder="Ej: 2500"
            value={formulario.precio}
            onChange={handleChange}
            min="0.01"
            max="10000"
            step="0.01"
          />
          {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="imagenUrl" className="form-label">Imagen (URL)</label>
          <input
            type="url"
            id="imagenUrl"
            name="imagenUrl"
            className={`form-control ${errores.imagenUrl ? "is-invalid" : ""}`}
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formulario.imagenUrl}
            onChange={handleChange}
          />
          {errores.imagenUrl && <div className="invalid-feedback">{errores.imagenUrl}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          {editandoIndex === null ? "Agregar" : "Guardar cambios"}
        </button>
      </form>

      <StorageInfo productos={productos} onClearStorage={limpiarStorage} />

      <TablaProductos
        productos={productos}
        eliminarProducto={(index) => {
          const nuevosProductos = productos.filter((_, i) => i !== index);
          setProductos(nuevosProductos);
        }}
        editarProducto={iniciarEdicion}
      />
    </>
  );
};

export default ProductForm;
