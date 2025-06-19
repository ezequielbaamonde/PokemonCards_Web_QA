## Adiciones al código:
> Al archivo vite.config.js le seteamos por defecto el origen del backend con "/API" como proxi. En la instancia de AXIOS.CREATE la urlBase es /API. Esta se utiliza para los llamados al endpoint
    Ejemplo: API.POST(....)
             API.GET
             etc...
 > Permite un código más limpio y reutilizable

> Se añadió las políticas CORS para las respuestas por parte del servidor a solicitudes HTTP del cliente. Estas fueron añadidas en el index.php del backend del proyecto mediante HEADERS. Además, en cada consumo de la API se aclara la instrucción "withCredentials: true" que es esencial para que CORS permita enviar cookies o headers sensibles como el JWT Token.

> Se modificó consulta SQL en endpoint de /ESTADISTICA. Colocamos que devuelva el ID del usuario porque en React se necesita una clave (key) única y estable para cada elemento renderizado en bucles (.map()).
 > Sin el id: React usaría índices como key, lo cual rompe buenas prácticas y puede causar bugs al actualizar listas dinámicas

> Se modificó la respueta JSON del endpoint /login. Colocamos que devuelva el ID del usuario para ser utilizado en otros componentes PUT o GET solicitados.


> Se instaló la libreria "react-router-dom" con "npm install react-router-dom" en la raíz del proyeto para linkear componentes mediante <a Link to...>.
 > Usar solo <a href=""> recarga la página completa, y eso rompe el flujo de una SPA (Single Page App) como React. En cambio, Link de React Router actualiza la URL y renderiza solo el componente correspondiente sin recargar.

> Se modificó el archivo "validateData" dentro del directorio HELPERS del backend en lo que es la validación del nombre del usuario, coloqué que el mínimo de caracteres sea 1 y el máximo 30 (Aclarado en enunciado de /registro con react)

> Se instalo la libreria "jwt-decode" con "npm install jwt-decode" para decodificar el token luego del login y obtener la información del usuario para setear el usuario logueado en la navbar y así acceder al menú especial.
 > Borrar este comentario

> Agregando el usuariosPagina.length > 0 ? ... : ..., en el StatPage, se evita que el <tbody> contenga nada que no sea un <tr> válido.

> El HOOK "useMemo" ayuda a optimizar el rendimiento evitando cálculos repetidos cuando los datos relevantes no han cambiado.

> Se instaló "toastify" mediante "npm install react-toastify", libreria de ventanas emergentes. Lo utilizan endpoints como:
 > Login
 > Registro
 > Update

> Se añadió una conidición al endpoint PUT y POST de /mazos para que el nombre del mazo no sea mayor a 20 caracterés

> Se añadió un nuevo endpoint en cardsController "/mazos/{id}/cartas" el cuál devuelve las cartas de un mazo que se le pasa el ID como parametro. Este endpoint se generó para crear el botón "Ver" para los mazos creados por un usuario. Tiene seguridad JWT para que el mazó a visualizar sea el del usuario logueado.