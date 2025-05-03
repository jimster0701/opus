import { type UserInterest } from "@prisma/client";
import { type SimpleUser } from "./user";

export interface Interest {
  id: number;
  name: string;
  icon: string;
  colour: string;
  private: boolean;
  createdById: string;
  createdBy: SimpleUser;
  users: UserInterest[];
}
