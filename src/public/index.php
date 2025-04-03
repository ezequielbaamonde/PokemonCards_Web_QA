<?php
/* DEPENDENCIAS IMPORTADAS DEL PSR de SLIM */
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../../vendor/autoload.php'; //COLOCAR PUNTOS PARA DIRIGIRME AL DIRECTORIO VENDOR.

$app = AppFactory::create(); //Crea la app (El Core)

// Add routing and body parsing middleware
$app->addRoutingMiddleware();
$app->addBodyParsingMiddleware();/*facilitar la extracción de datos en formato json del body de 
cada service con $data = $request->getParsedBody()*/
$app->addErrorMiddleware(true, true, true); //Manejo de errores en la app.

$app->setBasePath('/ProyectoWeb/src/public'); //Establece la ruta base de la app.

$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write('Hello, World!'); //Escribe en el body de la respuesta;
    return $response;
});

// Rutas de la API
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
        ->withHeader('Content-Type', 'application/json');
});

// GET: Retrieve all users
$app->get('/users', function (Request $request, Response $response) {
    $db = DB::getConnection();
    $stmt = $db->query("SELECT * FROM usuario");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $response->getBody()->write(json_encode($data));
    return $response;
});


$app->run(); //Corre la APP.
/* No es necesario cerrar la etiqueta PHP para ejecutar este codigo */

