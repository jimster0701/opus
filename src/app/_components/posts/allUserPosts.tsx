"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type Post } from "~/types/post";
import { type Interest } from "~/types/interest";
import PostboxEditable from "./postboxEditable";
import { type User } from "~/types/user";

interface allUserPostsProps {
  userId: string;
  sessionUser: User;
  setNewInterest?: (value: Interest) => void;
  setShowInterestModal?: (value: boolean) => void;
}

export function AllUserPosts(props: allUserPostsProps) {
  const posts = api.post.getAllUser.useSuspenseQuery({
    userId: props.userId,
  });

  if (posts[1].isLoading)
    return <p className={styles.showcaseText}>Loading...</p>;
  else if (posts[0].length > 0) {
    if (props.userId == props.sessionUser.id) {
      return posts[0].map((post) => (
        <PostboxEditable
          key={post.id}
          post={post}
          user={props.sessionUser}
          removePost={() => {
            posts[0].filter((p) => p.id != post.id);
          }}
        />
      ));
    } else {
      return posts[0].map((post) => (
        <Postbox
          setNewInterest={props.setNewInterest ?? undefined}
          setShowInterestModal={props.setShowInterestModal ?? undefined}
          key={post.id}
          userId={props.sessionUser.id}
          post={post as Post}
        />
      ));
    }
  } else return <p className={styles.showcaseText}>No posts yet.</p>;
}
