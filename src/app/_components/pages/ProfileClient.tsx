"use client";

import styles from "../../index.module.css";
import { useEffect, useMemo, useState } from "react";
import { useThemeStore } from "~/store/themeStore";
import { type Session } from "~/types/session";
import ProfileHeader from "../profile/profileHeader";
import { AllUserPosts } from "../posts/allUserPosts";
import { type Interest } from "~/types/interest";
import { trpc } from "~/utils/trpc";

interface ProfileClientProps {
  session: Session;
}

export default function ProfileClient(props: ProfileClientProps) {
  const { theme, setTheme } = useThemeStore();
  const [userInterests, setUserInterests] = useState<Interest[]>([]);
  const getInterests = trpc.user.getUserInterests.useQuery({
    userId: props.session.userId,
  });

  useMemo(() => {
    if (getInterests.isLoading) return;
    setUserInterests((getInterests.data as Interest[]) ?? []);
  }, [getInterests.isLoading, getInterests.data]);

  useEffect(() => {
    if (theme === "unset" || theme != props.session.user.themePreset) {
      setTheme(props.session.user.themePreset);
    } else setTheme(theme);
  }, [theme, props.session.user.themePreset, setTheme]);

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
            setNewInterest={undefined}
            setShowInterestModal={undefined}
          />
        </div>
      </div>
    </main>
  );
}
