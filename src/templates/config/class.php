<?php
/*NO LA USO EN NINGUN MOMENTO, TODAVIA*/
class PhpClasses{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    //Conexión a la BD
    public function connect()
    {
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
    }

    public function login($usuario, $password){
        $query  = $this->conn->preapare("SELECT * FROM usuario WHERE username = :user "); //Prepara la consulta SQL para seleccionar el usuario.
        $query->bindParam(':user', $usuario); //Asocia el parámetro :username con la variable $usuario. 
        $query->execute(); //Ejecuta la consulta.

        if ($query->rowCount()==1){
            $row = $query->fetch(PDO::FETCH_ASSOC); //Recupera la fila del resultado como un arreglo asociativo.
            $passwordHash = $row['password']; //Obtiene la contraseña hasheada del usuario.
            if (password_verify($password, $passwordHash)){ //Verifica si la contraseña ingresada coincide con la hasheada.
                return true; //Si las credenciales son correctas, devuelve true.
        }else{
            return false; //Si no se encuentra el usuario, devuelve false.
        }
        }
    }

    //Desconexión a la BD
    public function disconnect()
    {
        $this->conn = null; //Cierra la conexión a la base de datos.
    }
}
?>