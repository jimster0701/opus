import styles from "../index.module.css";
import { ProfilePicturePreviewWrapper } from "./cldImageWrapper";
import Image from "next/image";

interface HeaderProps {
  userId: string;
}

export default function Header(props: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>Opus</div>
      <div className={styles.navIcons}>
        <Image src="/images/bell.png" alt={""} width={25} height={25} />
        <ProfilePicturePreviewWrapper
          id={props.userId}
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}
