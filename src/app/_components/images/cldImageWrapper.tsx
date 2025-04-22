"use client";

import styles from "../../index.module.css";
import { CldImage } from "next-cloudinary";
import { openUploadWidget } from "./cldUploadWidget";

interface ProfilePictureWrapperProps {
  id: string | undefined;
  width: number;
  height: number;
}

export function ProfilePictureWrapper(props: ProfilePictureWrapperProps) {
  return (
    <div className={styles.profileAvatarWrapper}>
      <CldImage
        src={`profile-pictures/${props.id}`}
        width={props.width}
        height={props.height}
        className={styles.profileAvatar}
        crop={{
          type: "auto",
          source: true,
        }}
        alt={""}
      />
      <div
        className={styles.profileAvatarCover}
        onClick={() =>
          openUploadWidget({
            cloudName: "dbf1p4ylk",
            uploadPreset: "opus-profile-image",
            folder: "profile-pictures",
            id: props.id,
          })
        }
      >
        Change Picture
      </div>
    </div>
  );
}

export function ProfilePicturePreviewWrapper(
  props: ProfilePictureWrapperProps
) {
  return (
    <div className={styles.profileAvatarWrapper}>
      <CldImage
        src={`profile-pictures/${props.id}`}
        width={props.width}
        height={props.height}
        className={styles.profileAvatarPreview}
        crop={{
          type: "auto",
          source: true,
        }}
        alt={""}
      />
    </div>
  );
}
