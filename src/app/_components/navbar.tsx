"use client";
import { useThemeStore } from "~/store/themeStore";
import styles from "../index.module.css";
import Link from "next/link";
import { Home, Search, PlusCircle, Users, User } from "lucide-react";

export function Navbar() {
  const { theme } = useThemeStore();
  return (
    <nav
      className={
        theme === "default"
          ? `${styles.navbar}`
          : `${styles.navbar} ${styles[`theme-${theme}`]}`
      }
    >
      <Link className={styles.navbarItem} href={"/"}>
        <Home size={20} />
        <p>Home</p>
      </Link>
      <Link className={styles.navbarItem} href={"/discover"}>
        <Search size={20} />
        <p>Discover</p>
      </Link>
      <Link className={styles.navbarItem} href={"/create"}>
        <PlusCircle size={20} />
        <p>Create</p>
      </Link>
      <Link className={styles.navbarItem} href={"/friends"}>
        <Users size={20} />
        <p>Friends</p>
      </Link>
      <Link className={styles.navbarItem} href={"/profile"}>
        <User size={20} />
        <p>Profile</p>
      </Link>
    </nav>
  );
}
