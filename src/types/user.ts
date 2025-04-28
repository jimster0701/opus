import { type Account } from "./account";
import { type Interest } from "./interest";
import { type Post, type Tag } from "./post";
import { type Reply } from "./reply";
import { type Session } from "./session";
import { type Task } from "./task";

export interface SimpleUser {
  id: string;
  name: string;
  displayName: string;
  image: string;
}

export interface User extends SimpleUser {
  email: string;
  emailVerified: Date;
  themePreset: string;
  interestIds: number[];
  followers: string[];
  following: string[];
  accounts: Account[];
  posts: Post[];
  sessions: Session[];
  comments: Comment[];
  replys: Reply[];
  tags: Tag[];
  assignedtasks: Task[];
  ownTasks: Task[];
  createdInterests: Interest[];
}
