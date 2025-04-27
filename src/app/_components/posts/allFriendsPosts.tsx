"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type Post } from "~/types/post";

interface AllFriendsPostsProps {
  userId: string;
}

export function AllFriendsPosts(props: AllFriendsPostsProps) {
  const [posts] = api.post.getAllFriends.useSuspenseQuery();
  return (
    <>
      {posts ? (
        posts.map((post) => (
          <Postbox
            key={post.id}
            userId={props.userId}
            post={post as unknown as Post}
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
