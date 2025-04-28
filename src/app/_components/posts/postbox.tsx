"use client";
import { type Post } from "~/types/post";
import styles from "../../index.module.css";
import { useState } from "react";
import Image from "next/image";
import { trpc } from "~/utils/trpc";
import { CommentSection } from "./commentSection";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";

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
          <ProfilePicturePreviewWrapper
            id={props.post.createdBy.id}
            imageUrl={props.post.createdBy.image}
            width={10}
            height={10}
          />
          <h2 className={styles.postHeaderH2}>
            {props.post.createdBy.displayName}
          </h2>
        </div>
        <h3 className={styles.postHeaderDate}>
          {props.post.createdAt.toLocaleString()}
        </h3>
      </div>
      <div className={styles.postTitleContainer}>
        <h3 className={styles.postTitle}>{props.post.name}</h3>
      </div>
      <div className={styles.postContentContainer}>
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
            width={100}
            height={100}
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
