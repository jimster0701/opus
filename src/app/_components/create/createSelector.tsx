"use client";
import { Task, TaskType } from "~/types/task";
import styles from "../../index.module.css";
import { useState } from "react";
import Taskbox from "../tasks/taskbox";
import { Post } from "~/types/post";
import { User } from "~/types/user";
import { PostBox } from "../posts/postbox";

interface CreateTaskProps {
  task?: Task;
  user: User;
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
    imageId: "",
    comments: [],
  });
  return (
    <div className={styles.taskList}>
      <div className={styles.taskTabContainer}>
        <button
          autoFocus={selectedTab === "post"}
          onClick={() => setSelectedTab("post")}
        >
          Create post
        </button>
        <button onClick={() => setSelectedTab("task")}>Create task</button>
      </div>
      {selectedTab == "post" && (
        <div className={styles.taskComponentContainer}>
          <PostBox post={createdPost} userId={props.user.id} editable={true} />
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
