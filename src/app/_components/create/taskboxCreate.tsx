"use client";
import styles from "../../index.module.css";
import { type Task } from "~/types/task";
import { type User } from "~/types/user";
import { type Interest } from "~/types/interest";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { defaultInterests } from "~/const/defaultVar";
import { trpc } from "~/utils/trpc";

interface TaskboxCreateProps {
  task: Task;
  user: User;
  onTaskChange: (updatedTask: Task) => void;
}

export default function TaskboxCreate(props: TaskboxCreateProps) {
  const router = useRouter();

  const createdInterests = trpc.user.getCreatedInterests.useQuery();

  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const [availableInterests, setAvailableInterests] =
    useState<Interest[]>(defaultInterests);
  useEffect(() => {
    if (createdInterests.isLoading) return;
    setAvailableInterests((prev) => [
      ...prev,
      ...(createdInterests.data?.createdInterests as Interest[]),
    ]);
  }, [createdInterests.data?.createdInterests, createdInterests.isLoading]);

  const [removedInterests, setRemovedInterests] = useState<Interest[]>([]);
  const [iconError, setIconError] = useState([false, ""]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTask = api.task.createCustomTask.useMutation();
  return (
    <div>
      <div key={props.task.id} className={styles.taskCreateContainer}>
        <div className={styles.taskCreateHeader}>
          <div className={styles.taskCreateIconContainer}>
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
                    "Icon can be 2 characters",
                    "or one emoji E.g.🌲, LP, :]",
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
          </div>
        </div>
        <div className={styles.taskCreateInterestContainer}>
          <div className={styles.opusSelectorContainer}>
            <div className={styles.taskCreateSelectorText}>
              <p>Based on:</p>
              <h6>(Your interests)</h6>
            </div>
            <select
              multiple
              className={styles.opusSelector}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  const interest = availableInterests.find(
                    (i) => i.id == Number(value)
                  );
                  setSelectedInterests([...selectedInterests, interest!]);

                  setRemovedInterests([
                    ...removedInterests,
                    ...availableInterests.filter((i) => i.id == Number(value)),
                  ]);

                  setAvailableInterests(
                    availableInterests.filter((i) => i.id != Number(value))
                  );
                }
              }}
            >
              {availableInterests.map((interest) => (
                <option
                  className={styles.selectOption}
                  key={interest.id}
                  value={interest.id}
                >
                  {interest.icon}
                  {interest.name}
                </option>
              ))}
            </select>
          </div>
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
                  setRemovedInterests(
                    removedInterests.filter((i) => i.id != interest.id)
                  );
                  setAvailableInterests([
                    ...availableInterests,
                    ...removedInterests.filter((i) => i.id == interest.id),
                  ]);
                }}
              >
                {interest.name} X
              </p>
            </div>
          ))}
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
                interestIds: selectedInterests.map((i) => i.id),
                description: props.task.description,
              });
              // Success redirect and show new task
              router.push("/?selectedTab=custom");
            } catch (error: any) {
              setFormError(
                error?.message ??
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
    </div>
  );
}
