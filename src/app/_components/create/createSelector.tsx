"use client";
import { type Task } from "~/types/task";
import styles from "../../index.module.css";
import { type Dispatch, type SetStateAction, useState } from "react";
import { type Post } from "~/types/post";
import { type User } from "~/types/user";
import { PostboxCreate } from "./postboxCreate";
import { defaultPost, defaultTask } from "~/const/defaultVar";
import TaskboxCreate from "./taskboxCreate";
import CustomTaskGenerator from "../tasks/customTaskGenerator";
interface CreateSelectorProps {
  user: User;
  availableTasks: Task[];
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

export default function CreateSelector(props: CreateSelectorProps) {
  const [selectedTab, setSelectedTab] = useState("task");
  const [createdTask, setCreatedTask] = useState<Task>(defaultTask);
  const [createdPost, setCreatedPost] = useState<Post>({
    ...defaultPost,
    createdById: props.user.id,
    createdBy: props.user,
  });

  return (
    <div className={styles.createContainer}>
      <div className={styles.taskTabContainer}>
        <button
          autoFocus={selectedTab === "task"}
          onClick={() => {
            setSelectedTab("task");
            props.setSelectedTab("task");
          }}
        >
          Create task
        </button>
        <button
          autoFocus={selectedTab === "generate"}
          onClick={() => {
            setSelectedTab("generate");
            props.setSelectedTab("generate");
          }}
        >
          Generate task
        </button>
        <button
          autoFocus={selectedTab === "post"}
          onClick={() => {
            setSelectedTab("post");
            props.setSelectedTab("post");
          }}
        >
          Create post
        </button>
      </div>
      {selectedTab == "post" && (
        <div className={styles.taskComponentContainer}>
          <PostboxCreate
            post={createdPost}
            user={props.user}
            availableTasks={props.availableTasks}
            onPostChange={setCreatedPost}
          />
        </div>
      )}
      {selectedTab == "task" && (
        <div className={styles.taskComponentContainer}>
          <TaskboxCreate
            task={createdTask}
            user={props.user}
            onTaskChange={setCreatedTask}
          />
        </div>
      )}
      {selectedTab == "generate" && <CustomTaskGenerator user={props.user} />}
    </div>
  );
}
