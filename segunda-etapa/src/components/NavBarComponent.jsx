import { useState } from 'react'
import { Link } from 'react-router-dom'; //Importante
//import './App.css'

const NavBarComponent = ({ user }) => {
  const botonLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombre');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('token');
    window.location.reload(); // O actualizar estado
  };  

  return (
    <nav className="navbar">
      <ul className="navbar-links">

        {!user ? (
          <>
            <li><Link to= "/">Inicio</Link></li>
            <li><Link to="/register">Registro de usuario</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <>
            <li><span>Hola, {user.nombre}</span></li>
            <li><a href="/">Inicio</a></li>
            <li><a href="/mis-mazos">Mis mazos</a></li>
            <li><Link to="/update">Actualizar Usuario</Link></li>
            <li><button onClick={botonLogout}> Logout </button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBarComponent;