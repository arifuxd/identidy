import React from "react";
import style from "./button.module.css";
const Button = ({ children }) => {
  return (
    <div className={style.button}>
      <p className={style.buttonText}>{children}</p>
    </div>
  );
};

export default Button;
