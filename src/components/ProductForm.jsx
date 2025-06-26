// Componente principal para gestionar productos (agregar, editar, eliminar)
import { useState } from "react";
import "./ProductForm.css";
import TablaProductos from "./TablaProductos";
import useProductStorage from "../hooks/useProductStorage";
import StorageInfo from "./StorageInfo";
import ConnectionStatus from "./ConnectionStatus";

const ProductForm = () => {
  // Estado del formulario con los campos del producto
  const [formulario, setFormulario] = useState({
    categoria: "",
    producto: "",
    cantidad: "",
    precio: "",
    imagenUrl: "",
  });

  // Hook personalizado para manejar el almacenamiento de productos
  const {
    productos,
    loading,
    error,
    isOnline,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    limpiarProductos,
    sincronizarProductos
  } = useProductStorage();

  // Estados para manejar errores, edición y feedback
  const [errores, setErrores] = useState({});
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [operacionLoading, setOperacionLoading] = useState(false);

  // Función para iniciar la edición de un producto
  const iniciarEdicion = (index) => {
    const producto = productos[index];
    setFormulario({
      categoria: producto.categoria,
      producto: producto.producto,
      cantidad: producto.cantidad.toString(),
      precio: producto.precio.toString(),
      imagenUrl: producto.imagenUrl || "",
    });
    setEditandoIndex(index);
  };

  // Función para guardar los cambios de un producto editado
  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setOperacionLoading(true);
    
    const productoEditado = {
      categoria: formulario.categoria,
      producto: formulario.producto.trim(),
      cantidad: Number(formulario.cantidad),
      precio: Number(formulario.precio),
      imagenUrl: formulario.imagenUrl,
    };

    const resultado = await actualizarProducto(productos[editandoIndex].id, productoEditado);
    
    if (resultado.success) {
      setFormulario({
        categoria: "",
        producto: "",
        cantidad: "",
        precio: "",
        imagenUrl: "",
      });
      setErrores({});
      setEditandoIndex(null);
      setMostrarExito(true);
      setTimeout(() => setMostrarExito(false), 3000);
    } else {
      // Mostrar error si falla la actualización
      console.error('Error al actualizar:', resultado.error);
    }
    
    setOperacionLoading(false);
  };

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorLimitado = value;

    // Limitar longitud de campos numéricos
    if (name === "cantidad" && value.length > 3) {
      valorLimitado = value.slice(0, 3);
    } else if (name === "precio" && value.length > 5) {
      valorLimitado = value.slice(0, 5);
    }

    setFormulario({
      ...formulario,
      [name]: valorLimitado,
    });

    // Limpiar error del campo si existe
    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: "",
      });
    }
  };

  // Función para validar todos los campos del formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validaciones para cada campo
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

    // Validar URL de imagen si se proporciona
    if (
      formulario.imagenUrl &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formulario.imagenUrl.trim())
    ) {
      nuevosErrores.imagenUrl = "Debe ser una URL válida de imagen (jpg, png, etc)";
    }

    // Verificar que no exista un producto con el mismo nombre en la misma categoría
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

  // Función para agregar un nuevo producto
  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setOperacionLoading(true);

    const nuevoProducto = {
      categoria: formulario.categoria,
      producto: formulario.producto.trim(),
      cantidad: Number(formulario.cantidad),
      precio: Number(formulario.precio),
      imagenUrl: formulario.imagenUrl,
    };

    const resultado = await agregarProducto(nuevoProducto);
    
    if (resultado.success) {
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
    } else {
      // Mostrar error si falla la creación
      console.error('Error al agregar:', resultado.error);
    }
    
    setOperacionLoading(false);
  };

  // Función para eliminar un producto
  const handleEliminarProducto = async (index) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      const producto = productos[index];
      await eliminarProducto(producto.id);
    }
  };

  // Función para limpiar todos los productos del almacenamiento
  const handleLimpiarStorage = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar todos los productos?")) {
      await limpiarProductos();
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

  // Mostrar spinner de carga mientras se cargan los productos
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando productos...</p>
      </div>
    );
  }

  return (
    <>
      {/* Componente para mostrar estado de conexión y sincronización */}
      <ConnectionStatus 
        isOnline={isOnline}
        onSync={sincronizarProductos}
        loading={operacionLoading}
        error={error}
      />

      {/* Formulario principal para agregar/editar productos */}
      <form
        className="product-form"
        onSubmit={editandoIndex === null ? handleAgregarProducto : guardarEdicion}
      >
        <h2>Agregar producto al stock</h2>

        {/* Mensaje de éxito */}
        {mostrarExito && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <i className="fa fa-check-circle me-2" style={{ color: "#D8D7B2", fontSize: "1.2rem" }}></i>
            <span>¡Producto {editandoIndex === null ? 'agregado' : 'actualizado'} exitosamente!</span>
          </div>
        )}

        {/* Campo de categoría */}
        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            className={`form-select ${errores.categoria ? "is-invalid" : ""}`}
            value={formulario.categoria}
            onChange={handleChange}
            disabled={operacionLoading}
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

        {/* Campo de nombre del producto */}
        <div className="mb-3">
          <label htmlFor="producto" className="form-label">Producto</label>
          <input
            type="text"
            id="producto"
            name="producto"
            className={`form-control ${errores.producto ? "is-invalid" : ""}`}
            placeholder="Nombre del producto"
            value={formulario.producto}
            onChange={handleChange}
            disabled={operacionLoading}
          />
          {errores.producto && <div className="invalid-feedback">{errores.producto}</div>}
        </div>

        {/* Campos de cantidad y precio en fila */}
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="cantidad" className="form-label">Cantidad</label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                className={`form-control ${errores.cantidad ? "is-invalid" : ""}`}
                placeholder="0"
                value={formulario.cantidad}
                onChange={handleChange}
                disabled={operacionLoading}
              />
              {errores.cantidad && <div className="invalid-feedback">{errores.cantidad}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="precio" className="form-label">Precio ($)</label>
              <input
                type="number"
                id="precio"
                name="precio"
                className={`form-control ${errores.precio ? "is-invalid" : ""}`}
                placeholder="0.00"
                value={formulario.precio}
                onChange={handleChange}
                disabled={operacionLoading}
              />
              {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
            </div>
          </div>
        </div>

        {/* Campo de URL de imagen */}
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
            disabled={operacionLoading}
          />
          {errores.imagenUrl && <div className="invalid-feedback">{errores.imagenUrl}</div>}
        </div>

        {/* Botón de envío del formulario */}
        <button 
          type="submit" 
          className={`btn btn-primary ${operacionLoading ? 'loading' : ''}`}
          disabled={operacionLoading}
        >
          {operacionLoading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>
              {editandoIndex === null ? "Agregando..." : "Guardando..."}
            </>
          ) : (
            editandoIndex === null ? "Agregar" : "Guardar cambios"
          )}
        </button>
      </form>

      {/* Componente para mostrar información del almacenamiento */}
      <StorageInfo productos={productos} onClearStorage={handleLimpiarStorage} />

      {/* Tabla que muestra todos los productos */}
      <TablaProductos
        productos={productos}
        eliminarProducto={handleEliminarProducto}
        editarProducto={iniciarEdicion}
        loading={operacionLoading}
      />
    </>
  );
};

export default ProductForm;
