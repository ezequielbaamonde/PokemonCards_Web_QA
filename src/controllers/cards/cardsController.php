<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/*-----------------------------------------------------------------------*/
/*-----------------------------------------------------------------------*/

$app->post('/partidas', function (Request $request, Response $response) {
    $db = DB::getConnection();

    $data = $request->getParsedBody();
    $idMazo = $data['id_mazo'] ?? null;

    if (!$idMazo) {
        $response->getBody()->write(json_encode(['error' => 'El ID del mazo es obligatorio']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    $jwt = $request->getAttribute('jwt'); // Obtener el JWT del middleware
    $idUsuario = $jwt->sub; // Obtener el ID del usuario desde el JWT

    // Verificar que el mazo pertenece al usuario
    $stmt = $db->prepare("SELECT * FROM mazo WHERE id = :idMazo AND usuario_id = :idUsuario");
    $stmt->bindParam(':idMazo', $idMazo);
    $stmt->bindParam(':idUsuario', $idUsuario);
    $stmt->execute();
    $mazo = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$mazo) {
        $response->getBody()->write(json_encode(['error' => 'El mazo no pertenece al usuario']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(403);
    }

    $fechaCreacion = (new DateTime('now', new DateTimeZone('America/Argentina/Buenos_Aires')))->format('Y-m-d H:i:s');
    $estado = 'en_curso';

    // Crear la partida
    $stmt = $db->prepare("INSERT INTO partida (usuario_id, el_usuario, fecha, mazo_id, estado) VALUES (:idUsuario, :elUsuario, :fecha, :idMazo, :estado)");
    $stmt->bindParam(':idUsuario', $idUsuario);
    $stmt->bindParam(':elUsuario', $jwt->username); // Obtener el nombre de usuario desde el JWT
    $stmt->bindParam(':fecha', $fechaCreacion);
    $stmt->bindParam(':idMazo', $idMazo);
    $stmt->bindParam(':estado', $estado);

    if (!$stmt->execute()) {
        $response->getBody()->write(json_encode(['error' => 'Error al crear la partida']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }

    // Actualizar estado de las cartas en mazo_carta
    $stmt = $db->prepare("UPDATE mazo_carta SET estado = 'en_mano' WHERE id_mazo = :idMazo");
    $stmt->bindParam(':idMazo', $idMazo);
    $stmt->execute();

    $response->getBody()->write(json_encode(['message' => 'Partida creada exitosamente']));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
})->add($jwtMiddleware);
