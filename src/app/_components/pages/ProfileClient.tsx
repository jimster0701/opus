"use client";

import styles from "../../index.module.css";
import { ProfilePictureWrapper } from "../cldImageWrapper";
import { SignOutButton } from "../signOutButton";
import Image from "next/image";
import { use, useState } from "react";
import { trpc } from "~/utils/trpc";
import ImageUpload from "../imageUpload";

interface ProfileClientProps {
  session: any | null;
}

export default function ProfileClient(props: ProfileClientProps) {
  const [changeDisplay, setChangeDisplay] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const updateDisplayName = trpc.user.updateDisplayName.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateDisplayName.mutate({ newDisplayName: displayName });
    setChangeDisplay(false);
  };

  return (
    <main className={styles.main}>
      {props.session.user && (
        <div className={styles.container}>
          <ImageUpload />
          <div className={styles.profileHeader}>
            <ProfilePictureWrapper
              id={props.session.user.id}
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
                <p className={styles.profileHeaderText}>
                  Following:{props.session.user.following.length}
                </p>
                <p className={styles.profileHeaderText}>
                  Followers:{props.session.user.followers.length}
                </p>
              </div>
            </div>
          </div>
          <SignOutButton />
        </div>
      )}
    </main>
  );
}
