import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GamePage = () => {
  const [cartasJugador, setCartasJugador] = useState([]);
  const [cartasServidor, setCartasServidor] = useState([]);
  const [resultadoJugada, setResultadoJugada] = useState(null);
  const [idPartida, setIdPartida] = useState(null);
  // const idPartidaRef = useRef(null); useRef para mantener el ID de la partida sin re-renderizar
  const [loading, setLoading] = useState(true);

  const { idMazo } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    toast.info('Cargando partida...');
    crearPartida();
  }, []);


  const crearPartida = async () => {
    console.log('ID del mazo recibido:', idMazo);
    // console.log('Token:', token);
    try {
      const res = await API.post('/partidas',
        { id_mazo: idMazo },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Respuesta del servidor:', res.data);

      // idPartidaRef.current = res.data.id_partida; Guarda directamente el ID en ref
      setIdPartida(res.data.id_partida);
      setCartasJugador(res.data.cartas || []);
       //obtenerCartasServidor(res.data.id_partida); Opcional, si tenés esa lógica
      toast.success(res.data?.message || 'Partida creada exitosamente');
    } catch (err) {
      console.error('Error creando partida:', err);
      toast.error(err.response?.data?.error || 'No se pudo crear la partida');
      navigate('/mis-mazos');
    } finally {
      setLoading(false);
    }
  };

  const jugarCarta = async (idCarta) => {
    if (!idPartida) {
      toast.error('La partida aún no fue cargada completamente.');
      return;
    }

    try {
      const res = await API.post(
        '/jugadas',
        {
          id_partida: idPartida,
          id_carta: idCarta
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCartasJugador((prev) => prev.filter((c) => c.id !== idCarta));
      setResultadoJugada(res.data);
    } catch (err) {
      console.error('Error al jugar carta:', err);
      toast.error(err.response?.data?.error || 'Error al jugar carta');
    }
  };

  const reiniciarPartida = async () => {
    setLoading(true);
    setResultadoJugada(null);
    setCartasServidor([]);
    setCartasJugador([]);
    await crearPartida();
  };


  /* 
    toast.info esta modifica el estado global de React mientras el componente se está renderizando.
    React detecta eso como un side effect mal ubicado, porque los side effects (como mostrar toasts, hacer fetch, etc.)
    deben estar dentro de useEffect, no en el cuerpo principal del componente.
  */
  if (loading) return <p>Cargando partida...</p>;

  return (
    <div className="game-page">
      <div className="tablero-juego">
        <h2>Partida en curso...</h2>
        
        {/* Cartas del servidor */}
        <div className="cartas-servidor">
          <h3>Cartas del servidor</h3>
          {cartasServidor.map((carta, i) => (
            <div key={i} className="carta-servidor">
              <img src="/Cards/defaultp.png" alt="Carta oculta" />
              <p>Atributo: {carta.nombre}</p>
            </div>
          ))}
        </div>

        <hr className="separador" /> {/* Línea divisoria */}

        {/* Centro del tablero */}
        {resultadoJugada && (
          <div className="zona-jugada">
            <div>
              <h4>Carta Servidor</h4>
              <p>Fuerza: {resultadoJugada.fuerza_servidor}</p>
            </div>

            {resultadoJugada.resultado_final && (
              resultadoJugada.resultado_final === 'Usuario ganó la partida'
                ? <h4>{localStorage.getItem('usuario') + ' GANÓ LA PARTIDA'}</h4>
                : <h4>{resultadoJugada.resultado_final}</h4>
            )}

            <div>
              <h4>Tu carta</h4>
              <p>Fuerza: {resultadoJugada.fuerza_usuario}</p>
            </div>
          </div>
        )}

        <hr className="separador" /> {/* Línea divisoria */}

        {/* Cartas del jugador */}
        <div className="cartas-usuario">
          <h3>Tu mano</h3>
          {cartasJugador.map((carta) => (
            <div
              key={carta.id}
              className="carta-jugador"
              onDoubleClick={() => jugarCarta(carta.id)}
            >
              <img src={`/Cards/${carta.id}.png`} alt={carta.nombre} />
              <p>{carta.nombre}</p>
              <p>{carta.atributo}</p>
              <p>
                Ataque: {carta.ataque} ({carta.ataque_nombre})
              </p>
            </div>
          ))}
        </div>

        {/* Jugar otra vez */}
        {cartasJugador.length === 0 && (
          <button className="gameBack" onClick= {reiniciarPartida}>
            Jugar otra vez
          </button>
        )}
        {/* Volver */}
        {cartasJugador.length === 0 && (
          <button className="gameBack" onClick= {() => navigate('/mis-mazos')}>
            Volver
          </button>
        )}

      </div>

    </div>

  );
};

export default GamePage;
