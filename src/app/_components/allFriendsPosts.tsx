"use client";

import { api } from "~/trpc/react";
import styles from "../index.module.css";
import { PostBox } from "./postbox";
import { Post } from "~/types/post";

interface AllFriendsPostsProps {
  userId: string;
}

export function AllFriendsPosts({ userId }: AllFriendsPostsProps) {
  const [posts] = api.post.getAll.useSuspenseQuery();

  return (
    <>
      {posts &&
        posts.map((post) => (
          <PostBox
            key={post.id}
            userId={userId}
            post={post as unknown as Post}
          />
        ))}
      {!posts && <p className={styles.showcaseText}>No posts yet.</p>}
    </>
  );
}
