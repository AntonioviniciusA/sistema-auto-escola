import React from "react";
import './Button.css';

const Button = ({ variant = "default", className, children, ...props }) => {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
