"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { AllFriendsPosts } from "../posts/allFriendsPosts";
import { type Session } from "~/types/session";
import { useEffect, useState } from "react";
import { AllInterestPosts } from "../posts/allInterestPosts";
import { type Interest } from "~/types/interest";
import { defaultInterest } from "~/const/defaultVar";
import { trpc } from "~/utils/trpc";

interface DiscoverClientProps {
  session: Session;
  theme: string;
}

export default function DiscoverClient(props: DiscoverClientProps) {
  const [selectedTab, setSelectedTab] = useState("");
  const [interests, setInterests] = useState<Interest[]>([defaultInterest]);
  const { theme, setTheme } = useThemeStore();
  const getInterests = trpc.user.getUserInterests.useQuery({
    userId: props.session.userId,
  });

  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    } else setTheme(theme);
  }, [theme, props.theme, setTheme]);

  useEffect(() => {
    if (getInterests.isLoading) return;
    setInterests(getInterests.data as Interest[]);
  }, [getInterests.isLoading, getInterests.data]);

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
        {selectedTab == "discover" && (
          <AllInterestPosts
            interestIds={interests.map((i) => i.id)}
            userId={props.session?.user.id}
            session={props.session}
          />
        )}
      </div>
    </main>
  );
}
