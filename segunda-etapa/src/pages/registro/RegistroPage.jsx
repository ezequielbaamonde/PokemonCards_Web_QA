import React, { useState } from "react";
import axios from "axios";
import API from "../../utils/axios";

// Componente de registro de usuario
function RegistroPage() {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    usuario: "",
    nombre: "",
    password: "",
  });

  // Estado para mensajes de éxito y error
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    try {
      // Envía los datos al backend para registrar el usuario
      const response = await API.post("/registro", formData);

      // Si el registro fue exitoso
      if (response.status === 201) {
        setMensaje(response.data.message); // "Usuario creado exitosamente."
        setFormData({ usuario: "", nombre: "", password: "" }); // Limpia el formulario
      }
    } catch (err) {
      // Si hay un error del backend, muestra el mensaje correspondiente
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Error inesperado. Intenta más tarde.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Usuario (único):</label><br />
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Nombre:</label><br />
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Contraseña:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Registrarse</button>
      </form>

      {/* Muestra mensaje de éxito o error */}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RegistroPage;