"use client";
import { type Comment } from "~/types/comment";
import { type Post } from "~/types/post";
import styles from "../../index.module.css";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { CommentComponent } from "./commentComponent";

interface commentSectionProps {
  userId: string;
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
              setComments([...comments, newComment as Comment]);
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
          comments.map((comment) => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              userId={props.userId}
              removeComment={(id) => {
                setComments(comments.filter((c) => c.id != id));
              }}
            />
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
