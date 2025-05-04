"use client";

import styles from "../../index.module.css";
import { ProfilePictureWrapper } from "../images/cldImageWrapper";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { Check, X } from "lucide-react";
import { FollowerOrFollowingModal, SelectInterestsModal } from "../modals";
import { type Session } from "~/types/session";
import { type SimpleUser } from "~/types/user";
import { type Interest } from "~/types/interest";

interface ProfileHeaderProps {
  userInterests: Interest[];
  setUserInterests: (interests: Interest[]) => void;
  session: Session;
}

export default function ProfileHeader(props: ProfileHeaderProps) {
  const [changeDisplay, setChangeDisplay] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [showSelectInterests, setShowSelectInterests] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState<[boolean, string]>([
    false,
    "",
  ]);

  const { data: following } = trpc.user.getFollowing.useQuery({
    userId: props.session.user.id,
  });

  const { data: followers } = trpc.user.getFollowers.useQuery({
    userId: props.session.user.id,
  });

  const updateDisplayName = trpc.user.updateDisplayName.useMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateDisplayName.mutate({ newDisplayName: displayName });
    setChangeDisplay(false);
  };
  const utils = trpc.useUtils();
  const handleFollowersPrefetch = async () => {
    await utils.user.getFollowers.prefetch({ userId: props.session.user.id });
  };
  const handleFollowingPrefetch = async () => {
    await utils.user.getFollowers.prefetch({ userId: props.session.user.id });
  };

  return (
    <div className={styles.profileHeaderContainer}>
      <div className={styles.profileHeaderMain}>
        <ProfilePictureWrapper
          id={props.session.user.id}
          imageUrl={props.session.user.image}
          width={500}
          height={500}
          session={props.session}
        />
        <div className={styles.flexColumn}>
          <div className={styles.flexRow}>
            {!changeDisplay ? (
              <>
                <div
                  className={styles.flexRow}
                  onClick={() => {
                    setChangeDisplay(true);
                  }}
                >
                  <p
                    className={styles.profileHeaderText}
                    style={{ cursor: "pointer" }}
                  >
                    {displayName || props.session.user.displayName}
                  </p>
                  <Image
                    src="/images/pen.png"
                    alt={""}
                    width={15}
                    height={15}
                  />
                </div>
                {props.session.user.name && (
                  <>
                    <h5 className={styles.profileHeaderUsernameText}>
                      ({props.session.user.name})
                    </h5>
                  </>
                )}
              </>
            ) : (
              <form
                className={`${styles.flexRow} ${styles.profileHeaderUsernameForm}`}
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  name="newDisplayName"
                  placeholder={props.session.user.displayName}
                  required
                  value={displayName}
                  onChange={(e) => {
                    const newName = e.target.value;
                    if (newName.length > 20) {
                      setDisplayNameError(
                        "Display name cannot be more than 20 characters"
                      );
                    } else {
                      setDisplayNameError("");
                      setDisplayName(newName);
                    }
                  }}
                />
                <button
                  className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
                  onClick={(e) => {
                    if (displayName.length == 0) {
                      e.preventDefault();
                      setDisplayNameError("Display name cannot be empty.");
                    } else {
                      setDisplayNameError("");
                    }
                  }}
                  type="submit"
                >
                  <Check />
                </button>
                <button
                  className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
                  onClick={() => {
                    setDisplayName("");
                    setChangeDisplay(false);
                  }}
                  type="button"
                >
                  <X />
                </button>
                {displayNameError && (
                  <div className={styles.errorTooltip}>{displayNameError}</div>
                )}
              </form>
            )}
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
      <div className={styles.profileHeaderInterestsContainer}>
        <div
          className={styles.profileHeaderInterestPenContainer}
          onClick={() => setShowSelectInterests(true)}
        >
          Edit <Image src="/images/pen.png" alt={""} width={15} height={15} />
        </div>
        <div className={styles.profileHeaderInterests}>
          {props.userInterests.map((interest) => (
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
      </div>
      {showSelectInterests && (
        <SelectInterestsModal
          onComplete={(newInterests) => {
            setShowSelectInterests(false);
            props.setUserInterests(newInterests);
          }}
          interests={props.userInterests}
          session={props.session}
        />
      )}
      {showFollowModal[0] && followers && following && (
        <FollowerOrFollowingModal
          onComplete={() => setShowFollowModal([false, ""])}
          data={
            showFollowModal[1] == "Followers"
              ? (followers.map((f) => f.follower) as SimpleUser[])
              : (following.map((f) => f.following) as SimpleUser[])
          }
          user={props.session.user}
          type={showFollowModal[1]}
        />
      )}
    </div>
  );
}
