import { Task } from "~/types/task";
import styles from "../../index.module.css";
import { User } from "~/types/user";
import { useState } from "react";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";

interface TaskboxProps {
  task: Task;
  editable: boolean;
  user?: User;
  onTaskChange?: (updatedTask: Task) => void;
}

export default function Taskbox(props: TaskboxProps) {
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
  else {
    const [selectedInterests, setSelectedInterests] = useState<string[]>(
      props.task.interests
    );
    const [availableInterests, setAvailableInterests] = useState<string[]>(
      props.user!.interests
    );
    const [iconError, setIconError] = useState([false, ""]);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createTask = api.task.createCustomTask.useMutation({
      onSuccess: async () => {},
    });
    return (
      <>
        <div key={props.task.id} className={styles.taskContainer}>
          <div className={styles.taskIconContainer}>
            <input
              type="text"
              className={`${styles.taskIconInput} ${
                iconError[0] ? styles.inputError : ""
              }`}
              value={props.task.icon}
              onChange={(e) => {
                if (e.target.value.length <= 2) {
                  setIconError([false, ""]);
                  props.onTaskChange?.({
                    ...props.task,
                    icon: e.target.value,
                  });
                } else {
                  setIconError([
                    true,
                    "Icon can't be longer than 2 characters",
                    "Use emojis, initials or emoticons E.g.🌲, LP, :]",
                  ]);
                }
              }}
            />
            {iconError[0] && (
              <div className={styles.errorTooltip}>
                {iconError[1]}
                <br /> {iconError[2]}
              </div>
            )}
          </div>
          <div className={styles.taskContentContainer}>
            <input
              type="text"
              className={styles.taskTitle}
              value={props.task.name}
              placeholder="Task title"
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
              placeholder="Do this..."
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
                    {interest} X
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.taskSubmitContainer}>
          <button
            className={styles.opusButton}
            disabled={isSubmitting}
            onClick={async () => {
              setFormError(""); // Clear previous errors

              // Basic validation
              if (!props.task.name.trim()) {
                setFormError("Task name cannot be empty.");
                return;
              }
              if (!props.task.description.trim()) {
                setFormError("Task description cannot be empty.");
                return;
              }
              if (!props.task.icon.trim()) {
                setFormError("Task icon cannot be empty.");
                return;
              }
              if (selectedInterests.length == 0) {
                setFormError("Selected interests cannot be empty.");
                return;
              }

              try {
                setIsSubmitting(true);
                await createTask.mutateAsync({
                  name: props.task.name,
                  icon: props.task.icon,
                  interests: selectedInterests,
                  description: props.task.description,
                });
                redirect("/profile");
              } catch (error: any) {
                setFormError(
                  error?.message ||
                    "Something went wrong while creating the task."
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
          {formError && <div className={styles.formError}>{formError}</div>}
        </div>
      </>
    );
  }
}
