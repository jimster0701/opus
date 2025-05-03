import { type SimpleUser } from "./user";

export interface Interest {
  id: number;
  name: string;
  icon: string;
  colour: string;
  private: boolean;
  createdById: string;
  createdBy: SimpleUser;
}
