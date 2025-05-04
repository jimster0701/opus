"use client";
import styles from "../index.module.css";
import Image from "next/image";
import { SettingsModal } from "./modals";
import { useEffect, useState } from "react";
import { useThemeStore } from "~/store/themeStore";
import { useParams } from "next/navigation";
import { trpc } from "~/utils/trpc";

interface HeaderProps {
  theme: string;
  userId: string;
  page?: string;
}

export function Header(props: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    } else setTheme(theme);
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

export function SlugHeader(props: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("");
  const params = useParams();
  const slugData = params.slug;

  const getUser = trpc.user.getUserById.useQuery({
    id: typeof slugData === "string" ? slugData : "",
  });

  useEffect(() => {
    if (getUser.isLoading) return;
    if (getUser.data && getUser.data.themePreset) {
      setTheme(getUser.data.themePreset);
    }
  }, [getUser.isLoading, getUser.data, setTheme]);

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
          {showSettings && (
            <SettingsModal onComplete={() => setShowSettings(false)} />
          )}
        </div>
      )}
    </div>
  );
}
