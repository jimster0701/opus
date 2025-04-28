import { type Account } from "./account";
import { Interest } from "./interest";
import { type Post, type Tag } from "./post";
import { type Session } from "./session";
import { type Task } from "./task";

export interface SimpleUser {
  id: string;
  name: string;
  displayName: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  displayName: string;
  image: string;
  themePreset: string;
  interestIds: Number[];
  followers: string[];
  following: string[];
  accounts: Account[];
  posts: Post[];
  sessions: Session[];
  comments: Comment[];
  tags: Tag[];
  assignedtasks: Task[];
  ownTasks: Task[];
  createdInterests: Interest[];
}
