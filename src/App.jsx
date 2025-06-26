// Componente principal de la aplicación
import Header from "./components/Header";
import ProductForm from "./components/ProductForm";

function App() {
  return (
    <>
      {/* Encabezado de la aplicación */}
      <Header />
      {/* Contenido principal con el formulario de productos */}
      <main className="container">
        <ProductForm />
      </main>
    </>
  );
}

export default App;
