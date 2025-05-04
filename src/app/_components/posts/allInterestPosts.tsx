"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type Interest } from "~/types/interest";

interface allInterestPostsProps {
  userId: string;
  session: any;
  interestIds: number[];
  setNewInterest: (value: Interest) => void;
  setShowInterestModal: (value: boolean) => void;
}

export function AllInterestPosts(props: allInterestPostsProps) {
  const posts = api.post.getAllInterest.useSuspenseQuery({
    interestIds: props.interestIds,
  });
  if (posts[1].isLoading) <p className={styles.showcaseText}>Loading...</p>;
  else if (posts[0].length > 0) {
    return posts[0].map((post) => (
      <Postbox
        setNewInterest={props.setNewInterest}
        setShowInterestModal={props.setShowInterestModal}
        key={post.id}
        userId={props.userId}
        post={post}
      />
    ));
  } else return <p className={styles.showcaseText}>No posts yet.</p>;
}
