"use client";
import { Post } from "~/types/post";
import styles from "../../index.module.css";
import { useState } from "react";

interface commentSectionProps {
  post: Post;
}

export function CommentSection(props: commentSectionProps) {
  const [comment, setComment] = useState("");
  console.log(props.post);
  return (
    <div className={styles.commentSectionContainer}>
      <div className={styles.commentSectionInputContainer}>
        <input
          type="text"
          value={comment}
          placeholder="Comment..."
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className={styles.commentSubmitButton}
          onClick={() => {
            if (comment.trim()) {
              // create comment
              setComment("");
            }
          }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
      <div className={styles.commentSectionList}>
        {props.post.comments && props.post.comments.length > 0 ? (
          props.post.comments.map((comment, index) => (
            <div key={index} className={styles.commentContainer}>
              <p className={styles.commentTitles}>
                {comment.createdBy.name}
                <span className={styles.commentTimestamp}>
                  {new Date(comment.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              <p className={styles.commentContent}>{comment.message}</p>
            </div>
          ))
        ) : (
          <div className={styles.noComments}>
            No comments yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
}
