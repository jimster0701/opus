"use client";
import { useEffect, useState } from "react";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/navigation";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";
import { type Session } from "~/types/session";

export default function FriendsClient() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [hasMounted, setHasMounted] = useState(false);

  const { data: friendsData, isLoading } = trpc.user.getFriends.useQuery();

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
      </div>
    </main>
  );
}
