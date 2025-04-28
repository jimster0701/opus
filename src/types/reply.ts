import { type SimpleUser } from "./user";

export interface Reply {
  id: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  likedBy: string[];
  createdById: string;
  createdBy: SimpleUser;
  commentId: number;
}
