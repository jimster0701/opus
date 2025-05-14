import styles from "../index.module.css";
import { useMemo, useState, Fragment, useEffect } from "react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";
import { trpc } from "../../utils/trpc";
import "~/styles/themes.css";
import { useThemeStore } from "~/store/themeStore";
import { SignOutButton } from "./settings/signOutButton";
import {
  Check,
  Home,
  PlusCircle,
  Search,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { type SimpleUser, type SlugUser, type User } from "~/types/user";
import { ProfilePicturePreviewWrapper } from "./images/cldImageWrapper";
import { defaultInterests } from "~/const/defaultVar";
import { type Interest } from "~/types/interest";
import { api } from "~/trpc/react";
import { type Session } from "~/types/session";
import { NotificationType, type Notification } from "~/types/notification";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AboutUsInnerModal } from "./innerModals";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

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

export function AboutUsModal(props: modalProps) {
  const [interestIcon, setInterestIcon] = useState("");
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} />
      <div className={`${styles.modal} ${styles.AboutUsInnerContainer}`}>
        <p className={styles.closeModalButton} onClick={props.onComplete}>
          <X width={45} height={45} />
        </p>
        <AboutUsInnerModal />
        <br />
        <h1>Help</h1>
        <br />
        <div className={styles.helpContainer}>
          <div>
            <Home size={20} />
            <p>Home</p>
          </div>
          <div className={styles.helpContentContainer}>
            <p>
              On the home page you can find your generated tasks and your custom
              tasks. Here you can also edit your custom tasks and set any task
              as complete.
            </p>
          </div>
        </div>
        <div className={styles.helpContainer}>
          <div>
            <Search size={20} />
            <p>Discover</p>
          </div>
          <div className={styles.helpContentContainer}>
            <p>
              {
                "The discover page is all about other user's posts, choose from your friends posts or discover"
              }
              {
                ", which will show you posts from other user's that include one or more of your interests."
              }
            </p>
            <div className={styles.discoverTabContainer}>
              <button>Friends posts</button>
              <button>Discover posts</button>
            </div>
          </div>
        </div>
        <div className={styles.helpContainer}>
          <div>
            <PlusCircle size={20} />
            <p>Create</p>
          </div>
          <div className={styles.helpContentContainer}>
            <p>
              On the create page you can create your own custom tasks and also
              create posts based on your recent tasks.
            </p>
          </div>
        </div>
        <div className={styles.helpContainer}>
          <div>
            <Users size={20} />
            <p>Friends</p>
          </div>
          <div className={styles.helpContentContainer}>
            <p>
              The friends page is a simple shortcut to your friends, users you
              follow and that follow you.
            </p>
          </div>
        </div>
        <div className={styles.helpContainer}>
          <div>
            <UserIcon size={20} />
            <p>Profile</p>
          </div>
          <div className={styles.helpContentContainer}>
            <p>
              The profile page gives you control of account personalisation,
              where you can edit you profile picture, display name, create
              custom interests, select interests and edit your posts.
            </p>
          </div>
        </div>
        <p>
          When creating a task, post or interest you will need to fill out all
          areas with your own flare.
        </p>
        <p>
          For example, to create a custom interest you must enter an emoji or
          two characters as the icon. As well as the name and glow of your
          interest.
        </p>
        <form className={styles.modalForm}>
          <div className={styles.selectInterestModalInputContainer}>
            <input
              type="text"
              id="interestIcon"
              value={interestIcon}
              onChange={(e) => {
                if (e.target.value.length <= 2) {
                  setInterestIcon(e.target.value);
                }
              }}
              className={styles.selectInterestModalIconInput}
              placeholder="🔮"
              required
            />
            <input
              type="text"
              id="interestName"
              className={styles.selectInterestModalInterestInput}
              placeholder="Interesting..."
              required
            />
            <button
              onClick={(e) => e.preventDefault()}
              className={styles.selectInterestModalInterestButton}
            >
              Add
            </button>
          </div>
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
            />
          </Fragment>
        </form>
      </div>
    </div>
  );
}

interface firstLoginModalProps {
  displayName: string | null;
}

