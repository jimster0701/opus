"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type Post } from "~/types/post";

interface AllUserPostsProps {
  userId: string;
  sessionUserId: string;
}

export function AllUserPosts(props: AllUserPostsProps) {
  const posts = api.post.getAllUser.useSuspenseQuery({
    userId: props.userId,
  });

  if (posts[0].length > 0) {
    return posts[0].map((post) => (
      <Postbox key={post.id} userId={props.sessionUserId} post={post as Post} />
    ));
  } else return <p className={styles.showcaseText}>No posts yet.</p>;
}
