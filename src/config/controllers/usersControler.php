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