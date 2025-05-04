"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { AllFriendsPosts } from "../posts/allFriendsPosts";
import { type Session } from "~/types/session";
import { useEffect, useMemo, useState } from "react";
import { AllInterestPosts } from "../posts/allInterestPosts";
import { type Interest } from "~/types/interest";
import { defaultInterest } from "~/const/defaultVar";
import { trpc } from "~/utils/trpc";
import { GainInterestModal } from "../modals";

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

  const [showInterestModal, setShowInterestModal] = useState(false);
  const [sessionUserInterests, setSessionUserInterests] = useState<Interest[]>(
    []
  );
  const [newInterest, setNewInterest] = useState<Interest>(defaultInterest);

  const getSessionUserInterests = trpc.user.getUserInterests.useQuery({
    userId: props.session.userId,
  });

  useMemo(() => {
    if (getSessionUserInterests.isLoading) return;
    setSessionUserInterests((getSessionUserInterests.data as Interest[]) ?? []);
  }, [getSessionUserInterests.isLoading, getSessionUserInterests.data]);

  useEffect(() => {
    if (theme === "unset" || theme != props.theme) {
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
          <AllFriendsPosts
            setNewInterest={setNewInterest}
            setShowInterestModal={setShowInterestModal}
            userId={props.session?.user.id}
          />
        )}
        {selectedTab == "discover" && (
          <AllInterestPosts
            setNewInterest={setNewInterest}
            setShowInterestModal={setShowInterestModal}
            interestIds={interests.map((i) => i.id)}
            userId={props.session?.user.id}
            session={props.session}
          />
        )}
      </div>
      {showInterestModal && (
        <GainInterestModal
          interest={newInterest}
          userId={props.session.userId}
          onComplete={() => setShowInterestModal(false)}
          userInterests={sessionUserInterests}
        />
      )}
    </main>
  );
}
