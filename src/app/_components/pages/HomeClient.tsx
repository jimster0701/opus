"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import TaskList from "../tasks/taskList";
import { trpc } from "~/utils/trpc";
import { type Task } from "~/types/task";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { type Session } from "~/types/session";

interface HomeClientProps {
  session: Session;
  theme: string;
}

export default function HomeClient(props: HomeClientProps) {
  const { theme, setTheme } = useThemeStore();

  const searchParams = useSearchParams();
  const preselectedTab = searchParams.get("selectedTab"); // From taskbox

  const [selectedTabCount, setSelectedTabCount] = useState<[string, number]>([
    "daily",
    0,
  ]);

  const dailyTasks = trpc.task.getDailyTasks.useQuery();
  const customTasks = trpc.task.getCustomTasks.useQuery();

  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    }
  }, [theme, props.theme, setTheme]);

  useEffect(() => {
    if (preselectedTab == "custom") {
      setSelectedTabCount((prev) => [preselectedTab, prev[1]]);
      customTasks.refetch().catch(() => {
        console.error("Error refetching custom tasks");
      });
    }
  }, [preselectedTab, dailyTasks, customTasks]);

  useEffect(() => {
    if (dailyTasks.isLoading) {
      return;
    }
    if (dailyTasks.data?.length === 0) {
      // call gpt
    }
  }, [dailyTasks.isLoading, dailyTasks.data?.length]);

  const availableTasks: Task[] = [
    ...(dailyTasks.data ?? []),
    ...(customTasks.data ?? []),
  ];

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
          availableTasks={availableTasks}
          selectedTab={selectedTabCount}
        />
      </div>
    </main>
  );
}
