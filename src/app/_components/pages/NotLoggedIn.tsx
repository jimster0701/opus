import styles from "../../index.module.css";
import LoginButton from "../settings/loginButton";

export default function NotLoggedIn() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={`${styles.title} ${styles.opusText}`}>
          Welcome
          <br />
          to <span className={styles.opusText}>Opus</span>
          <div className={styles.showcaseContainer}>
            <p className={styles.showcaseText}>Please login to start:</p>
            <LoginButton />
          </div>
        </h1>
      </div>
    </main>
  );
}
