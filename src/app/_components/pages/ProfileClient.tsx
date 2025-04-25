"use client";

import styles from "../../index.module.css";
import { ProfilePictureWrapper } from "../images/cldImageWrapper";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { useThemeStore } from "~/store/themeStore";
import { Check, X } from "lucide-react";

interface ProfileClientProps {
  session: any | null;
}

export default function ProfileClient(props: ProfileClientProps) {
  const [changeDisplay, setChangeDisplay] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");

  const { theme, setTheme } = useThemeStore();

  const updateDisplayName = trpc.user.updateDisplayName.useMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateDisplayName.mutate({ newDisplayName: displayName });
    setChangeDisplay(false);
  };

  if (theme == "unset") setTheme(props.session.user.themePreset);
  return (
    <main
      className={
        theme == "default"
          ? `${styles.main}`
          : `${styles.main} ${styles[`theme-${theme}`]}`
      }
    >
      {props.session.user && (
        <div className={styles.container}>
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
                  <form className={styles.flexRow} onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="newDisplayName"
                      placeholder={props.session.user.displayName}
                      required
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
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
                      <div className={styles.formError}>{displayNameError}</div>
                    )}
                  </form>
                )}
              </div>
              <div className={styles.flexRow}>
                <p
                  className={`${styles.profileHeaderText} ${styles.profileHeaderFollowText}`}
                >
                  Following:{props.session.user.following.length}
                </p>
                <p
                  className={`${styles.profileHeaderText} ${styles.profileHeaderFollowText}`}
                >
                  Followers:{props.session.user.followers.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
