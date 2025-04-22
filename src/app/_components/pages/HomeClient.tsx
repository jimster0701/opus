"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";

interface HomeClientProps {
  session?: any;
}

export default function HomeClient(props: HomeClientProps) {
  const { theme, setTheme } = useThemeStore();
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
          Welcome {props.session && <span>{props.session.user?.name}, </span>}
          <br />
          to <span className={styles.opusText}>Opus</span>
        </h1>
      </div>
    </main>
  );
}
