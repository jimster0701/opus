import { type TaskType } from "@prisma/client";

export interface Task {
  id: number;
  type: TaskType;
  name: string;
  icon: string;
  userId: string;
  friends?: string[];
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  description: string;
  interestIds: number[];
}
