import { type Task } from "~/types/task";
import { TaskType } from "@prisma/client";
import styles from "../../index.module.css";
import Taskbox from "./taskbox";
import { useState } from "react";

interface taskListSlugProps {
  setSelectedTab: (tab: [string, number]) => void;
  selectedTab: [string, number];
  dailyTasks: Task[];
  customTasks: Task[];
}

export default function TaskListSlug(props: taskListSlugProps) {
  const [selectedTab, setSelectedTab] = useState<string>(
    props.selectedTab[0] ?? "daily"
  );

  const dailyCount = props.dailyTasks.length;
  const customCount = props.customTasks.length;

  return (
    <div className={styles.taskList}>
      <div className={styles.taskTabContainer}>
        <button
          autoFocus={selectedTab === "daily"}
          onClick={() => {
            setSelectedTab("daily");
            props.setSelectedTab(["daily", dailyCount]);
          }}
        >
          Daily tasks {`(${dailyCount})`}
        </button>
        <button
          onClick={() => {
            setSelectedTab("custom");
            props.setSelectedTab(["custom", customCount]);
          }}
        >
          Their tasks {`(${customCount})`}
        </button>
      </div>
      {selectedTab == "daily" && (
        <div className={styles.taskComponentContainer}>
          {props.dailyTasks
            .filter(
              (task) =>
                task.type == TaskType.GENERATED ||
                task.type == TaskType.GENERATED_FRIEND
            )
            .map((task) => (
              <Taskbox key={task.id} task={task} />
            ))}
          {dailyCount == 0 && (
            <p className={styles.noTaskText}>No tasks yet :(</p>
          )}
        </div>
      )}
      {selectedTab == "custom" && (
        <div className={styles.taskComponentContainer}>
          {props.customTasks
            .filter(
              (task) =>
                task.type == TaskType.CUSTOM ||
                task.type == TaskType.CUSTOM_FRIEND
            )
            .map((task) => (
              <Taskbox key={task.id} task={task} />
            ))}
          {customCount == 0 && (
            <p className={styles.noTaskText}>No tasks yet :(</p>
          )}
        </div>
      )}
    </div>
  );
}
