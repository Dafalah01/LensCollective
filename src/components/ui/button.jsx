import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Button = forwardRef(({ 
  children, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Button;