<?php
session_start(); // Iniciar sesión
require 'db_Connect.php'; // Incluir la conexión

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario']; // Cambié "username" por "usuario"
    $password = $_POST['password'];

    try {
        // Preparar la consulta con los nombres de columna correctos
        $stmt = $conn->prepare("SELECT id, usuario, password FROM usuario WHERE usuario = :usuario");
        $stmt->bindParam(":usuario", $usuario);
        $stmt->execute();

        // Obtener el usuario
        $usuarioDB = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuarioDB && password_verify($password, $usuarioDB['password'])) {
            // Inicio de sesión exitoso
            $_SESSION['usuario_id'] = $usuarioDB['id'];
            $_SESSION['usuario_nombre'] = $usuarioDB['usuario'];
            header("Location: ../index.php"); // Redirige a otra página
            exit();
        } else {
            $error = "Usuario o contraseña incorrectos";
        }
    } catch (PDOException $e) {
        die("Error en la consulta: " . $e->getMessage());
    }
}
?>