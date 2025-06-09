import { useState } from 'react'
//import './App.css'

function HeaderComponent() {
  const logo = "./././public/logo.png";

  
  return (
    <>
        <div className='encabezado'>
          <a href="/" className="logo-link">
            <h1>PokeWeb Cards</h1>
            <img src={logo} alt="logo.png" />
          </a>
        </div>
    </>
  )
}

export default HeaderComponent
