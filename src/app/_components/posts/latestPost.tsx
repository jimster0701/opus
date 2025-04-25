"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import styles from "../../index.module.css";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [description, setDescription] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setDescription("");
    },
  });

  return (
    <div className={styles.showcaseContainer}>
      {latestPost ? (
        <p className={styles.showcaseText}>
          Your most recent post: {latestPost.name}
        </p>
      ) : (
        <p className={styles.showcaseText}>You have no posts yet.</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({
            name: "Task name",
            description,
            imageUrl: "imageId",
          });
        }}
        className={styles.form}
      >
        <input
          type="text"
          placeholder="Title"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
