"use client";

import styles from "../../index.module.css";
import { ProfilePictureWrapper } from "../images/cldImageWrapper";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import { useThemeStore } from "~/store/themeStore";
import { Session } from "inspector/promises";

interface ProfileClientProps {
  session: any | null;
}

export default function ProfileClient(props: ProfileClientProps) {
  const [changeDisplay, setChangeDisplay] = useState(false);
  const [displayName, setDisplayName] = useState("");
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
            />
            <div className={styles.flexColumn}>
              <div className={styles.flexRow}>
                <p className={styles.profileHeaderText}>
                  {props.session.user.name}
                </p>
                <p className={styles.profileHeaderText}>-</p>
                {!changeDisplay ? (
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
                ) : (
                  <form className={styles.flexRow} onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="newDisplayName"
                      placeholder={props.session.user.displayName}
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <button type="submit">Save</button>
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
