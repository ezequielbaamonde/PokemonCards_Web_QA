import { useState } from 'react'
import { Link } from 'react-router-dom'; //Importante
//import './App.css'

const NavBarComponent = ({ user }) => {
  const botonLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    window.location.reload(); // O actualizar estado
  };  

  return (
    <nav className="navbar">
      <ul className="navbar-links">

        {!user ? (
          <>
            <li><Link to= "/">Inicio</Link></li>
            <li><Link to="/registro">Registro de usuario</Link></li>
            <li><a href="/login">Login</a></li>
          </>
        ) : (
          <>
            <li><span>Hola, {user.nombre}</span></li>
            <li><a href="/">Inicio</a></li>
            <li><a href="/mis-mazos">Mis mazos</a></li>
            <li><a href="/editar-usuario">Editar usuario</a></li>
            <li><button on onClick={botonLogout}> Logout </button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBarComponent;