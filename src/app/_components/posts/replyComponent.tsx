"use client";
import styles from "../../index.module.css";
import { type Reply } from "~/types/reply";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";
import Image from "next/image";

interface replyProps {
  userId: string;
  reply: Reply;
}

export function ReplyComponent(props: replyProps) {
  const [liked, setLiked] = useState(
    props.reply.likedBy.includes(props.userId)
  );
  const [tempLike, setTempLike] = useState(0);

  const likeComment = trpc.reply.likeReply.useMutation();
  const unlikeComment = trpc.reply.unlikeReply.useMutation();

  const handleLike = () => {
    setLiked(!liked);
    if (liked) {
      setTempLike(tempLike - 1);
      unlikeComment.mutate({
        replyId: props.reply.id,
        userId: props.userId,
      });
    } else {
      setTempLike(tempLike + 1);
      likeComment.mutate({ replyId: props.reply.id, userId: props.userId });
    }
  };

  if (props.reply.createdBy)
    return (
      <div className={styles.commentContainer}>
        <div className={styles.commentHeader}>
          <div className={styles.flexRow}>
            <ProfilePicturePreviewWrapper
              id={props.reply.createdBy.id}
              imageUrl={props.reply.createdBy.image}
              width={0}
              height={0}
            />
            <p className={styles.commentTitle}>
              {props.reply.createdBy.displayName}
            </p>
          </div>
          <p className={styles.commentTimestamp}>
            {props.reply.createdAt.toDateString()}
          </p>
        </div>
        <div className={styles.commentContentContainer}>
          <p className={styles.commentContent}>{props.reply.message}</p>
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
              {props.reply.likedBy.length + tempLike}
            </p>
          </div>
        </div>
      </div>
    );
}
