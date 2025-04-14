"use client";

import { api } from "~/trpc/react";
import styles from "../index.module.css";
import { PostBox } from "./postbox";
import { Post } from "~/types/post";

export function AllFriendsPosts() {
  const [posts] = api.post.getAll.useSuspenseQuery();

  return (
    <>
      {posts &&
        posts.map((post) => <PostBox key={post.id} post={post as Post} />)}

      {!posts && <p className={styles.showcaseText}>No posts yet.</p>}
    </>
  );
}
