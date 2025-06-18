const TablaProductos = ({ productos }) => {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProductos;
