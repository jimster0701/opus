//import styles from "../../index.module.css";

import { type Session } from "~/types/session";

interface ProfileSlugClientProps {
  session: Session;
  theme: string;
}

export default async function ProfileSlugClient(props: ProfileSlugClientProps) {
  const session = props.session;
  return <div></div>;
}
