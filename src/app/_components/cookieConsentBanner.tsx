// CookieConsent.tsx
"use client";
import { useState, useEffect } from "react";
import styles from "../index.module.css";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setShowBanner(true);
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem("cookie_consent", accepted ? "accepted" : "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={styles.cookieBanner}>
      <p className={styles.opusText}>
        We use cookies to enhance your experience. By continuing, you agree to
        our use of essential cookies. You may choose to accept or reject
        non-essential cookies.
      </p>
      <div className={styles.flexRow}>
        <button
          className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
          onClick={() => handleConsent(true)}
        >
          Accept
        </button>
        <button
          className={`${styles.opusButton} ${styles.profileAvatarConfirmButton}`}
          onClick={() => handleConsent(false)}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
