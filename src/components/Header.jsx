// Componente del encabezado con logo y título de la aplicación
import './Header.css';

const Header = () => {
    return (
      <header className="header-sonne shadow-sm py-1 mb-4">
        <div className="container d-flex align-items-center">
          {/* Logo de la empresa */}
          <img
            src="/logo-sonne.png"
            alt="Logo Sonne"
            width="80"
            height="80"
            className="me-3"
          />
          {/* Título y subtítulo de la aplicación */}
          <div>
            <h1 className="h4 m-0">Sonne Accessories</h1>
            <small className="text-muted subtitulo">Control de stock</small>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;
  
  