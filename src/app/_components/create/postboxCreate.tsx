"use client";
import { Post, Tag } from "~/types/post";
import styles from "../../index.module.css";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { trpc } from "~/utils/trpc";
import { X } from "lucide-react";
import { User } from "~/types/user";
import { defaultTask } from "~/const/defaultVar";
import { Task } from "~/types/task";

interface postboxCreateProps {
  post: Post;
  user: User;
  availableTasks: Task[];
}

export function PostboxCreate(props: postboxCreateProps) {
  const [formData, setFormData] = useState({
    name: props.post.name || "",
    taskId: props.post.task.id || defaultTask.id,
    description: props.post.description || "",
  });

  const [newPostTime, setNewPostTime] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [error, setError] = useState("");
  const utils = trpc.useUtils();

  const getTags = trpc.tag.getAllTags.useQuery();

  const createPost = trpc.post.create.useMutation();
  const updateImage = trpc.post.updateImage.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });

  const updateTags = trpc.post.updateTags.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setSelectedTags([]);
    },
  });

  useEffect(() => {
    setNewPostTime(new Date().toLocaleString());
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const ids = [...selectedTags, Number(value)];
    setFormData({
      ...formData,
      [name]: ids,
    });
    setSelectedTags(ids);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
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
        taskId: formData.taskId,
        description: formData.description,
        imageUrl: "none",
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

      // If there are tags, upload the tags
      if (selectedTags.length > 0) {
        // Update the post with the tags
        await updateTags.mutateAsync({
          tags: selectedTags,
          id: newPost.id,
        });
      }

      // Reset form after successful submission
      setFormData({
        name: "",
        taskId: 0,
        description: "",
      });
      setImage(null);
      setPreview("");
      setError("");
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

  return (
    <form onSubmit={handleSubmit}>
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
          <h3>{newPostTime}</h3>
        </div>

        <div className={styles.postContent}>
          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write your post content here..."
              className={styles.postText}
              rows={4}
            />

            <div className={styles.imageUploadContainer}>
              {!preview && (
                <label className={styles.postText}>
                  Add Image (Optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
          </div>
          {uploading && <p className={styles.uploading}>Uploading...</p>}
          {error && <p className={styles.error}>{error}</p>}
          <div>
            <select
              name="task"
              value={formData.taskId}
              className={styles.taskSelect}
              //onChange={}
              required
            >
              {props.availableTasks.map((task) => (
                <option
                  key={task.id}
                  value={task.id}
                  className={styles.taskSelectOption}
                >
                  <p className={styles.postText}>{task.icon}</p>
                  <p className={styles.postText}>{task.name}</p>
                </option>
              ))}
            </select>
          </div>
        </div>
        {preview && (
          <div className={styles.flexColumn}>
            <div className={styles.profileAvatarConfirmContainer}>
              <button
                type="button"
                className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
                onClick={cancelImageUpload}
              >
                <X />
              </button>
            </div>
            <div className={styles.postImagePreviewContainer}>
              <img
                src={preview}
                alt="Preview"
                className={styles.imagePreview}
              />
            </div>
          </div>
        )}
        <div className={styles.postTagSelector}>
          <p>Tags:</p>
          {!getTags.isLoading && (
            <select
              name="tags"
              value={selectedTags.map(String)}
              onChange={handleTagSelectChange}
            >
              {getTags.data
                ?.filter((tag) => !selectedTags.includes(tag.id))
                .map((tag) => (
                  <option
                    style={{ borderColor: tag.colour }}
                    key={tag.id}
                    value={tag.id}
                  >
                    {tag.name}
                  </option>
                ))}
            </select>
          )}
          {getTags.isLoading && <div>Loading...</div>}
          {getTags.error && (
            <div className={styles.formError}>{getTags.error.message}</div>
          )}
        </div>
        <div className={styles.tagContainer}>
          {getTags.data
            ?.filter((tag) => selectedTags.includes(tag.id))
            .map((tag) => (
              <p style={{ borderColor: tag.colour }} className={styles.tag}>
                {tag.name}
              </p>
            ))}
        </div>
      </div>
      <div className={styles.postSubmitContainer}>
        <button
          type="submit"
          className={`${styles.opusButton} ${styles.submitButton}`}
          disabled={uploading}
        >
          {uploading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
