import React from "react";
import style from "./RoundIcon.module.css";
import Image from "next/image";
import Link from "next/link";
const RoundIcon = ({ icon, to }) => {
  return (
    <Link
      className={style.container}
      href={to}
      target={to == "#" ? "_self" : "_blank"}
    >
      <Image className={style.icon} src={icon} width={33} height={33} />
    </Link>
  );
};

export default RoundIcon;
