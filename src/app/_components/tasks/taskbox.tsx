"use client";
import styles from "../../index.module.css";
import { type Task } from "~/types/task";
import { type Interest } from "~/types/interest";
import { trpc } from "~/utils/trpc";
import { useEffect, useState } from "react";
import { shuffle } from "../util";
import { BadgeCheck, Bot, SquarePen } from "lucide-react";
import {
  CompleteTaskModal,
  DeleteTaskModal,
  UncompleteTaskModal,
} from "../modals";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";
import { type User, type SimpleUser } from "~/types/user";
import { defaultUser } from "~/const/defaultVar";
import { TaskType } from "@prisma/client";
import toast from "react-hot-toast";

interface TaskboxProps {
  setNewInterest?: (value: Interest) => void;
  setShowInterestModal?: (value: boolean) => void;
  task: Task;
  user?: User;
  setEditMode?: (value: boolean) => void;
}

export default function Taskbox(props: TaskboxProps) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [completedTask, setCompletedTask] = useState<boolean>(
    props.task.completed
  );
  const [showTaskDelete, setShowTaskDelete] = useState<boolean>(false);
  const [showCompleteTask, setShowCompleteTask] = useState<boolean>(false);
  const [showUncompleteTask, setShowUncompleteTask] = useState<boolean>(false);
  const [friendsTask, setFriendsTask] = useState(false);
  const [friends, setFriends] = useState<SimpleUser[]>([defaultUser]);

  const getInterests = trpc.interest.getInterestsById.useQuery(
    {
      interestIds: props.task.interests.map((i) => i.interest.id),
    },
    { enabled: props.task.interests != undefined }
  );

  const getFriends = trpc.task.getFriendsOnTask.useQuery(
    {
      userIds: props.task.friends.map((f) => f.userId),
    },
    {
      enabled: props.task.friends.length != 0,
    }
  );

  useEffect(() => {
    if (getInterests.isLoading) return;
    if (getInterests.data?.length != 0) {
      setInterests(shuffle(getInterests.data as Interest[]));
    }
  }, [getInterests.isLoading, getInterests.data]);

  useEffect(() => {
    if (getFriends.isLoading || getFriends.isPending) return;
    if (getFriends.data?.length != 0) {
      setFriends(getFriends.data as SimpleUser[]);
      setFriendsTask(true);
    }
  }, [getFriends.isLoading, getFriends.isPending, getFriends.data]);

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
            {props.task.type == TaskType.GENERATED_FRIEND ? (
              <div
                className={styles.taskEditContainer}
                onClick={() => {
                  if (
                    props.task.friends.find((f) => f.userId == props.user?.id)
                  )
                    setShowTaskDelete(true);
                }}
              >
                <Bot />
              </div>
            ) : (
              <>
                {props.setEditMode &&
                props.user?.id == props.task.createdById ? (
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
              </>
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
      {friendsTask && (
        <div className={styles.flexRow}>
          <p>Friends:</p>
          <div className={styles.taskFriendsContainer}>
            {friends.map((friend) => (
              <div key={friend.id} className={styles.taskFriendContainer}>
                <ProfilePicturePreviewWrapper
                  id={friend.id}
                  imageUrl={friend.image ?? ""}
                  width={10}
                  height={10}
                />
                <div>
                  <p className={`${styles.taskFriendText}`}>
                    {friend.displayName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {props.user?.id == props.task.createdById && (
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
      {showTaskDelete && (
        <DeleteTaskModal
          onComplete={(deleteTask: boolean) => {
            if (deleteTask) toast.success("Refresh page to load changes.");
            setShowTaskDelete(false);
          }}
          id={props.task.id}
          name={props.task.name}
        />
      )}
    </div>
  );
}
