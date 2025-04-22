import { Navbar } from "./_components/navbar";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { NewUserModalWrapper } from "./_components/modalWrappers";
import Header from "./_components/header";
import HomeClient from "./_components/pages/HomeClient";
import LoginButton from "./_components/settings/loginButton";
import styles from "./index.module.css";

export default async function Home() {
  const session = await auth();
  const userId = session?.user.id || "null";

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  console.log(session?.user.themePreset);

  return (
    <HydrateClient>
      <Header userId={userId} />

      <HomeClient session={session} />
      {!session && (
        <div className={styles.showcaseContainer}>
          <p className={styles.showcaseText}>Please login to start:</p>
          <LoginButton />
        </div>
      )}
      {session && (
        <NewUserModalWrapper displayName={session?.user.displayName ?? null} />
      )}
      {session?.user && <Navbar />}
    </HydrateClient>
  );
}
