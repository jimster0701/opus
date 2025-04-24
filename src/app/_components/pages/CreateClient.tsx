"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { LatestPost } from "../posts/latestPost";

interface CreateClientProps {
  session?: any;
  theme: string;
}

export default function CreateClient(props: CreateClientProps) {
  const { theme, setTheme } = useThemeStore();
  if (theme == "unset") setTheme(props.theme);
  return (
    <main
      className={
        theme == "default"
          ? `${styles.main}`
          : `${styles.main} ${styles[`theme-${theme}`]}`
      }
    >
      <div className={styles.container}>
        <LatestPost />
      </div>
    </main>
  );
}
