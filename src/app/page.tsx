import { Navbar } from "./_components/navbar";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { NewUserModalWrapper } from "./_components/modalWrappers";
import Header from "./_components/header";
import HomeClient from "./_components/pages/HomeClient";
import styles from "./index.module.css";
import NotLoggedIn from "./_components/pages/NotLoggedIn";

export default async function Home() {
  const session = await auth();
  const userId = session?.user.id || "null";

  if (session) {
    if (session?.user) {
      void api.post.getLatest.prefetch();
    }
    return (
      <HydrateClient>
        <Header userId={userId} />
        <HomeClient session={session} theme={session.user.themePreset} />
        <NewUserModalWrapper displayName={session?.user.displayName ?? null} />
        <Navbar />
      </HydrateClient>
    );
  }
  return (
    <HydrateClient>
      <NotLoggedIn />
    </HydrateClient>
  );
}
