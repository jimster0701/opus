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
          <label htmlFor="newDisplayName">Set display name:</label>
          <input
            type="text"
            name="newDisplayName"
            placeholder="Username"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <br />
          <div className={styles.choiceList}>
            {hobbies.map((hobby) => (
              <button
                type="button"
                key={hobby}
                name={hobby}
                className={styles.opusButton}
                value={hobby}
                onClick={(e) => {
                  e.preventDefault();
                  const button = e.target as HTMLButtonElement;
                  if (styles.selectedOpusButton) {
                    button.classList.contains(styles.selectedOpusButton)
                      ? button.classList.remove(styles.selectedOpusButton)
                      : button.classList.add(styles.selectedOpusButton);
                  }

                  if (selectedHobbies.includes(hobby)) {
                    setSelectedHobbies((prev) =>
                      prev.filter((h) => h !== hobby)
                    );
                  } else {
                    setSelectedHobbies((prev) => [...prev, hobby]);
                  }
                }}
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
