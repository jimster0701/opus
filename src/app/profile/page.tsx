import { auth } from "~/server/auth";
import ProfileClient from "../_components/pages/ProfileClient";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import Header from "../_components/header";
import { Navbar } from "../_components/navbar";

export default async function Profile() {
  const session = await auth();
  const userId = session?.user.id ?? "null";
  if (session)
    return (
      <HydrateClient>
        <Header userId={userId} theme={session.user.themePreset} />
        <ProfileClient session={session} theme={session.user.themePreset} />
        <Navbar />
      </HydrateClient>
    );
  else redirect("/");
}
