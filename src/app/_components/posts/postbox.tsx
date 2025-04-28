"use client";
import { type Post } from "~/types/post";
import styles from "../../index.module.css";
import { useState } from "react";
import Image from "next/image";
import { trpc } from "~/utils/trpc";
import { CommentSection } from "./commentSection";

interface postProps {
  post: Post;
  userId: string;
}

export function Postbox(props: postProps) {
  const [liked, setLiked] = useState(props.post.likedBy.includes(props.userId));
  const [tempLike, setTempLike] = useState(0);
  const likePost = trpc.post.likePost.useMutation();
  const unlikePost = trpc.post.unlikePost.useMutation();

  const interests = trpc.interest.getInterestsById.useQuery({
    interestIds: props.post.task.interestIds,
  });

  const cloudinaryPrefix = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`;

  const handleLike = () => {
    setLiked(!liked);
    if (liked) {
      setTempLike(tempLike - 1);
      unlikePost.mutate({ postId: props.post.id, userId: props.userId });
    } else {
      setTempLike(tempLike + 1);
      likePost.mutate({ postId: props.post.id, userId: props.userId });
    }
  };
  return (
    <div className={styles.postContainer} key={props.post.id}>
      <div className={styles.postHeader}>
        <div className={styles.flexRow}>
          <h2>{props.post.createdBy.displayName}</h2>
          <p className={styles.postText}>-</p>
          <p className={styles.postText}>{props.post.name}</p>
        </div>
        <h3>{props.post.createdAt.toLocaleString()}</h3>
      </div>
      <div className={styles.postContent}>
        <div className={styles.postLikes} onClick={() => handleLike()}>
          {liked ? (
            <Image
              src="/images/heart-full.png"
              alt={""}
              width={10}
              height={10}
            />
          ) : (
            <Image src="/images/heart.png" alt={""} width={10} height={10} />
          )}
          <p className={styles.postText}>
            {props.post.likedBy.length + tempLike}
          </p>
        </div>
        <p className={styles.postText}>{props.post.description}</p>
      </div>
      {props.post.imageUrl && props.post.imageUrl != "none" && (
        <div className={styles.postImageContainer}>
          <Image
            className={styles.postImage}
            src={cloudinaryPrefix + props.post.imageUrl}
            alt={""}
          />
        </div>
      )}

      <div className={styles.tagContainer}>
        {!interests.isLoading ? (
          interests.data?.map((interest) => (
            <p
              key={interest.id}
              style={{ borderColor: interest.colour }}
              className={styles.tag}
            >
              {interest.name}
            </p>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <CommentSection post={props.post} />
    </div>
  );
}
