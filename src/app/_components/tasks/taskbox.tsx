"use client";
import styles from "../../index.module.css";
import { type Task } from "~/types/task";
import { type Interest } from "~/types/interest";
import { trpc } from "~/utils/trpc";
import { useEffect, useState } from "react";
import { shuffle } from "../util";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";

interface TaskboxProps {
  setNewInterest?: (value: Interest) => void;
  setShowInterestModal?: (value: boolean) => void;
  task: Task;
  setEditMode?: (value: boolean) => void;
}

export default function Taskbox(props: TaskboxProps) {
  const router = useRouter();
  const [interests, setInterests] = useState<Interest[]>([]);
  const getInterests = trpc.interest.getInterestsById.useQuery(
    {
      interestIds: props.task.interests.map((i) => i.interest.id),
    },
    {
      retry: (_count, err) => {
        // `onError` only runs once React Query stops retrying
        if (err.data?.code === "UNAUTHORIZED") {
          void router.push("/");
        }
        return true;
      },
    }
  );
  useEffect(() => {
    if (getInterests.isLoading) return;
    if (getInterests.data?.length != 0) {
      setInterests(shuffle(getInterests.data as Interest[]));
    }
  }, [getInterests.isLoading, getInterests.data]);

  return (
    <div key={props.task.id} className={styles.taskContainer}>
      <div className={styles.taskMain}>
        <div className={styles.taskIconContainer}>
          <p>{props.task.icon}</p>
        </div>
        <div className={styles.taskContentContainer}>
          {" "}
          <div className={styles.taskTitleContainer}>
            <p className={styles.taskTitle}>{props.task.name}</p>
            {props.setEditMode && (
              <div
                className={styles.taskEditContainer}
                onClick={() => {
                  if (props.setEditMode) props.setEditMode(true);
                }}
              >
                <SquarePen />
              </div>
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
            className={styles.glowingNugget}
            onClick={() => {
              if (props.setNewInterest && props.setShowInterestModal) {
                props.setShowInterestModal(true);
                props.setNewInterest(interest);
              }
            }}
          >
            <p className={styles.glowingNuggetText}>
              {interest.icon}
              {interest.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
