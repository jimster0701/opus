import styles from "../index.module.css";
import { useMemo, useState } from "react";
import { trpc } from "../../utils/trpc";
import "~/styles/themes.css";
import { shuffle } from "./util";
import { useThemeStore } from "~/store/themeStore";
import { SignOutButton } from "./settings/signOutButton";
import { X } from "lucide-react";
import { User } from "~/types/user";
import { ProfilePicturePreviewWrapper } from "./images/cldImageWrapper";

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

interface followerOrFollowingProps extends modalProps {
  user: User;
  following?: any[];
  followers?: any[];
}

export function FollowingModal(props: followerOrFollowingProps) {
  const { theme, setTheme } = useThemeStore();
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
          <X width={45} height={45} />
        </p>
        <h1>Following</h1>
        {props.following?.map((user) => (
          <div key={user.id} className={styles.cardContainer}>
            <ProfilePicturePreviewWrapper
              id={user.id}
              imageUrl={user.following.image || undefined}
              width={10}
              height={10}
              session={undefined}
            />
            <p className={styles.cardTitle}></p>
            {user.following.displayName}
          </div>
        ))}
      </div>
    </div>
  );
}
export function FollowerModal(props: followerOrFollowingProps) {
  const { theme, setTheme } = useThemeStore();
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
          <X width={45} height={45} />
        </p>
        <h1>Followers</h1>
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
          <X width={45} height={45} />
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
  const [submitError, setSubmitError] = useState([false, ""]);
  const { theme, setTheme } = useThemeStore();

  const interests = [
    "Music",
    "Art",
    "Design",
    "Sports",
    "Fitness",
    "Technology",
    "Coding",
    "Travel",
    "Exploration",
    "Food",
    "Cooking",
    "Fashion",
    "Style",
    "Gaming",
    "Streaming",
    "Photography",
    "Reading",
    "Writing",
    "Crafting",
    "DIY",
    "Outdoor Activities",
    "Volunteering",
    "Community",
    "Entrepreneurship",
    "Business",
    "Content Creation",
  ];

  useMemo(() => {
    setChoices(shuffle(interests));
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
          Please complete your profile.
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
            onChange={(e) => {
              const newName = e.target.value;
              if (newName.length > 20) {
                setSubmitError([
                  true,
                  "Display name must be less than 20 characters",
                ]);
              } else {
                setSubmitError([false, ""]);
                setDisplayName(newName);
              }
            }}
            autoComplete="off"
          />
          {submitError[0] && (
            <div className={styles.errorTooltip}>{submitError[1]}</div>
          )}
          <h3 className={styles.modalText}>
            Below is a list of affiliations, <br />
            Choose at least 5, These choices will influence the tasks you
            receive and social circles you discover.
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
                className={`${styles.choiceButton} ${
                  selected.includes(tag) ? `${styles.selectedChoiceButton}` : ""
                }`}
                onClick={() => toggleSelected(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={selected.length < 5 || submitError[0] == true}
          >
            Go
          </button>
          {submitError[0] && (
            <div className={styles.formError}>{submitError[1]}</div>
          )}
        </form>
      </div>
    </div>
  );
}
