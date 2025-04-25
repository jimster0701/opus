import { Task } from "~/types/task";
import styles from "../../index.module.css";
import { User } from "~/types/user";
import { useState } from "react";

interface TaskboxProps {
  task: Task;
  editable: boolean;
  user: User;
  onTaskChange?: (updatedTask: Task) => void;
}

export default function Taskbox(props: TaskboxProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    props.task.interests
  );
  const [availableInterests, setAvailableInterests] = useState<string[]>(
    props.user.interests
  );

  if (!props.editable)
    return (
      <div key={props.task.id} className={styles.taskContainer}>
        <div className={styles.taskIconContainer}>
          <p>{props.task.icon}</p>
        </div>
        <div className={styles.taskContentContainer}>
          <p className={styles.taskTitle}>{props.task.name}</p>
          <p className={styles.taskText}>{props.task.description}</p>
          <p className={styles.taskInterests}>
            Based on: {props.task.interests.join(", ")}
          </p>
        </div>
      </div>
    );
  else
    return (
      <div key={props.task.id} className={styles.taskContainer}>
        <div className={styles.taskIconContainer}>
          <input
            type="text"
            className={styles.taskIconInput}
            value={props.task.icon}
            onChange={(e) =>
              props.onTaskChange?.({
                ...props.task,
                icon: e.target.value,
              })
            }
          />
        </div>
        <div className={styles.taskContentContainer}>
          <input
            type="text"
            className={styles.taskTitle}
            value={props.task.name}
            onChange={(e) =>
              props.onTaskChange?.({
                ...props.task,
                name: e.target.value,
              })
            }
          />
          <textarea
            className={styles.taskText}
            value={props.task.description}
            onChange={(e) =>
              props.onTaskChange?.({
                ...props.task,
                description: e.target.value,
              })
            }
          />
          <div className={styles.taskInterestSelector}>
            <p>Based on:</p>
            <select
              onChange={(e) => {
                const value = e.target.value;
                setSelectedInterests([...selectedInterests, value]);

                const newArray = availableInterests.filter((i) => i != value);
                setAvailableInterests(newArray);
              }}
              value=""
            >
              {availableInterests.map((interest) => (
                <option key={interest} value={interest}>
                  {interest}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.taskInterestList}>
            {selectedInterests.map((interest, index) => (
              <div className={styles.taskChoosenInterest} key={index}>
                <p
                  className={styles.taskChoosenInterestText}
                  onClick={() => {
                    const newArray = selectedInterests.filter(
                      (i) => i != interest
                    );
                    setSelectedInterests(newArray);
                    setAvailableInterests([...availableInterests, interest]);
                  }}
                >
                  {interest}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
