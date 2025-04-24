import { Task } from "~/types/task";
import styles from "../../index.module.css";

interface TaskboxProps {
  task?: Task;
  editable: boolean;
  onTaskChange?: (updatedTask: Task) => void;
}

export default function Taskbox(props: TaskboxProps) {
  const handleInterestChange = (index: number, value: string) => {
    if (!props.task || !props.onTaskChange) return;
    const updatedInterests = [...props.task.interests];
    updatedInterests[index] = value;
    props.onTaskChange({ ...props.task, interests: updatedInterests });
  };
  if (!props.editable)
    return (
      <div key={props.task?.id} className={styles.taskContainer}>
        <div className={styles.taskIconContainer}>
          <p>{props.task?.icon}</p>
        </div>
        <div className={styles.taskContentContainer}>
          <p className={styles.taskTitle}>{props.task?.name}</p>
          <p className={styles.taskText}>{props.task?.description}</p>
          <p className={styles.taskInterests}>
            Based on: {props.task?.interests.join(", ")}
          </p>
        </div>
      </div>
    );
  else
    return (
      <div key={props.task?.id} className={styles.taskContainer}>
        <div className={styles.taskIconContainer}>
          <p>{props.task?.icon}</p>
        </div>
        <div className={styles.taskContentContainer}>
          <input
            type="text"
            className={styles.taskTitle}
            value={props.task?.name}
            onChange={(e) =>
              props.onTaskChange?.({
                ...props.task!,
                name: e.target.value,
              })
            }
          />
          <textarea
            className={styles.taskText}
            value={props.task?.description}
            onChange={(e) =>
              props.onTaskChange?.({
                ...props.task!,
                description: e.target.value,
              })
            }
          />
          <div className={styles.taskInterests}>
            Based on:
            <ul>
              {props.task?.interests.map((interest, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={interest}
                    onChange={(e) =>
                      handleInterestChange(index, e.target.value)
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
}
