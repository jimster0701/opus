"use client";
import styles from "../../index.module.css";
import { type Post } from "~/types/post";
import { type Interest } from "~/types/interest";
import { useEffect, useState } from "react";
import Image from "next/image";
import { trpc } from "~/utils/trpc";
import { CommentSection } from "./commentSection";
import { ProfilePicturePreviewWrapper } from "../images/cldImageWrapper";
import { shuffle } from "../util";
import { useRouter } from "next/navigation";

interface postProps {
  post: Post;
  userId: string;
}

export function Postbox(props: postProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(props.post.likedBy.includes(props.userId));
  const [tempLike, setTempLike] = useState(0);
  const [interests, setInterests] = useState<Interest[]>([]);

  const likePost = trpc.post.likePost.useMutation();
  const unlikePost = trpc.post.unlikePost.useMutation();

  const getInterests = trpc.interest.getInterestsById.useQuery({
    interestIds: props.post.task.interests.map((i) => i.task.id),
  });

  useEffect(() => {
    if (getInterests.isLoading) return;

    if (getInterests.data?.length != 0) {
      setInterests(shuffle(getInterests.data as Interest[]));
    }
  }, [getInterests.isLoading, getInterests.data]);

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
        <div
          className={styles.flexRow}
          onClick={() => {
            router.push(`/profile/${props.post.createdBy.id}`);
          }}
        >
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
              width={15}
              height={15}
            />
          ) : (
            <Image src="/images/heart.png" alt={""} width={15} height={15} />
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

      <div className={styles.postInterestContainer}>
        <p>Based on:</p>
        <br />
        {interests.map((interest) => (
          <div
            key={interest.id}
            style={{
              border: `${interest.colour} 1px solid`,
              ["--text-glow" as any]: `linear-gradient(to top left,rgb(70, 70, 70), ${interest.colour})`,
            }}
            className={styles.glowingNugget}
          >
            <p className={styles.glowingNuggetText}>
              {interest.icon}
              {interest.name}
            </p>
          </div>
        ))}
      </div>
      <CommentSection userId={props.userId} post={props.post} />
    </div>
  );
}
