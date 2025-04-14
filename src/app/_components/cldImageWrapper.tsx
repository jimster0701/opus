"use client";

import styles from "../index.module.css";
import { CldImage } from "next-cloudinary";

export default function ProfilePictureWrapper() {
  return (
    <div className={styles.profileAvatarWrapper}>
      <CldImage
        src="cld-sample-5" // Use this sample image or upload your own via the Media Explorer
        width="500" // Transform the image: auto-crop to square aspect_ratio
        height="500"
        className={styles.profileAvatar}
        crop={{
          type: "auto",
          source: true,
        }}
        alt={""}
      />
      <div className={styles.profileAvatarCover}>Change Picture</div>
    </div>
  );
}
