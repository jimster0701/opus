import styles from "../index.module.css";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import "~/styles/themes.css";
import { shuffle } from "../util";

export function Modal() {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} />
      <div className={styles.modal}>
        <h1>Hello, do this please :)</h1>
      </div>
    </div>
  );
}

export function SettingsModal({ onComplete }: { onComplete: () => void }) {
  const allThemes = [
    "sunset",
    "ocean",
    "forest",
    "ice",
    "lava",
    "midnight",
    "space",
    "obsidian",
    "velvet",
    "twilight",
  ];
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} onClick={onComplete} />
      <div className={styles.modal}>
        <h1>General Theme</h1>
        <div className={styles.themeSettings}>
          {allThemes.map((theme) => (
            <div className={styles.themeOption} key={theme}>
              <p>{theme}</p>
              <div className={`${styles.themePreset} theme-${theme}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NewUserModal({ onComplete }: { onComplete: () => void }) {
  const [displayName, setDisplayName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const hobbies = [
    "Music",
    "Art",
    "Sports",
    "Technology",
    "Travel",
    "Food",
    "Fashion",
    "Fitness",
    "Gaming",
    "Photography",
    "Reading",
    "Writing",
    "Crafting",
    "Dancing",
    "Hiking",
    "Fishing",
    "Camping",
    "Volunteering",
    "Learning",
    "Coding",
    "Designing",
    "Building",
    "Collecting",
    "Exploring",
    "Streaming",
  ];

  const affiliations = [
    "Student",
    "Hobbyist",
    "Artist",
    "Independent",
    "Business Owner",
    "Freelancer",
    "Entrepreneur",
    "Creator",
    "Influencer",
    "Developer",
    "Designer",
    "Musician",
    "Photographer",
  ];

  const mixedTags = shuffle([...hobbies, ...affiliations]);

  const updateTags = trpc.user.updateInterests.useMutation({});
  const updateDisplayName = trpc.user.updateDisplayName.useMutation({
    onSuccess: () => {
      onComplete();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateTags.mutate({ interests: selected.join(",") });
    updateDisplayName.mutate({ newDisplayName: displayName });
  };

  const toggleSelected = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} />
      <div className={styles.modal}>
        <h1>Welcome to Opus :)</h1>
        <p>
          Please complete your profile
          <br />
          Don't worry, all choices can be changed later.
        </p>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label htmlFor="newDisplayName">Choose your display name:</label>
          <input
            type="text"
            id="newDisplayName"
            name="newDisplayName"
            placeholder="Username"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="off"
          />
          <br />
          <p>
            Below is a list of hobbies and affiliations, <br />
            These choices will influence the types of tasks you are suggested
            <br />
            Please choose at least 5:
          </p>
          <div className={styles.choiceList}>
            {mixedTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`${styles.opusButton} ${
                  selected.includes(tag) ? `${styles.selectedOpusButton}` : ""
                }`}
                onClick={() => toggleSelected(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <button type="submit">Go</button>
        </form>
      </div>
    </div>
  );
}
