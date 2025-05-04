"use client";
import { useEffect, useState } from "react";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/navigation";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";
import { type Session } from "~/types/session";

interface FriendsClientProps {
  session: Session;
}

export default function FriendsClient(props: FriendsClientProps) {
  const router = useRouter();
  const { theme, setTheme } = useThemeStore();
  const [hasMounted, setHasMounted] = useState(false);

  const { data: friendsData, isLoading } = trpc.user.getFriends.useQuery();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (theme === "unset" || theme != props.session.user.themePreset) {
      setTheme(props.session.user.themePreset);
    } else setTheme(theme);
  }, [theme, props.session.user.themePreset, setTheme]);

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
