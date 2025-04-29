"use client";

import styles from "../../index.module.css";
import { ProfilePictureWrapper } from "../images/cldImageWrapper";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { Check, X } from "lucide-react";
import { FollowerModal, FollowingModal } from "../modals";
import { type Session } from "~/types/session";

interface ProfileHeaderProps {
  session: Session;
}

export default function ProfileHeader(props: ProfileHeaderProps) {
  const [changeDisplay, setChangeDisplay] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");

  const { data: following } = trpc.user.getFollowing.useQuery({
    userId: props.session.user.id,
  });

  const { data: followers } = trpc.user.getFollowing.useQuery({
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
      <div className={styles.profileHeader}>
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
                setShowFollowingModal(true);
              }}
            >
              Following:{following?.length}
            </p>
            <p
              className={`${styles.profileHeaderText} ${styles.profileHeaderFollowText}`}
              onClick={async () => {
                await handleFollowersPrefetch();
                setShowFollowerModal(true);
              }}
            >
              Followers:{followers?.length}
            </p>
          </div>
        </div>
      </div>
      {showFollowingModal && (
        <FollowingModal
          theme={props.session.user.themePreset}
          onComplete={() => setShowFollowingModal(false)}
          user={props.session.user}
        />
      )}
      {showFollowerModal && (
        <FollowerModal
          theme={props.session.user.themePreset}
          onComplete={() => setShowFollowerModal(false)}
          user={props.session.user}
        />
      )}
    </div>
  );
}
