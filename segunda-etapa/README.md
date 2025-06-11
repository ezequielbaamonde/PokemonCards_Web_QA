# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



-----------------------------------------------
Adiciones al código:

Añadimos las políticas CORS para las respuestas por parte del servidor a solicitudes HTTP del cliente. Estas fueron
añadidas en el index.php del backend del proyecto mediante HEADERS. Además, en cada consumo de la API se aclara la
instrucción "withCredentials: true" que es esencial para que CORS permita enviar cookies o headers sensibles como el
JWT Token.

 > Prueba de LOCALSTORAGE = localStorage.setItem('usuario', 3) | localStorage.setItem('token', 'tutoken')

El hook useEffect en React sirve para ejecutar código secundario (efectos) en tus componentes funcionales. Es decir, se utiliza para manejar efectos colaterales, como:
    - Llamadas a APIs (fetch/axios)
    - Suscripciones o listeners (como window.addEventListener)
    - Manipulación del DOM
    - Timers (setTimeout, setInterval)
    - Sincronización con localStorage, etc...

useEffect(() => {
  // código que se ejecuta después de que el componente se renderiza

  return () => {
    // cleanup (opcional), se ejecuta antes de desmontar o actualizar
  };
}, [dependencias]);