import { type Task } from "~/types/task";
import { TaskType } from "@prisma/client";
import styles from "../../index.module.css";
import Taskbox from "./taskbox";
import { useState } from "react";
import TaskboxEditable from "./taskboxEditable";
import { type Session } from "~/types/session";

interface TaskListProps {
  session: Session;
  setSelectedTab: (tab: [string, number]) => void;
  selectedTab: [string, number];
  dailyTasks: Task[];
  customTasks: Task[];
}

export default function TaskList(props: TaskListProps) {
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
          Your tasks {`(${customCount})`}
        </button>
      </div>
      {selectedTab == "daily" && (
        <div className={styles.taskComponentContainer}>
          {props.dailyTasks
            .filter((task) => task.type == TaskType.GENERATED)
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
            .filter((task) => task.type == TaskType.CUSTOM)
            .map((task) => (
              <TaskboxEditable
                key={task.id}
                task={task}
                session={props.session}
              />
            ))}
          {customCount == 0 && (
            <p className={styles.noTaskText}>No tasks yet :(</p>
          )}
        </div>
      )}
    </div>
  );
}
