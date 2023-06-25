import React from "react";
import style from "./IconButton.module.css";
import Image from "next/image";
import Link from "next/link";
const IconButton = ({ title, url }) => {
  //tolowercase title
  console.log(url);
  return (
    <Link
      className={style.container}
      href={url.startsWith("http") ? url : `//${url}`}
      target={url == "#" ? "_self" : "_blank"}
    >
      <Image
        className={style.icon}
        src={`/link-icon/${title.toLowerCase()}.svg`}
        width={title.toLowerCase() == "other" ? 22 : 30}
        height={title.toLowerCase() == "other" ? 22 : 30}
      />
      <p className={style.buttonText}>{url}</p>
    </Link>
  );
};

export default IconButton;
