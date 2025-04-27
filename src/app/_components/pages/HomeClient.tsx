"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import TaskList from "../tasks/taskList";
import { trpc } from "~/utils/trpc";
import { type Task } from "~/types/task";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface HomeClientProps {
  session?: any;
  theme: string;
}

export default function HomeClient(props: HomeClientProps) {
  const { theme, setTheme } = useThemeStore();
  const searchParams = useSearchParams();
  const preselectedTab = searchParams.get("selectedTab");

  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    }
  }, [theme, props.theme, setTheme]);

  const dailyTasks = trpc.task.getDailyTasks.useQuery();
  const customTasks = trpc.task.getCustomTasks.useQuery();

  if (!dailyTasks.isLoading && dailyTasks.data?.length == 0) {
    // generate tasks using chat...
  }

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
          {props.session.user.name ? (
            <span>{props.session.user.name}</span>
          ) : (
            <span>{props.session.user.displayName}</span>
          )}
        </h1>
        <br />
        <TaskList
          preselectedTab={preselectedTab}
          availableTasks={availableTasks}
        />
      </div>
    </main>
  );
}
