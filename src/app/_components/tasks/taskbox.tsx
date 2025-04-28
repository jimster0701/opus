"use client";
import { type Task } from "~/types/task";
import styles from "../../index.module.css";
import { type User } from "~/types/user";
import { trpc } from "~/utils/trpc";

interface TaskboxProps {
  task: Task;
  user?: User;
  onTaskChange?: (updatedTask: Task) => void;
}

export default function Taskbox(props: TaskboxProps) {
  const interests = trpc.interest.getInterestsById.useQuery({
    interestIds: props.task.interestIds,
  });
  return (
    <div key={props.task.id} className={styles.taskContainer}>
      <div className={styles.taskIconContainer}>
        <p>{props.task.icon}</p>
      </div>
      <div className={styles.taskContentContainer}>
        <p className={styles.taskTitle}>{props.task.name}</p>
        <p className={styles.taskText}>{props.task.description}</p>
        <p className={styles.taskInterests}>
          Based on:{" "}
          {interests.isLoading ? (
            <>Loading...</>
          ) : (
            interests.data?.map((interest) => interest.name).join(", ")
          )}
        </p>
      </div>
    </div>
  );
}
