<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

//composer require firebase/php-jwt
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// POST: Login de usuario
$app->post('/login', function (Request $request, Response $response) {
    $db = DB::getConnection(); // Conexión a la base de datos.
    $params = $request->getParsedBody(); // Obtiene los datos enviados en el cuerpo de la solicitud.
    // Extrae los parámetros de la solicitud
    //name = $params['nombre'] ?? null;
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

    //  /SIN PASSWORD HASH EN BD. Verifica si el usuario existe y si la contraseña es correcta, GENERA TOKEN
    if ($user && $password === $user['password']) {
        //$secretKey = substr(bin2hex(random_bytes(16)), 0, 32); // Genera una clave secreta aleatoria alfanumérica de 32 caracteres
        $secretKey = "1983temandealab"; // Clave secreta manual. Cámbiarla por algo más seguro
        $issuedAt = time(); // Tiempo actual
        $expirationTime = $issuedAt + 3600; // 1 hora de validez del token
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'sub' => $user['id'],
            'username' => $user['usuario']
        ]; // Datos que se incluirán en el token

        $jwt = JWT::encode($payload, $secretKey, 'HS256'); // Codifica el token usando la clave secreta y el algoritmo HS256

        $response->getBody()->write(json_encode(['token' => $jwt])); // Devuelve el token al cliente
        $response->getBody()->write(json_encode(['message' => 'Login successful'])); // Mensaje de éxito
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200); // Devuelve el código de estado 200 (OK)
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