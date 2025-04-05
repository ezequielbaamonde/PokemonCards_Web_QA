<?php
require_once __DIR__ . '/../config/db_Connect.php'; //Conexión a la base de datos.

//Función solamente que retorna ID sin considerar nada preciso del inciso
function jugadaServidor(): int {
    $pdo = (new DB())->getConnection(); // Obtener la conexión a la base de datos

    // Consulta para obtener el ID de la carta jugada por el servidor
    $stmt = $pdo->query("SELECT id FROM mazo_carta WHERE estado = 'en_mazo' LIMIT 1"); 
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Retornar el ID de la carta o lanzar una excepción si no se encuentra
    if ($result && isset($result['id_carta'])) {
        return (int) $result['id_carta']; // convierte a entero el resultado y lo retorna

        // Actualizar el estado de la carta a "descartado"
        $updateStmt = $pdo->prepare("UPDATE mazo_carta SET estado = 'descartado' WHERE id = :id");
        $updateStmt->execute(['id' => $result['id_carta']]); //Ejecuta la consulta de actualización
    } else {
        throw new Exception("No se encontró ninguna carta jugada por el servidor."); //Lanza una excepción si no se encuentra ninguna carta
    }
}