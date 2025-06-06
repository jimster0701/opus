import { type UserInterest } from "@prisma/client";
import { type Account } from "./account";
import { type Interest } from "./interest";
import { type Post } from "./post";
import { type Reply } from "./reply";
import { type Session } from "./session";
import { type Task } from "./task";

export interface SimpleUser {
  id: string;
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

export interface UserTask {
  id: string;
  userID: string;
  taskId: string;
  user: User;
  task: Task;
}

export interface SlugUser extends SimpleUser {
  themePreset: string;
  private: boolean;
  tasksPrivate: boolean;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  displayName: string;
  image: string;
  private: boolean;
  tasksPrivate: boolean;
  themePreset: string;
  followers: Follow[];
  following: Follow[];
  comments: Comment[];
  replies: Reply[];
  assignedtasks: UserTask[];
  ownTasks: Task[];
  interests: UserInterest[];
  createdInterests: Interest[];
  accounts: Account[];
  posts: Post[];
  sessions: Session[];
}
