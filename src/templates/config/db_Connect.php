<?php
    $dsn="mysql:host=localhost;dbname=seminario_php";
    $username="root";
    $password="";
    try{
        $conn = new PDO($dsn, $username, $password); //Crea la conexión a la base de datos.
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //Muestra los errores de la conexión.
        echo "Conectado a la base de datos"; //Si se conecta, muestra el mensaje de conexión exitosa.
    }
    catch (PDOException $e){
        die("Error en la conexion: ". $e->getMessage()); //Si hay un error en la conexión, muestra el mensaje de error.
    }
    
?>