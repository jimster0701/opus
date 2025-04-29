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
  const [posts] = api.post.getAllUser.useSuspenseQuery({
    userId: props.userId,
  });

  return (
    <>
      {posts ? (
        posts.map((post) => (
          <Postbox
            key={post.id}
            userId={props.sessionUserId}
            post={post as Post}
          />
        ))
      ) : (
        <p className={styles.showcaseText}>No posts yet.</p>
      )}
      {posts.length == 0 && (
        <p className={styles.showcaseText}>No posts yet.</p>
      )}
    </>
  );
}
