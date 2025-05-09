"use client";
import { useEffect, useState } from "react";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/navigation";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";
import { AllFriendsPosts } from "../posts/allFriendsPosts";
import { type Interest } from "~/types/interest";
import { defaultInterest } from "~/const/defaultVar";
import { type User } from "~/types/user";
import { GainInterestModal } from "../modals";

interface friendsClientProps {
  user: User;
}

export default function FriendsClient(props: friendsClientProps) {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [selectedTab, setSelectedTab] = useState("");
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [newInterest, setNewInterest] = useState<Interest>(defaultInterest);
  const [hasMounted, setHasMounted] = useState(false);
  const [userInterests, setUserInterests] = useState<Interest[]>([
    defaultInterest,
  ]);

  const getUserInterests = trpc.user.getUserInterests.useQuery({
    userId: props.user.id,
  });

  const { data: friendsData, isLoading } = trpc.user.getFriends.useQuery();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (getUserInterests.isLoading) return;
    setUserInterests(getUserInterests.data as Interest[]);
  }, [getUserInterests.isLoading, getUserInterests.data]);

  if (!hasMounted) {
    return (
      <main
        className={
          theme === "default"
            ? `${styles.main}`
            : `${styles.main} ${styles[`theme-${theme}`]}`
        }
      ></main>
    );
  }

  return (
    <main
      className={
        theme === "default"
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
            Friends posts
          </button>
          <button
            onClick={() => {
              setSelectedTab("list");
            }}
          >
            Friends list
          </button>
        </div>
        {(selectedTab == "posts" || selectedTab == "") && (
          <AllFriendsPosts
            setNewInterest={setNewInterest}
            setShowInterestModal={setShowInterestModal}
            userId={props.user.id}
          />
        )}
        {selectedTab == "list" && (
          <>
            <h1 className={styles.opusText}>Friends List</h1>
            {isLoading ? (
              <p className={styles.opusText}>Loading friends...</p>
            ) : friendsData && friendsData.length > 0 ? (
              <div className={styles.friendsContainer}>
                {friendsData.map((friend) => (
                  <div
                    key={friend.id}
                    className={styles.cardContainer}
                    onClick={() => {
                      router.push(`/profile/${friend.id}`);
                    }}
                  >
                    <ProfilePicturePreviewWrapper
                      id={friend.id}
                      imageUrl={friend.image ?? ""}
                      width={10}
                      height={10}
                    />
                    <p className={styles.opusText}>{friend.displayName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.opusText}>No friends found.</p>
            )}
          </>
        )}
      </div>
      {showInterestModal && (
        <GainInterestModal
          interest={newInterest}
          userId={props.user.id}
          onComplete={() => setShowInterestModal(false)}
          userInterests={userInterests}
        />
      )}
    </main>
  );
}
