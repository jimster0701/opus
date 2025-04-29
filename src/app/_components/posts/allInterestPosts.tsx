"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type Post } from "~/types/post";

interface AllInterestPostsProps {
  userId: string;
  session: any;
}

export function AllInterestPosts(props: AllInterestPostsProps) {
  const [posts] = api.post.getAllInterest.useSuspenseQuery({
    interestIds: props.session.user.interestIds,
  });
  return (
    <>
      {posts ? (
        posts.map((post) => (
          <Postbox key={post.id} userId={props.userId} post={post as Post} />
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
