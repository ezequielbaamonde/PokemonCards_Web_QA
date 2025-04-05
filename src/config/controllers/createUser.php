<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

// POST: Crea un nuevo usuario
$app->post('/registro', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    /* Validación del nombre de usuario: debe tener entre 6 y 20 caracteres alfanuméricos preg_match es una
    funcion de PHP que permite realizar una búsqueda de patrones en una cadena de texto. En este caso, se
    está buscando una cadena que contenga solo letras y números, con una longitud de entre 6 y 20 caracteres.
    Retorna 1 si se encuentra una coincidencia, 0 si no se encuentra ninguna coincidencia y false si ocurre
    un error.*/
    if (!preg_match('/^[a-zA-Z0-9]{6,20}$/', $username)) {
        $response->getBody()->write(json_encode(['error' => 'El nombre de usuario debe tener entre 6 y 20 caracteres alfanuméricos.']));
        return $response->withStatus(400);
    }
    // Validación de la clave
    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/', $password)) {
        $response->getBody()->write(json_encode(['error' => 'La clave debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.']));
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
    $stmt = $db->prepare("INSERT INTO usuario (usuario, password) VALUES (:username, :password)");
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