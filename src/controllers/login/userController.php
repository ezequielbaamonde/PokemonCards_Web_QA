<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require_once __DIR__ . '/../../middlewares/JwtMiddleware.php'; // importar el middleware

/*-----------------------------------------------------------------------*/
/*-----------------------------------------------------------------------*/

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
        $response->getBody()->write(json_encode(['error' => 'El usuario y la clave son requeridos']));
        //return $response->withStatus(400);
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    $stmt = $db->prepare("SELECT * FROM usuario WHERE usuario = :username"); // Prepara la consulta SQL para buscar el usuario por nombre y contraseña.
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC); // Busca el usuario en la base de datos.

    // Verifica si el usuario existe y si la contraseña es correcta usando password_verify - Genera TOKEN
    if ($user && password_verify($password, $user['password'])) {
        $secretKey = "1983temandealab";
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600; // Una hora

        //Establece la zona horaria a Buenos Aires
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $expirationDateTime = date('Y-m-d H:i:s', $expirationTime); //Convertimos a formato MySQL
    
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'sub' => $user['id'],
            'username' => $user['usuario']
        ];
    
        $jwt = JWT::encode($payload, $secretKey, 'HS256'); // Clave secreta para codificar el token.
    
        // Guardamos el token y la expiración
        $stmt = $db->prepare("UPDATE usuario SET token = :token, vencimiento_token = :expiration WHERE id = :userId");
        $stmt->bindParam(':token', $jwt);
        $stmt->bindParam(':expiration', $expirationDateTime); // 🕒 Guardamos formato legible
        $stmt->bindParam(':userId', $user['id']);
        $stmt->execute();
    
        $response->getBody()->write(json_encode([
            'id_usuario' => $user['id'], // ID del usuario
            'nombre' => $user['nombre'], // Nombre del usuario, para utilizar en navbar frontend
            'token' => $jwt,
            'message' => 'Inicio de sesión exitoso'
        ]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }else{
        $response->getBody()->write(json_encode(['error' => 'Invalid username or password']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
    }
});

/*-----------------------------------------------------------------------*/
/*-----------------------------------------------------------------------*/

// POST: Crea un nuevo usuario.
$app->post('/registro', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $username = $data['usuario'] ?? ''; //Corregido para unificar con el campo de "usuario" del login
    $name = $data['nombre'] ?? '';
    $password = $data['password'] ?? '';
    
    $usernameError = validateUsername($username);
    if ($usernameError) {
        $response->getBody()->write(json_encode(['error' => $usernameError]));
        return $response->withStatus(400);
    }

    $nameError = validateName($name);
    if ($nameError) {
        $response->getBody()->write(json_encode(['error' => $nameError]));
        return $response->withStatus(400);
    }

    $passwordError = validatePassword($password);
    if ($passwordError) {
        $response->getBody()->write(json_encode(['error' => $passwordError]));
        return $response->withStatus(400);
    }

    $db = DB::getConnection(); // Obtener la conexión a la base de datos

    // Verificar si el nombre de usuario ya está en uso
    $stmt = $db->prepare("SELECT COUNT(*) FROM usuario WHERE usuario = :username"); // Utilizamos COUNT(*) para verificar si el nombre de usuario ya está en uso antes de intentar crear un nuevo usuario.
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    if ($stmt->fetchColumn() > 0) { //el fetchColumn() devuelve la primera columna de la primera fila del conjunto de resultados.
        $response->getBody()->write(json_encode(['error' => 'El nombre de usuario ya está en uso.']));
        return $response->withStatus(400);
    }
    // Insertar el nuevo usuario
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT); // Hashear la contraseña antes de almacenarla en la base de datos.
    $stmt = $db->prepare("INSERT INTO usuario (nombre, usuario, password) VALUES (:nombre, :username, :password)");
    $stmt->bindParam(':nombre', $name);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $hashedPassword);

    if ($stmt->execute()) {
        $response->getBody()->write(json_encode(['message' => 'Usuario creado exitosamente.']));
        return $response->withStatus(201); // Código de estado 201 Created indica que el recurso fue creado exitosamente.
    } else {
        $response->getBody()->write(json_encode(['error' => 'Error al crear el usuario.']));
        return $response->withStatus(500); // Código de estado 500 Internal Server Error indica que hubo un error en el servidor al procesar la solicitud.
    }
});

/*-----------------------------------------------------------------------*/
/*-----------------------------------------------------------------------*/

