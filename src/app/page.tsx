import { Navbar } from "./_components/navbar";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import styles from "./index.module.css";
import { LatestPost } from "./_components/latestPost";
import { NewUserModalWrapper } from "./_components/modalWrappers";
import LoginButton from "./_components/loginButton";
import Header from "./_components/header";
import { AllFriendsPosts } from "./_components/allFriendsPosts";

export default async function Home() {
  const session = await auth();
  const userId = session?.user.id || "null";

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <Header userId={userId} />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Welcome {session && <span>{session.user?.name}, </span>}
            <br />
            to <span className={styles.pinkSpan}>Opus</span>
          </h1>
          {!session && (
            <div className={styles.showcaseContainer}>
              <p className={styles.showcaseText}>Please login to start:</p>
              <LoginButton />
            </div>
          )}
          {session?.user.displayName && (
            <>
              <AllFriendsPosts userId={session?.user.id} />
            </>
          )}
        </div>
      </main>
      {session && (
        <NewUserModalWrapper displayName={session?.user.displayName ?? null} />
      )}
      {session?.user && <Navbar />}
    </HydrateClient>
  );
}
