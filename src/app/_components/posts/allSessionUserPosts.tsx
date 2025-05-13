"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import PostboxEditable from "./postboxEditable";
import { type User } from "~/types/user";
import { useEffect, useState } from "react";
import { type Post } from "~/types/post";

interface allSessionUserPostsProps {
  sessionUser: User;
}

export function AllSessionUserPosts(props: allSessionUserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = api.post.getAllSessionUser.useQuery();

  useEffect(() => {
    if (getPosts.isLoading) return;
    if (getPosts.data?.length != 0 && getPosts.data != undefined)
      return setPosts(getPosts.data as Post[]);
  }, [getPosts.isLoading, getPosts.data?.length, getPosts.data]);

  if (getPosts.isLoading) {
    return <p className={styles.showcaseText}>Loading...</p>;
  } else if (posts.length > 0) {
    return posts.map((post) => (
      <PostboxEditable
        key={post.id}
        post={post}
        user={props.sessionUser}
        removePost={() => {
          setPosts(posts.filter((p) => p.id != post.id));
        }}
      />
    ));
  } else return <p className={styles.showcaseText}>No posts yet.</p>;
}
