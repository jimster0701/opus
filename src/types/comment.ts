import { type Reply } from "./reply";
import { type SimpleUser } from "./user";

export interface Comment {
  id: number;
  message: string;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: SimpleUser;
  replies: Reply[];
}
