import { type Task } from "./task";
import { type SimpleUser } from "./user";
import { type Comment } from "./comment";

export interface Tag {
  id: number;
  icon: string;
  name: string;
  colour: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: SimpleUser;
}

export interface Post {
  id: number;
  name: string;
  task: Task;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: SimpleUser;
  likedBy: string[];
  tags: Tag[];
  imageUrl: string | null;
  comments: Comment[];
}
