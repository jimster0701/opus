"use client";
import { useThemeStore } from "~/store/themeStore";
import styles from "../index.module.css";
import Link from "next/link";

export function Navbar() {
  const { theme, setTheme } = useThemeStore();
  return (
    <nav
      className={
        theme === "default"
          ? `${styles.navbar}`
          : `${styles.navbar} ${styles[`theme-${theme}`]}`
      }
    >
      <Link className={styles.navbarItem} href={"/"}>
        <p className={styles.opusText}>Home</p>
      </Link>
      <Link className={styles.navbarItem} href={"/feed"}>
        <p className={styles.opusText}></p>
        <p className={styles.opusText}>Discover</p>
      </Link>
      <Link className={styles.navbarItem} href={"/create"}>
        <p className={styles.opusText}>Create</p>
      </Link>
      <Link className={styles.navbarItem} href={"/friends"}>
        <p className={styles.opusText}>Friends</p>
      </Link>
      <Link className={styles.navbarItem} href={"/profile"}>
        <p className={styles.opusText}>Profile</p>
      </Link>
    </nav>
  );
}
