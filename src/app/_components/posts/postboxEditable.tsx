"use client";
import { useEffect, useState } from "react";
import { Postbox } from "./postbox";
import { type Post } from "~/types/post";
import PostboxUpdate from "./postboxUpdate";
import { type Task } from "~/types/task";
import { trpc } from "~/utils/trpc";
import { type User } from "~/types/user";

interface postboxEditableProps {
  post: Post;
  user: User;
  removePost: (postId: number) => void;
}

export default function PostboxEditable(props: postboxEditableProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [post, setPost] = useState<Post>(props.post);
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);

  const getCustomTasks = trpc.task.getCustomTasks.useQuery();
  const getDailyTasks = trpc.task.getDailyTasks.useQuery();

  useEffect(() => {
    if (getCustomTasks.isLoading) return;
    if (getCustomTasks.data?.length != 0) {
      setCustomTasks(getCustomTasks.data as Task[]);
      setAvailableTasks(getCustomTasks.data as Task[]);
    }
  }, [
    getCustomTasks.isLoading,
    getCustomTasks.data?.length,
    getCustomTasks.data,
  ]);

  useEffect(() => {
    if (getDailyTasks.isLoading) return;
    if (getDailyTasks.data?.length != 0) {
      setAvailableTasks([...(getDailyTasks.data as Task[]), ...customTasks]);
    }
  }, [
    getDailyTasks.isLoading,
    getDailyTasks.data?.length,
    getDailyTasks.data,
    customTasks,
  ]);

  const finishUpdate = (post: Post, deletePost: boolean) => {
    setEditMode(false);
    if (!deletePost) {
      setPost(post);
    } else {
      props.removePost(post.id);
    }
  };

  if (!editMode)
    return (
      <Postbox post={post} setEditMode={setEditMode} userId={props.user.id} />
    );
  else
    return (
      <PostboxUpdate
        post={props.post}
        user={props.user}
        onComplete={finishUpdate}
        availableTasks={availableTasks}
      />
    );
}
