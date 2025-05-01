"use client";
import styles from "../../index.module.css";
import { type TaskInterest, type Task } from "~/types/task";
import { type User } from "~/types/user";
import { type Interest } from "~/types/interest";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { trpc } from "~/utils/trpc";
import { Check, Trash2, X } from "lucide-react";
import { DeleteTaskModal } from "../modals";
import { boolean } from "zod";

interface TaskboxUpdateProps {
  task: Task;
  user: User;
  onComplete: (
    finalTask: Task,
    updatedInterests: TaskInterest[],
    deleteTask: boolean
  ) => void;
}

export default function TaskboxUpdate(props: TaskboxUpdateProps) {
  const [updatedTask, setUpdatedTask] = useState<Task>(props.task);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(
    props.task.interests.map((i) => i.interest)
  );
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [removedInterests, setRemovedInterests] = useState<Interest[]>(
    props.task.interests.map((i) => i.interest)
  );
  const [iconError, setIconError] = useState([false, ""]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTaskDelete, setShowTaskDelete] = useState(false);

  const userInterests = trpc.user.getUserInterests.useQuery({
    userId: props.user.id,
  });

  useEffect(() => {
    if (userInterests.isLoading) return;
    if (
      userInterests.data &&
      !availableInterests.some((prev) => userInterests.data.includes(prev))
    ) {
      const pulledInterests = userInterests.data as Interest[];
      const selectedIds = selectedInterests.map((i) => i.id);
      setAvailableInterests(
        pulledInterests.filter((i) => !selectedIds.includes(i.id))
      );
    }
  }, [
    userInterests.isLoading,
    userInterests.data,
    availableInterests,
    selectedInterests,
  ]);

  const updateTask = api.task.updateTask.useMutation();
  return (
    <>
      <div key={updatedTask.id} className={styles.taskCreateContainer}>
        <div className={styles.taskCreateHeader}>
          <div className={styles.taskCreateIconContainer}>
            <input
              type="text"
              className={`${styles.taskCreateIconInput} ${
                iconError[0] ? styles.inputError : ""
              }`}
              value={updatedTask.icon}
              onChange={(e) => {
                if (e.target.value.length <= 2) {
                  setIconError([false, ""]);
                  setUpdatedTask({
                    ...updatedTask,
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
              value={updatedTask.name}
              placeholder="Task title"
              onClick={() => setFormError("")}
              onChange={(e) => {
                if (e.target.value.length >= 50) {
                  setFormError(
                    "Task name cannot be longer than 50 characters."
                  );
                  return;
                }
                setUpdatedTask({
                  ...updatedTask,
                  name: e.target.value,
                });
              }}
            />
            <textarea
              className={styles.taskText}
              value={updatedTask.description}
              onClick={() => setFormError("")}
              placeholder="Do this..."
              onChange={(e) => {
                if (e.target.value.length >= 150) {
                  setFormError(
                    "Task description cannot be longer than 150 characters."
                  );
                  return;
                }

                setUpdatedTask({
                  ...updatedTask,
                  description: e.target.value,
                });
              }}
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
              className={`${styles.opusSelector} ${styles.opusSelectorMultiple}`}
              onChange={(e) => {
                if (selectedInterests.length >= 5) {
                  setFormError("You can only select 5 interests.");
                  return;
                }
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
              <option>Select an interest</option>
              {availableInterests.map((interest) => (
                <option
                  className={styles.taskCreateSelectOption}
                  key={interest.id}
                  value={interest.id}
                >
                  {interest.icon}
                  {interest.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.taskInterestList}>
            {selectedInterests.map((interest, index) => (
              <div
                className={styles.glowingNugget}
                style={{
                  border: `${interest.colour} 1px solid`,
                  ["--text-glow" as any]: `linear-gradient(to bottom right,rgb(0, 0, 0) , ${interest.colour})`,
                }}
                key={index}
              >
                <p
                  className={styles.glowingNuggetText}
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
                    setFormError("");
                  }}
                >
                  {interest.icon}
                  {interest.name} X
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.taskSubmitContainer}>
        {!isSubmitting && (
          <>
            <div className={styles.taskUpdateControls}>
              <button
                className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
                disabled={isSubmitting}
                onClick={async () => {
                  // Basic validation
                  if (!updatedTask.name.trim()) {
                    setFormError("Task name cannot be empty.");
                    return;
                  }
                  if (!updatedTask.description.trim()) {
                    setFormError("Task description cannot be empty.");
                    return;
                  }
                  if (!updatedTask.icon.trim()) {
                    setFormError("An icon is required.");
                    return;
                  }
                  if (selectedInterests.length == 0) {
                    setFormError("Choose an interest to relate this to.");
                    return;
                  }

                  try {
                    setIsSubmitting(true);
                    const updatedTaskWithInterests =
                      await updateTask.mutateAsync({
                        id: updatedTask.id,
                        name: updatedTask.name,
                        icon: updatedTask.icon,
                        interestIds: selectedInterests.map((i) => i.id),
                        description: updatedTask.description,
                      });
                    console.log(updatedTaskWithInterests?.interests);
                    props.onComplete(
                      updatedTask,
                      updatedTaskWithInterests?.interests as TaskInterest[],
                      false
                    );
                  } catch (error: any) {
                    setFormError(
                      error?.message ??
                        "Something went wrong while updating the task."
                    );
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                Confirm
                <Check />
              </button>
              <button
                className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
                onClick={() => {
                  props.onComplete(props.task, props.task.interests, false);
                }}
              >
                Cancel
                <X />
              </button>
            </div>
            <div className={styles.taskUpdateDelete}>
              {/** <SquareCheckBig onClick={async () => {
                  try{
                    completeTask.mutate({id:props.task.id});
                  } catch
                }} />  */}
              <Trash2
                onClick={() => {
                  setShowTaskDelete(true);
                }}
              />
            </div>
          </>
        )}
        {isSubmitting && (
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
          >
            Updating...
          </button>
        )}
      </div>
      {formError && (
        <div className={styles.formError} onClick={() => setFormError("")}>
          {formError}
        </div>
      )}
      <br />
      {showTaskDelete && (
        <DeleteTaskModal
          onComplete={() => {
            props.onComplete(props.task, props.task.interests, true);
            setShowTaskDelete(false);
          }}
          id={props.task.id}
          name={props.task.name}
        />
      )}
    </>
  );
}
