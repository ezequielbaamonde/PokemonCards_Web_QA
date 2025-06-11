import React, { useState } from "react";
import axios from "axios";

function RegistroPage() {
  const [formData, setFormData] = useState({
    usuario: "",
    nombre: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/registro", formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 201) {
        setMensaje(response.data.message); // "Usuario creado exitosamente."
        setFormData({ usuario: "", nombre: "", password: "" });
      }
    } catch (err) {
      // Si la respuesta tiene un mensaje de error del backend
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Error inesperado. Intenta más tarde.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 16 }}>
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
          <label>Nombre de usuario:</label><br />
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

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RegistroPage;