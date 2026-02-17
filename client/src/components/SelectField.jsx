import './SelectField.css';

const SelectField = ({
  name,
  value,
  onChange,
  options = [],
  label,
  error = '',
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className="select-wrapper">
      {label && (
        <label htmlFor={name} className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`select ${error ? 'select--error' : ''} ${className}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
};

export default SelectField;
