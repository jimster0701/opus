"use client";
import styles from "../../index.module.css";
import { type User, type SlugUser } from "~/types/user";
import { trpc } from "~/utils/trpc";
import { AllUserPosts } from "../posts/allUserPosts";
import { useEffect, useMemo, useState } from "react";
import { defaultInterest, defaultUser } from "~/const/defaultVar";
import ProfileSlugHeader from "../profile/profileSlugHeader";
import { useParams } from "next/navigation";
import { type Interest } from "~/types/interest";
import { GainInterestModal } from "../modals";

interface ProfileSlugClientProps {
  sessionUser: User;
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

  const getSessionUserInterests = trpc.user.getUserInterests.useQuery({
    userId: props.sessionUser.id,
  });

  useMemo(() => {
    if (getSessionUserInterests.isLoading) return;
    setSessionUserInterests((getSessionUserInterests.data as Interest[]) ?? []);
  }, [getSessionUserInterests.isLoading, getSessionUserInterests.data]);

  useMemo(() => {
    setTheme(props.sessionUser.themePreset);
  }, [props.sessionUser.themePreset]);

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
  }
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
          sessionUser={props.sessionUser}
          userInterests={userInterests}
        />
        <br />
        <div className={styles.profilePostContainer}>
          <AllUserPosts
            setNewInterest={setNewInterest}
            setShowInterestModal={setShowInterestModal}
            userId={user.id}
            sessionUser={props.sessionUser}
          />
        </div>
      </div>
      {showInterestModal && (
        <GainInterestModal
          interest={newInterest}
          userId={props.sessionUser.id}
          onComplete={() => setShowInterestModal(false)}
          userInterests={sessionUserInterests}
        />
      )}
    </main>
  );
}
