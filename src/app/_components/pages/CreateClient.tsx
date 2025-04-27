"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import CreateSelector from "../create/createSelector";
import { useEffect, useState } from "react";
import { type Task } from "~/types/task";
import { trpc } from "~/utils/trpc";

interface CreateClientProps {
  session: any;
  theme: string;
}

export default function CreateClient(props: CreateClientProps) {
  const [selectedTab, setSelectedTab] = useState("");
  const [titleWord, setTitleWord] = useState("something");
  const { theme, setTheme } = useThemeStore();

  const dailyTasks = trpc.task.getDailyTasks.useQuery();
  const customTasks = trpc.task.getCustomTasks.useQuery();

  const availableTasks: Task[] = [
    ...(dailyTasks.data ?? []),
    ...(customTasks.data ?? []),
  ];

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

  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    }
  }, [theme, props.theme, setTheme]);
  return (
    <main
      className={
        theme == "default"
          ? `${styles.main}`
          : `${styles.main} ${styles[`theme-${theme}`]}`
      }
    >
      <div className={styles.container}>
        <h1 className={styles.createPageText}>Create {titleWord}</h1>
        <h2 className={styles.createPageText}>
          Post about your daily tasks or create a new custom task
        </h2>
        <CreateSelector
          user={props.session.user}
          setSelectedTab={setSelectedTab}
          availableTasks={availableTasks}
        />
      </div>
    </main>
  );
}
