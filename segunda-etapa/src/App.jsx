/* Punto de entrada de la aplicacion que renderiza el componente raíz en el DOM */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Estilos
import './assets/styles/style.css'

//Componentes
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import NavBarComponent from './components/NavBarComponent';

//Páginas
import StatPage from './pages/stat/StatPage'
import RegistroPage from './pages/registro/RegistroPage';
import LoginPage from './pages/login/LoginPage';
// import LoginPage from './pages/LoginPage'; // Si tenés login
// import HomePage from './pages/HomePage'; // Página de inicio opcional

const App = () => {
  const [user, setUser] = useState(null); //Utilizamos estados dinámicos para los valores de variables, base es NULL
  const [loading, setLoading] = useState(true); //Idem usuarios

useEffect(() => {
  const usuarioNombre = localStorage.getItem('usuario');

  if (!usuarioNombre) {
    console.log('No hay usuarios logueados');
    setUser(null);
    setLoading(false);
    return;
  } else {
    console.log('Usuario logueado: ' + usuarioNombre);
    setUser({ nombre: usuarioNombre }); // NavBar reciba el nombre como objeto
    setLoading(false);
  }
  }, []);
  if (loading) return <p>...</p>;

  return (
    <BrowserRouter>
      <div className="app-container">
        <header>
          <HeaderComponent />
          <NavBarComponent user={user} />
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<StatPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route path="/login" element={<LoginPage setUser={setUser}/>} />
            {/*<Route path="/home" element={<HomePage />} /> */}
            {/* Agregá más rutas si tenés otras páginas */}
          </Routes>
        </main>

        <footer>
          <FooterComponent />
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App
