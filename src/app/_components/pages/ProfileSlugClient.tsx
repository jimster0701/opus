//import styles from "../../index.module.css";

import { type Session } from "~/types/session";

interface ProfileSlugClientProps {
  session: Session;
  theme: string;
}

export default async function ProfileSlugClient(props: ProfileSlugClientProps) {
  console.log("session", props.session);
  return <div></div>;
}
