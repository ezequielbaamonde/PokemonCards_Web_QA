<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require_once __DIR__ . '/../middlewares/JwtMiddleware.php'; // importar el middleware


//valida el token JWT y lo decodifica
$app->get('/perfil', function (Request $request, Response $response) {
    $user = $request->getAttribute('jwt');
    $response->getBody()->write(json_encode([ // devuelve el token decodificado
        'mensaje' => 'Bienvenido ' . $user->username,
        'id' => $user->sub // id del usuario
    ]));
    return $response->withHeader('Content-Type', 'application/json');
})->add($jwtMiddleware); // agrega el middleware JWT a la ruta /perfil