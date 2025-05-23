"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { type Session } from "~/types/session";
import { useEffect, useMemo, useState } from "react";
import { AllInterestPosts } from "../posts/allInterestPosts";
import { type Interest } from "~/types/interest";
import { defaultInterest } from "~/const/defaultVar";
import { trpc } from "~/utils/trpc";
import { GainInterestModal } from "../modals";
import toast from "react-hot-toast";
import { shuffle } from "../util";

interface DiscoverClientProps {
  session: Session;
  theme: string;
}

export default function DiscoverClient(props: DiscoverClientProps) {
  const [selectedTab, setSelectedTab] = useState("");
  const [userInterests, setUserInterests] = useState<Interest[]>([
    defaultInterest,
  ]);
  const { theme } = useThemeStore();
  const getUserInterests = trpc.user.getUserInterests.useQuery({
    userId: props.session.user.id,
  });

  const [showInterestModal, setShowInterestModal] = useState(false);
  const [allCustomInterests, setAllCustomInterests] = useState<Interest[]>([]);

  const [newInterest, setNewInterest] = useState<Interest>(defaultInterest);

  const getAllInterests = trpc.interest.getAllCustomInterests.useQuery();

  useMemo(() => {
    if (getAllInterests.isLoading) return;
    setAllCustomInterests(shuffle(getAllInterests.data as Interest[]) ?? []);
  }, [getAllInterests.isLoading, getAllInterests.data]);

  useEffect(() => {
    if (getUserInterests.isLoading) return;
    setUserInterests(getUserInterests.data as Interest[]);
  }, [getUserInterests.isLoading, getUserInterests.data]);

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
              setSelectedTab("posts");
            }}
          >
            Discover posts
          </button>
          <button
            onClick={() => {
              setSelectedTab("interests");
            }}
          >
            Discover interests
          </button>
        </div>
        {(selectedTab == "posts" || selectedTab == "") && (
          <>
            <h2 className={styles.opusText} style={{ margin: 0 }}>
              Posts related to you:
            </h2>
            <AllInterestPosts
              setNewInterest={setNewInterest}
              setShowInterestModal={setShowInterestModal}
              interestIds={userInterests.map((i) => i.id)}
              userId={props.session?.user.id}
              session={props.session}
            />
          </>
        )}
        {selectedTab == "interests" && (
          <>
            <h3 className={styles.opusText}>User created interests:</h3>
            {getAllInterests.isLoading && <h3>Loading...</h3>}
            {allCustomInterests.length > 0 ? (
              <div className={styles.discoverCustomInterestContainer}>
                {allCustomInterests.map((interest) => (
                  <div
                    key={interest.id}
                    style={{
                      border: `${interest.colour} 1px solid`,
                      ["--text-glow" as any]: `linear-gradient(to top left,rgb(70, 70, 70), ${interest.colour})`,
                    }}
                    className={styles.glowingNugget}
                    onClick={() => {
                      if (!userInterests.some((i) => i.id == interest.id)) {
                        setShowInterestModal(true);
                        setNewInterest(interest);
                      } else {
                        toast.error("You already have this interest selected");
                      }
                    }}
                  >
                    <p className={styles.glowingNuggetText}>
                      {interest.icon}
                      {interest.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <h3 className={styles.opusText}>
                No custom interests are available.
              </h3>
            )}
          </>
        )}
      </div>
      {showInterestModal && (
        <GainInterestModal
          interest={newInterest}
          userId={props.session.user.id}
          onComplete={() => setShowInterestModal(false)}
          userInterests={userInterests}
        />
      )}
    </main>
  );
}
