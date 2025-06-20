const TablaProductos = ({ productos, eliminarProducto, editarProducto }) => {

  return (
    <div className="tabla-productos">
      <h2>Stock cargado</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario ($)</th>
            <th>Total ($)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p, index) => (
            <tr key={index}>
              <td>{p.fecha}</td>
              <td>{p.categoria}</td>
              <td>{p.producto}</td>
              <td>{p.cantidad}</td>
              <td>{p.precio}</td>
              <td>{p.cantidad * p.precio}</td>
           <td>
  <button
    className="btn btn-warning btn-sm me-2"
    onClick={() => editarProducto(index)}
  >
    Editar
  </button>
  <button
    className="btn btn-danger btn-sm"
    onClick={() => {
      if (window.confirm(`¿Estás seguro que querés eliminar "${p.producto}" de la categoría "${p.categoria}"?`)) {
        eliminarProducto(index);
      }
    }}
  >
    Eliminar
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProductos;
