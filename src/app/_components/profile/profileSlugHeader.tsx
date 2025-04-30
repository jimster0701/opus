"use client";

import styles from "../../index.module.css";
import { ProfileSlugPictureWrapper } from "../images/cldImageWrapper";
import { useEffect, useState } from "react";
import { trpc } from "~/utils/trpc";
import { FollowerOrFollowingModal } from "../modals";
import {
  type SlugUser,
  type SimpleUser,
  type User,
  Follow,
} from "~/types/user";

interface ProfileSlugHeaderProps {
  sessionUser: User;
  user: SlugUser;
}

export default function ProfileSlugHeader(props: ProfileSlugHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState<[boolean, string]>([
    false,
    "",
  ]);

  const { data: following } = trpc.user.getFollowing.useQuery({
    userId: props.user.id,
  });

  const { data: followers } = trpc.user.getFollowers.useQuery({
    userId: props.user.id,
  });

  const getIsFollowing = trpc.user.IsFollowing.useQuery({
    userId: props.user.id,
  });

  const addFollowing = trpc.user.addFollowing.useMutation();
  const removeFollowing = trpc.user.removeFollowing.useMutation();

  const utils = trpc.useUtils();
  const handleFollowersPrefetch = async () => {
    await utils.user.getFollowers.prefetch({ userId: props.user.id });
  };
  const handleFollowingPrefetch = async () => {
    await utils.user.getFollowers.prefetch({ userId: props.user.id });
  };

  useEffect(() => {
    if (getIsFollowing.isLoading) return;
    if (getIsFollowing.data) {
      setIsFollowing(getIsFollowing.data);
    }
  }, [getIsFollowing.isLoading, getIsFollowing.data]);

  return (
    <div className={styles.profileHeaderContainer}>
      <div className={styles.profileSlugHeader}>
        <ProfileSlugPictureWrapper user={props.user} width={500} height={500} />
        <div className={styles.profileSlugHeaderMain}>
          <div className={styles.flexRow}>
            <div className={styles.flexRow}>
              <p
                className={styles.profileHeaderText}
                style={{ cursor: "pointer" }}
              >
                {props.user.displayName}
              </p>
            </div>
          </div>
          <div className={styles.flexRow}>
            <p
              className={`${styles.profileHeaderText} ${styles.profileHeaderFollowText}`}
              onClick={async () => {
                await handleFollowingPrefetch();
                setShowFollowModal([true, "Following"]);
              }}
            >
              Following:{following?.length}
            </p>
            <p
              className={`${styles.profileHeaderText} ${styles.profileHeaderFollowText}`}
              onClick={async () => {
                await handleFollowersPrefetch();
                setShowFollowModal([true, "Followers"]);
              }}
            >
              Followers:{followers?.length}
            </p>
          </div>
        </div>
      </div>
      <div>
        {isFollowing ? (
          <button
            className={styles.opusButton}
            onClick={async () => {
              await removeFollowing.mutateAsync({ userId: props.user.id });
            }}
          >
            Following
          </button>
        ) : (
          <button
            className={styles.opusButton}
            onClick={async () => {
              await addFollowing.mutateAsync({ userId: props.user.id });
            }}
          >
            Follow
          </button>
        )}
      </div>
      {showFollowModal[0] && followers && following && (
        <FollowerOrFollowingModal
          onComplete={() => setShowFollowModal([false, ""])}
          data={
            showFollowModal[1]
              ? (followers.map((f) => f.follower) as SimpleUser[])
              : (following.map((f) => f.following) as SimpleUser[])
          }
          user={props.user}
          type={showFollowModal[1]}
        />
      )}
    </div>
  );
}
