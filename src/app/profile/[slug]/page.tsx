import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import ProfileSlugClient from "~/app/_components/pages/ProfileSlugClient";
import { redirect } from "next/navigation";

export default async function ProfileSlug() {
  const session = await auth();
  if (session)
    return (
      <HydrateClient>
        <ProfileSlugClient
          session={session}
          theme={session?.user.themePreset}
        />
      </HydrateClient>
    );
  else redirect("/");
}
