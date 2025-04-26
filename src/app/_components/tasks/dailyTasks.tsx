import { Task, TaskType } from "~/types/task";
import styles from "../../index.module.css";
import Taskbox from "./taskbox";
import { useState } from "react";

interface TaskListProps {
  tasks?: Task;
  availableTasks: Task[];
}

export default function TaskList(props: TaskListProps) {
  const [selectedTab, setSelectedTab] = useState("daily");

  return (
    <div className={styles.taskList}>
      <div className={styles.taskTabContainer}>
        <button
          autoFocus={selectedTab === "daily"}
          onClick={() => setSelectedTab("daily")}
        >
          Daily tasks
        </button>
        <button onClick={() => setSelectedTab("friends")}>Friend tasks</button>
      </div>
      {selectedTab == "daily" && (
        <div className={styles.taskComponentContainer}>
          {props.availableTasks
            .filter((task) => task.type == TaskType.generated)
            .map((task) => (
              <Taskbox task={task} editable={false} />
            ))}
        </div>
      )}
      {selectedTab == "friends" && (
        <div className={styles.taskComponentContainer}>
          {props.availableTasks
            .filter((task) => task.type == TaskType.generatedFriend)
            .map((task) => (
              <Taskbox task={task} editable={false} />
            ))}
        </div>
      )}
    </div>
  );
}
