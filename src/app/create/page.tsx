import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import styles from "../index.module.css";
import { redirect } from "next/navigation";
import { Navbar } from "../_components/navbar";
import Header from "../_components/header";
import CreateClient from "../_components/pages/CreateClient";

export default async function Create() {
  const session = await auth();
  if (session?.user) {
    const userId = session.user.id || "null";
    const tags = await api.tag.getAllTags.call({ userId });
    return (
      <HydrateClient>
        <Header userId={userId} />
        <CreateClient theme={session.user.themePreset} session={session} />
        <Navbar />
      </HydrateClient>
    );
  } else redirect("/");
}
