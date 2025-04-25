"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { Post } from "~/types/post";

interface AllFriendsPostsProps {
  userId: string;
}

export function AllFriendsPosts(props: AllFriendsPostsProps) {
  const [posts] = api.post.getAll.useSuspenseQuery();
  console.log(props.userId);
  return (
    <>
      {posts &&
        posts.map((post) => (
          <Postbox
            key={post.id}
            userId={props.userId}
            post={post as unknown as Post}
          />
        ))}
      {!posts && <p className={styles.showcaseText}>No posts yet.</p>}
    </>
  );
}
