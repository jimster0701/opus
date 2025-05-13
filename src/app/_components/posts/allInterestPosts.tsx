"use client";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";
import { Postbox } from "./postbox";
import { type Interest } from "~/types/interest";
import { useEffect, useState } from "react";
import { type Post } from "~/types/post";

interface allInterestPostsProps {
  userId: string;
  session: any;
  interestIds: number[];
  setNewInterest: (value: Interest) => void;
  setShowInterestModal: (value: boolean) => void;
}

export function AllInterestPosts(props: allInterestPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = api.post.getAllInterest.useQuery(
    {
      interestIds: props.interestIds ?? [],
    },
    { enabled: props.interestIds[0] != -1 }
  );

  useEffect(() => {
    if (getPosts.isLoading) return;
    if (getPosts.data?.length != 0 && getPosts.data != undefined)
      return setPosts(getPosts.data as Post[]);
  }, [getPosts.isLoading, getPosts.data?.length, getPosts.data]);

  if (getPosts.isLoading)
    return <p className={styles.showcaseText}>Loading...</p>;
  else if (posts.length > 0) {
    return (
      <>
        {posts.map((post) => (
          <Postbox
            setNewInterest={props.setNewInterest}
            setShowInterestModal={props.setShowInterestModal}
            key={post.id}
            userId={props.userId}
            post={post}
          />
        ))}
      </>
    );
  } else return <p className={styles.showcaseText}>There are no posts yet.</p>;
}
