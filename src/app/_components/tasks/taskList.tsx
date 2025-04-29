import { type Task, TaskType } from "~/types/task";
import styles from "../../index.module.css";
import Taskbox from "./taskbox";
import { useState } from "react";

interface TaskListProps {
  setSelectedTab: (tab: [string, number]) => void;
  selectedTab: [string, number];
  availableTasks: Task[];
}

export default function TaskList(props: TaskListProps) {
  const [selectedTab, setSelectedTab] = useState<string>(props.selectedTab[0]);

  const dailyCount = props.availableTasks.filter(
    (task) => task.type == TaskType.generated
  ).length;
  const customCount = props.availableTasks.filter(
    (task) => task.type == TaskType.custom
  ).length;

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
          Daily tasks
        </button>
        <button
          onClick={() => {
            setSelectedTab("custom");
            props.setSelectedTab(["custom", customCount]);
          }}
        >
          Your tasks
        </button>
      </div>
      {selectedTab == "daily" && (
        <div className={styles.taskComponentContainer}>
          {props.availableTasks
            .filter((task) => task.type == TaskType.generated)
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
          {props.availableTasks
            .filter((task) => task.type == TaskType.custom)
            .map((task) => (
              <Taskbox key={task.id} task={task} />
            ))}
          {customCount == 0 && (
            <p className={styles.noTaskText}>
              Create a task using the create page.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
