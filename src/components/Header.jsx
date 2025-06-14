import './Header.css';

const Header = () => {
    return (
      <header className="header-sonne shadow-sm py-3 mb-4">
        <div className="container d-flex align-items-center">
          <img
            src="/logo-sonne.png"
            alt="Logo Sonne"
            width="50"
            height="50"
            className="me-3"
          />
          <div>
            <h1 className="h4 m-0">Sonne Accessories</h1>
            <small className="text-muted subtitulo">Control de stock</small>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;
  
  