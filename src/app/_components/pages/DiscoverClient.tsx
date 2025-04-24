"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { AllFriendsPosts } from "../posts/allFriendsPosts";
import { Session } from "~/types/session";

interface DiscoverClientProps {
  session: Session;
  theme: string;
}

export default function DiscoverClient(props: DiscoverClientProps) {
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
        <AllFriendsPosts userId={props.session.user.id} />
      </div>
    </main>
  );
}
