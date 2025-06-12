import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ setUser }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); //Redirige al usuario a otra página después del login exitoso.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/login', {
        usuario,
        password
      }, {
        withCredentials: true
      });

      const { token } = response.data;

      // Guardar el token y el usuario, esto sirve para luego desloguear
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', usuario); // nombre del usuario, no su ID
      // Actualizar el estado global del usuario
      setUser({ nombre: usuario }); // <---- Un objeto con 'nombre'
      navigate('/'); // Redirige al inicio de manera exitosa

    } catch (err) {
      console.error('Error al iniciar sesión:', err);

      // Detalle más específico del error
      let msg = 'Error desconocido al iniciar sesión';
      if (err.response) {
        // El servidor respondió con un código fuera del rango 2xx
        msg = `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`;
      } else if (err.request) {
        // La solicitud fue hecha pero no hubo respuesta
        msg = 'No se recibió respuesta del servidor. Verifique su conexión.';
      } else if (err.message) {
        // Algo pasó al configurar la solicitud
        msg = `Error al configurar la solicitud: ${err.message}`;
      }
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Usuario:</label><br />
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Contraseña:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Ingresar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;