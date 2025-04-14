import { Navbar } from "./_components/navbar";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import styles from "./index.module.css";
import { LatestPost } from "./_components/latestPost";
import { NewUserModalWrapper } from "./_components/modalWrappers";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Welcome {session && <span>{session.user?.name}, </span>}
            <br />
            to <span className={styles.pinkSpan}>Opus</span>
          </h1>

          {session?.user && <LatestPost />}
        </div>
        <Navbar />
      </main>
      <NewUserModalWrapper displayName={session?.user.displayName ?? null} />
    </HydrateClient>
  );
}
