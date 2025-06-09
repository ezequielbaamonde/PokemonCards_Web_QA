import React, { useState, useMemo } from "react";

// Ejemplo de datos simulados
const users = [
    { id: 1, nombre: "Ana", ganadas: 8, perdidas: 2, empatadas: 0 },
    { id: 2, nombre: "Luis", ganadas: 5, perdidas: 3, empatadas: 2 },
    { id: 3, nombre: "Sofía", ganadas: 2, perdidas: 5, empatadas: 3 },
    { id: 4, nombre: "Carlos", ganadas: 7, perdidas: 2, empatadas: 1 },
    { id: 5, nombre: "Marta", ganadas: 4, perdidas: 4, empatadas: 2 },
    { id: 6, nombre: "Pedro", ganadas: 1, perdidas: 8, empatadas: 1 },
    { id: 7, nombre: "Lucía", ganadas: 6, perdidas: 2, empatadas: 2 },
];

function calcularPromedio(ganadas, total) {
    return total === 0 ? 0 : (ganadas / total) * 100;
}

function StatPage() {
    const [orden, setOrden] = useState("mejor");
    const [pagina, setPagina] = useState(1);
    const porPagina = 5;

    // Calcula los datos con promedios
    const usuariosConPromedio = useMemo(() =>
        users.map(u => {
            const total = u.ganadas + u.perdidas + u.empatadas;
            return {
                ...u,
                total,
                promedio: calcularPromedio(u.ganadas, total)
            };
        }), []
    );

    // Ordena los usuarios
    const usuariosOrdenados = useMemo(() => {
        const copia = [...usuariosConPromedio];
        copia.sort((a, b) =>
            orden === "mejor"
                ? b.promedio - a.promedio
                : a.promedio - b.promedio
        );
        return copia;
    }, [usuariosConPromedio, orden]);

    // Mejor usuario
    const mejorPromedio = usuariosOrdenados[0]?.promedio ?? 0;

    // Paginado
    const totalPaginas = Math.ceil(usuariosOrdenados.length / porPagina);
    const usuariosPagina = usuariosOrdenados.slice(
        (pagina - 1) * porPagina,
        pagina * porPagina
    );

    return (
        <div className= "statpage-container">
            <h2>Estadísticas de Usuarios</h2>
            <div className= "botones-perfom">
                <button
                    onClick={() => setOrden("mejor")}
                    disabled={orden === "mejor"}
                >
                    Ordenar por Mejor Performance
                </button>
                <button
                    onClick={() => setOrden("peor")}
                    disabled={orden === "peor"}
                    style={{ marginLeft: 8 }}
                >
                    Ordenar por Peor Performance
                </button>
            </div>
            <table width="100%" border="1" cellPadding={8} className="tabla-stat">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Partidas</th>
                        <th>Ganadas</th>
                        <th>Perdidas</th>
                        <th>Empatadas</th>
                        <th>Promedio Ganadas (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosPagina.map((u, idx) => (
                        <tr
                            key={u.id}
                            style={
                                u.promedio === mejorPromedio && orden === "mejor"
                                    ? { background: "#EE4232", fontWeight: "bold" }
                                    : {}
                            }
                        >
                            <td>{u.nombre}</td>
                            <td>{u.total}</td>
                            <td>{u.ganadas}</td>
                            <td>{u.perdidas}</td>
                            <td>{u.empatadas}</td>
                            <td>{u.promedio.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: 16 }}>
                <button
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                >
                    Anterior
                </button>
                <span style={{ margin: "0 8px" }}>
                    Página {pagina} de {totalPaginas}
                </span>
                <button
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default StatPage;