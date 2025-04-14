"use client";
import { Post } from "~/types/post";
import styles from "../index.module.css";

interface postProps {
  post: Post;
}

export function PostBox(props: postProps) {
  return (
    <div className={styles.postContainer} key={props.post.id}>
      <div className={styles.postHeader}>
        <h2>{props.post.createdBy.displayName}</h2>
        <h3>{props.post.createdAt.toLocaleString()}</h3>
      </div>
      <div className={styles.postContent}>
        <div className={styles.postLikes}>
          <img alt=" " />
          <p className={styles.postText}>{props.post.likes}</p>
        </div>
        <p className={styles.postText}>{props.post.name}</p>
      </div>
    </div>
  );
}
