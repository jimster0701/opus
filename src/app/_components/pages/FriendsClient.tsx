"use client";
import { useEffect, useState } from "react";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { trpc } from "~/utils/trpc";

interface FriendsClientProps {
  session?: any;
  theme: string;
}

export default function FriendsClient(props: FriendsClientProps) {
  const { theme, setTheme } = useThemeStore();
  const [friends, setFriends] = useState<any[]>([]);

  const { data: friendsData, isLoading } = trpc.user.getFriends.useQuery();

  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    }
  }, [theme, props.theme, setTheme]);

  useEffect(() => {
    if (friendsData) {
      setFriends(friendsData);
    }
  }, [friendsData]);

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
        ) : friends.length > 0 ? (
          <ul>
            {friends.map((friend) => (
              <li key={friend.id}>
                <p className={styles.opusText}>
                  {friend.displayName || friend.name}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.opusText}>No friends found.</p>
        )}
      </div>
    </main>
  );
}
