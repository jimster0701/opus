"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // Redirects after signout
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
