/* 
Un usuario logueado podrá ver sus mazos creados. Para eso se listará el nombre del mazo  
y 4 opciones:  
●  Ver Mazo: se muestra en un modal las cartas que lo componen. 
●  Eliminar: da de baja el mazo seleccionado (siempre que no haya sido previamente 
usado en una partida). 
●  Editar: Muestra un pequeño formulario junto a la fila para cambiar el nombre del 
mazo (puede ser junto a la fila o junto al nombre del mazo). 
●  Jugar: Enlace a “Jugar” con el mazo seleccionado. 
La forma en que se muestra la información anterior puede modificarse por una más óptima 
si así lo considera pero debe permitirle al usuario realizar las acciones descriptas. 
En la parte inferior o superior debe haber un botón o link para ir al “Alta de nuevo mazo”. Si 
el usuario ya tiene 3 mazos creados, este botón debe estar deshabilitado.
*/

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MazosPage = () => {
  const [mazos, setMazos] = useState([]);
  const [mazoSeleccionado, setMazoSeleccionado] = useState(null);
  const [mazoEditandoId, setMazoEditandoId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  
  const navigate = useNavigate();

  const usuario = localStorage.getItem('usuario');
  const token = localStorage.getItem('token');

  useEffect(() => {
    obtenerMazos();
  }, []);

  const obtenerMazos = async () => {
    try {
      const res = await API.get(`/usuarios/${usuario}/mazos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMazos(res.data.mazos || []);
      if (res.data.mazos?.length >= 3) {
        toast.info('Ya tienes 3 mazos creados. Elimina uno para poder crear otro.');
      }
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al cargar los mazos.';
      toast.error(mensaje);
    }
  };

  const eliminarMazo = async (mazoId) => {
    try {
      await API.delete(`/mazos/${mazoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Mazo eliminado correctamente');
      obtenerMazos();
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo eliminar el mazo');
    }
  };

  const guardarNuevoNombre = async (id) => {
    const nombreTrim = nuevoNombre.trim(); // Elimina espacios al inicio y al final
  
    if (nombreTrim === '') {
      toast.error('El nombre del mazo no puede estar vacío.');
      return;
    }
  
    try {
      const response = await API.put(`/mazos/${id}`,
        { nombre: nombreTrim },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      toast.success(response.data.message || 'Nombre actualizado');
      setMazoEditandoId(null);
      setNuevoNombre('');
      obtenerMazos(); // Actualiza la lista
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al actualizar el nombre del mazo';
      toast.error(msg);
    }
  };

  return (
    <div className="mazos-container">
      <h2>Mazos de {localStorage.getItem('nombre')}</h2>

      {mazos.map((mazo) => (
        <div key={mazo.id} className="mazo-card">
          {mazoEditandoId === mazo.id ? (
            <div className="mazo-edicion">
              <input
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
              <button onClick={() => guardarNuevoNombre(mazo.id)}>Guardar</button>
              <button onClick={() => setMazoEditandoId(null)}>Cancelar</button>
            </div>
          ) : (
            <h3 className="mazo-nombre">{mazo.nombre}</h3>
          )}

          <div className="mazo-botones">
            <button onClick={() => setMazoSeleccionado(mazo)}>Ver Mazo</button>
            <button onClick={() => eliminarMazo(mazo.id)}>Eliminar</button>
            <button onClick={() => {
              setMazoEditandoId(mazo.id);
              setNuevoNombre(mazo.nombre);
            }}>
              Editar
            </button>
            <button onClick={() => navigate(`/jugar/${mazo.id}`)}>Jugar</button>
          </div>
        </div>
      ))}

      <button
        onClick={() => navigate('/crear-mazo')}
        disabled={mazos.length >= 3}
        className="pokemon-button"
      >
        CREAR MAZO
      </button>

      {mazoSeleccionado && (
        <div className="modal-overlay" onClick={() => setMazoSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{mazoSeleccionado.nombre}</h3>
            <ul>
              {mazoSeleccionado.cartas?.length > 0 ? (
                mazoSeleccionado.cartas.map((carta, i) => (
                  <li key={i}>{carta.nombre}</li>
                ))
              ) : (
                <li>Este mazo no tiene cartas</li>
              )}
            </ul>
            <button onClick={() => setMazoSeleccionado(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MazosPage;