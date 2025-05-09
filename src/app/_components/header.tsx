"use client";
import styles from "../index.module.css";
import Image from "next/image";
import { AboutUsModal, NotificationsModal, SettingsModal } from "./modals";
import { useEffect, useState } from "react";
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
  const [showAboutUs, setShowAboutUs] = useState(false);
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

  useEffect(() => {
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
      <div
        className={styles.logo}
        onClick={() => {
          setShowAboutUs(true);
        }}
      >
        Opus
      </div>
      {props.userId != "null" && (
        <div className={styles.navIcons}>
          <div className={styles.notificationContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setShowNotifications(true)}
              width="25px"
              height="25px"
              viewBox="0 0 25 25"
              version="1.1"
            >
              <g id="surface1">
                <path
                  style={{ fill: "var(--text-primary)" }}
                  d="M 12.492188 -0.015625 C 12.550781 -0.015625 12.609375 -0.015625 12.671875 -0.0195312 C 12.980469 0.015625 13.179688 0.15625 13.378906 0.390625 C 13.613281 0.75 13.597656 1.070312 13.585938 1.488281 C 13.585938 1.550781 13.585938 1.617188 13.582031 1.679688 C 13.582031 1.835938 13.578125 1.992188 13.574219 2.148438 C 13.601562 2.152344 13.628906 2.152344 13.660156 2.15625 C 15.386719 2.328125 17.042969 3.347656 18.152344 4.65625 C 19.257812 6.074219 19.835938 7.683594 19.839844 9.484375 C 19.839844 9.613281 19.839844 9.742188 19.839844 9.871094 C 19.84375 10.238281 19.84375 10.605469 19.847656 10.972656 C 19.855469 12.996094 20 14.914062 21.335938 16.554688 C 21.359375 16.582031 21.382812 16.609375 21.40625 16.636719 C 21.664062 16.957031 21.929688 17.25 22.234375 17.519531 C 22.644531 17.882812 22.914062 18.273438 22.964844 18.824219 C 22.980469 19.386719 22.875 19.824219 22.511719 20.261719 C 22.109375 20.667969 21.667969 20.851562 21.097656 20.867188 C 20.964844 20.867188 20.835938 20.867188 20.703125 20.867188 C 20.628906 20.867188 20.554688 20.867188 20.480469 20.871094 C 20.277344 20.871094 20.078125 20.871094 19.875 20.871094 C 19.65625 20.871094 19.441406 20.871094 19.222656 20.871094 C 18.796875 20.871094 18.371094 20.871094 17.941406 20.871094 C 17.597656 20.871094 17.25 20.871094 16.902344 20.871094 C 16.855469 20.871094 16.804688 20.871094 16.753906 20.871094 C 16.652344 20.871094 16.554688 20.871094 16.453125 20.871094 C 15.511719 20.871094 14.574219 20.871094 13.632812 20.871094 C 12.773438 20.871094 11.914062 20.871094 11.054688 20.871094 C 10.167969 20.875 9.285156 20.875 8.402344 20.875 C 7.90625 20.875 7.410156 20.875 6.914062 20.875 C 6.492188 20.875 6.070312 20.875 5.648438 20.875 C 5.433594 20.875 5.21875 20.875 5.003906 20.875 C 4.808594 20.875 4.609375 20.875 4.414062 20.875 C 4.34375 20.875 4.269531 20.875 4.199219 20.875 C 3.539062 20.878906 3.03125 20.75 2.554688 20.28125 C 2.113281 19.796875 2.066406 19.289062 2.089844 18.660156 C 2.132812 18.140625 2.488281 17.75 2.867188 17.429688 C 4.175781 16.300781 5 14.625 5.140625 12.902344 C 5.144531 12.835938 5.148438 12.769531 5.152344 12.703125 C 5.15625 12.648438 5.15625 12.648438 5.160156 12.59375 C 5.179688 12.230469 5.183594 11.871094 5.183594 11.507812 C 5.1875 11.390625 5.1875 11.273438 5.1875 11.152344 C 5.191406 10.820312 5.195312 10.484375 5.195312 10.152344 C 5.195312 9.945312 5.199219 9.738281 5.199219 9.53125 C 5.199219 9.453125 5.203125 9.378906 5.203125 9.300781 C 5.203125 8.582031 5.277344 7.871094 5.507812 7.1875 C 5.519531 7.148438 5.535156 7.109375 5.546875 7.070312 C 5.660156 6.734375 5.796875 6.417969 5.957031 6.101562 C 5.984375 6.050781 6.007812 6 6.035156 5.949219 C 6.382812 5.269531 6.835938 4.691406 7.375 4.148438 C 7.417969 4.105469 7.464844 4.058594 7.507812 4.011719 C 8.484375 3.074219 10.078125 2.148438 11.476562 2.148438 C 11.472656 2.105469 11.472656 2.0625 11.472656 2.019531 C 11.464844 1.863281 11.464844 1.703125 11.460938 1.542969 C 11.460938 1.476562 11.457031 1.40625 11.457031 1.339844 C 11.433594 0.601562 11.433594 0.601562 11.71875 0.292969 C 11.96875 0.0585938 12.152344 -0.015625 12.492188 -0.015625 Z M 12.492188 -0.015625 "
                />
                <path
                  style={{
                    fill: "var(--text-primary)",
                  }}
                  d="M 8.640625 21.875 C 11.1875 21.875 13.734375 21.875 16.359375 21.875 C 16.222656 22.542969 16.007812 23.058594 15.578125 23.585938 C 15.542969 23.625 15.511719 23.667969 15.476562 23.710938 C 14.914062 24.378906 14.011719 24.902344 13.132812 25 C 11.964844 25.074219 10.882812 24.910156 9.96875 24.121094 C 9.933594 24.089844 9.898438 24.054688 9.863281 24.023438 C 9.832031 23.996094 9.796875 23.96875 9.765625 23.9375 C 9.175781 23.394531 8.796875 22.652344 8.640625 21.875 Z M 8.640625 21.875 "
                />
              </g>
            </svg>

            {unreadNotifications && (
              <div className={styles.unreadNotificationIcon} />
            )}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setShowSettings(true)}
            width="25px"
            height="25px"
            viewBox="0 0 25 25"
            version="1.1"
          >
            <g id="surface1">
              <path
                style={{ fill: "var(--text-primary)" }}
                d="M 9.09375 1.375 C 9.136719 1.375 9.175781 1.378906 9.21875 1.378906 C 9.660156 1.484375 9.953125 1.722656 10.253906 2.046875 C 10.523438 2.328125 10.773438 2.570312 11.132812 2.734375 C 11.171875 2.753906 11.207031 2.773438 11.246094 2.789062 C 11.964844 3.132812 12.753906 3.148438 13.507812 2.894531 C 13.59375 2.859375 13.683594 2.824219 13.769531 2.78125 C 13.8125 2.761719 13.859375 2.742188 13.902344 2.722656 C 14.300781 2.519531 14.582031 2.230469 14.882812 1.90625 C 15.167969 1.601562 15.46875 1.40625 15.894531 1.375 C 15.933594 1.371094 15.976562 1.367188 16.015625 1.363281 C 16.417969 1.378906 16.769531 1.519531 17.128906 1.679688 C 17.203125 1.714844 17.203125 1.714844 17.277344 1.746094 C 18.292969 2.203125 19.957031 2.957031 20.453125 4.03125 C 20.605469 4.507812 20.511719 4.996094 20.359375 5.460938 C 20.128906 6.214844 20.285156 6.992188 20.636719 7.679688 C 21.007812 8.355469 21.59375 8.820312 22.3125 9.082031 C 22.453125 9.117188 22.597656 9.148438 22.738281 9.179688 C 23.191406 9.277344 23.53125 9.417969 23.824219 9.792969 C 24.28125 10.511719 24.238281 11.554688 24.234375 12.382812 C 24.234375 12.425781 24.234375 12.464844 24.234375 12.511719 C 24.226562 14.683594 24.226562 14.683594 23.625 15.296875 C 23.597656 15.324219 23.566406 15.351562 23.535156 15.382812 C 23.496094 15.417969 23.496094 15.417969 23.457031 15.453125 C 23.203125 15.644531 22.902344 15.683594 22.597656 15.746094 C 21.816406 15.910156 21.117188 16.335938 20.671875 17 C 20.1875 17.796875 20.0625 18.566406 20.269531 19.46875 C 20.304688 19.601562 20.34375 19.722656 20.394531 19.847656 C 20.519531 20.207031 20.523438 20.636719 20.382812 20.988281 C 19.882812 21.921875 18.679688 22.523438 17.78125 22.996094 C 17.730469 23.023438 17.679688 23.046875 17.625 23.074219 C 17.007812 23.394531 16.398438 23.664062 15.703125 23.445312 C 15.367188 23.296875 15.144531 23.066406 14.921875 22.777344 C 14.429688 22.160156 13.679688 21.832031 12.910156 21.742188 C 12.078125 21.683594 11.265625 21.960938 10.632812 22.503906 C 10.464844 22.667969 10.320312 22.839844 10.183594 23.027344 C 9.941406 23.347656 9.628906 23.5625 9.226562 23.632812 C 7.953125 23.792969 6.308594 22.558594 5.359375 21.832031 C 5.292969 21.78125 5.292969 21.78125 5.226562 21.726562 C 5.1875 21.699219 5.148438 21.671875 5.109375 21.640625 C 4.78125 21.375 4.578125 21.046875 4.527344 20.625 C 4.507812 20.1875 4.617188 19.835938 4.765625 19.433594 C 5.019531 18.738281 4.914062 17.949219 4.621094 17.285156 C 4.253906 16.5625 3.691406 16.039062 2.929688 15.753906 C 2.734375 15.691406 2.535156 15.660156 2.335938 15.625 C 1.847656 15.539062 1.445312 15.394531 1.136719 14.992188 C 0.722656 14.320312 0.765625 13.433594 0.765625 12.675781 C 0.765625 12.539062 0.765625 12.40625 0.761719 12.273438 C 0.757812 10.261719 0.757812 10.261719 1.269531 9.597656 C 1.625 9.242188 2.0625 9.117188 2.542969 9.039062 C 3.070312 8.949219 3.484375 8.722656 3.90625 8.398438 C 3.957031 8.359375 4.007812 8.324219 4.0625 8.285156 C 4.644531 7.730469 4.933594 6.960938 4.980469 6.167969 C 4.980469 5.777344 4.902344 5.417969 4.777344 5.050781 C 4.648438 4.644531 4.617188 4.222656 4.773438 3.820312 C 5.367188 2.746094 6.996094 2.027344 8.089844 1.585938 C 8.132812 1.570312 8.171875 1.554688 8.214844 1.535156 C 8.507812 1.421875 8.773438 1.351562 9.09375 1.375 Z M 9.667969 9.8125 C 8.878906 10.636719 8.613281 11.675781 8.628906 12.789062 C 8.652344 13.585938 9.003906 14.386719 9.523438 14.992188 C 9.546875 15.019531 9.570312 15.050781 9.59375 15.085938 C 10.140625 15.761719 11.050781 16.246094 11.914062 16.359375 C 13.105469 16.453125 14.164062 16.1875 15.089844 15.414062 C 15.769531 14.800781 16.300781 13.894531 16.367188 12.960938 C 16.390625 11.863281 16.21875 10.871094 15.476562 10.007812 C 15.453125 9.980469 15.429688 9.949219 15.40625 9.914062 C 14.84375 9.21875 13.960938 8.777344 13.085938 8.640625 C 13.039062 8.636719 12.992188 8.628906 12.945312 8.621094 C 11.714844 8.46875 10.542969 8.96875 9.667969 9.8125 Z M 9.667969 9.8125 "
              />
            </g>
          </svg>

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
      {showAboutUs && <AboutUsModal onComplete={() => setShowAboutUs(false)} />}
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
  const [showAboutUs, setShowAboutUs] = useState(false);
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

  useEffect(() => {
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

  useEffect(() => {
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
      <div
        className={styles.logo}
        onClick={() => {
          setShowAboutUs(true);
        }}
      >
        Opus
      </div>
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
      {showAboutUs && <AboutUsModal onComplete={() => setShowAboutUs(false)} />}
    </div>
  );
}
