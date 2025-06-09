import { useState } from 'react'
//import './App.css'

const NavBarComponent = ({ user }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        

        {!user ? (
          <>
            <li><a href="/">Inicio</a></li>
            <li><a href="/registro">Registro de usuario</a></li>
            <li><a href="/login">Login</a></li>
          </>
        ) : (
          <>
            <li><span>Hola, {user.nombre}</span></li>
            <li><a href="/">Inicio</a></li>
            <li><a href="/mis-mazos">Mis mazos</a></li>
            <li><a href="/editar-usuario">Editar usuario</a></li>
            <li><a href="/logout">Logout</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBarComponent;