import { type Account } from "./account";
import { type Interest } from "./interest";
import { type Post } from "./post";
import { type Reply } from "./reply";
import { type Session } from "./session";
import { type Task } from "./task";

export interface SimpleUser {
  id: string;
  name: string;
  displayName: string;
  image: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  follower: User;
  following: User;
}

export interface SlugUser extends SimpleUser {
  themePreset: string;
  interestIds: number[];
}

export interface User extends SimpleUser {
  email: string;
  emailVerified: Date;
  themePreset: string;
  interestIds: number[];
  followers: Follow[];
  following: Follow[];
  accounts: Account[];
  posts: Post[];
  sessions: Session[];
  comments: Comment[];
  replys: Reply[];
  assignedtasks: Task[];
  ownTasks: Task[];
  createdInterests: Interest[];
}
