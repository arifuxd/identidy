import React from "react";
import style from "./IconButton.module.css";
import Image from "next/image";
import Link from "next/link";
const IconButton = ({ title, url }) => {
  return (
    <Link
      className={style.container}
      href={url}
      target={url == "#" ? "_self" : "_blank"}
    >
      <Image className={style.icon} src={`link.svg`} width={20} height={20} />
      <p className={style.buttonText}>{url}</p>
    </Link>
  );
};

export default IconButton;
