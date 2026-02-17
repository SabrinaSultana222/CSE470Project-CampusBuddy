import './Button.css';

import Spinner from './Spinner';

const Button = ({ 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  disabled = false,
  isLoading = false,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`btn btn--${variant} btn--${size} ${className}`}
    >
      {isLoading ? <Spinner size={14} /> : children}
    </button>
  );
};

export default Button;
