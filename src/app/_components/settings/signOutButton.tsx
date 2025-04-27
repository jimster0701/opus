"use client";
import { signOut } from "next-auth/react";
import styles from "../../index.module.css";

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // Redirects after signout
  };

  return (
    <button
      className={`${styles.opusButton} ${styles.signOutButton}`}
      onClick={handleSignOut}
    >
      Sign Out
    </button>
  );
}
