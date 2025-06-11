/* Punto de entrada de la aplicacion que renderiza el componente raíz en el DOM */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios';

//Estilos
import './index.css'
// import './assets/styles/style.css'

//Componente principal
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


