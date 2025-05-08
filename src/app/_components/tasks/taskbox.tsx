"use client";
import styles from "../../index.module.css";
import { type Task } from "~/types/task";
import { type Interest } from "~/types/interest";
import { trpc } from "~/utils/trpc";
import { useEffect, useState } from "react";
import { shuffle } from "../util";
import { BadgeCheck, SquarePen } from "lucide-react";
import { CompleteTaskModal, UncompleteTaskModal } from "../modals";

interface TaskboxProps {
  setNewInterest?: (value: Interest) => void;
  setShowInterestModal?: (value: boolean) => void;
  task: Task;
  userId?: string;
  setEditMode?: (value: boolean) => void;
}

export default function Taskbox(props: TaskboxProps) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [completedTask, setCompletedTask] = useState<boolean>(
    props.task.completed
  );
  const [showCompleteTask, setShowCompleteTask] = useState<boolean>(false);
  const [showUncompleteTask, setShowUncompleteTask] = useState<boolean>(false);

  const getInterests = trpc.interest.getInterestsById.useQuery({
    interestIds: props.task.interests.map((i) => i.interest.id) ?? [],
  });
  useEffect(() => {
    if (getInterests.isLoading) return;
    if (getInterests.data?.length != 0) {
      setInterests(shuffle(getInterests.data as Interest[]));
    }
  }, [getInterests.isLoading, getInterests.data]);

  return (
    <div
      key={props.task.id}
      className={`${
        !completedTask
          ? `${styles.taskContainer}`
          : `${styles.taskContainer} ${styles.taskContainerCompleted}`
      }`}
    >
      <div className={styles.taskMain}>
        <div className={styles.taskIconContainer}>
          <p>{props.task.icon}</p>
        </div>
        <div className={styles.taskContentContainer}>
          <div className={styles.taskTitleContainer}>
            <p className={styles.taskTitle}>{props.task.name}</p>
            {props.setEditMode ? (
              <div
                className={styles.taskEditContainer}
                onClick={() => {
                  if (props.setEditMode) props.setEditMode(true);
                }}
              >
                <SquarePen />
              </div>
            ) : (
              completedTask && (
                <div className={styles.taskEditContainer}>
                  <BadgeCheck width={30} height={30} />
                </div>
              )
            )}
          </div>
          <p className={styles.taskText}>{props.task.description}</p>
        </div>
      </div>
      <div className={styles.flexRow}>
        <p className={styles.taskInterestText}>Based on: </p>
        {interests.map((interest) => (
          <div
            key={interest.id}
            style={{
              border: `${interest.colour} 1px solid`,
              ["--text-glow" as any]: `linear-gradient(to top left,rgb(70, 70, 70), ${interest.colour})`,
            }}
            className={`${
              !completedTask
                ? `${styles.glowingNugget}`
                : `${styles.glowingNugget} ${styles.glowingNuggetCompleted}`
            }`}
            onClick={() => {
              if (props.setNewInterest && props.setShowInterestModal) {
                props.setShowInterestModal(true);
                props.setNewInterest(interest);
              }
            }}
          >
            <p
              className={`${
                !completedTask
                  ? `${styles.glowingNuggetText}`
                  : `${styles.glowingNuggetText} ${styles.glowingNuggetTextCompleted}`
              }`}
            >
              {interest.icon}
              {interest.name}
            </p>
          </div>
        ))}
      </div>
      {props.userId && (
        <div className={styles.taskCompletedContainer}>
          {completedTask ? (
            <button
              className={`${styles.opusButton} ${styles.taskCompleteButton}`}
              onClick={() => setShowUncompleteTask(true)}
            >
              Uncomplete Task
            </button>
          ) : (
            <button
              className={`${styles.opusButton} ${styles.taskCompleteButton}`}
              onClick={() => setShowCompleteTask(true)}
            >
              Complete Task
            </button>
          )}
        </div>
      )}
      {showCompleteTask && (
        <CompleteTaskModal
          icon={props.task.icon}
          onComplete={(action) => {
            setCompletedTask(action);
            setShowCompleteTask(false);
          }}
          id={props.task.id}
          name={props.task.name}
        />
      )}
      {showUncompleteTask && (
        <UncompleteTaskModal
          icon={props.task.icon}
          onComplete={(action) => {
            setCompletedTask(action);
            setShowUncompleteTask(false);
          }}
          id={props.task.id}
          name={props.task.name}
        />
      )}
    </div>
  );
}
