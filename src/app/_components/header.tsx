"use client";
import styles from "../index.module.css";
import Image from "next/image";
import { NotificationsModal, SettingsModal } from "./modals";
import { useEffect, useMemo, useState } from "react";
import { useThemeStore } from "~/store/themeStore";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "~/utils/trpc";
import { CookieConsent } from "./cookieConsentBanner";
import { type Notification } from "~/types/notification";

interface HeaderProps {
  theme: string;
  userId: string;
  userPrivate: boolean;
  userTasksPrivate: boolean;
  page?: string;
}

export function Header(props: HeaderProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme } = useThemeStore();

  const getNotifications = trpc.notification.getNotifications.useQuery(
    {
      userId: props.userId,
    },
    {
      retry: (_count, err) => {
        // `onError` only runs once React Query stops retrying
        if (err.data?.code === "UNAUTHORIZED") {
          void router.push("/");
        }
        return true;
      },
    }
  );

  useMemo(() => {
    setShowCookieConsent(localStorage.getItem("cookie_consent") == null);
  }, []);

  useEffect(() => {
    if (getNotifications.isLoading) return;
    if (getNotifications.data?.length != 0) {
      setNotifications(getNotifications.data as Notification[]);
      if (getNotifications.data)
        setUnreadNotifications(getNotifications.data?.some((n) => !n.read));
    }
  }, [
    getNotifications.isLoading,
    getNotifications.data?.length,
    getNotifications.data,
    notifications,
    unreadNotifications,
  ]);

  useEffect(() => {
    if (theme === "unset") {
      setTheme(props.theme);
    } else setTheme(theme);
  }, [theme, props.theme, setTheme]);

  return (
    <div
      className={
        theme === "default"
          ? `${styles.header}`
          : `${styles.header} ${styles[`theme-${theme}`]}`
      }
    >
      <div className={styles.logo}>Opus</div>
      {props.userId != "null" && (
        <div className={styles.navIcons}>
          <Image
            src={
              unreadNotifications
                ? "/images/bell-unread.png"
                : "/images/bell.png"
            }
            alt={""}
            width={25}
            height={25}
            onClick={() => setShowNotifications(true)}
          />
          <Image
            src="/images/setting.png"
            alt={""}
            width={25}
            height={25}
            onClick={() => setShowSettings(true)}
          />
          {showNotifications && (
            <NotificationsModal
              onComplete={() => setShowNotifications(false)}
              notifications={notifications}
            />
          )}
          {showSettings && (
            <SettingsModal
              onComplete={() => setShowSettings(false)}
              userPrivate={props.userPrivate}
              userTasksPrivate={props.userTasksPrivate}
            />
          )}
        </div>
      )}
      {showCookieConsent && <CookieConsent />}
    </div>
  );
}

export function SlugHeader(props: HeaderProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("");
  const params = useParams();
  const slugData = params.slug;

  const getUser = trpc.user.getUserById.useQuery({
    id: typeof slugData === "string" ? slugData : "",
  });

  const getNotifications = trpc.notification.getNotifications.useQuery(
    {
      userId: props.userId,
    },
    {
      retry: (_count, err) => {
        // `onError` only runs once React Query stops retrying
        if (err.data?.code === "UNAUTHORIZED") {
          void router.push("/");
        }
        return true;
      },
    }
  );

  useMemo(() => {
    setShowCookieConsent(localStorage.getItem("cookie_consent") == null);
  }, []);

  useEffect(() => {
    if (getNotifications.isLoading) return;
    if (getNotifications.data?.length != 0) {
      setNotifications(getNotifications.data as Notification[]);
      if (getNotifications.data)
        setUnreadNotifications(getNotifications.data.some((n) => !n.read));
    }
  }, [
    getNotifications.isLoading,
    getNotifications.data?.length,
    getNotifications.data,
  ]);

  useMemo(() => {
    setTheme(props.theme);
  }, [props.theme]);

  useEffect(() => {
    if (getUser.isLoading) return;
    if (getUser.data && getUser.data.themePreset) {
      setTheme(getUser.data.themePreset);
    }
  }, [getUser.isLoading, getUser.data, setTheme]);

  return (
    <div
      className={
        theme === "default"
          ? `${styles.header}`
          : `${styles.header} ${styles[`theme-${theme}`]}`
      }
    >
      <div className={styles.logo}>Opus</div>
      {props.userId != "null" && (
        <div className={styles.navIcons}>
          <Image
            src={
              unreadNotifications
                ? "/images/bell-unread.png"
                : "/images/bell.png"
            }
            alt={""}
            width={25}
            height={25}
            onClick={() => setShowNotifications(true)}
          />

          <Image
            src="/images/setting.png"
            alt={""}
            width={25}
            height={25}
            onClick={() => setShowSettings(true)}
          />
          {showNotifications && (
            <NotificationsModal
              onComplete={() => setShowNotifications(false)}
              notifications={notifications}
            />
          )}
          {showSettings && (
            <SettingsModal
              onComplete={() => setShowSettings(false)}
              userPrivate={props.userPrivate}
              userTasksPrivate={props.userTasksPrivate}
            />
          )}
        </div>
      )}
      {showCookieConsent && <CookieConsent />}
    </div>
  );
}
