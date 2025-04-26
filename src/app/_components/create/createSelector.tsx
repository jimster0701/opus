"use client";
import { Task, TaskType } from "~/types/task";
import styles from "../../index.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import Taskbox from "../tasks/taskbox";
import { Post } from "~/types/post";
import { User } from "~/types/user";
import { PostboxCreate } from "./postboxCreate";
import { defaultPost, defaultTask } from "~/const/defaultVar";

interface CreateTaskProps {
  task?: Task;
  user: User;
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

export default function CreateSelector(props: CreateTaskProps) {
  const [selectedTab, setSelectedTab] = useState("post");
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
          autoFocus={selectedTab === "post" || selectedTab == ""}
          onClick={() => {
            setSelectedTab("post");
            props.setSelectedTab("post");
          }}
        >
          Create post
        </button>
        <button
          onClick={() => {
            setSelectedTab("task");
            props.setSelectedTab("task");
          }}
        >
          Create task
        </button>
      </div>
      {selectedTab == "post" && (
        <div className={styles.taskComponentContainer}>
          <PostboxCreate post={createdPost} user={props.user} />
        </div>
      )}
      {selectedTab == "task" && (
        <div className={styles.taskComponentContainer}>
          <Taskbox
            task={createdTask}
            editable={true}
            user={props.user}
            onTaskChange={setCreatedTask}
          />
        </div>
      )}
    </div>
  );
}
