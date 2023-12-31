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
      <div className={style.logoContainer}>
        <Image src="/logo.svg" width={130} height={100} />
      </div>

      <Image
        src={data?.avatar}
        className={style.avatar}
        width={140}
        height={140}
      />
      <h1 className={style.name}>{data?.name}</h1>
      <h2 className={style.title}>{data?.title}</h2>

      <div className={style.buttonContainer}>
        <div className={style.button1}>
          <Link href={`tel:${data?.phone}`}>
            <p className={style.buttonText}>Call Now</p>
          </Link>
        </div>
        <div className={style.button2}>
          <p className={style.buttonText}>
            <Link className={style.buttonText} href={`mailto:${data?.email}`}>
              <p>Email Me</p>
            </Link>
          </p>
        </div>
      </div>
      <div className={style.socialLinks}>
        {data?.sociallinks.map((link) =>
          link.url ? (
            <RoundIcon key={link._id} icon={link.icon} url={link.url} />
          ) : null
        )}
      </div>
      <p className={style.bio}>{data?.bio}</p>
      <div className={style.links}>
        {data?.links.map((link) => (
          <IconButton key={link._id} title={link.title} url={link.url} />
        ))}
      </div>
    </div>
  );
};

const Profile = ({ params }) => {
  const { isMobile, isTablet, isDesktop } = useContext(DeviceContext);
  const [data, setData] = useState(null);
  //   const [subdomain, setSubdomain] = useState("");
  console.log(params);
  useEffect(() => {
    // const subdomain = window.location.hostname.split(".")[0];
    // setSubdomain(subdomain);

    async function getData() {
      const res = await fetch(`api/user/${params.profile}`, {
        cache: "no-cache",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      setData(await res.json());
    }

    getData();
  }, []);

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
      {isMobile && data ? (
        <ProfileComponent isMobile={isMobile} data={data.user} />
      ) : isDesktop && data ? (
        <div className={`${style.Desktopcontainer}`}>
          <ProfileComponent isMobile={isMobile} data={data.user} />
        </div>
      ) : isTablet && data ? (
        // Add your logic for tablet here
        <div className={`${style.Tabletcontainer}`}>
          <ProfileComponent isMobile={isMobile} data={data.user} />
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

export default Profile;
