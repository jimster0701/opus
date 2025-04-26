import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Navbar } from "../_components/navbar";
import Header from "../_components/header";
import CreateClient from "../_components/pages/CreateClient";

export default async function Create() {
  const session = await auth();
  if (session?.user) {
    const userId = session.user.id || "null";
    return (
      <HydrateClient>
        <Header userId={userId} theme={session.user.themePreset} />
        <CreateClient theme={session.user.themePreset} session={session} />
        <Navbar />
      </HydrateClient>
    );
  } else redirect("/");
}
