<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

// GET: Devuelve todos los users
$app->get('/users', function (Request $request, Response $response) {
    $db = DB::getConnection(); //Conexión a la base de datos.	
    $stmt = $db->query("SELECT * FROM usuario"); //consulta SQL para obtener todos los usuarios.
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC); //Ejecuta la consulta y obtiene todos los resultados en un array asociativo.
    $response->getBody()->write(json_encode($data)); //Escribe en el body de la respuesta el array de usuarios en formato JSON.
    return $response;
});

// POST: Login de usuario
$app->post('/login', function (Request $request, Response $response) {
    $db = DB::getConnection(); // Conexión a la base de datos.
    $params = $request->getParsedBody(); // Obtiene los datos enviados en el cuerpo de la solicitud.
    // Extrae los parámetros de la solicitud
    $username = $params['usuario'] ?? null;
    $password = $params['password'] ?? null;

    // Validación de datos
    if (!$username || !$password) {
        $response->getBody()->write(json_encode(['error' => 'Username and password are required']));
        //return $response->withStatus(400);
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    $stmt = $db->prepare("SELECT * FROM usuario WHERE usuario = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC); // Busca el usuario en la base de datos.
    
    //SIN PASSWORD HASH EN BD. Verifica si el usuario existe y si la contraseña es correcta
    if ($user && $password === $user['password']) {
        $response->getBody()->write(json_encode(['message' => 'Login successful']));
        return $response->withStatus(200);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Invalid username or password']));
        return $response->withStatus(401);
    }

    /* con password HASH en BD ---> IMPLEMENTAR
    if ($user && password_verify($password, $user['password'])) {
        $response->getBody()->write(json_encode(['message' => 'Login successful']));
        return $response->withStatus(200);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Invalid username or password']));
        return $response->withStatus(401);
    }*/
});