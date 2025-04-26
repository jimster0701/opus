"use client";

import { Check, X } from "lucide-react";
import styles from "../../index.module.css";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";
import { trpc } from "~/utils/trpc";

interface ProfilePictureWrapperProps {
  id: string | undefined;
  imageUrl?: string;
  width: number;
  height: number;
  session: any;
}

export function ProfilePictureWrapper(props: ProfilePictureWrapperProps) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1745329655/profile-pictures/default`
  );

  const updateImage = trpc.user.updateProfilePicture.useMutation({});

  useEffect(() => {
    if (props.imageUrl) {
      if (props.imageUrl.includes("google"))
        setUploadedUrl(props.session.user.image);
      else
        setUploadedUrl(
          `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${props.imageUrl}`
        );
    }
  }, [props.imageUrl]);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("No image selected");
    setUploading(true);

    try {
      // Delete existing image
      const deleteRes = await fetch("/api/cld-delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id: "profile-pictures/" + props.id }),
      });

      const deleteResult = await deleteRes.json();

      if (!deleteRes.ok) {
        throw new Error(
          deleteResult.error || "Failed to delete existing image."
        );
      }

      // Upload the new image
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "opus-profile-image");
      formData.append("public_id", `profile-pictures/${props.id}`);

      const reqURL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
      const res = await fetch(reqURL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadedUrl(data.secure_url);
      const url = data.secure_url.replace(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`,
        ""
      );

      updateImage.mutate({ image: url });
      setPreview("");
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.flexColumn}>
      <div className={styles.profileAvatarWrapper}>
        {preview && (
          <img src={preview} alt="Preview" className={styles.profileAvatar} />
        )}
        {!preview && (
          <img
            src={uploadedUrl}
            width={props.width}
            height={props.height}
            className={styles.profileAvatar}
            onErrorCapture={(e) => {
              e.currentTarget.src = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1745329655/profile-pictures/default`;
            }}
            alt={""}
          />
        )}
        <label className={styles.profileAvatarChangeCover}>
          Change Picture
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
      </div>
      {uploading && "Uploading..."}
      {error && <p className={styles.error}>{error}</p>}

      {preview && (
        <div className={styles.profileAvatarConfirmContainer}>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={handleUpload}
          >
            <Check />
          </button>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={() => {
              setPreview("");
              setImage(null);
            }}
          >
            <X />
          </button>
        </div>
      )}
    </div>
  );
}

export function ProfilePicturePreviewWrapper(
  props: ProfilePictureWrapperProps
) {
  const [src, setSrc] = useState(
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1745329655/profile-pictures/default`
  );

  if (props.imageUrl) {
    if (props.imageUrl.includes("google")) setSrc(props.session.user.image);
    else
      setSrc(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${props.imageUrl}`
      );
  }
  return (
    <div className={styles.profileAvatarWrapper}>
      <img
        src={src}
        width={props.width}
        height={props.height}
        className={styles.profileAvatarPreview}
        alt={""}
      />
    </div>
  );
}
