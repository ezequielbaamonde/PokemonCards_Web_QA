/* Punto de entrada de la aplicacion que renderiza el componente raíz en el DOM */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//Estilos
import './index.css'

//Componente principal
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


