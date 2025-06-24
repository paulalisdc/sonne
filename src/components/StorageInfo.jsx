import React from 'react';

const StorageInfo = ({ productos, onClearStorage }) => {
  const totalProductos = productos.length;

  return (
    <div className="text-end mt-4">
      <button 
        className="btn btn-outline-danger"
        onClick={onClearStorage}
        disabled={totalProductos === 0}
      >
        Limpiar todos los datos
      </button>
    </div>
  );
};

export default StorageInfo; 