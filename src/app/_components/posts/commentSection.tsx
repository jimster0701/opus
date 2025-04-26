"use client";
import { Post, PostComment } from "~/types/post";
import styles from "../../index.module.css";
import { useState } from "react";
import { trpc } from "~/utils/trpc";

interface commentSectionProps {
  post: Post;
}

export function CommentSection(props: commentSectionProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(props.post.comments);
  const utils = trpc.useUtils();

  const createComment = trpc.comment.createComment.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });

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
          onClick={async () => {
            if (comment.trim()) {
              const newComment = await createComment.mutateAsync({
                message: comment,
                postId: props.post.id,
              });
              setComment("");
              setComments([...comments, newComment as PostComment]);
            }
          }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <div className={styles.commentSectionList}>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => {
            console.log(props.post.comments);
            console.log(comment);
            if (comment.createdBy)
              return (
                <div key={index} className={styles.commentContainer}>
                  <p className={styles.commentTitle}>
                    {comment.createdBy.displayName}
                  </p>
                  <p className={styles.commentContent}>{comment.message}</p>
                  <span className={styles.commentTimestamp}>
                    {new Date(comment.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
          })
        ) : (
          <div className={styles.noComments}>
            No comments yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
}
