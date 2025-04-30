"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import TaskList from "../tasks/taskList";
import { trpc } from "~/utils/trpc";
import { type Task } from "~/types/task";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { type Session } from "~/types/session";
import Error from "next/error";

interface HomeClientProps {
  session: Session;
  theme: string;
}

export default function HomeClient(props: HomeClientProps) {
  const { theme, setTheme } = useThemeStore();

  const searchParams = useSearchParams();

  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);

  const [preselectedTab, setPreselectedTab] = useState(
    searchParams.get("selectedTab") ?? ""
  );
  const [selectedTabCount, setSelectedTabCount] = useState<[string, number]>([
    preselectedTab ?? "daily",
    0,
  ]);

  const getDailyTasks = trpc.task.getDailyTasks.useQuery();
  const getCustomTasks = trpc.task.getCustomTasks.useQuery();

  const preselectedUpdate = async () => {
    try {
      await getCustomTasks.refetch();
    } catch (error) {
      console.error("Error refetching custom tasks", error);
    }
  };

  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    }
  }, [theme, props.theme, setTheme]);

  useEffect(() => {
    if (preselectedTab == "custom") {
      setSelectedTabCount((prev) => [selectedTabCount[0], prev[1]]);
      preselectedUpdate();
      setPreselectedTab("");
    }
  }, [selectedTabCount[0], preselectedTab]);

  useEffect(() => {
    if (getDailyTasks.isLoading) return;
    if (getDailyTasks.data?.length != 0) {
      // call gpt
      setDailyTasks([]);
    }
  }, [getDailyTasks.isLoading, getDailyTasks.data?.length]);

  useEffect(() => {
    if (getCustomTasks.isLoading) return;
    if (getCustomTasks.data?.length != 0) {
      setCustomTasks(getCustomTasks.data as Task[]);
    }
  }, [getCustomTasks.isLoading, getCustomTasks.data?.length]);

  return (
    <main
      className={
        theme == "default"
          ? `${styles.main}`
          : `${styles.main} ${styles[`theme-${theme}`]}`
      }
    >
      <div className={styles.container}>
        <h1 className={`${styles.title} ${styles.opusText}`}>
          Welcome
          <br />
          to Opus,
          <br />
          {props.session.user.displayName && (
            <span>{props.session.user.displayName}</span>
          )}
        </h1>
        <br />
        {selectedTabCount[0] == "custom" && selectedTabCount[1] > 0 ? (
          <h3 className={`${styles.homeDescription} ${styles.opusText}`}>
            These are your custom tasks from the past week:
          </h3>
        ) : selectedTabCount[0] == "daily" ? (
          <h3 className={`${styles.homeDescription} ${styles.opusText}`}>
            Here are your tasks for today:
          </h3>
        ) : (
          <h3 className={`${styles.homeDescription} ${styles.opusText}`}>
            {"You can create a new task on the 'Create' page!"}
          </h3>
        )}
        <TaskList
          setSelectedTab={setSelectedTabCount}
          customTasks={customTasks}
          dailyTasks={dailyTasks}
          selectedTab={selectedTabCount}
        />
      </div>
    </main>
  );
}
