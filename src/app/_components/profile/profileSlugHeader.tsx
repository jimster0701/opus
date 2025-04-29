"use client";

import styles from "../../index.module.css";
import { ProfileSlugPictureWrapper } from "../images/cldImageWrapper";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { FollowerOrFollowingModal } from "../modals";
import { type SlugUser, type SimpleUser, type User } from "~/types/user";

interface ProfileSlugHeaderProps {
  sessionUser: User;
  user: SlugUser;
}

export default function ProfileSlugHeader(props: ProfileSlugHeaderProps) {
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

  return (
    <div className={styles.profileHeaderContainer}>
      <div className={styles.profileHeader}>
        <ProfileSlugPictureWrapper user={props.user} width={500} height={500} />
        <div className={styles.flexColumn}>
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
          <button className={styles.opusButton} disabled>
            Follow
          </button>
          <div className={styles.flexRow}>
            <p
              className={`${styles.profileHeaderText} ${styles.profileHeaderFollowText}`}
              onClick={() => {
                setShowFollowModal([true, "Following"]);
              }}
            >
              Following:{following?.length}
            </p>
            <p
              className={`${styles.profileHeaderText} ${styles.profileHeaderFollowText}`}
              onClick={() => {
                setShowFollowModal([true, "Followers"]);
              }}
            >
              Followers:{followers?.length}
            </p>
          </div>
        </div>
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
