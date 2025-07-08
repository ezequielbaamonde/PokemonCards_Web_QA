/* Punto de entrada de la aplicacion que renderiza el componente raíz en el DOM */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

//Estilos
import './index.css'

//Componente principal
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  /*
  <StrictMode>
    <App />
  </StrictMode>, 
  Comentamos estas líneas debido a que StrictMode puede causar problemas con ciertos efectos secundarios
  en el desarrollo. En mi caso los errores de consola figuraban por duplicado.
   A la hora de la entrega esto se habilita nuevamente para verificar que no haya problemas.
  Esto es útil para detectar problemas potenciales en el código, pero puede ser molesto durante
  el desarrollo si se generan muchos mensajes de advertencia o error.
  */

 /* Envolvemos la APP con BrowserRouter para el manejo de rutas */
 <BrowserRouter>
  <App />
 </BrowserRouter>
)


