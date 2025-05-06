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
  const { theme } = useThemeStore();

  const searchParams = useSearchParams();
  const [preselectedTab, setPreselectedTab] = useState(
    searchParams.get("selectedTab")
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);

  const [selectedTabCount, setSelectedTabCount] = useState<[string, number]>([
    preselectedTab ?? "daily",
    0,
  ]);

  const generateDailyTasks = trpc.task.generateDailyTasks.useQuery(
    {
      userId: props.session.userId,
    },
    {
      enabled: false, // don't auto-fetch
    }
  );
  const getDailyTasks = trpc.task.getDailyTasks.useQuery();
  const getCustomTasks = trpc.task.getCustomTasks.useQuery();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError("");
    try {
      const response = await generateDailyTasks.refetch();
      if (response.data) {
        //setCustomTasks();
        console.log(response.data);
      }
    } catch (err) {
      setGenerationError("Failed to generate tasks");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (preselectedTab == "custom") {
      setSelectedTabCount((prev) => [selectedTabCount[0], prev[1]]);
      getCustomTasks.refetch().catch((error) => {
        console.error("Error refetching custom tasks", error);
      });
      setPreselectedTab("");
    }
  }, [preselectedTab, selectedTabCount, getCustomTasks]);

  useEffect(() => {
    if (getDailyTasks.isLoading) return;
    if (getDailyTasks.data?.length != 0) {
      setDailyTasks(getDailyTasks.data as Task[]);
    } else {
      setIsGenerating(true);
      handleGenerate();
    }
  }, [getDailyTasks.isLoading, getDailyTasks.data?.length, getDailyTasks.data]);

  useEffect(() => {
    if (getCustomTasks.isLoading) return;
    if (getCustomTasks.data?.length != 0) {
      setCustomTasks(getCustomTasks.data as Task[]);
    }
  }, [
    getCustomTasks.isLoading,
    getCustomTasks.data?.length,
    getCustomTasks.data,
  ]);

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
          session={props.session}
          setSelectedTab={setSelectedTabCount}
          customTasks={customTasks}
          dailyTasks={dailyTasks}
          selectedTab={selectedTabCount}
          setCustomTasks={setCustomTasks}
        />
      </div>
    </main>
  );
}
