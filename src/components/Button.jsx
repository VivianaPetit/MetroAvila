import React from "react";

function Button({divClassName, className, text, onClick, type, disabled} ) {
  return (
    <div className={divClassName}>
      <button
        className={className}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
      {console.log("Button disabled:", disabled)}
    </div>
  );
}
export default Button