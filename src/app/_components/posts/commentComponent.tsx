"use client";
import styles from "../../index.module.css";
import { type Comment } from "~/types/comment";
import { type Reply } from "~/types/reply";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";
import Image from "next/image";
import { ReplyComponent } from "./replyComponent";
import { useRouter } from "next/navigation";
import { DeleteCommentModal } from "../modals";
import { Trash2 } from "lucide-react";

interface commentProps {
  userId: string;
  comment: Comment;
  removeComment: (id: number) => void;
}

export function CommentComponent(props: commentProps) {
  const router = useRouter();
  const [showDeleteComment, setShowDeleteComment] = useState(false);
  const [liked, setLiked] = useState(
    props.comment.likedBy.includes(props.userId)
  );
  const [tempLike, setTempLike] = useState(0);

  const likeComment = trpc.comment.likeComment.useMutation();
  const unlikeComment = trpc.comment.unlikeComment.useMutation();

  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState(props.comment.replies);
  const utils = trpc.useUtils();

  const createReply = trpc.reply.createReply.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });

  const handleLike = () => {
    setLiked(!liked);
    if (liked) {
      setTempLike(tempLike - 1);
      unlikeComment.mutate({
        commentId: props.comment.id,
        userId: props.userId,
      });
    } else {
      setTempLike(tempLike + 1);
      likeComment.mutate({ commentId: props.comment.id, userId: props.userId });
    }
  };

  if (props.comment.createdBy)
    return (
      <div className={styles.commentContainer}>
        <div className={styles.commentHeader}>
          <div
            className={styles.flexRow}
            onClick={() => {
              router.push(`/profile/${props.comment.createdBy.id}`);
            }}
          >
            <ProfilePicturePreviewWrapper
              id={props.comment.createdBy.id}
              imageUrl={props.comment.createdBy.image}
              width={0}
              height={0}
            />
            <p className={styles.commentTitle}>
              {props.comment.createdBy.displayName}
            </p>
          </div>
          <p className={styles.commentTimestamp}>
            {props.comment.createdById == props.userId ? (
              <Trash2
                onClick={() => {
                  setShowDeleteComment(true);
                }}
              />
            ) : (
              props.comment.createdAt.toDateString()
            )}
          </p>
        </div>
        <div className={styles.commentContentContainer}>
          <div className={styles.commentContent}>
            <p>{props.comment.message}</p>
          </div>
          <div className={styles.postLikes} onClick={() => handleLike()}>
            {liked ? (
              <Image
                src="/images/heart-full.png"
                alt={""}
                width={15}
                height={15}
              />
            ) : (
              <Image src="/images/heart.png" alt={""} width={15} height={15} />
            )}
            <p className={styles.commentContent}>
              {props.comment.likedBy.length + tempLike}
            </p>
          </div>
        </div>
        <div className={styles.commentSectionInputContainer}>
          <input
            type="text"
            value={reply}
            placeholder="Comment..."
            onChange={(e) => setReply(e.target.value)}
          />
          <button
            className={styles.commentSubmitButton}
            onClick={async () => {
              if (reply.trim()) {
                const newReply = await createReply.mutateAsync({
                  message: reply,
                  commentId: props.comment.id,
                });
                setReply("");
                setReplies([...replies, newReply as Reply]);
              }
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        {replies.length > 0 &&
          replies.map((reply) => (
            <ReplyComponent
              key={reply.id}
              reply={reply}
              userId={props.userId}
              removeReply={(id) => {
                setReplies(replies.filter((r) => r.id != id));
              }}
            />
          ))}
        {showDeleteComment && (
          <DeleteCommentModal
            onComplete={(deleteComment) => {
              if (deleteComment) props.removeComment(props.comment.id);
              setShowDeleteComment(false);
            }}
            id={props.comment.id}
            name={props.comment.message}
          />
        )}
      </div>
    );
}
