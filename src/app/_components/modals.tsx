import styles from "../index.module.css";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

export function Modal() {
  return (
    <>
      <div className={styles.modalOverlay} />
      <div className={styles.modal}>
        <h1>Hello, do this please :)</h1>
      </div>
    </>
  );
}

export function NewUserModal({ onComplete }: { onComplete: () => void }) {
  const [displayName, setDisplayName] = useState("");
  const updateDisplayName = trpc.user.updateDisplayName.useMutation({
    onSuccess: () => {
      onComplete();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateDisplayName.mutate({ newDisplayName: displayName });
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} />
      <div className={styles.modal}>
        <h1>Welcome, new user!</h1>
        <p>
          Please complete your profile,
          <br />
          Don't worry all of these can be changed later.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="newDisplayName"
            placeholder="Display Name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}
