import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import styles from "../index.module.css";
import { redirect } from "next/navigation";
import { Navbar } from "../_components/navbar";
import Header from "../_components/header";
import { LatestPost } from "../_components/posts/latestPost";

export default async function Create() {
  const session = await auth();
  if (session?.user) {
    const userId = session.user.id || "null";
    const tags = await api.tag.getAllTags.call({ userId });
    console.log("Tags", tags);
    return (
      <HydrateClient>
        <Header userId={userId} />
        <main className={styles.main}>
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
