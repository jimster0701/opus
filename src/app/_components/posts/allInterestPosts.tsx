"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type UserInterest } from "@prisma/client";

interface allInterestPostsProps {
  userId: string;
  session: any;
}

export function AllInterestPosts(props: allInterestPostsProps) {
  const posts = api.post.getAllInterest.useSuspenseQuery({
    interestIds: props.session.user.interests.map(
      (i: UserInterest) => i.interestId
    ),
  });
  if (posts[1].isLoading) <p className={styles.showcaseText}>Loading...</p>;
  else if (posts[0].length > 0) {
    return posts[0].map((post) => (
      <Postbox key={post.id} userId={props.userId} post={post} />
    ));
  } else return <p className={styles.showcaseText}>No posts yet.</p>;
}
