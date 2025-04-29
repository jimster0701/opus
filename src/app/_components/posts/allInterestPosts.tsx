"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type Post } from "~/types/post";

interface allInterestPostsProps {
  userId: string;
  session: any;
}

export function AllInterestPosts(props: allInterestPostsProps) {
  const posts = api.post.getAllInterest.useSuspenseQuery({
    interestIds: props.session.user.interestIds,
  });
  if (posts[0].length > 0) {
    return posts[0].map((post) => (
      <Postbox key={post.id} userId={props.userId} post={post as Post} />
    ));
  } else return <p className={styles.showcaseText}>No posts yet.</p>;
}
