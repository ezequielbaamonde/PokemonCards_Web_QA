<?php
include 'db_Connect.php'; // Incluir la conexión
include_once 'class.php'; //incluyho clases

$newCon = new PhpClasses($conn); // Crear una nueva instancia de la clase PhpClasses

if (isset($_POST["login"])){ //el isset determina si una variable esta definida y no es null
    $usuario = $_POST["username"];
    $password = $_POST["password"];

    $ready = $newCon->login($usuario, $password); // Llamar al método login de la clase PhpClasses
    if ($ready){
        header("Location: ../index.php"); // Redirigir a la página principal
    }else{
        echo "CREDENCIALES INCORRECTAS";
    }
}
?>