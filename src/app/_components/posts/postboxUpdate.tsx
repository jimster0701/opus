"use client";
import styles from "../../index.module.css";
import { type Post } from "~/types/post";
import { type User } from "~/types/user";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { trpc } from "~/utils/trpc";
import { Check, Trash2, X } from "lucide-react";
import { DeletePostImageModal, DeletePostModal } from "../modals";
import Image from "next/image";
import { type Task } from "~/types/task";
import toast from "react-hot-toast";

interface PostboxUpdateProps {
  post: Post;
  user: User;
  availableTasks: Task[];
  onComplete: (finalPost: Post, deletePost: boolean) => void;
}

export default function PostboxUpdate(props: PostboxUpdateProps) {
  const [formData, setFormData] = useState({
    name: props.post.name,
    taskId: props.post.task.id,
    description: props.post.description,
  });

  const [updatedPost] = useState<Post>(props.post);
  const [showPostImageDelete, setShowPostImageDelete] = useState(false);
  const [showPostDelete, setShowPostDelete] = useState(false);
  const [updatedPostTime, setupdatedPostTime] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploadedURL, setUploadedURL] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const utils = trpc.useUtils();

  const cloudinaryPrefix = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`;

  const updatePost = api.post.updatePost.useMutation();

  const updateImage = trpc.post.updateImage.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });

  useEffect(() => {
    setupdatedPostTime(new Date().toLocaleString());
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
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
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "opus-post-image");
      formData.append("public_id", `post-pictures/${postId}`);

      const reqURL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
      const res = await fetch(reqURL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();

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
    try {
      const returnedPost = await updatePost.mutateAsync({
        id: props.post.id,
        name: formData.name,
        taskId: Number(formData.taskId),
        description: formData.description,
        private: false,
        imageUrl: props.post.imageUrl == "none" ? "none" : props.post.imageUrl,
      });

      if (image && returnedPost.id) {
        setUploading(true);
        const cloudinaryPath = await handleUploadImage(returnedPost.id);
        if (cloudinaryPath) {
          setUploadedURL(cloudinaryPath);
          await updateImage.mutateAsync({
            imageUrl: cloudinaryPath,
            id: returnedPost.id,
          });
        }
      }

      if (!image) {
        props.onComplete(
          {
            ...updatedPost,
            name: formData.name,
            task: props.availableTasks.find(
              (t) => t.id == formData.taskId
            ) as Task,
            description: formData.description,
            imageUrl: props.post.imageUrl,
          },
          false
        );
      } else {
        props.onComplete(
          {
            ...updatedPost,
            name: formData.name,
            task: props.availableTasks.find(
              (t) => t.id == formData.taskId
            ) as Task,
            description: formData.description,
            imageUrl: uploadedURL,
          },
          false
        );
      }
      cancelImageUpload();
    } catch (error) {
      console.error("Error updating post:", error);
      setError("Failed to update post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const cancelImageUpload = () => {
    setPreview("");
    setImage(null);
    setError("");
  };

  const deleteImage = async () => {
    const deleteRes = await fetch("/api/cld-delete-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id: "post-pictures/" + props.post.id }),
    });
    const deleteResult = await deleteRes.json();

    if (!deleteRes.ok) {
      throw new Error(deleteResult.error ?? "Failed to delete existing image.");
    }
    props.post.imageUrl = "none";
    cancelImageUpload();
  };

  return (
    <form className={styles.postCreateForm} onSubmit={handleSubmit}>
      <div className={styles.postContainer}>
        <div className={styles.postHeader}>
          <div
            className={`${styles.flexRow} ${styles.postCreateTitleContainer}`}
          >
            <h2>{props.post.createdBy?.displayName || "New Post"}</h2>
            <p className={styles.postText}>-</p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Post Title"
              className={styles.postText}
              required
            />
          </div>
          <h3>{updatedPostTime}</h3>
        </div>

        <div className={styles.postCreateContent}>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Write your post content here..."
            className={styles.postText}
            rows={4}
            required
          />
          {!preview && (
            <div className={styles.imageUploadContainer}>
              <label className={styles.postText}>
                Add Image (Optional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}
          <div className={styles.flexRow}>
            <p>Based on:</p>
            <select
              name="taskId"
              value={formData.taskId}
              className={styles.opusSelector}
              onChange={handleInputChange}
              required
            >
              <option value={""}>Choose a task</option>
              {props.availableTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.icon}
                  {task.name}
                </option>
              ))}
            </select>
          </div>
          {(preview || props.post.imageUrl != "none") && (
            <div className={styles.postCreateImagePreviewContainer}>
              <div className={styles.flexRow}>
                <p>Delete image: </p>
                <button
                  type="button"
                  className={`${styles.opusButton} ${styles.postCreateImagePreviewCancelButton}`}
                  onClick={() => {
                    if (props.post.imageUrl != "none")
                      setShowPostImageDelete(true);
                    if (preview) cancelImageUpload();
                  }}
                >
                  <X />
                </button>
              </div>
              <div className={styles.postCreateImagePreview}>
                <Image
                  src={
                    preview == ""
                      ? cloudinaryPrefix + props.post.imageUrl
                      : preview
                  }
                  className={styles.imagePreview}
                  alt={""}
                  width={100}
                  height={100}
                />
              </div>
            </div>
          )}
        </div>
        {uploading && <p className={styles.uploading}>Uploading ...</p>}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.postUpdateDeleteContainer}>
          {/** <SquareCheckBig onClick={async () => {
                          try{
                            completeTask.mutate({id:props.task.id});
                          } catch
                        }} />  */}
          <Trash2
            onClick={() => {
              setShowPostDelete(true);
            }}
          />
        </div>
      </div>

      <div className={styles.postSubmitContainer}>
        <button
          type="submit"
          className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
          disabled={uploading}
        >
          {uploading ? "Updating..." : "Confirm"}

          <Check />
        </button>
        <button
          className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
          onClick={() => {
            props.onComplete(props.post, false);
          }}
        >
          Cancel
          <X />
        </button>
      </div>
      {showPostImageDelete && (
        <DeletePostImageModal
          onComplete={(deletePostImage: boolean) => {
            if (deletePostImage)
              deleteImage().catch(() =>
                toast.error("Something went wrong deleting your image")
              );

            setShowPostImageDelete(false);
          }}
          id={props.post.id}
          name={props.post.imageUrl}
        />
      )}
      {showPostDelete && (
        <DeletePostModal
          onComplete={(deletePost: boolean) => {
            if (deletePost) props.onComplete(props.post, deletePost);

            setShowPostDelete(false);
          }}
          id={props.post.id}
          name={props.post.name}
        />
      )}
    </form>
  );
}
