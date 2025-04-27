"use client";

import styles from "../../index.module.css";
import { useEffect } from "react";
import { useThemeStore } from "~/store/themeStore";
import { type Session } from "~/types/session";
import ProfileHeader from "../profile/profileHeader";
import { AllUserPosts } from "../posts/allUserPosts";

interface ProfileClientProps {
  session: Session;
  theme: string;
}

export default function ProfileClient(props: ProfileClientProps) {
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
      {props.session.user && (
        <>
          <ProfileHeader session={props.session} />
          <div
            className={`${styles.container} ${styles.profileUserPostContainer}`}
          >
            <AllUserPosts userId={props.session.user.id} />
          </div>
        </>
      )}
    </main>
  );
}
