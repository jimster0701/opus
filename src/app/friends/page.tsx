import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import styles from "./index.module.css";

export default async function Friends() {
  const session = await auth();

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
      <main className={styles.main}>
        <div className={styles.container}></div>
      </main>
    </HydrateClient>
  );
}
