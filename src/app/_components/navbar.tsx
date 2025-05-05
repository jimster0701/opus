"use client";
import { useThemeStore } from "~/store/themeStore";
import styles from "../index.module.css";
import Link from "next/link";
import { Home, Search, PlusCircle, Users, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "~/utils/trpc";
import { useEffect, useMemo, useState } from "react";

interface navbarProps {
  theme: string;
}

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

export function SlugNavbar(props: navbarProps) {
  const router = useRouter();
  const [theme, setTheme] = useState("");
  const params = useParams();
  const slugData = params.slug;

  const getUser = trpc.user.getUserById.useQuery(
    {
      id: typeof slugData === "string" ? slugData : "",
    },
    {
      retry: (_count, err) => {
        // `onError` only runs once React Query stops retrying
        if (err.data?.code === "UNAUTHORIZED") {
          void router.push("/");
        }
        return true;
      },
    }
  );

  useMemo(() => {
    setTheme(props.theme);
  }, [props.theme]);

  useEffect(() => {
    if (getUser.isLoading) return;
    if (getUser.data && getUser.data.themePreset) {
      setTheme(getUser.data.themePreset);
    }
  }, [getUser.isLoading, getUser.data, setTheme]);

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
