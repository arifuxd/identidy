import React from "react";
import style from "./IconButton.module.css";
import Image from "next/image";
import Link from "next/link";
const IconButton = ({ icon, text, to }) => {
  return (
    <Link
      className={style.container}
      href={to}
      target={to == "#" ? "_self" : "_blank"}
    >
      <Image className={style.icon} src={icon} width={20} height={20} />
      <p className={style.buttonText}>{text}</p>
    </Link>
  );
};

export default IconButton;
