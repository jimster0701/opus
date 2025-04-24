import { Task, TaskType } from "~/types/task";
import styles from "../../index.module.css";
import Taskbox from "./taskbox";
import { useState } from "react";

interface TaskListProps {
  tasks?: Task;
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
          <Taskbox
            task={{
              id: 1,
              type: TaskType.generated,
              name: "Title",
              icon: ":0",
              interests: ["Help"],
              description: "Do this...",
            }}
            editable={false}
          />
        </div>
      )}
      {selectedTab == "friends" && (
        <div className={styles.taskComponentContainer}>
          <Taskbox
            task={{
              id: 1,
              type: TaskType.generated,
              name: "Title",
              icon: ":0",
              interests: ["Help"],
              friends: [""],
              description: "Do this...",
            }}
            editable={false}
          />
        </div>
      )}
    </div>
  );
}
