"use client";
import { type Comment } from "~/types/comment";
import { type Post } from "~/types/post";
import styles from "../../index.module.css";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";

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
          comments.map((comment, index) => {
            if (comment.createdBy)
              return (
                <div key={index} className={styles.commentContainer}>
                  <div className={styles.flexRow}>
                    <ProfilePicturePreviewWrapper
                      id={comment.createdBy.id}
                      imageUrl={comment.createdBy.image}
                      width={0}
                      height={0}
                    />
                    <p className={styles.commentTitle}>
                      {comment.createdBy.displayName}
                    </p>
                  </div>
                  <p className={styles.commentContent}>{comment.message}</p>
                  <p className={styles.commentTimestamp}>
                    {comment.createdAt.toDateString()}
                  </p>
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
