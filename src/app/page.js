"use client";
import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import style from "./page.module.css";
import IconButton from "@/components/IconButton/IconButton";
import { DeviceContext } from "@/utils/deviceContext";
import Link from "next/link";
import RoundIcon from "@/components/RoundIcon/RoundIcon";

const ProfileComponent = ({ data, isMobile }) => {
  return (
    <div
      className={`${style.container}`}
      style={!isMobile ? { width: 450 } : null}
    >
      <div className={style.background}></div>
      <Image src="/logo.png" className={style.logo} width={130} height={100} />
      <Image
        src={data[0]?.avatar}
        className={style.avatar}
        width={140}
        height={140}
      />
      <h1 className={style.name}>{data[0]?.name}</h1>
      <h2 className={style.title}>{data[0]?.title}</h2>

      <div className={style.buttonContainer}>
        <div className={style.button1}>
          <Link href="tel:+8801990004984">
            <p className={style.buttonText}>Call Now</p>
          </Link>
        </div>
        <div className={style.button2}>
          <p className={style.buttonText}>Hire me</p>
        </div>
      </div>
      <div className={style.socialLinks}>
        {data[0]?.sociallinks.map((link) => (
          <RoundIcon key={link.id} icon={link.icon} to={link.to} />
        ))}
      </div>
      <p className={style.bio}>{data?.bio}</p>
      <div className={style.links}>
        {data[0]?.links.map((link) => (
          <IconButton
            key={link.id}
            icon={link.icon}
            text={link.text}
            to={link.to}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { isMobile, isTablet, isDesktop } = useContext(DeviceContext);
  const [data, setData] = useState(null);
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    const subdomain = window.location.hostname.split(".")[0];
    setSubdomain(subdomain);

    async function getData() {
      const res = await fetch(
        `https://my-json-server.typicode.com/arifuxd/fake-data/users?username=${subdomain}`,
        {
          cache: "no-cache",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      setData(await res.json());
    }

    getData();
  }, [subdomain]);

  console.log(data);
  console.log("subdomain: ", subdomain);

  if (!data) {
    return (
      <div>
        Loading halchal...
        <p className={style.footer}>Identity &copy; 2023</p>
      </div>
    );
  }

  return (
    <div>
      {isMobile && data[0]?.username ? (
        <ProfileComponent isMobile={isMobile} data={data} />
      ) : isDesktop && data[0]?.username ? (
        <div className={`${style.Desktopcontainer}`}>
          <ProfileComponent isMobile={isMobile} data={data} />
        </div>
      ) : isTablet && data[0]?.username ? (
        // Add your logic for tablet here
        <div className={`${style.Tabletcontainer}`}>
          <ProfileComponent isMobile={isMobile} data={data} />
        </div>
      ) : (
        <div>
          Loading
          <p className={style.footer}>Identidy &copy; 2023 </p>
        </div>
      )}
    </div>
  );
};

export default Home;
