"use client";

import styles from "../../index.module.css";
import { useEffect, useState } from "react";
import { useThemeStore } from "~/store/themeStore";
import { type Session } from "~/types/session";
import ProfileHeader from "../profile/profileHeader";
import { AllUserPosts } from "../posts/allUserPosts";
import { type Interest } from "~/types/interest";
import { defaultInterests } from "~/const/defaultVar";

interface ProfileClientProps {
  session: Session;
  theme: string;
}

export default function ProfileClient(props: ProfileClientProps) {
  const { theme, setTheme } = useThemeStore();
  const [userInterests, setUserInterests] = useState<Interest[]>(
    defaultInterests.filter((i) =>
      props.session.user.interestIds.includes(i.id)
    )
  );
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
        <ProfileHeader
          session={props.session}
          userInterests={userInterests}
          setUserInterests={setUserInterests}
        />
        <br />
        <div className={styles.profilePostContainer}>
          <AllUserPosts
            userId={props.session.user.id}
            sessionUserId={props.session.user.id}
          />
        </div>
      </div>
    </main>
  );
}
