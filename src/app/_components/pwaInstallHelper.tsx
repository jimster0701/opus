"use client";
import { ArrowUp, EllipsisVertical, Smartphone } from "lucide-react";
import styles from "../index.module.css";
import { useEffect, useState } from "react";
export function PWAInstallHelper() {
  const [showModal, setShowModal] = useState(false);
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

  const isChrome = () => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const uaData = (navigator as any).userAgentData;
      if (uaData?.brands.length > 0) {
        const isChrome = uaData.brands.some((brand: any) =>
          brand.brand.includes("Google Chrome")
        );
        return isChrome;
      } else {
        // Fallback for older browsers
        const userAgent = navigator.userAgent;
        const isChromium = (window as any).chrome !== undefined;
        const isOpera = userAgent.includes("OPR");
        const isEdge = userAgent.includes("Edg");
        return isChromium && !isOpera && !isEdge;
      }
    }
    return false;
  };

  if (isMobile && !isStandalone) {
    setShowModal(true);
  }

  if (showModal && isChrome()) {
    return (
      <div className={styles.modalContainer}>
        <div
          className={styles.modalBackground}
          onClick={() => setShowModal(false)}
        ></div>
        <div className={styles.pwaHelperContainer}>
          <div className={styles.pwaHelperTextContainer}>
            <p>
              Go into the page settings <EllipsisVertical />
            </p>
            <p>Scroll until you find:</p>
            <p>
              <Smartphone />
              {"Add to home screen"}
            </p>
          </div>
          <ArrowUp
            className={styles.pwaHelperArrow}
            color="white"
            size={"25vw"}
          />
        </div>
      </div>
    );
  } else if (showModal && !isChrome()) {
    return (
      <div className={styles.modalContainer}>
        <div
          className={styles.modalBackground}
          onClick={() => setShowModal(false)}
        ></div>
        <div className={styles.pwaHelperContainer}>
          <div className={styles.pwaHelperTextContainer}>
            <h2>Welcome to Opus</h2>
            <p>To use this app please use</p>
            <p>chrome browser instead.</p>
          </div>
        </div>
      </div>
    );
  }
}
