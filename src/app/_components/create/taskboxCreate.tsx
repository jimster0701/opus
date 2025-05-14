"use client";
import styles from "../../index.module.css";
import { type Task } from "~/types/task";
import { type SimpleUser, type User } from "~/types/user";
import { type Interest } from "~/types/interest";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { trpc } from "~/utils/trpc";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";

interface TaskboxCreateProps {
  task: Task;
  user: User;
  onTaskChange: (updatedTask: Task) => void;
}

export default function TaskboxCreate(props: TaskboxCreateProps) {
  const router = useRouter();

  const [interestIcon, setInterestIcon] = useState(props.task.icon);

  const [loaded, setLoaded] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [removedInterests, setRemovedInterests] = useState<Interest[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<SimpleUser[]>([]);
  const [availableFriends, setAvailableFriends] = useState<SimpleUser[]>([]);
  const [removedFriends, setRemovedFriends] = useState<SimpleUser[]>([]);
  const [iconError, setIconError] = useState([false, ""]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFriends = trpc.user.getFriends.useQuery();

  const userInterests = trpc.user.getUserInterests.useQuery({
    userId: props.user.id,
  });

  useEffect(() => {
    if (loaded || userInterests.isLoading) return;
    if (
      userInterests.data &&
      !availableInterests.some((prev) => userInterests.data.includes(prev))
    )
      setAvailableInterests(userInterests.data as Interest[]);
    setLoaded(true);
  }, [userInterests.isLoading, userInterests.data, availableInterests, loaded]);

  useEffect(() => {
    if (getFriends.isLoading) return;
    if (getFriends.data?.length != 0) {
      setAvailableFriends(getFriends.data as SimpleUser[]);
    }
  }, [getFriends.isLoading, getFriends.data, getFriends.data?.length]);

  const createTask = api.task.createCustomTask.useMutation();
  const createFriendTask = api.task.createCustomFriendTask.useMutation();
  return (
    <>
      <div key={props.task.id} className={styles.taskCreateContainer}>
        <div className={styles.taskCreateHeader}>
          <div className={styles.taskCreateIconContainer}>
            <input
              type="text"
              className={`${styles.taskCreateIconInput} ${
                iconError[0] ? styles.inputError : ""
              }`}
              value={interestIcon}
              onChange={(e) => {
                const emojiRegex = `(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])`;
                if (
                  e.target.value == "" ||
                  RegExp(emojiRegex).test(e.target.value)
                ) {
                  setIconError([false, ""]);
                  props.onTaskChange?.({
                    ...props.task,
                    icon: e.target.value,
                  });
                  setInterestIcon(e.target.value);
                } else {
                  setIconError([true, "Icon must be an emoji"]);
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
              onChange={(e) => {
                if (e.target.value.length >= 50) {
                  setFormError(
                    "Task name cannot be longer than 50 characters."
                  );
                  return;
                }
                props.onTaskChange?.({
                  ...props.task,
                  name: e.target.value,
                });
              }}
            />
            <textarea
              className={styles.taskText}
              value={props.task.description}
              placeholder="Do this..."
              onChange={(e) => {
                if (e.target.value.length >= 150) {
                  setFormError(
                    "Task description cannot be longer than 150 characters."
                  );
                  return;
                }
                props.onTaskChange?.({
                  ...props.task,
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
              multiple
              className={`${styles.opusSelector} ${styles.opusSelectorMultiple}`}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions
                ).map((option) => Number(option.value));

                if (selectedOptions.length + selectedInterests.length > 5) {
                  setFormError("You can only select 5 interests.");
                  return;
                }

                const newInterests = selectedOptions
                  .map((id) => availableInterests.find((i) => i.id === id))
                  .filter((i): i is (typeof availableInterests)[number] => !!i);

                const updatedSelected = [
                  ...selectedInterests,
                  ...newInterests.filter(
                    (i) => !selectedInterests.some((sel) => sel.id === i.id)
                  ),
                ];

                const updatedAvailable =
                  availableInterests.length == 1
                    ? []
                    : [
                        ...availableInterests.filter(
                          (i) => !newInterests.some((sel) => sel.id === i.id)
                        ),
                      ];

                const updatedRemoved = [
                  ...removedInterests,
                  ...newInterests.filter(
                    (i) => !removedInterests.some((r) => r.id === i.id)
                  ),
                ];

                setSelectedInterests(updatedSelected);
                setAvailableInterests(updatedAvailable);
                setRemovedInterests(updatedRemoved);
              }}
            >
              <option disabled>Select up to 5 interests</option>
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
                  }}
                >
                  {interest.icon}
                  {interest.name} X
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.opusSelectorContainer}>
          <div className={styles.taskCreateSelectorText}>
            <p>Friends:</p>
          </div>
          <select
            multiple
            className={`${styles.opusSelector} ${styles.opusSelectorMultiple}`}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );

              if (selectedOptions.length + selectedFriends.length > 5) {
                setFormError("You can only select 5 friends.");
                return;
              }

              const newFriends = selectedOptions
                .map((id) => availableFriends.find((f) => f.id === id))
                .filter((f) => !!f);

              const updatedSelected = [
                ...selectedFriends,
                ...newFriends.filter((f) =>
                  selectedFriends.filter((sel) => sel.id != f.id)
                ),
              ];

              const updatedAvailable =
                availableFriends.length == 1
                  ? []
                  : [
                      ...availableFriends.filter(
                        (f) => !newFriends.some((sel) => sel.id === f.id)
                      ),
                    ];

              const updatedRemoved = [
                ...removedFriends,
                ...newFriends.filter(
                  (i) => !removedFriends.some((r) => r.id === i.id)
                ),
              ];

              setSelectedFriends(updatedSelected);
              setAvailableFriends(updatedAvailable);
              setRemovedFriends(updatedRemoved);
            }}
          >
            <option disabled>Select up to 5 friends</option>
            {availableFriends.map((friend) => (
              <option
                className={styles.taskCreateSelectOption}
                key={friend.id}
                value={friend.id}
              >
                {friend.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.taskFriendsContainer}>
          {selectedFriends.map((friend) => (
            <div
              key={friend.id}
              className={styles.taskFriendContainer}
              onClick={() => {
                const newArray = selectedFriends.filter((f) => f != friend);
                setSelectedFriends(newArray);
                setRemovedFriends(
                  removedFriends.filter((f) => f.id != friend.id)
                );
                setAvailableFriends([
                  ...availableFriends,
                  ...removedFriends.filter((f) => f.id == friend.id),
                ]);
              }}
            >
              <ProfilePicturePreviewWrapper
                id={friend.id}
                imageUrl={friend.image ?? ""}
                width={10}
                height={10}
              />
              <div>
                <p className={`${styles.taskFriendText}`}>
                  {friend.displayName} x
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.taskSubmitContainer}>
        <button
          className={styles.opusButton}
          disabled={isSubmitting}
          onClick={async () => {
            setIsSubmitting(true);
            setFormError(""); // Clear previous errors

            // Basic validation
            if (!props.task.name.trim()) {
              setFormError("Task name cannot be empty.");
              return;
            }
            if (props.task.name.length > 55) {
              setFormError("Task name cannot be longer than 55 characters.");
              return;
            }
            if (!props.task.description.trim()) {
              setFormError("Task description cannot be empty.");
              return;
            }
            if (props.task.name.length > 155) {
              setFormError("Task name cannot be longer than 155 characters.");
              return;
            }
            if (!props.task.icon.trim()) {
              setFormError("An icon is required.");
              return;
            }
            if (selectedInterests.length == 0) {
              setFormError("Choose an interest to relate this to.");
              return;
            }

            try {
              if (selectedFriends.length > 0) {
                await createFriendTask.mutateAsync({
                  name: props.task.name,
                  icon: props.task.icon,
                  interestIds: selectedInterests.map((i) => i.id),
                  description: props.task.description,
                  friends: selectedFriends.map((f) => f.id),
                });
              } else {
                await createTask.mutateAsync({
                  name: props.task.name,
                  icon: props.task.icon,
                  interestIds: selectedInterests.map((i) => i.id),
                  description: props.task.description,
                });
              }
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
    </>
  );
}
