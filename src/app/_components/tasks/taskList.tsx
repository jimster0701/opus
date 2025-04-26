import { Task, TaskType } from "~/types/task";
import styles from "../../index.module.css";
import Taskbox from "./taskbox";
import { useState } from "react";

interface TaskListProps {
  preselectedTab: string | null;
  availableTasks: Task[];
}

export default function TaskList(props: TaskListProps) {
  const [selectedTab, setSelectedTab] = useState(
    props.preselectedTab ?? "daily"
  );

  return (
    <div className={styles.taskList}>
      <div className={styles.taskTabContainer}>
        <button
          autoFocus={selectedTab === "daily"}
          onClick={() => setSelectedTab("daily")}
        >
          Daily tasks
        </button>
        <button onClick={() => setSelectedTab("custom")}>Your tasks</button>
      </div>
      {selectedTab == "daily" && (
        <div className={styles.taskComponentContainer}>
          {props.availableTasks
            .filter((task) => task.type == TaskType.generated)
            .map((task) => (
              <Taskbox task={task} />
            ))}
        </div>
      )}
      {selectedTab == "custom" && (
        <div className={styles.taskComponentContainer}>
          {props.availableTasks
            .filter((task) => task.type == TaskType.custom)
            .map((task) => (
              <Taskbox task={task} />
            ))}
        </div>
      )}
    </div>
  );
}
