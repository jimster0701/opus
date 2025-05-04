import styles from "../../index.module.css";
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
          <p className={styles.showcaseText}>
            {
              "You've been invited to be a part of the first and only trial testing of Opus."
            }
          </p>
          <p className={styles.showcaseText}>
            You are free to use the app until the 16th of May, which is when I
            will start to limit access.
          </p>
          <p className={styles.showcaseText}>
            I am looking to collect data for my dissertation, a link will be
            supplied to the official survery which I ask you complete after
            trying out the app.
          </p>
          <p className={styles.showcaseText}>
            You can also leave messages at any time using the settings page.
            These messages are intended to be used as a space for bug reports,
            opinions and reviews so feel free to use it as you wish.
          </p>
          <p className={styles.showcaseText}>Please login to start:</p>
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
