"use client";
import styles from "../../index.module.css";
import { type SlugUser } from "~/types/user";
import { trpc } from "~/utils/trpc";
import { AllUserPosts } from "../posts/allUserPosts";
import { useEffect, useMemo, useState } from "react";
import { defaultInterest, defaultUser } from "~/const/defaultVar";
import ProfileSlugHeader from "../profile/profileSlugHeader";
import { useParams } from "next/navigation";
import { type Interest } from "~/types/interest";
import { GainInterestModal } from "../modals";
import { type Session } from "~/types/session";
import { type Task } from "~/types/task";
import TaskListSlug from "../tasks/tasklistSlug";

interface ProfileSlugClientProps {
  session: Session;
}

export default function ProfileSlugClient(props: ProfileSlugClientProps) {
  const params = useParams();
  const slugData = params.slug;
  const [theme, setTheme] = useState("");
  const [user, setUser] = useState<SlugUser>(defaultUser as SlugUser);
  const [userInterests, setUserInterests] = useState<Interest[]>([]);

  const getUser = trpc.user.getUserById.useQuery({
    id: typeof slugData === "string" ? slugData : "",
  });

  const getInterests = trpc.user.getUserInterests.useQuery({
    userId: user.id,
  });

  const [showInterestModal, setShowInterestModal] = useState(false);
  const [sessionUserInterests, setSessionUserInterests] = useState<Interest[]>(
    []
  );
  const [newInterest, setNewInterest] = useState<Interest>(defaultInterest);
  const [usersAreFriends, setUsersAreFriends] = useState(false);

  const getSessionUserInterests = trpc.user.getUserInterests.useQuery({
    userId: props.session.user.id,
  });

  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);

  const [selectedTab, setSelectedTab] = useState<string>("post");

  const [selectedTabCount, setSelectedTabCount] = useState<[string, number]>([
    "daily",
    0,
  ]);

  const isFriend = trpc.user.IsFriend.useQuery({ userId: user.id });
  const getDailyTasks = trpc.task.getDailyTasks.useQuery(
    { userId: user.id },
    { enabled: user.id != "system" }
  );
  const getCustomTasks = trpc.task.getCustomTasks.useQuery(
    { userId: user.id },
    { enabled: user.id != "system" }
  );

  useMemo(() => {
    if (getSessionUserInterests.isLoading) return;
    setSessionUserInterests((getSessionUserInterests.data as Interest[]) ?? []);
  }, [getSessionUserInterests.isLoading, getSessionUserInterests.data]);

  useMemo(() => {
    setTheme(props.session.user.themePreset);
  }, [props.session.user.themePreset]);

  useMemo(() => {
    if (getInterests.isLoading) return;
    setUserInterests((getInterests.data as Interest[]) ?? []);
  }, [getInterests.isLoading, getInterests.data]);

  useEffect(() => {
    if (getUser.isLoading) return;
    if (getUser.data) {
      setUser(getUser.data as SlugUser);
      if (getUser.data.themePreset) {
        setTheme(getUser.data.themePreset);
      }
    }
  }, [getUser.isLoading, getUser.data]);

  useEffect(() => {
    if (isFriend.isLoading) return;
    if (isFriend.data) {
      setUsersAreFriends(isFriend.data);
    }
  }, [isFriend.isLoading, isFriend.data]);

  useEffect(() => {
    if (getDailyTasks.isLoading || user.id == "system") return;
    if (getDailyTasks.data?.length != 0) {
      setDailyTasks(getDailyTasks.data as Task[]);
    }
  }, [
    getDailyTasks.isLoading,
    getDailyTasks.data?.length,
    getDailyTasks.data,
    user.id,
  ]);

  useEffect(() => {
    if (getCustomTasks.isLoading || user.id == "system") return;
    if (getCustomTasks.data?.length != 0) {
      setCustomTasks(getCustomTasks.data as Task[]);
    }
  }, [
    getCustomTasks.isLoading,
    getCustomTasks.data?.length,
    getCustomTasks.data,
    user.id,
  ]);

  if (getUser.isLoading) {
    return (
      <main
        className={
          theme == "default"
            ? `${styles.main}`
            : `${styles.main} ${styles[`theme-${theme}`]}`
        }
      >
        <div className={styles.container}>
          <div className={styles.profilePostContainer}>
            <h1 className={styles.opusText}>Loading...</h1>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main
        className={
          theme == "default"
            ? `${styles.main}`
            : `${styles.main} ${styles[`theme-${theme}`]}`
        }
      >
        <div className={styles.container}>
          <ProfileSlugHeader
            user={user}
            sessionUser={props.session.user}
            userInterests={userInterests}
          />
          <br />
          <div className={styles.profilePostContainer}>
            {user.private && !usersAreFriends ? (
              <h2 className={styles.opusText}>Private user.</h2>
            ) : (
              <>
                {!user.tasksPrivate && (
                  <div className={styles.profileTabContainer}>
                    <button
                      onClick={() => {
                        setSelectedTab("post");
                      }}
                    >
                      Posts
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTab("task");
                      }}
                    >
                      Tasks
                    </button>
                  </div>
                )}
                {selectedTab == "post" ? (
                  <AllUserPosts
                    setNewInterest={setNewInterest}
                    setShowInterestModal={setShowInterestModal}
                    userId={user.id}
                    isFriend={usersAreFriends}
                    isPrivate={user.private}
                  />
                ) : (
                  <TaskListSlug
                    setSelectedTab={setSelectedTabCount}
                    selectedTab={selectedTabCount}
                    dailyTasks={dailyTasks}
                    customTasks={customTasks}
                  />
                )}
              </>
            )}
          </div>
        </div>
        {showInterestModal && (
          <GainInterestModal
            interest={newInterest}
            userId={props.session.user.id}
            onComplete={() => setShowInterestModal(false)}
            userInterests={sessionUserInterests}
          />
        )}
      </main>
    );
  }
}
