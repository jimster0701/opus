"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import Taskbox from "../taskbox";

interface HomeClientProps {
  session?: any;
  theme: string;
}

export default function HomeClient(props: HomeClientProps) {
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
        <h1 className={`${styles.title} ${styles.opusText}`}>
          Welcome
          <br />
          to Opus,
          <br />
          {props.session.user.name ? (
            <span>{props.session.user.name}</span>
          ) : (
            <span>{props.session.user.displayName}</span>
          )}
        </h1>
      </div>
    </main>
  );
}
