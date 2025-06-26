// Componente que muestra la tabla de productos con opciones de editar y eliminar
const TablaProductos = ({ productos, eliminarProducto, editarProducto, loading }) => {
  // Función para formatear precios en formato de moneda argentina
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
            {/* Iterar sobre cada producto para mostrar en la tabla */}
            {productos.map((p, index) => (
              <tr key={p.id || index}>
                <td>{p.fecha}</td>
                <td>{p.categoria}</td>
                <td>{p.producto}</td>
                <td>
                  {/* Mostrar imagen del producto si existe, sino mostrar texto */}
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
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                  ) : null}
                  <span className="text-muted" style={{ display: p.imagenUrl ? 'none' : 'inline' }}>
                    Sin imagen
                  </span>
                </td>
                <td>{p.cantidad}</td>
                <td className="text-end">{formatearMoneda(p.precio)}</td>
                <td className="text-end">{formatearMoneda(p.cantidad * p.precio)}</td>
                <td>
                  {/* Botones de editar y eliminar producto */}
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarProducto(index)}
                    title="Editar producto"
                    disabled={loading}
                  >
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarProducto(index)}
                    title="Eliminar producto"
                    disabled={loading}
                  >
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Mensaje cuando no hay productos */}
        {productos.length === 0 && !loading && (
          <div className="text-center py-4">
            <i className="fas fa-box-open text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mt-3">No hay productos cargados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaProductos;
