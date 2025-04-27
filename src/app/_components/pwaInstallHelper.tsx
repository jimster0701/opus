"use client";
import { ArrowUp, EllipsisVertical } from "lucide-react";
import styles from "../index.module.css";
import { useEffect, useState } from "react";
export function PWAInstallHelper() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isInStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true; // (as any) to avoid TS errors
      setIsStandalone(isInStandaloneMode);
    };

    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(
        navigator.userAgent
      );
      setIsMobile(isMobileDevice);
    };

    checkStandalone();
    checkMobile();
  }, []);
  if (!isStandalone && isMobile)
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalBackground}></div>
        <div className={styles.pwaHelperContainer}>
          <div className={styles.pwaHelperTextContainer}>
            <p>
              Go into the page settings <EllipsisVertical />
            </p>
            <p>Scroll until you find:</p>
            <p>"Add to home screen"</p>
          </div>
          <ArrowUp
            className={styles.pwaHelperArrow}
            color="white"
            size={"25vw"}
          />
        </div>
      </div>
    );
}
