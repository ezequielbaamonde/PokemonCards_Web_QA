import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Api
import API from "../../utils/axios";



const EditUserPage = ({ setUser }) => { //Recibe prop para actualizar el nombre en el contexto global
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !password || !repetirPassword) {
      toast.error('Todos los campos son obligatorios.');
      return;
    }

    if (password !== repetirPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    // const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem('token');
    const userLog = localStorage.getItem('usuario'); //el usuario logueado es parametro de la URL

    try {
      const response = await API.put(`/usuarios/${userLog}`, { //Se toma el ID del usuario logueado en localStorage
        nombre,
        password
      }, {
        headers: {
          Authorization: `Bearer ${token}` //Token del localstorage
        }
      });
      // Si el update fue exitoso
      if (response.status === 200) {
        toast.success(response.data.message); // Mensaje del backend
        // Limpiar los campos del formulario
        setNombre('');
        setPassword('');
        setRepetirPassword('');

        // Actualizar localStorage
        localStorage.setItem('nombre', nombre);

        // Actualizar contexto global para el navbar
        setUser({ nombre: nombre });

        // Redirigir al inicio
        navigate('/');
      }  
    } catch (err) {
      const backendError = err.response?.data?.error;
      toast.error(backendError);
      // setMensaje(null); 
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}> 
      <h2>Editar Usuario '{localStorage.getItem('usuario')}'</h2>{/*userLog*/}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nuevo nombre</label><br />
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Nueva contraseña</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Repetir contraseña</label><br />
          <input
            type="password"
            value={repetirPassword}
            onChange={(e) => setRepetirPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Actualizar Usuario</button>
      </form>
    </div>
  );
};

export default EditUserPage;