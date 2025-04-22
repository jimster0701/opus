import styles from "../index.module.css";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import "~/styles/themes.css";

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
  const [image, setImage] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedAfilliations, setSelectedAffiliations] = useState<string[]>(
    []
  );

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
    "Cooking",
    "Gardening",
    "Crafting",
    "Dancing",
    "Hiking",
    "Fishing",
    "camping",
    "Biking",
    "Running",
    "Swimming",
    "Yoga",
    "Meditation",
    "Volunteering",
    "Learning",
    "Coding",
    "Designing",
    "Building",
    "Collecting",
    "Exploring",
    "DIY",
    "Knitting",
    "Sewing",
    "Woodworking",
    "Metalworking",
    "Pottery",
    "Drawing",
    "Painting",
    "Sculpting",
    "Blogging",
    "Podcasting",
    "Vlogging",
    "Streaming",
  ];

  const affiliations = [
    "Student",
    "Hobbyist",
    "Idpendent Artist",
    "Independent Business Owner",
    "Freelancer",
    "Entrepreneur",
    "Independent Creator",
    "Content Creator",
    "Influencer",
    "Developer",
    "Designer",
    "Artist",
    "Musician",
    "Photographer",
  ];

  const updateDisplayName = trpc.user.updateDisplayName.useMutation({
    onSuccess: () => {
      onComplete();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateDisplayName.mutate({ newDisplayName: displayName });
  };

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} />
      <div className={styles.modal}>
        <h1>Welcome to Opus</h1>
        <p>
          Please complete your profile,
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
          <div className={styles.choiceList}>
            {hobbies.map((hobby) => (
              <button
                type="button"
                key={hobby}
                className={`${styles.opusButton} ${
                  selectedHobbies.includes(hobby)
                    ? `${styles.selectedOpusButton}`
                    : ""
                }`}
                onClick={() => toggleHobby(hobby)}
              >
                {hobby}
              </button>
            ))}
          </div>
          <button type="submit">Go</button>
        </form>
      </div>
    </div>
  );
}
