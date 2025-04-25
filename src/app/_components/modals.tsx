import styles from "../index.module.css";
import { useMemo, useState } from "react";
import { trpc } from "../../utils/trpc";
import "~/styles/themes.css";
import { shuffle } from "./util";
import { useThemeStore } from "~/store/themeStore";
import { SignOutButton } from "./settings/signOutButton";

interface modalProps {
  onComplete: () => void;
  theme?: string;
}

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

export function SettingsModal(props: modalProps) {
  const { theme, setTheme } = useThemeStore();
  const allThemes = [
    "default",
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
  const updateThemePreset = trpc.user.updateThemePreset.useMutation();
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} onClick={props.onComplete} />
      <div
        className={
          theme == "default"
            ? `${styles.modal}`
            : `${styles.modal} ${styles[`theme-${theme}`]}`
        }
      >
        <p className={styles.closeModalButton} onClick={props.onComplete}>
          x
        </p>
        <h2 className={styles.opusText}>Settings</h2>
        <h3 className={styles.opusText}>Change The Theme</h3>
        <div className={styles.themeList}>
          {allThemes.map((theme) => (
            <div
              className={styles.themeOption}
              key={theme}
              onClick={() => {
                setTheme(theme);
                updateThemePreset.mutate({ theme: theme });
              }}
            >
              <p className={`${styles.themeText} ${styles.opusText}`}>
                {theme}
              </p>
              <div
                className={`${styles.themePreset} ${
                  styles[`theme-${theme}-preview`]
                }`}
              />
            </div>
          ))}
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}

export function NewUserModal(props: modalProps) {
  const [displayName, setDisplayName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const { theme, setTheme } = useThemeStore();

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
    "Fantasy Sports",
    "Knitting",
  ];

  const affiliations = [
    "Student",
    "Hobbyist",
    "Artist",
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

  useMemo(() => {
    setChoices(shuffle([...hobbies, ...affiliations]));
  }, []);

  const updateTags = trpc.user.updateInterests.useMutation({});
  const updateDisplayName = trpc.user.updateDisplayName.useMutation({
    onSuccess: () => {
      props.onComplete();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateTags.mutate({ interests: selected });
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
      <div
        className={
          theme == "default"
            ? `${styles.modal}`
            : `${styles.modal} ${styles[`theme-${theme}`]}`
        }
      >
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
          <h3 className={styles.modalText}>
            Below is a list of hobbies and affiliations, <br />
            These will influence your tasks and social circles.
            <br />
          </h3>
          <h4>
            {selected.length < 5 && (
              <>Please choose at least {5 - selected.length} more</>
            )}
            {selected.length >= 5 && (
              <>You have {25 - selected.length} choices left:</>
            )}
          </h4>
          <h5>You can have up to 25 interests.</h5>
          <div className={styles.choiceList}>
            {choices.map((tag) => (
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
          <button type="submit" disabled={selected.length < 5}>
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
