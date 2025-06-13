/* Punto de entrada de la aplicacion que renderiza el componente raíz en el DOM */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

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
import EditUserPage from './pages/user/EditUserPage';


const App = () => {
  const [user, setUser] = useState(null); //Utilizamos estados dinámicos para los valores de variables, base es NULL
  const [loading, setLoading] = useState(true); //Idem usuarios

  useEffect(() => {
    const usuarioNombre = localStorage.getItem('nombre'); //Obtenemos el nombre del usuario logueado desde localStorage

    if (!usuarioNombre) {
      console.log('No hay usuarios logueados')
      setUser(null)
      setLoading(false)
      return
    } else {
      console.log('Usuario logueado: ' + usuarioNombre)
      setUser({ nombre: usuarioNombre }) // NavBar reciba el nombre como objeto
      setLoading(false)
    }
  }, []); //Si no pongo [] se ejecuta en cada renderizado, si pongo [] se ejecuta una sola vez al inicio
  
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
            <Route path="/register" element={<RegistroPage />} />
            <Route path="/login" element={<LoginPage setUser={setUser}/>} />
            <Route path="/update" element={<EditUserPage setUser={setUser} />} />
            {/*<Route path="/home" element={<HomePage />} /> */}
            {/* Agregá más rutas si tenés otras páginas */}
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />

        <footer>
          <FooterComponent />
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App
