import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import styles from "../index.module.css";
import { redirect } from "next/navigation";
import { Navbar } from "../_components/navbar";
import Header from "../_components/header";
import { LatestPost } from "../_components/posts/latestPost";
import { useThemeStore } from "~/store/themeStore";

export default async function Create() {
  const session = await auth();
  const { theme, setTheme } = useThemeStore();
  if (session?.user) {
    const userId = session.user.id || "null";
    const tags = await api.tag.getAllTags.call({ userId });
    console.log("Tags", tags);
    return (
      <HydrateClient>
        <Header userId={userId} />
        <main
          className={
            theme == "default"
              ? `${styles.main}`
              : `${styles.main} ${styles[`theme-${theme}`]}`
          }
        >
          <div className={styles.container}>
            {!session?.user && redirect("/")}

            <LatestPost />
          </div>
        </main>
        <Navbar />
      </HydrateClient>
    );
  }
}
