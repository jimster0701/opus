"use client";

import styles from "../../index.module.css";
import { useEffect, useState } from "react";
import { useThemeStore } from "~/store/themeStore";
import { type Session } from "~/types/session";
import ProfileHeader from "../profile/profileHeader";
import { trpc } from "~/utils/trpc";
import { type Task } from "~/types/task";
import TaskList from "../tasks/taskList";
import { AllSessionUserPosts } from "../posts/allSessionUserPosts";

interface ProfileClientProps {
  session: Session;
}

export default function ProfileClient(props: ProfileClientProps) {
  const { theme } = useThemeStore();

  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);

  const [selectedTab, setSelectedTab] = useState<string>("post");

  const [selectedTabCount, setSelectedTabCount] = useState<[string, number]>([
    "daily",
    0,
  ]);

  const getDailyTasks = trpc.task.getDailyTasks.useQuery({
    userId: props.session.user.id,
  });
  const getCustomTasks = trpc.task.getCustomTasks.useQuery({
    userId: props.session.user.id,
  });

  useEffect(() => {
    if (getDailyTasks.isLoading) return;
    if (getDailyTasks.data?.length != 0) {
      setDailyTasks(getDailyTasks.data as Task[]);
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
        <ProfileHeader session={props.session} />
        <br />
        <div className={styles.profilePostContainer}>
          <div className={styles.profileTabContainer}>
            <button
              onClick={() => {
                setSelectedTab("post");
              }}
            >
              Posts
            </button>
            <button
              onClick={() => {
                setSelectedTab("task");
              }}
            >
              Tasks
            </button>
          </div>
          {selectedTab == "post" ? (
            <AllSessionUserPosts sessionUser={props.session.user} />
          ) : (
            <TaskList
              session={props.session}
              setSelectedTab={setSelectedTabCount}
              selectedTab={selectedTabCount}
              dailyTasks={dailyTasks}
              customTasks={customTasks}
              setCustomTasks={setCustomTasks}
            />
          )}
        </div>
      </div>
    </main>
  );
}
