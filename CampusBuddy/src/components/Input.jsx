import './Input.css';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  label,
  error = '',
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input ${error ? 'input--error' : ''} ${className}`}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
