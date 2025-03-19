import React from "react";

function Button({divClassName, className, text, onClick, type, disable} ) {
  return (
    <div className={divClassName}>
      <button
        className={className}
        type={type}
        onClick={onClick}
        disabled={disable}
      >
        {text}
      </button>
    </div>
  );
}
export default Button