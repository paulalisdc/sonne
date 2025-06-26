const TablaProductos = ({ productos, eliminarProducto, editarProducto }) => {
  const formatearMoneda = (valor) => {
    return `$${Number(valor).toLocaleString("es-AR")}`;
  };

  return (
    <div className="tabla-productos">
      <h2>Stock cargado</h2>
      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Producto</th>
              <th>Imagen</th>
              <th>Cantidad</th>
              <th className="text-end">Precio ($)</th>
              <th className="text-end">Total ($)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, index) => (
              <tr key={index}>
                <td>{p.fecha}</td>
                <td>{p.categoria}</td>
                <td>{p.producto}</td>
                <td>
                  {p.imagenUrl ? (
                    <img
                      src={p.imagenUrl}
                      alt={p.producto}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <span className="text-muted">Sin imagen</span>
                  )}
                </td>
                <td>{p.cantidad}</td>
                <td className="text-end">{formatearMoneda(p.precio)}</td>
                <td className="text-end">{formatearMoneda(p.cantidad * p.precio)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarProducto(index)}
                    title="Editar producto"
                  >
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          `¿Estás seguro que querés eliminar "${p.producto}" de la categoría "${p.categoria}"?`
                        )
                      ) {
                        eliminarProducto(index);
                      }
                    }}
                    title="Eliminar producto"
                  >
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaProductos;
