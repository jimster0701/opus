"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";

interface FriendsClientProps {
  session?: any;
  theme: string;
}

export default function FriendsClient(props: FriendsClientProps) {
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
      <div className={styles.container}></div>
    </main>
  );
}
