import React from "react";
import style from "./RoundIcon.module.css";
import Image from "next/image";
import Link from "next/link";
const RoundIcon = ({ icon, url }) => {
  return (
    <Link
      className={style.container}
      href={url !== undefined ? url : "#"}
      target={url == "#" ? "_self" : "_blank"}
    >
      <Image
        className={style.icon}
        src={`${icon}.svg`}
        width={33}
        height={33}
      />
    </Link>
  );
};

export default RoundIcon;
