import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";
import FriendsClient from "../_components/pages/FriendsClient";
import { Navbar } from "../_components/navbar";
import { Header } from "../_components/header";

export default async function Friends() {
  const session = await auth();
  if (session?.user) {
    void api.user.getFriends.prefetch();

    /*
    getFriends();
    friends.map((friend) => {
        <Link href=`/friends/${friend.slug}`>{friend.displayName}</Link>
    })
  */
    return (
      <HydrateClient>
        <Header userId={session.user.id} theme={session.user.themePreset} />
        <FriendsClient theme={session.user.themePreset} />
        <Navbar />
      </HydrateClient>
    );
  } else redirect("/");
}
