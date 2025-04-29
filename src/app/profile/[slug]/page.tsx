import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import ProfileSlugClient from "~/app/_components/pages/ProfileSlugClient";
import { redirect } from "next/navigation";
import Header from "~/app/_components/header";
import { Navbar } from "~/app/_components/navbar";

export default async function ProfileSlug() {
  const session = await auth();

  if (session && session.user)
    return (
      <HydrateClient>
        <Header userId={session.user.id} theme={session.user.themePreset} />
        <ProfileSlugClient sessionUser={session.user} />
        <Navbar />
      </HydrateClient>
    );
  else redirect("/");
}
