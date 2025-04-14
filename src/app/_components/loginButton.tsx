import { signIn } from "~/server/auth";
import styles from "../index.module.css";

export default async function LoginButton() {
  return (
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
  );
}
