/*
 * InputFilas es un componente reutilizable de entrada de formulario.
 *  Renderiza una etiqueta opcional y un campo de entrada configurable.
*/

const InputFilas = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  placeholder = '',
}) => (
  <div className="form-container-div">
    {label && <label>{label}</label>}
    <br />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
    />
  </div>
);

export default InputFilas;