import { type Task } from "./task";
import { type SimpleUser } from "./user";
import { type Comment } from "./comment";

export interface Post {
  id: number;
  name: string;
  task: Task;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  private: boolean;
  createdById: string;
  createdBy: SimpleUser;
  likedBy: string[];
  imageUrl: string | null;
  comments: Comment[];
}
