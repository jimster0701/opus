"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import { LatestPost } from "../posts/latestPost";
import CreateSelector from "../create/createSelector";
import { useEffect, useState } from "react";

interface CreateClientProps {
  session: any;
  theme: string;
}

export default function CreateClient(props: CreateClientProps) {
  const [selectedTab, setSelectedTab] = useState("");
  const [titleWord, setTitleWord] = useState("something");
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    switch (selectedTab) {
      case "post":
        setTitleWord("a post");
        break;
      case "task":
        setTitleWord("a task");
        break;
      default:
        setTitleWord("something");
    }
  }, [selectedTab]);

  if (theme == "unset") setTheme(props.theme);
  return (
    <main
      className={
        theme == "default"
          ? `${styles.main}`
          : `${styles.main} ${styles[`theme-${theme}`]}`
      }
    >
      <div className={styles.container}>
        <h1>Create {titleWord}</h1>
        <h2>Post about your daily tasks or create a new custom task</h2>
        <CreateSelector
          user={props.session.user}
          setSelectedTab={setSelectedTab}
        />
      </div>
    </main>
  );
}
