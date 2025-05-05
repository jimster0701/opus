import styles from "../index.module.css";
import { useMemo, useState, Fragment, useEffect } from "react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";
import { trpc } from "../../utils/trpc";
import "~/styles/themes.css";
import { shuffle } from "./util";
import { useThemeStore } from "~/store/themeStore";
import { SignOutButton } from "./settings/signOutButton";
import { Check, X } from "lucide-react";
import { type SimpleUser, type SlugUser, type User } from "~/types/user";
import { ProfilePicturePreviewWrapper } from "./images/cldImageWrapper";
import { defaultInterests } from "~/const/defaultVar";
import { type Interest } from "~/types/interest";
import { api } from "~/trpc/react";
import { type Session } from "~/types/session";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface modalProps {
  onComplete: () => void;
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

interface deleteModalProps {
  onComplete: (deleteThing: boolean) => void;
  id: number;
  name: string;
}

export function DeleteCommentModal(props: deleteModalProps) {
  const deleteComment = api.comment.deleteComment.useMutation();
  return (
    <div className={styles.modalContainer}>
      <div
        className={styles.modalBackground}
        onClick={() => props.onComplete(false)}
      />
      <div className={styles.modal}>
        <h1>Are you sure you want to delete this comment:</h1>
        <h2>{props.name}?</h2>
        <div className={styles.taskUpdateControls}>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={async () => {
              try {
                deleteComment.mutate({ id: props.id });
                props.onComplete(true);
                toast.success("Deleted comment!");
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Yes <Check />
          </button>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={() => props.onComplete(false)}
          >
            No <X />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeletePostImageModal(props: deleteModalProps) {
  return (
    <div className={styles.modalContainer}>
      <div
        className={styles.modalBackground}
        onClick={() => props.onComplete(false)}
      />
      <div className={styles.modal}>
        <h1>Are you sure you want to delete this image?</h1>
        <div className={styles.taskUpdateControls}>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={async () => {
              try {
                props.onComplete(true);
                toast.success("Deleting image!");
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Yes <Check />
          </button>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={() => props.onComplete(false)}
          >
            No <X />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeletePostModal(props: deleteModalProps) {
  const deletePost = api.post.deletePost.useMutation();
  return (
    <div className={styles.modalContainer}>
      <div
        className={styles.modalBackground}
        onClick={() => props.onComplete(false)}
      />
      <div className={styles.modal}>
        <h1>Are you sure you want to delete:</h1>
        <h2>{props.name}?</h2>
        <br />
        <div className={styles.taskUpdateControls}>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={async () => {
              try {
                deletePost.mutate({ id: props.id });
                props.onComplete(true);
                toast.success("Post Deleted!");
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Yes <Check />
          </button>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={() => props.onComplete(false)}
          >
            No <X />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeleteTaskModal(props: deleteModalProps) {
  const deleteTask = api.task.deleteTask.useMutation();
  return (
    <div className={styles.modalContainer}>
      <div
        className={styles.modalBackground}
        onClick={() => props.onComplete(false)}
      />
      <div className={styles.modal}>
        <h1>Are you sure you want to delete:</h1>
        <h2>{props.name}?</h2>
        <br />
        <div className={styles.taskUpdateControls}>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={async () => {
              try {
                deleteTask.mutate({ id: props.id });
                props.onComplete(true);
                toast.success("Task Deleted!");
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Yes <Check />
          </button>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={() => props.onComplete(false)}
          >
            No <X />
          </button>
        </div>
      </div>
    </div>
  );
}

interface gainInterestModalProps extends modalProps {
  interest: Interest;
  userInterests: Interest[];
  userId: string;
}

export function GainInterestModal(props: gainInterestModalProps) {
  const updateInterests = api.user.updateInterests.useMutation();
  const [newSelectedError, setNewSelectedError] = useState<[boolean, string]>([
    false,
    "",
  ]);
  const [newUserInterests, setNewUserInterests] = useState<Interest[]>(
    props.userInterests
  );
  const getInterests = trpc.user.getUserInterests.useQuery({
    userId: props.userId,
  });

  useMemo(() => {
    if (getInterests.isLoading) return;
    setNewUserInterests((getInterests.data as Interest[]) ?? []);
  }, [getInterests.isLoading, getInterests.data]);
  if (newUserInterests.length == 10) {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalBackground} onClick={props.onComplete} />
        <div className={styles.modal}>
          <h3>You can only have 10 interests</h3>
          <h4>
            Choose one for this to replace:
            <br />
            {props.interest.icon}
            {props.interest.name}
          </h4>
          <div className={styles.gainInterestReplacementList}>
            {newUserInterests.map((interest) => (
              <button
                type="button"
                key={interest.id}
                className={`${styles.choiceButton} ${
                  newUserInterests.some((i) => i.id == interest.id)
                    ? `${styles.selectedChoiceButton}`
                    : ""
                }`}
                onClick={() => {
                  if (newUserInterests.some((i) => i.id == interest.id)) {
                    setNewUserInterests((prev) =>
                      prev.filter((i) => i.id != interest.id)
                    );
                    setNewSelectedError([false, ""]);
                  } else if (newUserInterests.length > 10) {
                    setNewSelectedError([
                      true,
                      "You can only select up to 10 interests",
                    ]);
                  } else {
                    setNewUserInterests((prev) =>
                      prev.filter((i) => i.id != interest.id)
                    );
                    setNewSelectedError([false, ""]);
                  }
                }}
              >
                {interest.icon}
                {interest.name}
              </button>
            ))}
          </div>
          {newSelectedError[0] && (
            <div className={styles.formError}>{newSelectedError[1]}</div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalBackground} onClick={props.onComplete} />
        <div className={styles.modal}>
          <h1>Do you want to add this interest to your own profile?</h1>
          <h2>
            {props.interest.icon}
            {props.interest.name}
          </h2>
          <br />
          <div className={styles.taskUpdateControls}>
            <button
              className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
              onClick={async () => {
                try {
                  updateInterests.mutate({
                    interestIds: [
                      ...newUserInterests.map((i) => i.id),
                      props.interest.id,
                    ],
                  });
                  toast.success("Interest added to your profile!");
                  props.onComplete();
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              Yes <Check />
            </button>
            <button
              className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
              onClick={props.onComplete}
            >
              No <X />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

interface followerOrFollowingProps extends modalProps {
  data: SimpleUser[];
  user: User | SlugUser;
  type: string;
}

export function FollowerOrFollowingModal(props: followerOrFollowingProps) {
  const [list] = useState<SimpleUser[]>(props.data);
  const router = useRouter();

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} onClick={props.onComplete} />
      <div
        className={
          props.user.themePreset == "default"
            ? `${styles.modal}`
            : `${styles.modal} ${styles[`theme-${props.user.themePreset}`]}`
        }
      >
        <p className={styles.closeModalButton} onClick={props.onComplete}>
          <X width={45} height={45} />
        </p>
        <h1>{props.type}:</h1>
        {list.map((user) => (
          <div
            key={user.id}
            className={styles.cardContainer}
            onClick={() => {
              router.push(`/profile/${user.id}`);
            }}
          >
            <ProfilePicturePreviewWrapper
              id={user.id}
              imageUrl={user.image}
              width={10}
              height={10}
            />
            <p className={styles.cardTitle}></p>
            {user.displayName}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsModal(props: modalProps) {
  const { theme, setTheme } = useThemeStore();
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [profileTaskPrivate, setProfileTaskPrivate] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
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
  const updatePrivateSetting = trpc.user.updatePrivate.useMutation();
  const updateTasksPrivateSetting = trpc.user.updateTasksPrivate.useMutation();
  const sendReport = trpc.report.createIssueReport.useMutation();

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
        <h2 className={`${styles.opusText} ${styles.settingsTitle}`}>
          Settings
        </h2>
        <div className={styles.settingsContainer}>
          <h3 className={`${styles.opusText} ${styles.themeTitle}`}>
            Change The Theme
          </h3>
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
        </div>
        <br />

        <h3 className={`${styles.opusText} ${styles.settingsPrivacyTitle}`}>
          Profile privacy
        </h3>
        <div className={styles.settingsPrivacyContainer}>
          <div className={styles.settingsPrivacyInput}>
            <p>
              Private profile:
              <br />
              {"(Hide interests and posts)"}
            </p>
            <input
              type="checkbox"
              checked={profilePrivate}
              onChange={(e) => {
                setProfilePrivate(e.target.checked);
                updatePrivateSetting.mutate({ private: e.target.checked });
              }}
            />
          </div>
          <div className={styles.settingsPrivacyInput}>
            <p>Show tasks on profile:</p>
            <input
              type="checkbox"
              checked={profileTaskPrivate}
              onChange={(e) => {
                setProfileTaskPrivate(e.target.checked);
                updateTasksPrivateSetting.mutate({
                  tasksPrivate: e.target.checked,
                });
              }}
            />
          </div>
        </div>
        <div>
          <h3>Leave a message</h3>
          <h4>Report a bug or give your opinion</h4>
          <div className={styles.reportContainer}>
            <input
              type="text"
              value={reportMessage}
              placeholder="Message"
              className={styles.reportInput}
              onChange={(e) => setReportMessage(e.target.value)}
            />
            <button
              className={`${styles.opusButton} ${styles.signOutButton}`}
              onClick={async () => {
                if (reportMessage != "") {
                  sendReport.mutate({ message: reportMessage });
                  setReportMessage("");
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
        <br />
        <br />
        <SignOutButton />
      </div>
    </div>
  );
}

export function NewUserModal(props: modalProps) {
  const [displayName, setDisplayName] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [choices, setChoices] = useState<Interest[]>([]);
  const [submitError, setSubmitError] = useState([false, ""]);
  const [choiceError, setChoiceError] = useState([false, ""]);
  const { theme } = useThemeStore();

  useMemo(() => {
    setChoices(shuffle(defaultInterests));
  }, []);

  const updateInterests = trpc.user.updateInterests.useMutation({});
  const updateDisplayName = trpc.user.updateDisplayName.useMutation({
    onSuccess: () => {
      props.onComplete();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateInterests.mutate({ interestIds: selected });
    updateDisplayName.mutate({ newDisplayName: displayName });
  };

  const removeSelected = (interest: Interest) => {
    if (selected.includes(interest.id)) {
      setSelected((prev) => prev.filter((i) => i !== interest.id));
    }
  };

  const addSelected = (interest: Interest) => {
    if (!selected.includes(interest.id)) {
      setSelected((prev) => [...prev, interest.id]);
    }
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
          {"Don't worry, all choices can be changed later."}
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
            Choose at least 3,
            <br />
            <br />
            These choices will influence the tasks you receive and social
            circles you discover.
            <br />
          </h3>
          <h4>
            {selected.length < 3 && (
              <>Please choose at least {3 - selected.length} more</>
            )}
            {selected.length >= 3 && (
              <>You have {10 - selected.length} choices left:</>
            )}
          </h4>
          <h5>You can have up to 10 interests.</h5>
          <div className={styles.choiceList}>
            {choices.map((interest) => (
              <button
                type="button"
                key={interest.id}
                className={`${styles.choiceButton} ${
                  selected.includes(interest.id)
                    ? `${styles.selectedChoiceButton}`
                    : ""
                }`}
                onClick={() => {
                  if (selected.includes(interest.id)) {
                    removeSelected(interest);
                    setChoiceError([false, ""]);
                  } else if (selected.length > 10) {
                    setChoiceError([
                      true,
                      "You can only select up to 10 interests",
                    ]);
                  } else addSelected(interest);
                }}
              >
                {interest.icon}
                {interest.name}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={
              selected.length < 3 ||
              selected.length > 10 ||
              submitError[0] == true ||
              choiceError[0] == true
            }
          >
            Go
          </button>
          {choiceError[0] && (
            <div className={styles.formError}>{choiceError[1]}</div>
          )}
        </form>
      </div>
    </div>
  );
}

interface selectInterestsModalProps {
  onComplete: (newInterests: Interest[]) => void;
  interests: Interest[];
  session: Session;
}

export function SelectInterestsModal(props: selectInterestsModalProps) {
  const [interestName, setInterestName] = useState("");
  const [interestIcon, setInterestIcon] = useState("");
  const [interestDeleted, setInterestDeleted] = useState(0);
  const [selected, setSelected] = useState<Interest[]>(props.interests);
  const [choices, setChoices] = useState<Interest[]>([]);
  const [customInterests, setCustomInterests] = useState<Interest[]>(
    props.session.user.createdInterests ?? []
  );
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [submitError, setSubmitError] = useState([false, ""]);
  const [choiceError, setChoiceError] = useState([false, ""]);
  const { theme } = useThemeStore();

  const updateInterests = trpc.user.updateInterests.useMutation({});
  const getCustomInterests = trpc.interest.getCustomUserInterests.useQuery({
    userId: props.session.userId,
  });
  const addCustomInterest = trpc.interest.createInterest.useMutation({});
  const deleteCustomInterest = trpc.interest.deleteInterest.useMutation({});

  useEffect(() => {
    if (getCustomInterests.isLoading) return;
    setCustomInterests((getCustomInterests.data as Interest[]) ?? []);
  }, [getCustomInterests.isLoading, getCustomInterests.data]);

  useMemo(() => {
    setChoices([
      ...selected,
      ...customInterests.filter(
        (interest) => !selected.some((i) => i.id == interest.id)
      ),
      ...defaultInterests.filter(
        (interest) => !selected.some((i) => i.id == interest.id)
      ),
    ]);
  }, [selected, customInterests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateInterests.mutate({ interestIds: selected.map((i) => i.id) });
    props.onComplete(selected);
  };

  const removeSelected = (interest: Interest) => {
    if (selected.some((i) => i.id == interest.id)) {
      setSelected((prev) => prev.filter((i) => i.id !== interest.id));
    }
  };

  const addSelected = (interest: Interest) => {
    if (!selected.some((i) => i.id == interest.id)) {
      setSelected((prev) => [...prev, interest]);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div
        className={styles.modalBackground}
        onClick={() => props.onComplete(selected)}
      />
      <div
        className={
          theme == "default"
            ? `${styles.modal}`
            : `${styles.modal} ${styles[`theme-${theme}`]}`
        }
      >
        <p
          className={styles.closeModalButton}
          onClick={() => props.onComplete(selected)}
        >
          <X width={45} height={45} />
        </p>
        <h1>Choose your interests</h1>
        <h4>
          Below, you can create a custom interest. If this interest is selected
          then it will be visible on your profile as well as any post with an
          affiliated task.
        </h4>
        <form className={styles.modalForm}>
          <label htmlFor="newInterestName">Create a new interest:</label>
          <div className={styles.selectInterestModalInputContainer}>
            <input
              type="text"
              id="newInterestIcon"
              name="newInterestIcon"
              className={styles.selectInterestModalIconInput}
              placeholder={choices[10]?.icon}
              required
              value={interestIcon}
              onChange={(e) => {
                const newIcon = e.target.value;
                setSubmitError([false, ""]);
                if (newIcon.length > 2) {
                  setSubmitError([
                    true,
                    "Interest icon can only be 2 character",
                  ]);
                } else {
                  setInterestIcon(newIcon);
                }
              }}
              onClick={() => setSubmitError([false, ""])}
              autoComplete="off"
            />
            <input
              type="text"
              id="newInterestName"
              name="newInterestName"
              className={styles.selectInterestModalInterestInput}
              placeholder="Interesting..."
              required
              value={interestName}
              onChange={(e) => {
                const newName = e.target.value;
                if (newName.length > 20) {
                  setSubmitError([
                    true,
                    "Interest name must be less than 20 characters",
                  ]);
                } else {
                  setSubmitError([false, ""]);
                  setInterestName(newName);
                }
              }}
              onClick={() => setSubmitError([false, ""])}
              autoComplete="off"
            />
            <button
              className={styles.selectInterestModalInterestButton}
              onClick={async (e) => {
                setSubmitError([false, ""]);
                e.preventDefault();
                const interest = await addCustomInterest.mutateAsync({
                  name: interestName,
                  icon: interestIcon,
                  colour: hsvaToHex(hsva),
                  private: false,
                });
                setCustomInterests((prev) => [interest as Interest, ...prev]);
                setInterestIcon("");
                setInterestName("");
              }}
              disabled={
                interestName.length < 1 ||
                interestName.length > 20 ||
                interestIcon.length < 1
              }
            >
              Add
            </button>
          </div>

          {submitError[0] && (
            <div className={styles.errorTooltip}>{submitError[1]}</div>
          )}
          <Fragment>
            <Wheel
              color={hsva}
              onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
            />
            <div
              style={{
                width: "100%",
                height: 34,
                marginTop: 20,
                background: hsvaToHex(hsva),
              }}
            ></div>
          </Fragment>
        </form>
        <div className={styles.selectInterestModalCustomInterestContainer}>
          <h4>Your custom interests</h4>
          {customInterests.length == 0 ? (
            <div className={styles.selectInterestModalCustomInterest}>
              No custom interests created.
            </div>
          ) : (
            customInterests.map((custom) => (
              <div
                key={custom.id}
                style={{ borderColor: custom.colour }}
                className={styles.selectInterestModalCustomInterest}
              >
                <div>
                  <p>{custom.icon}</p>
                  <p>{custom.name}</p>
                </div>
                {interestDeleted == custom.id &&
                deleteCustomInterest.isPending ? (
                  <span className={styles.loader} />
                ) : (
                  <X
                    onClick={async () => {
                      setInterestDeleted(custom.id);
                      await deleteCustomInterest.mutateAsync({ id: custom.id });
                      setCustomInterests(
                        customInterests.filter((i) => i.id != custom.id)
                      );
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <h4>
            {selected.length < 3 && (
              <>Please choose at least {3 - selected.length} more</>
            )}
            {selected.length >= 3 && (
              <>You have {10 - selected.length} choices left:</>
            )}
          </h4>
          <h5>You can have up to 10 interests.</h5>
          <div className={styles.choiceList}>
            {choices.map((interest) => (
              <button
                type="button"
                key={interest.id}
                className={`${styles.choiceButton} ${
                  selected.some((i) => i.id == interest.id)
                    ? `${styles.selectedChoiceButton}`
                    : ""
                }`}
                onClick={() => {
                  if (selected.some((i) => i.id == interest.id)) {
                    removeSelected(interest);
                    setChoiceError([false, ""]);
                  } else if (selected.length == 10) {
                    setChoiceError([
                      true,
                      "You can only select up to 10 interests",
                    ]);
                  } else {
                    addSelected(interest);
                    setChoiceError([false, ""]);
                  }
                }}
              >
                {interest.icon}
                {interest.name}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={
              selected.length < 3 ||
              selected.length > 10 ||
              submitError[0] == true ||
              choiceError[0] == true
            }
          >
            Go
          </button>
          {choiceError[0] && (
            <div className={styles.formError}>{choiceError[1]}</div>
          )}
        </form>
      </div>
    </div>
  );
}
