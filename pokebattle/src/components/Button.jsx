const Button = ({ type = 'button', onClick, children, className = '' }) => (
  <button type={type} onClick={onClick} className={className}>
    {children}
  </button>
);

export default Button;

/*En React, children es una prop especial que representa cualquier contenido (elementos, texto, componentes) que se coloca entre las etiquetas de apertura y cierre de un componente.*/