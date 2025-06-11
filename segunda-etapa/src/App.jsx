/* Punto de entrada de la aplicacion que renderiza el componente raíz en el DOM */
import { useEffect, useState } from 'react';
import axios from 'axios';

//Estilos
import './assets/styles/style.css'

//Componentes
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import NavBarComponent from './components/NavBarComponent';
import StatPage from './pages/stat/StatPage'

/*Simulación de LOG
const userLog = { nombre: 'Ezequiel' }; o `null` si no está logueado*/


const App = () => {
  const [user, setUser] = useState(null); //Utilizamos estados dinámicos para los valores de variables, base es NULL
  const [loading, setLoading] = useState(true); //Idem usuarios

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuario'); // por ejemplo: "3"
    const token = localStorage.getItem('token'); // JWT

    if (!usuarioId || !token) {
      setUser(null); //User = NULL y muestra menú de navegación default
      setLoading(false); //No carga.
      return;
    }

    axios.get(`http://localhost:8000/usuarios/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}` //validación del jwt
      },
      withCredentials: true // Esto es esencial para que CORS permita enviar cookies o headers sensibles
    })
    .then(response => {
      setUser(response.data); // Supone que la API devuelve los datos del usuario
    })
    .catch(error => {
      console.error('Usuario no autenticado:', error);
      setUser(null);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);


  return (
    <>
      <div className="app-container">
        <header>
          <HeaderComponent />
          <NavBarComponent user={user} />
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
    </>
  );
};

export default App
