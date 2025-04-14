"use client";

export function SignOutButton() {
  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/"; // Redirect to homepage or login
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
