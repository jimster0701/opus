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
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const { theme } = useThemeStore();

  const getCustomTasks = trpc.task.getCustomTasks.useQuery({
    userId: props.session.user.id,
  });
  const getDailyTasks = trpc.task.getDailyTasks.useQuery({
    userId: props.session.user.id,
  });

  useEffect(() => {
    if (getCustomTasks.isLoading) return;
    if (getCustomTasks.data?.length != 0) {
      setCustomTasks(getCustomTasks.data as Task[]);
      setAvailableTasks(getCustomTasks.data as Task[]);
    }
  }, [
    getCustomTasks.isLoading,
    getCustomTasks.data?.length,
    getCustomTasks.data,
  ]);

  useEffect(() => {
    if (getDailyTasks.isLoading) return;
    if (getDailyTasks.data?.length != 0) {
      setAvailableTasks([...(getDailyTasks.data as Task[]), ...customTasks]);
    }
  }, [
    getDailyTasks.isLoading,
    getDailyTasks.data?.length,
    getDailyTasks.data,
    customTasks,
  ]);

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
