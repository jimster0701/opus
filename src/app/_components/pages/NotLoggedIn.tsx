import styles from "../../index.module.css";
import { AboutUsInnerModal } from "../innerModals";
import LoginButton from "../settings/loginButton";

export default function NotLoggedIn() {
  return (
    <main className={styles.main}>
      <div className={styles.notLoggedInContainer}>
        <h1 className={`${styles.title} ${styles.opusText}`}>
          Welcome
          <br />
          to <span className={styles.opusText}>Opus</span>
        </h1>
        <div className={styles.showcaseContainer}>
          <p className={styles.showcaseText}>Please login to start:</p>
          <LoginButton />
          <br />
          <div className={`${styles.modal} ${styles.AboutUsInnerContainer}`}>
            <AboutUsInnerModal />
          </div>
        </div>
      </div>
    </main>
  );
}
