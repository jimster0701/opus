import styles from "../index.module.css";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link className={styles.navbarItem} href={"/"}>
        Home
      </Link>
      <Link className={styles.navbarItem} href={"/discover"}>
        Discover
      </Link>
      <Link className={styles.navbarItem} href={"/create"}>
        Create
      </Link>
      <Link className={styles.navbarItem} href={"/friends"}>
        Friends
      </Link>
      <Link className={styles.navbarItem} href={"/profile"}>
        Profile
      </Link>
    </nav>
  );
}
