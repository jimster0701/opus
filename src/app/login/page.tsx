import { auth, signIn } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import styles from "../index.module.css";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className={styles.main}>
        <div className={styles.container}>
          {session && (
            <h1 className={styles.title}>Welcome {session.user?.name}</h1>
          )}
          {session?.user && redirect("/")}
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button className={styles.loginWithGoogleBtn} type="submit">
              Signin with Google
            </button>
          </form>
        </div>
      </main>
    </HydrateClient>
  );
}