// PUT: Actualiza el nombre de usuario y la contraseña de un ID | Valida token logueado.
$app->put('/usuarios/{usuario}', function (Request $request, Response $response, array $args) {
    $userIdParam = $args['usuario'];
    
    $data = $request->getParsedBody();
    $newUsername = $data['nombre'] ?? null;
    $newPassword = $data['password'] ?? null;

    // 1. Obtener y validar el token
    $jwt = $request->getAttribute('jwt');

    // 2. Validar que el ID USUARIO coincida con el del token
    if ($jwt->sub != $userIdParam) {
        $response->getBody()->write(json_encode(['error' => 'No autorizado para modificar este usuario']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(403);
    }

    // 3. Validar que al menos uno de los campos esté presente
    if (!$newUsername && !$newPassword) {
        $response->getBody()->write(json_encode(['error' => 'Debes ingresar al menos un campo a modificar (nombre o contraseña).']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }

    // Validaciones individuales
    if ($newUsername) {
        $nameError = validateName($newUsername);
        if ($nameError) {
            $response->getBody()->write(json_encode(['error' => $nameError]));
            return $response->withStatus(400);
        }
    }

    if ($newPassword) {
        $passwordError = validatePassword($newPassword);
        if ($passwordError) {
            $response->getBody()->write(json_encode(['error' => $passwordError]));
            return $response->withStatus(400);
        }
    }

    // 4. Actualizar en la base de datos
    $db = DB::getConnection();

    // Verificar si el usuario existe
    $stmt = $db->prepare("SELECT * FROM usuario WHERE id = :userId");
    $stmt->bindParam(':userId', $userIdParam);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        $response->getBody()->write(json_encode(['error' => 'Usuario no encontrado']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
    }

    /* Armar un UPDATE dinámico
    Se necesita construir la consulta SQL de forma dinámica, es decir, solo incluir en el UPDATE los campos que
    realmente se recibieron. */
    $campos = []; // guardará strings como 'nombre = :nombre', 'password = :password'
    $valores = [':userId' => $userIdParam]; // este siempre se usa en el WHERE

    if ($newUsername) {
        $campos[] = 'nombre = :nombre'; // añade campo SQL
        $valores[':nombre'] = $newUsername; // añade valor para bind
    }
    if ($newPassword) {
        $campos[] = 'password = :password';
        $valores[':password'] = password_hash($newPassword, PASSWORD_BCRYPT);
    }

    $sql = 'UPDATE usuario SET ' . implode(', ', $campos) . ' WHERE id = :userId';
    // implode(', ', $campos) convierte el array en un string separado por comas, por ejemplo: 'nombre = :nombre, password = :password'
    $stmt = $db->prepare($sql);

    foreach ($valores as $key => $val) {
        $stmt->bindValue($key, $val); // vincula cada :nombre, :password y :userId
    }

    if ($stmt->execute()) {
        $response->getBody()->write(json_encode([
            'message' => 'Usuario actualizado exitosamente',
            'nuevo_nombre' => $newUsername
            //'nueva_password' => '$newPassword'
        ]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    } else {
        $response->getBody()->write(json_encode(['error' => 'Error al actualizar el usuario']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
    }
})->add($jwtMiddleware); // Agrega el middleware JWT a la ruta /usuarios/{usuario}


/*-----------------------------------------------------------------------*/
/*-----------------------------------------------------------------------*/

// GET: Obtener información del usuario logueado por ID | Valida token.
$app->get('/usuarios/{usuario}', function (Request $request, Response $response, array $args) {
    $userIdParam = $args['usuario']; //ID del usuario a obtener

    // 1. Obtener y validar el token
    $jwt = $request->getAttribute('jwt');

    // 2. Validar que el ID en el token coincida con el de la URL
    if ($jwt->sub != $userIdParam) {
        $response->getBody()->write(json_encode(['error' => 'No autorizado para acceder a este usuario']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(403);
    }

    // 3. Obtener información del usuario desde la base de datos
    $db = DB::getConnection();
    $stmt = $db->prepare("SELECT id, nombre, usuario FROM usuario WHERE id = :id");
    $stmt->bindParam(':id', $userIdParam);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        $response->getBody()->write(json_encode(['error' => 'Usuario no encontrado']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
    }

    // 4. Retornar la información del usuario
    $response->getBody()->write(json_encode($user));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
})->add($jwtMiddleware); // Agrega el middleware JWT a la ruta /usuarios/{id}
