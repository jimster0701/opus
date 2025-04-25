import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import styles from "../index.module.css";
import { redirect } from "next/navigation";
import { Navbar } from "../_components/navbar";
import Header from "../_components/header";
import DiscoverClient from "../_components/pages/DiscoverClient";

export default async function Discover() {
  const session = await auth();

  if (session?.user) {
    const userId = session.user.id || "null";
    return (
      <HydrateClient>
        <Header userId={userId} />
        <DiscoverClient theme={session.user.themePreset} session={session} />
        <Navbar />
      </HydrateClient>
    );
  } else redirect("/");
}
