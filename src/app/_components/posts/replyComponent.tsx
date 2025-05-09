"use client";
import styles from "../../index.module.css";
import { type Reply } from "~/types/reply";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { DeleteReplyModal } from "../modals";

interface replyProps {
  userId: string;
  reply: Reply;
  removeReply: (id: number) => void;
}

export function ReplyComponent(props: replyProps) {
  const router = useRouter();
  const [showDeleteReply, setShowDeleteReply] = useState(false);
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
          <div
            className={styles.flexRow}
            onClick={() => {
              router.push(`/profile/${props.reply.createdBy.id}`);
            }}
          >
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
            {props.reply.createdById == props.userId ? (
              <Trash2
                onClick={() => {
                  setShowDeleteReply(true);
                }}
              />
            ) : (
              props.reply.createdAt.toDateString()
            )}
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
        {showDeleteReply && (
          <DeleteReplyModal
            onComplete={(deleteReply) => {
              if (deleteReply) props.removeReply(props.reply.id);
              setShowDeleteReply(false);
            }}
            id={props.reply.id}
            name={props.reply.message}
          />
        )}
      </div>
    );
}
