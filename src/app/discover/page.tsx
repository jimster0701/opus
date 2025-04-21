import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import styles from "../index.module.css";
import { redirect } from "next/navigation";
import { Navbar } from "../_components/navbar";
import Header from "../_components/header";

export default async function Discover() {
  const session = await auth();
  if (session?.user) {
    const userId = session.user.id || "null";
    return (
      <HydrateClient>
        <Header userId={userId} />
        <main className={styles.main}>
          <div className={styles.container}>
            {!session?.user && redirect("/")}
          </div>
        </main>
        <Navbar />
      </HydrateClient>
    );
  }
}
