import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import ProfileSlugClient from "~/app/_components/pages/ProfileSlugClient";
import { redirect } from "next/navigation";
import { SlugHeader } from "~/app/_components/header";
import { SlugNavbar } from "~/app/_components/navbar";

export default async function ProfileSlug() {
  const session = await auth();

  if (session?.user)
    return (
      <HydrateClient>
        <SlugHeader
          userPrivate={session.user.private}
          userTasksPrivate={session.user.tasksPrivate}
          userId={session.user.id}
          theme={session.user.themePreset}
        />
        <ProfileSlugClient session={session} />
        <SlugNavbar theme={session.user.themePreset} />
      </HydrateClient>
    );
  else redirect("/");
}
