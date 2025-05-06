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
  userId?: string;
  setCustomTasks: (tasks: Task[]) => void;
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
          Custom tasks {`(${customCount})`}
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
            .sort((task1, task2) =>
              task1.completed === task2.completed ? 0 : task1.completed ? 1 : -1
            )
            .map((task) => (
              <Taskbox key={task.id} task={task} userId={props.userId} />
            ))}
          {dailyCount == 0 && (
            <p className={styles.noTaskText}>
              No tasks have been generated today.
            </p>
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
            .sort((task1, task2) =>
              task1.completed === task2.completed ? 0 : task1.completed ? 1 : -1
            )
            .map((task) => (
              <TaskboxEditable
                key={task.id}
                task={task}
                userId={props.session.userId}
                session={props.session}
                removeTask={(taskId: number) => {
                  props.setCustomTasks(
                    props.customTasks.filter((t) => t.id != taskId)
                  );
                }}
              />
            ))}
          {customCount == 0 && (
            <p className={styles.noTaskText}>No tasks created this week.</p>
          )}
        </div>
      )}
    </div>
  );
}
