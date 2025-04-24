import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import styles from "./index.module.css";
import { redirect } from "next/navigation";
import FriendsClient from "../_components/pages/FriendsClient";
import { Navbar } from "../_components/navbar";
import Header from "../_components/header";

export default async function Friends() {
  const session = await auth();
  if (session?.user) {
    void api.post.getLatest.prefetch();

    /*
    getFriends();
    friends.map((friend) => {
        <Link href=`/friends/${friend.slug}`>{friend.displayName}</Link>
    })
  */
    return (
      <HydrateClient>
        <Header userId={session.user.id} />
        <FriendsClient theme={session.user.themePreset} />
        <Navbar />
      </HydrateClient>
    );
  } else redirect("/");
}
