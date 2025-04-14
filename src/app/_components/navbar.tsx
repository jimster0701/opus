import styles from "../index.module.css";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href={"/"}>Home</Link>
      <Link href={"/feed"}>Feed</Link>
      <Link href={"/profile"}>Profile</Link>
    </nav>
  );
}
