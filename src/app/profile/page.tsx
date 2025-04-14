import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import styles from "../index.module.css";
import { Navbar } from "../_components/navbar";
import { SignOutButton } from "../_components/signOutButton";

export default async function Profile() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <img className={styles.profileAvatar} alt="avatar" />
            <p className={styles.description}>{session?.user?.name}</p>
            <p>-</p>
            <p className={styles.description}> {session?.user?.displayName}</p>
          </div>
          <SignOutButton />
          <Navbar />
        </div>
      </main>
    </HydrateClient>
  );
}
