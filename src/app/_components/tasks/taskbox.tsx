import { Task } from "~/types/task";
import styles from "../../index.module.css";

interface TaskboxProps {
  task?: Task;
}

export default function Taskbox(props: TaskboxProps) {
  return (
    <div key={props.task?.id} className={styles.taskContainer}>
      <div className={styles.taskIconContainer}>
        <p>{props.task?.icon}</p>
      </div>
      <div className={styles.taskContentContainer}>
        <p className={styles.taskTitle}>{props.task?.name}</p>
        <p className={styles.taskText}>{props.task?.description}</p>
        <p className={styles.taskInterests}>
          Based on: {props.task?.interests}
        </p>
      </div>
    </div>
  );
}
