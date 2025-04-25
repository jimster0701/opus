import { Account } from "./account";
import { Post } from "./post";
import { Session } from "./session";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  displayName: string;
  image: string;
  themePreset: string;
  interests: string[];
  followers: string[];
  following: string[];
  accounts: Account[];
  posts: Post[];
  sessions: Session[];
}
