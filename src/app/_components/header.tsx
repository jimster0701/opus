"use client";
import styles from "../index.module.css";
import { ProfilePicturePreviewWrapper } from "../_components/images/cldImageWrapper";
import Image from "next/image";
import { SettingsModal } from "./modals";
import { useState } from "react";

interface HeaderProps {
  userId: string;
  profile?: boolean;
}

export default function Header(props: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  console.log(props.userId);
  return (
    <div className={styles.header}>
      <div className={styles.logo}>Opus</div>
      {props.userId != "null" && (
        <div className={styles.navIcons}>
          <Image src="/images/bell.png" alt={""} width={25} height={25} />

          <Image
            src="/images/setting.png"
            alt={""}
            width={25}
            height={25}
            onClick={() => setShowSettings(true)}
          />
          {showSettings && (
            <SettingsModal onComplete={() => setShowSettings(false)} />
          )}
        </div>
      )}
    </div>
  );
}