export function FirstLoginModal(props: firstLoginModalProps) {
  const [closed, setClosed] = useState(false);
  if (!closed && !props.displayName)
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalBackground} />
        <div className={styles.modal}>
          <p
            className={styles.closeModalButton}
            onClick={() => setClosed(true)}
          >
            <X width={45} height={45} />
          </p>
          <h1>Welcome new user</h1>
          <p className={styles.showcaseText}>
            {
              "You've been invited to be a part of the first and only trial testing of Opus."
            }
          </p>
          <p className={styles.showcaseText}>
            You are free to use the app until the 23rd of May, after which I
            will start to limit access.
          </p>
          <p className={styles.showcaseText}>
            The main purpose of this trial is data collection for my
            dissertation.
            <br />
            The survey can be found in the settings page at the bottom, {
              "I'd"
            }{" "}
            be very gratful if you answered it after having a look around the
            app.
          </p>
          <p className={styles.showcaseText}>
            Also in the settings page there is a message box, this space is
            intended to be used as a bug report, opinions and reviews system for
            the app, so feel free to use it as you wish.
          </p>
          <p className={styles.showcaseText}>
            Thank you for reading and for trying Opus :)
          </p>
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

export function DeleteReplyModal(props: deleteModalProps) {
  const deleteReply = api.reply.deleteReply.useMutation();
  return (
    <div className={styles.modalContainer}>
      <div
        className={styles.modalBackground}
        onClick={() => props.onComplete(false)}
      />
      <div className={styles.modal}>
        <h1>Are you sure you want to delete this reply:</h1>
        <h2>{props.name}?</h2>
        <div className={styles.taskUpdateControls}>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={async () => {
              try {
                deleteReply.mutate({ id: props.id });
                props.onComplete(true);
                toast.success("Deleted reply!");
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

export function RemoveCookiesModal(props: modalProps) {
  const handleCookieReset = async () => {
    localStorage.removeItem("cookie_consent");
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} onClick={props.onComplete} />
      <div className={styles.modal}>
        <h1>Are you sure you want to revoke your cookie acception?</h1>
        <h2>
          You will be asked to accept again to allow non-essential cookies.
        </h2>
        <br />
        <div className={styles.taskUpdateControls}>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={async () => {
              try {
                handleCookieReset().catch((error) => console.error(error));
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
            onClick={() => props.onComplete()}
          >
            No <X />
          </button>
        </div>
      </div>
    </div>
  );
}

interface completeTaskModalProps extends deleteModalProps {
  icon: string;
}

export function CompleteTaskModal(props: completeTaskModalProps) {
  const completeTask = api.task.completeTask.useMutation();
  return (
    <div className={styles.modalContainer}>
      <div
        className={styles.modalBackground}
        onClick={() => props.onComplete(false)}
      />
      <div className={styles.modal}>
        <h1>Would you like to complete this task?</h1>
        <h2>
          {props.icon}
          {props.name}
        </h2>
        <br />
        <div className={styles.taskUpdateControls}>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={() => {
              try {
                completeTask.mutate({ id: props.id, value: true });
                props.onComplete(true);
                toast.success("Task Completed!");
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

export function UncompleteTaskModal(props: completeTaskModalProps) {
  const completeTask = api.task.completeTask.useMutation();
  return (
    <div className={styles.modalContainer}>
      <div
        className={styles.modalBackground}
        onClick={() => props.onComplete(true)}
      />
      <div className={styles.modal}>
        <h1>Do you want to uncomplete this task?</h1>
        <h2>
          {props.icon}
          {props.name}
        </h2>
        <br />
        <div className={styles.taskUpdateControls}>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={() => {
              try {
                completeTask.mutate({ id: props.id, value: false });
                props.onComplete(false);
                toast.success("Task Uncompleted!");
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Yes <Check />
          </button>
          <button
            className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
            onClick={() => props.onComplete(true)}
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

  const notifyUser = trpc.notification.createInterestNotification.useMutation();

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
                  notifyUser.mutate({
                    userId: props.interest.createdById,
                    interestId: props.interest.id,
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

export function PrivacyPolicyModal(props: modalProps) {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} onClick={props.onComplete} />
      <div className={styles.modal}>
        <p className={styles.closeModalButton} onClick={props.onComplete}>
          <X width={45} height={45} />
        </p>
        <h1>Privacy Policy</h1>
        <p>
          <strong>Effective Date:</strong> 05/05/2025
          <br />
          <strong>Last Updated:</strong> 05/05/2025
        </p>

        <h2>1. Who We Are</h2>
        <p>
          Opus is a social productivity platform designed to help users create
          and manage tasks, connect with friends, and share content based around
          being productive. Opus and its creator are the data controller
          responsible for handling your personal data in accordance with the UK
          GDPR and other relevant data protection laws.
        </p>
        <p>
          For any privacy-related questions or requests, you can contact us at:{" "}
          <a href="mailto:jimmypm0701@gmail.com">jimmypm0701@gmail.com</a>
        </p>

        <h2>2. What Data We Collect</h2>
        <ul>
          <li>Display name, name, email, profile image (via Google)</li>
          <li>Posts, comments, replies, images, interests, likes, followers</li>
          <li>Tasks you create or are assigned</li>
          <li>Session data via Google OAuth</li>
          <li>Issue reports you submit</li>
        </ul>
        <p>
          <strong>Note:</strong> We do not store passwords. Google OAuth handles
          authentication.
        </p>

        <h2>3. Why We Collect Your Data</h2>
        <ul>
          <li>To enable social media features</li>
          <li>To generate personalized tasks based on interests</li>
          <li>To show and store content you create</li>
          <li>To improve and maintain the service</li>
        </ul>

        <h2>4. Legal Basis for Processing</h2>
        <ul>
          <li>Contract: To provide app functionality</li>
          <li>Legitimate Interests: Improve, secure, and operate the app</li>
          <li>Consent: For optional features</li>
          <li>Legal Obligation: As required under UK law</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>
          Your data is stored until you delete your account. Inactive accounts
          may be removed after 12 months.
        </p>

        <h2>6. Third-Party Services We Use</h2>
        <ul>
          <li>Vercel - Hosting and serverless infrastructure</li>
          <li>Prisma - Data ORM layer</li>
          <li>T3 Stack / Next.js - App framework</li>
          <li>Neon - PostgreSQL database</li>
          <li>Cloudinary - Image hosting and delivery</li>
          <li>Google - Authentication via OAuth</li>
        </ul>

        <h2>7. Your Rights Under UK GDPR</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your data</li>
          <li>Receive a portable copy of your data</li>
          <li>Restrict or object to processing</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <strong>
            <a href="mailto:jimmypm0701@gmail.com">jimmypm0701@gmail.com</a>
          </strong>
          .
        </p>

        <h2>8. Cookies & Tracking</h2>
        <p>
          We may use cookies to store session data. You will be asked to consent
          to non-essential cookies.
        </p>

        <h2>9. Data Security</h2>
        <ul>
          <li>All communication is secured via HTTPS</li>
          <li>Tokens and sessions are securely handled</li>
          <li>No passwords are stored</li>
        </ul>

        <h2>10. Policy Updates</h2>
        <p>
          We may update this policy from time to time. Significant changes will
          be communicated through the app or by email.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          📧 <strong>Email:</strong>{" "}
          <a href="mailto:jimmypm0701@gmail.com">jimmypm0701@gmail.com</a>
        </p>
      </div>
    </div>
  );
}

export function SurveyModal(props: modalProps) {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground} onClick={props.onComplete} />
      <div className={styles.modal}>
        <p className={styles.closeModalButton} onClick={props.onComplete}>
          <X width={45} height={45} />
        </p>
        <h2>Survey shortcut</h2>
        <h3>Opens - 09/05/2025</h3>
        <h3>Closes - 22/05/2025</h3>
        <iframe
          className={styles.surveyIframe}
          src="https://app.onlinesurveys.jisc.ac.uk/s/bournemouth/opus-trail-tester-questionnaire"
        />
      </div>
    </div>
  );
}

interface settingsModalProps extends modalProps {
  userPrivate: boolean;
  userTasksPrivate: boolean;
}

export function SettingsModal(props: settingsModalProps) {
  const { theme, setTheme } = useThemeStore();
  const [profilePrivate, setProfilePrivate] = useState(props.userPrivate);
  const [profileTaskPrivate, setProfileTaskPrivate] = useState(
    props.userTasksPrivate
  );
  const [showSurvey, setShowSurvey] = useState(false);
  const [showRemoveCookies, setShowRemoveCookies] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
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
              Friends only profile:
              <br />
              {"(Hide everything)"}
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
            <p>Hide tasks on profile:</p>
            <input
              type="checkbox"
              checked={profileTaskPrivate}
              onChange={(e) => {
                setProfileTaskPrivate(e.target.checked);
                updateTasksPrivateSetting.mutate({
                  tasksPrivate: e.target.checked,
                });
              }}
              disabled={profilePrivate}
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
        <p onClick={() => setShowSurvey(true)}>Answer survey</p>
        <p onClick={() => setShowPrivacyPolicy(true)}>Privacy Policy</p>
        <p onClick={() => setShowRemoveCookies(true)}>
          Revoke Cookie acception
        </p>
        <p></p>
        {showSurvey && <SurveyModal onComplete={() => setShowSurvey(false)} />}
        {showPrivacyPolicy && (
          <PrivacyPolicyModal onComplete={() => setShowPrivacyPolicy(false)} />
        )}
        {showRemoveCookies && (
          <RemoveCookiesModal onComplete={() => setShowRemoveCookies(false)} />
        )}
      </div>
    </div>
  );
}

interface notificationModalProps extends modalProps {
  notifications: Notification[];
}

export function NotificationsModal(props: notificationModalProps) {
  const { theme } = useThemeStore();
  const router = useRouter();
  const markAsRead = trpc.notification.markNotificationsAsRead.useMutation();
  useEffect(() => {
    if (props.notifications.some((n) => !n.read)) {
      markAsRead.mutate();
    }
  });

  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "1s",
      m: "1m",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
      d: "1d",
      dd: "%dd",
      M: "1mo",
      MM: "%dmo",
      y: "1y",
      yy: "%dy",
    },
  });

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
        <h2>Notifications</h2>
        {props.notifications.length == 0 && <h3>No notifications yet.</h3>}
        {props.notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${styles.cardContainer} ${styles.notificationContainer}`}
            onClick={() => {
              router.push(`/profile/${notification.fromUserId}`);
            }}
          >
            <div className={styles.notificationContentContainer}>
              <ProfilePicturePreviewWrapper
                id={notification.fromUserId}
                imageUrl={notification.fromUser.image}
                width={10}
                height={10}
              />
              {notification.type == NotificationType.FOLLOW && (
                <p>{notification.fromUser.displayName} has followed you!</p>
              )}
              {notification.type == NotificationType.LIKE_COMMENT && (
                <p>{notification.fromUser.displayName} liked your comment!</p>
              )}
              {notification.type == NotificationType.LIKE_REPLY && (
                <p>{notification.fromUser.displayName} liked your reply!</p>
              )}
              {notification.type == NotificationType.LIKE_POST && (
                <p>{notification.fromUser.displayName} liked your post!</p>
              )}
              {notification.type == NotificationType.TAKE_INTEREST && (
                <p>
                  {notification.fromUser.displayName} borrowed your interest!
                </p>
              )}
              {notification.type == NotificationType.BUG_REPORT && (
                <p>
                  {notification.fromUser.displayName} sent a message in reports!
                </p>
              )}
            </div>
            <p>{dayjs(notification.createdAt).fromNow()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface newUserModalProps extends modalProps {
  user: User;
}

export function NewUserModal(props: newUserModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [selected, setSelected] = useState<Interest[]>([]);
  const [choices, setChoices] = useState<Interest[]>([]);
  const [submitError, setSubmitError] = useState(["", ""]);
  const [choiceError, setChoiceError] = useState([false, ""]);
  const [interestName, setInterestName] = useState("");
  const [interestIcon, setInterestIcon] = useState("");
  const [interestPrivate, setInterestPrivate] = useState(false);
  const [interestDeleted, setInterestDeleted] = useState(0);
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
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

  const [customInterests, setCustomInterests] = useState<Interest[]>(
    props.user.createdInterests ?? []
  );

  const addCustomInterest = trpc.interest.createInterest.useMutation({});
  const deleteCustomInterest = trpc.interest.deleteInterest.useMutation({});

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

  const updateInterests = trpc.user.updateInterests.useMutation({});
  const updateDisplayName = trpc.user.updateDisplayName.useMutation({
    onSuccess: () => {
      props.onComplete();
    },
  });

  const updateThemePreset = trpc.user.updateThemePreset.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateInterests.mutate({ interestIds: selected.map((i) => i.id) });
    updateDisplayName.mutate({ newDisplayName: displayName });
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
      <div className={styles.modalBackground} />
      <div
        className={
          theme == "default"
            ? `${styles.modal}`
            : `${styles.modal} ${styles[`theme-${theme}`]}`
        }
      >
        <h1>Welcome to Opus</h1>
        <p>
          Please complete your profile.
          <br />
          {"Don't worry, all choices can be edited later."}
        </p>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label htmlFor="newDisplayName">Choose your display name:</label>
          <input
            type="text"
            id="newDisplayName"
            name="newDisplayName"
            placeholder="Username"
            value={displayName}
            onChange={(e) => {
              const newName = e.target.value;
              if (newName.length > 20) {
                setSubmitError([
                  "display",
                  "Display name must be less than 20 characters",
                ]);
              } else {
                setSubmitError(["", ""]);
                setDisplayName(newName);
              }
            }}
            autoComplete="off"
          />
          {submitError[0] == "display" && (
            <div className={styles.errorTooltip}>{submitError[1]}</div>
          )}
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
          <h3 className={styles.modalText}>
            Below you can select or create your own custom interests, <br />
            Choose at least 3 and a maximum of 15
            <br />
            <br />
            These choices will influence the tasks you receive and the social
            circles you can discover.
            <br />
          </h3>
          <div className={styles.modalForm}>
            <label htmlFor="newInterestName">Create a new interest:</label>
            <div className={styles.selectInterestModalInputContainer}>
              <input
                type="text"
                id="newInterestIcon"
                name="newInterestIcon"
                className={styles.selectInterestModalIconInput}
                placeholder={"Icon"}
                value={interestIcon}
                onChange={(e) => {
                  const newIcon = e.target.value;
                  setSubmitError(["", ""]);
                  const emojiRegex =
                    /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/;
                  if (!RegExp(emojiRegex).test(newIcon) && newIcon != "") {
                    setSubmitError(["interest", "The Icon must be one emoji"]);
                  } else {
                    setInterestIcon(newIcon);
                  }
                }}
                onClick={() => setSubmitError(["", ""])}
                autoComplete="off"
              />
              <input
                type="text"
                id="newInterestName"
                name="newInterestName"
                className={styles.selectInterestModalInterestInput}
                placeholder="Interesting..."
                value={interestName}
                onChange={(e) => {
                  const newName = e.target.value;
                  if (newName.length > 20) {
                    setSubmitError([
                      "interest",
                      "Interest name must be less than 20 characters",
                    ]);
                  } else {
                    setSubmitError(["", ""]);
                    setInterestName(newName);
                  }
                }}
                onClick={() => setSubmitError(["", ""])}
                autoComplete="off"
              />
              <button
                className={styles.selectInterestModalInterestButton}
                onClick={async (e) => {
                  e.preventDefault();
                  setSubmitError(["", ""]);
                  if (interestIcon.length == 0) {
                    setSubmitError([
                      "interest",
                      "Icon must be present to create",
                    ]);
                    return;
                  }
                  if (interestName.length == 0) {
                    setSubmitError([
                      "interest",
                      "Interest name must be filled to create the interest",
                    ]);
                    return;
                  }

                  const interest = await addCustomInterest.mutateAsync({
                    name: interestName,
                    icon: interestIcon,
                    colour: hsvaToHex(hsva),
                    private: interestPrivate,
                  });
                  setCustomInterests((prev) => [interest as Interest, ...prev]);
                  setInterestIcon("");
                  setInterestName("");
                }}
                disabled={interestName.length < 1 || interestName.length > 20}
              >
                Add
              </button>
              <br />
            </div>
            <div className={styles.selectInterestModalPrivateContainer}>
              <p>Make this interest friends only:</p>
              <input
                type="checkbox"
                checked={interestPrivate}
                onChange={(e) => setInterestPrivate(e.target.checked)}
              />
            </div>

            {submitError[0] == "interest" && (
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
          </div>
          <div className={styles.selectInterestModalCustomInterestContainer}>
            <h2>Your custom interests</h2>
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
                        await deleteCustomInterest.mutateAsync({
                          id: custom.id,
                        });
                        setSelected(selected.filter((i) => i.id != custom.id));
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
          <h4>
            {selected.length < 3 && (
              <>Please choose at least {3 - selected.length} more</>
            )}
            {selected.length >= 3 && (
              <>You have {15 - selected.length} choices left:</>
            )}
          </h4>
          <h5>You can have up to 15 interests.</h5>
          <div className={styles.choiceList}>
            {choices.map((interest) => (
              <button
                type="button"
                key={interest.id}
                className={`${styles.choiceButton} ${
                  selected.includes(interest)
                    ? `${styles.selectedChoiceButton}`
                    : ""
                }`}
                onClick={() => {
                  if (selected.includes(interest)) {
                    removeSelected(interest);
                    setChoiceError([false, ""]);
                  } else if (selected.length > 15) {
                    setChoiceError([
                      true,
                      "You can only select up to 15 interests",
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
              selected.length > 15 ||
              submitError[0] == "display" ||
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
  const [interestPrivate, setInterestPrivate] = useState(false);
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
        <h1>Create and choose your interests</h1>
        <h4>
          Below, you can create a custom interest. When selected the interest
          will be visible on your profile as well as any task or post affiliated
          with the interest.
        </h4>
        <form className={styles.modalForm}>
          <label htmlFor="newInterestName">Create a new interest:</label>
          <div className={styles.selectInterestModalInputContainer}>
            <input
              type="text"
              id="newInterestIcon"
              name="newInterestIcon"
              className={styles.selectInterestModalIconInput}
              placeholder={"Icon"}
              required
              value={interestIcon}
              onChange={(e) => {
                const newIcon = e.target.value;
                setSubmitError([false, ""]);
                const emojiRegex =
                  /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/;
                if (!RegExp(emojiRegex).test(newIcon) && newIcon != "") {
                  setSubmitError([true, "Interest icon must be one emoji"]);
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
                if (interestIcon.length == 0) return;
                e.preventDefault();
                const interest = await addCustomInterest.mutateAsync({
                  name: interestName,
                  icon: interestIcon,
                  colour: hsvaToHex(hsva),
                  private: interestPrivate,
                });
                setCustomInterests((prev) => [interest as Interest, ...prev]);
                setInterestIcon("");
                setInterestName("");
              }}
              disabled={interestName.length < 1 || interestName.length > 20}
            >
              Add
            </button>
            <br />
          </div>
          <div className={styles.selectInterestModalPrivateContainer}>
            <p>Make this interest friends only:</p>
            <input
              type="checkbox"
              checked={interestPrivate}
              onChange={(e) => setInterestPrivate(e.target.checked)}
            />
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
          <h2>Your custom interests</h2>
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
                      setSelected(selected.filter((i) => i.id != custom.id));
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
          <h2>Your selected interests</h2>
          <h4>
            {selected.length < 3 && (
              <>Please choose at least {3 - selected.length} more</>
            )}
            {selected.length >= 3 && (
              <>You have {15 - selected.length} choices left:</>
            )}
          </h4>
          <h5>You can have up to 15 interests.</h5>
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
                  } else if (selected.length == 15) {
                    setChoiceError([
                      true,
                      "You can only select up to 15 interests",
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
              selected.length > 15 ||
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
