import { Task } from "./task";

export interface SimpleUser {
  id: string;
  name: string | null;
  displayName: string;
  image: string;
}

export interface PostComment {
  id: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: SimpleUser;
}

export interface Tag {
  id: number;
  icon: string;
  name: string;
  colour: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: SimpleUser;
}

export interface Post {
  id: number;
  task: Task;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: SimpleUser;
  likedBy: string[];
  tags: Tag[];
  imageUrl: string | null;
  comments: PostComment[];
}
