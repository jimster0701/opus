import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import styles from "./index.module.css";
import { useThemeStore } from "~/store/themeStore";

export default async function Friends() {
  const session = await auth();
  const { theme, setTheme } = useThemeStore();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  /*
    getFriends();
    friends.map((friend) => {
        <Link href=`/friends/${friend.slug}`>{friend.displayName}</Link>
    })
  */

  return (
    <HydrateClient>
      <main
        className={
          theme == "default"
            ? `${styles.main}`
            : `${styles.main} ${styles[`theme-${theme}`]}`
        }
      >
        <div className={styles.container}></div>
      </main>
    </HydrateClient>
  );
}
