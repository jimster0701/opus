"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { AllFriendsPosts } from "../posts/allFriendsPosts";
import { Session } from "~/types/session";
import { useEffect, useState } from "react";

interface DiscoverClientProps {
  session: Session;
  theme: string;
}

export default function DiscoverClient(props: DiscoverClientProps) {
  const [selectedTab, setSelectedTab] = useState("");
  const { theme, setTheme } = useThemeStore();
  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    }
  }, [theme, props.theme, setTheme]);
  return (
    <main
      className={
        theme == "default"
          ? `${styles.main}`
          : `${styles.main} ${styles[`theme-${theme}`]}`
      }
    >
      <div className={styles.container}>
        <div className={styles.discoverTabContainer}>
          <button
            autoFocus={selectedTab === "friends"}
            onClick={() => {
              setSelectedTab("friends");
            }}
          >
            Friends posts
          </button>
          <button
            onClick={() => {
              setSelectedTab("discover");
            }}
          >
            Discover posts
          </button>
        </div>
        {(selectedTab == "friends" || selectedTab == "") && (
          <AllFriendsPosts userId={props.session?.user.id} />
        )}
      </div>
    </main>
  );
}
