"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type Post } from "~/types/post";
import { type Interest } from "~/types/interest";

interface allFriendsPostsProps {
  userId: string;
  setNewInterest: (value: Interest) => void;
  setShowInterestModal: (value: boolean) => void;
}

export function AllFriendsPosts(props: allFriendsPostsProps) {
  const posts = api.post.getAllFriends.useSuspenseQuery();

  if (posts[1].isLoading) <p className={styles.showcaseText}>Loading...</p>;
  else if (posts[0].length > 0) {
    return posts[0].map((post) => (
      <Postbox
        setNewInterest={props.setNewInterest}
        setShowInterestModal={props.setShowInterestModal}
        key={post.id}
        userId={props.userId}
        post={post as Post}
      />
    ));
  } else return <p className={styles.showcaseText}>No posts yet.</p>;
}
