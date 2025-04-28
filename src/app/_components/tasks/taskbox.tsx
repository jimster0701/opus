"use client";
import styles from "../../index.module.css";
import { type Task } from "~/types/task";
import { type Interest } from "~/types/interest";
import { type User } from "~/types/user";
import { trpc } from "~/utils/trpc";
import { defaultInterests } from "~/const/defaultVar";
import { useEffect, useState } from "react";
import { shuffle } from "../util";

interface TaskboxProps {
  task: Task;
  user?: User;
  onTaskChange?: (updatedTask: Task) => void;
}

export default function Taskbox(props: TaskboxProps) {
  const [interests, setInterests] = useState<Interest[]>(
    shuffle(
      defaultInterests.filter((i) => props.task.interestIds.includes(i.id))
    )
  );
  const interestResult = trpc.interest.getInterestsById.useQuery({
    interestIds: props.task.interestIds,
  });

  useEffect(() => {
    if (interestResult.isLoading) {
      return;
    }
    if (interestResult.data?.length != 0) {
      setInterests((prev) =>
        shuffle([...prev, ...(interestResult.data as Interest[])])
      );
    }
  }, [interestResult.isLoading, interestResult.data]);

  return (
    <div key={props.task.id} className={styles.taskContainer}>
      <div className={styles.taskIconContainer}>
        <p>{props.task.icon}</p>
      </div>
      <div className={styles.taskContentContainer}>
        <p className={styles.taskTitle}>{props.task.name}</p>
        <p className={styles.taskText}>{props.task.description}</p>
        <div className={styles.flexRow}>
          <p className={styles.taskInterests}>Based on: </p>
          {interests.map((interest) => (
            <div
              key={interest.id}
              style={{
                border: `${interest.colour} 1px solid`,
                ["--text-glow" as any]: `linear-gradient(to top left,rgb(70, 70, 70), ${interest.colour})`,
              }}
              className={styles.glowingNugget}
            >
              <p className={styles.glowingNuggetText}>
                {interest.icon}
                {interest.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
