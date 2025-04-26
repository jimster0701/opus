"use client";
import styles from "../../index.module.css";
import { useThemeStore } from "~/store/themeStore";
import TaskList from "../tasks/dailyTasks";
import { trpc } from "~/utils/trpc";
import { Task } from "~/types/task";
import { useEffect } from "react";

interface HomeClientProps {
  session?: any;
  theme: string;
}

export default function HomeClient(props: HomeClientProps) {
  const { theme, setTheme } = useThemeStore();
  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    }
  }, [theme, props.theme, setTheme]);

  const { data: dailyTasks, isLoading: isDailyLoading } =
    trpc.task.getDailyTasks.useQuery();
  const { data: customTasks, isLoading: isCustomLoading } =
    trpc.task.getCustomTasks.useQuery();

  if (!isDailyLoading && dailyTasks?.length == 0) {
    // generate tasks using chat...
  }

  const availableTasks: Task[] = [
    ...(dailyTasks || []),
    ...(customTasks || []),
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
        <TaskList availableTasks={availableTasks} />
      </div>
    </main>
  );
}
