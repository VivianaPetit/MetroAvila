import React from "react";

function Button({divClassName, className, text, onClick, type} ) {
  return (
    <div className={divClassName}>
      <button
        className={className}
        type={type}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}
export default Button