import React from 'react';
import './ConnectionStatus.css';

const ConnectionStatus = ({ isOnline, onSync, loading, error }) => {
  return (
    <div className="connection-status">
      <div className="status-indicator">
        <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
        <span className="status-text">
          {isOnline ? 'Conectado' : 'Sin conexión'}
        </span>
      </div>
      
      {!isOnline && (
        <div className="offline-warning">
          <i className="fas fa-exclamation-triangle"></i>
          <span>Modo offline - Los cambios se guardarán localmente</span>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      {!isOnline && (
        <button 
          className="btn btn-outline-primary btn-sm sync-button"
          onClick={onSync}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Sincronizando...
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt"></i>
              Sincronizar cuando esté online
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus; 