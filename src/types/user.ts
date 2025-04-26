import { Account } from "./account";
import { Post, Tag } from "./post";
import { Session } from "./session";
import { Task } from "./task";

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
  comments: Comment[];
  tags: Tag[];
  assignedtasks: Task[];
  ownTasks: Task[];
}
