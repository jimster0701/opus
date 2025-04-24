import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import styles from "../index.module.css";
import { redirect } from "next/navigation";
import { Navbar } from "../_components/navbar";
import Header from "../_components/header";
import { useThemeStore } from "~/store/themeStore";
import DiscoverClient from "../_components/pages/DiscoverClient";

export default async function Discover() {
  const session = await auth();
  const { theme, setTheme } = useThemeStore();

  if (session?.user) {
    const userId = session.user.id || "null";
    if (theme == "unset") setTheme(session.user.themePreset);
    return (
      <HydrateClient>
        <Header userId={userId} />
        <DiscoverClient theme={""} />
        <Navbar />
      </HydrateClient>
    );
  } else redirect("/");
}
