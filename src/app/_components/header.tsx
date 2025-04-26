"use client";
import styles from "../index.module.css";
import Image from "next/image";
import { SettingsModal } from "./modals";
import { useEffect, useState } from "react";
import { useThemeStore } from "~/store/themeStore";

interface HeaderProps {
  userId: string;
  theme: string;
}

export default function Header(props: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme } = useThemeStore();
  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    }
  }, [theme, props.theme, setTheme]);

  return (
    <div
      className={
        theme === "default"
          ? `${styles.header}`
          : `${styles.header} ${styles[`theme-${theme}`]}`
      }
    >
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
