"use client";
import { Task, TaskType } from "~/types/task";
import styles from "../../index.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import Taskbox from "../tasks/taskbox";
import { Post } from "~/types/post";
import { User } from "~/types/user";
import { PostboxCreate } from "../posts/postboxCreate";

interface CreateTaskProps {
  task?: Task;
  user: User;
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

export default function CreateSelector(props: CreateTaskProps) {
  const [selectedTab, setSelectedTab] = useState("post");
  const [createdTask, setCreatedTask] = useState<Task>({
    id: 1,
    type: TaskType.generated,
    name: "Title",
    icon: ":0",
    interests: [],
    friends: [],
    description: "Do this...",
  });
  const [createdPost, setCreatedPost] = useState<Post>({
    id: 0,
    name: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: props.user.id,
    createdBy: props.user,
    likedBy: [],
    tags: [],
    imageUrl: "",
    comments: [],
  });
  return (
    <div className={styles.taskList}>
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
          <PostboxCreate post={createdPost} userId={props.user.id} />
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
