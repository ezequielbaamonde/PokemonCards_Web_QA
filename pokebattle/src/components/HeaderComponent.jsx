import { useState } from 'react'
function HeaderComponent() {
  const logo ='/logo.png';
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
