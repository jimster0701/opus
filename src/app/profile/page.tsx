import { auth } from "~/server/auth";
import ProfileClient from "../_components/pages/ProfileClient";
import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import Header from "../_components/header";
import { Navbar } from "../_components/navbar";

export default async function Profile() {
  const session = await auth();
  const userId = session?.user.id || "null";
  return (
    <HydrateClient>
      {!session?.user && redirect("/")}
      <Header userId={userId} profile={true} />
      <ProfileClient session={session} />
      <Navbar />
    </HydrateClient>
  );
}
