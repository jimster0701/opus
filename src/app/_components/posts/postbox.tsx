"use client";
import { Post } from "~/types/post";
import styles from "../../index.module.css";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { trpc } from "~/utils/trpc";
import { X } from "lucide-react";

interface postProps {
  post: Post;
  userId: string;
  editable?: boolean;
}

export function PostBox(props: postProps) {
  const [liked, setLiked] = useState(props.post.likedBy.includes(props.userId));
  const [tempLike, setTempLike] = useState(0);
  const likePost = trpc.post.likePost.useMutation();
  const unlikePost = trpc.post.unlikePost.useMutation();

  const [formData, setFormData] = useState({
    name: props.post.name || "",
    description: props.post.description || "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const createPost = trpc.post.create.useMutation();
  const updateImage = trpc.post.updateImage.useMutation();

  const handleLike = () => {
    setLiked(!liked);
    if (liked) {
      setTempLike(0);
      unlikePost.mutate({ postId: props.post.id, userId: props.userId });
    } else {
      setTempLike(1);
      likePost.mutate({ postId: props.post.id, userId: props.userId });
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      console.log("File selected:", file);
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleUploadImage = async (postId: number) => {
    if (!image) return null;
    setUploading(true);

    try {
      // Upload the new image to Cloudinary
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "opus-post-image"); // You should create a preset for posts
      formData.append("public_id", `post-images/${postId}`);

      const reqURL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
      const res = await fetch(reqURL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      setUploadedUrl(data.secure_url);

      // Extract the cloudinary path from the secure URL
      const cloudinaryPath = data.secure_url.replace(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`,
        ""
      );

      return cloudinaryPath;
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload image. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // First create the post
      const newPost = await createPost.mutateAsync({
        name: formData.name,
        description: formData.description,
        imageUrl: "",
      });

      // If there's an image, upload it and update the post
      if (image && newPost.id) {
        const cloudinaryPath = await handleUploadImage(newPost.id);
        if (cloudinaryPath) {
          // Update the post with the image URL
          await updateImage.mutateAsync({
            imageUrl: cloudinaryPath,
            id: newPost.id,
          });
        }
      }

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
      });
      setImage(null);
      setPreview("");
      setError("");

      // You might want to redirect or show a success message here
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const cancelImageUpload = () => {
    setPreview("");
    setImage(null);
    setError("");
  };

  if (!props.editable)
    return (
      <div className={styles.postContainer} key={props.post.id}>
        <div className={styles.postHeader}>
          <div className={styles.flexRow}>
            <h2>{props.post.createdBy.displayName}</h2>
            <p className={styles.postText}>-</p>
            <p className={styles.postText}>{props.post.name}</p>
          </div>
          <h3>{props.post.createdAt.toLocaleString()}</h3>
        </div>
        <div className={styles.postContent}>
          <div className={styles.postLikes} onClick={() => handleLike()}>
            {liked ? (
              <Image
                src="/images/heart-full.png"
                alt={""}
                width={10}
                height={10}
              />
            ) : (
              <Image src="/images/heart.png" alt={""} width={10} height={10} />
            )}
            <p className={styles.postText}>
              {props.post.likedBy.length + tempLike}
            </p>
          </div>
          <p className={styles.postText}>{props.post.description}</p>
        </div>
      </div>
    );
  else {
    return (
      <div className={styles.postContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.postHeader}>
            <div className={styles.flexRow}>
              <h2>{props.post.createdBy?.displayName || "New Post"}</h2>
              <p className={styles.postText}>-</p>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Post Title"
                className={styles.titleInput}
                required
              />
            </div>
            <h3>{new Date().toLocaleString()}</h3>
          </div>

          <div className={styles.postContent}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write your post content here..."
              className={styles.descriptionInput}
              rows={4}
              required
            />

            <div className={styles.imageUploadContainer}>
              {!preview ? (
                <label className={styles.profileAvatarChangeCover}>
                  Add Image (Optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              ) : (
                <div className={styles.flexColumn}>
                  <div className={styles.imagePreviewContainer}>
                    <img
                      src={preview}
                      alt="Preview"
                      className={styles.imagePreview}
                    />
                  </div>

                  <div className={styles.profileAvatarConfirmContainer}>
                    <button
                      type="button"
                      className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
                      onClick={cancelImageUpload}
                    >
                      <X />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {uploading && <p className={styles.uploading}>Uploading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.formActions}>
              <button
                type="submit"
                className={`${styles.opusButton} ${styles.submitButton}`}
                disabled={uploading}
              >
                {uploading ? "Creating Post..." : "Create Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
