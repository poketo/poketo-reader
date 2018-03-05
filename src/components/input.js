import React from 'react';

const Input = ({ className, ...props }) => (
  <input className={`Input ${className}`} {...props} />
);

export default Input;
