/* Punto de entrada de la aplicacion que renderiza el componente raíz en el DOM */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/styles/style.css'
//import App from './App.jsx'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import NavBarComponent from './components/NavBarComponent';
import StatPage from './pages/stat/StatPage'

//Simulación de LOG
const userLog = { nombre: 'Ezequiel' }; // o `null` si no está logueado

createRoot(document.getElementById('root')).render(
  <StrictMode>
     {/* <App /> componente de ejemplo*/}
    <div className="app-container">
      <header>
        <HeaderComponent />
        <NavBarComponent user={userLog} />
      </header>

      <main className="main-content">
        {/* Aca iría el contenido de tu página */}
        {/* <h2>Bienvenido a nuestra web</h2>
        <p>Contenido de ejemplo para mostrar cómo se comporta el footer.</p> */}
        <StatPage />
      </main>

      <footer>
        <FooterComponent />
      </footer>
    </div>
  </StrictMode>,
)


