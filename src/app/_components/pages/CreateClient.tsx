"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { LatestPost } from "../posts/latestPost";
import CreateSelector from "../create/createSelector";

interface CreateClientProps {
  session: any;
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
        <h1>Create something</h1>
        <h2>Post about your daily tasks or create a new custom task</h2>
        <CreateSelector user={props.session.user} />
      </div>
    </main>
  );
}
