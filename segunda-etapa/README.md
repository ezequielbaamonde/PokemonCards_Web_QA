# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



-----------------------------------------------
Adiciones al código:
> Añadimos las políticas CORS para las respuestas por parte del servidor a solicitudes HTTP del cliente. Estas fueron añadidas en el index.php del backend del proyecto mediante HEADERS. Además, en cada consumo de la API se aclara la instrucción "withCredentials: true" que es esencial para que CORS permita enviar cookies o headers sensibles como el JWT Token.

> Modificamos consulta SQL en endpoint de /ESTADISTICA. Colocamos que devuelva el ID del usuario porque en React se necesita una clave (key) única y estable para cada elemento renderizado en bucles (.map()).
 > Sin el id: React usaría índices como key, lo cual rompe buenas prácticas y puede causar bugs al actualizar listas dinámicas

> Instale la libreria "react-router-dom" con "npm install react-router-dom" en la raíz del proyeto para linkear componentes mediante <a Link to...>.
 > Usar solo <a href=""> recarga la página completa, y eso rompe el flujo de una SPA (Single Page App) como React. En cambio, Link de React Router actualiza la URL y renderiza solo el componente correspondiente sin recargar.

> Modifique el archivo "validateData" dentro del directorio HELPERS del backend en lo que es la validación del nombre del usuario, coloqué que el mínimo de caracteres sea 1 y el máximo 30 (Aclarado en enunciado de /registro con react)

>Instale libreria "jwt-decode" con "npm install jwt-decode" para decodificar el token luego del login y obtener la información del usuario para setear el usuario logueado en la navbar y así acceder al menú especial.
 > Borrar este comentario

> Agregando el usuariosPagina.length > 0 ? ... : ..., en el StatPage, se evita que el <tbody> contenga nada que no sea un <tr> válido.