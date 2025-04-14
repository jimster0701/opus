import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import styles from "../index.module.css";
import { Navbar } from "../_components/navbar";
import { SignOutButton } from "../_components/signOutButton";
import { CldImage } from "next-cloudinary";
import CldImageWrapper from "../_components/cldImageWrapper";
import ProfilePictureWrapper from "../_components/cldImageWrapper";

export default async function Profile() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <ProfilePictureWrapper />
            <p>{session?.user?.name}</p>
            <p>-</p>
            <p>{session?.user?.displayName}</p>
            <p>Following:{session?.user?.following.length}</p>
            <p>Followers:{session?.user?.followers.length}</p>
          </div>
          <SignOutButton />
          <Navbar />
        </div>
      </main>
    </HydrateClient>
  );
}
