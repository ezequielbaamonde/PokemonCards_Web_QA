import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateMazosPage = () => {
  const [nombre, setNombre] = useState('');
  const [cartas, setCartas] = useState([]);
  const [cartasDisponibles, setCartasDisponibles] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    obtenerCartas();
  }, []);

  const obtenerCartas = async () => {
    try {
      const res = await API.get('/cartas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartasDisponibles(res.data);
    } catch (err) {
      toast.error('Error al obtener las cartas');
    }
  };
   
  /*Seleccionador de cartas
    Se maneja el cambio de estado de las cartas seleccionadas*/
  const handleCheckboxChange = (id) => {
    setCartas((prev) => { //Prev es es simplemente el valor anterior del estado cartas antes de la actualización.
      if (prev.includes(id)) { // Verifica si la carta ya está seleccionada
        return prev.filter((c) => c !== id); // Elimina la carta si ya está seleccionada
      } else if (prev.length < 5) { //Si el array tiene menos de 5 cartas
        return [...prev, id];
      } else {
        toast.warn('Solo se puede seleccionar 5 cartas');
        return prev;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error('El nombre del mazo no puede estar vacío');
      return;
    }

    if (cartas.length !== 5) {
      toast.error('Se debe seleccionar exactamente 5 cartas');
      return;
    }

    try {
      await API.post(
        '/mazos',
        { nombre: nombre.trim(), cartas },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Mazo creado exitosamente');
      navigate('/mis-mazos');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al crear el mazo';
      toast.error(msg);
    }
  };

  return (
    <div className="create-mazo-container">
      <h2>Crear nuevo mazo</h2>
      <form onSubmit={handleSubmit} className="create-mazo-form">
        <label>
          Nombre del mazo:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input-nombre"
          />
        </label>

        <div className="cartas-grid">
          {cartasDisponibles.map((carta) => ( // Aquí mapeamos las cartas disponibles, "carta" es el objeto de cada carta
            <div
              key={carta.id}
              className={`carta-card ${
                cartas.includes(carta.id) ? 'seleccionada' : ''
              }`}
              onClick={() => handleCheckboxChange(carta.id)}
            >
              <img
               src={`/Cards/${carta.id}.png`} //Uso backticks ( ` ), para cadenas con variables o expresiones embebidas
               alt={carta.nombre}
               onError={(e) => {
                 e.target.onerror = null;
                 e.target.src = '/Cards/default.png';
               }}
              />
                
              <h4>{carta.nombre}</h4>
              <p>Atributo: {carta.atributo}</p>
              <p>Ataque: {carta.ataque}<br/>({carta.ataque_nombre})</p>
              <input
                type="checkbox"
                checked={cartas.includes(carta.id)}
                onChange={() => handleCheckboxChange(carta.id)}
              />
            </div>
          ))}
        </div>

        <button type="submit" className="pokemon-button">
          Crear mazo
        </button>
      </form>
    </div>
  );
};

export default CreateMazosPage