<?PHP
/**
 * Valida un nombre de usuario.
 *
 * @param string $username El nombre de usuario a validar.
 * @return string|null Mensaje de error si no es válido, o null si es válido.

/* Validación del nombre de usuario: debe tener entre 6 y 20 caracteres alfanuméricos preg_match es una
funcion de PHP que permite realizar una búsqueda de patrones en una cadena de texto. En este caso, se
está buscando una cadena que contenga solo letras y números, con una longitud de entre 6 y 20 caracteres.
Retorna 1 si se encuentra una coincidencia, 0 si no se encuentra ninguna coincidencia y false si ocurre
un error.*/

function validateUsername(string $username): ?string {
    if (!preg_match('/^[a-zA-Z0-9]{6,20}$/', $username)) {
        return 'El nombre de usuario debe tener entre 6 y 20 caracteres alfanuméricos.';
    }
    return null;
}

function validatePassword(string $password): ?string {
    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/', $password)) {
        return 'La clave debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.';
    }
    return null;
}

function validateName(string $name): ?string {
    if (strlen($name) < 1 || strlen($name) > 20) {
        return 'El nombre debe tener entre 1 y 20 caracteres.';
    }
    return null;
}