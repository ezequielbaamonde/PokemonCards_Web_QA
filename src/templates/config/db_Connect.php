<?php
class DB {
    private static $connection;

    public static function getConnection() {
        if (!self::$connection) {
            $host = 'localhost';
            $dbname = 'seminario_php_new';
            $user = 'root';
            $pass = '';

            try {
                self::$connection = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                echo json_encode(['success' => 'Connected to the database successfully.']);
            } catch (PDOException $e) {
                die(json_encode(['error' => $e->getMessage()]));
            }
        }

        return self::$connection;
    }

    public static function closeConnection() {
        if (self::$connection) {
            self::$connection = null;
            echo json_encode(['success' => 'Database connection closed.']);
        }
    }
}
?>