"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type Post } from "~/types/post";
import { type Interest } from "~/types/interest";
import { useEffect, useState } from "react";

interface allUserPostsProps {
  userId: string;
  isFriend: boolean;
  isPrivate: boolean;
  setNewInterest?: (value: Interest) => void;
  setShowInterestModal?: (value: boolean) => void;
}

export function AllUserPosts(props: allUserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const getPosts = api.post.getAllUser.useQuery({
    userId: props.userId,
    isFriend: props.isFriend,
    isPrivate: props.isPrivate,
  });

  useEffect(() => {
    if (getPosts.isLoading) return;
    if (getPosts.data?.length != 0) return setPosts(getPosts.data as Post[]);
  }, [getPosts.isLoading, getPosts.data?.length, getPosts.data]);

  if (getPosts.isLoading) {
    return <p className={styles.showcaseText}>Loading...</p>;
  } else if (posts.length > 0) {
    return posts.map((post) => (
      <Postbox
        setNewInterest={props.setNewInterest ?? undefined}
        setShowInterestModal={props.setShowInterestModal ?? undefined}
        key={post.id}
        userId={props.userId}
        post={post as Post}
      />
    ));
  } else return <p className={styles.showcaseText}>No posts yet.</p>;
}
