<?php
class DB {
    private static $connection;

    public static function getConnection() {
        if (!self::$connection) {
            // Configuración para Railway (usa getenv() o $_ENV)
            $host = getenv('DB_HOST') ?: 'localhost';
            $dbname = getenv('DB_NAME') ?: 'pruebaproyecto';
            $user = getenv('DB_USER') ?: 'root';
            $pass = getenv('DB_PASSWORD') ?: '';
            $port = getenv('DB_PORT') ?: '3306';

            try {
                self::$connection = new PDO(
                    "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8", 
                    $user, 
                    $pass
                );
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                // Log del error (útil para debug en Railway)
                error_log("Error de conexión a la BD: " . $e->getMessage());
                die(json_encode([
                    'error' => 'Error al conectar con la base de datos',
                    'details' => (getenv('APP_ENV') === 'production') ? null : $e->getMessage()
                ]));
            }
        }
        return self::$connection;
    }

    public static function closeConnection() {
        if (self::$connection) {
            self::$connection = null;
        }
    }
}
?>