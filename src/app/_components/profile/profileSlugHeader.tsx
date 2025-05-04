"use client";

import styles from "../../index.module.css";
import { ProfileSlugPictureWrapper } from "../images/cldImageWrapper";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "~/utils/trpc";
import { FollowerOrFollowingModal, GainInterestModal } from "../modals";
import { type SlugUser, type SimpleUser, type User } from "~/types/user";
import { type Interest } from "~/types/interest";
import { defaultInterest } from "~/const/defaultVar";

interface ProfileSlugHeaderProps {
  sessionUser: User;
  userInterests: Interest[];
  user: SlugUser;
}

export default function ProfileSlugHeader(props: ProfileSlugHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [sessionUserInterests, setSessionUserInterests] = useState<Interest[]>(
    []
  );
  const [newInterest, setNewInterest] = useState<Interest>(defaultInterest);
  const [tempFollow, setTempFollow] = useState(0);
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

  const getSessionUserInterests = trpc.user.getUserInterests.useQuery({
    userId: props.sessionUser.id,
  });

  useMemo(() => {
    if (getSessionUserInterests.isLoading) return;
    setSessionUserInterests((getSessionUserInterests.data as Interest[]) ?? []);
  }, [getSessionUserInterests.isLoading, getSessionUserInterests.data]);

  useEffect(() => {
    if (getIsFollowing.isLoading) return;
    if (getIsFollowing.data) {
      setIsFollowing(getIsFollowing.data);
    }
  }, [getIsFollowing.isLoading, getIsFollowing.data]);

  const handleFollow = () => {
    if (!isFollowing) {
      setTempFollow(tempFollow + 1);
    } else {
      setTempFollow(tempFollow - 1);
    }
  };

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
              <div>
                {isFollowing ? (
                  <button
                    className={styles.opusButton}
                    onClick={async () => {
                      setIsFollowing(false);
                      handleFollow();
                      await removeFollowing.mutateAsync({
                        userId: props.user.id,
                      });
                    }}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className={styles.opusButton}
                    onClick={async () => {
                      setIsFollowing(true);
                      handleFollow();
                      await addFollowing.mutateAsync({ userId: props.user.id });
                    }}
                    disabled={props.user.id == props.sessionUser.id}
                  >
                    Follow
                  </button>
                )}
              </div>
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
              Followers:{followers?.length && followers.length + tempFollow}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.profileHeaderInterestsContainer}>
        <div className={styles.profileHeaderInterests}>
          {props.userInterests.map((interest) => (
            <div
              key={interest.id}
              style={{
                border: `${interest.colour} 1px solid`,
                ["--text-glow" as any]: `linear-gradient(to top left,rgb(70, 70, 70), ${interest.colour})`,
              }}
              className={styles.glowingNugget}
              onClick={() => {
                setShowInterestModal(true);
                setNewInterest(interest);
              }}
            >
              <p className={styles.glowingNuggetText}>
                {interest.icon}
                {interest.name}
              </p>
            </div>
          ))}
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
      {showInterestModal && (
        <GainInterestModal
          interest={newInterest}
          userId={props.sessionUser.id}
          onComplete={() => setShowInterestModal(false)}
          userInterests={sessionUserInterests}
        />
      )}
    </div>
  );
}
