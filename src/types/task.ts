import { type UserTask, type TaskType } from "@prisma/client";
import { type Interest } from "./interest";

export interface TaskInterest {
  id: string;
  taskId: number;
  interestId: number;
  task: SimpleTask;
  interest: Interest;
}

export interface SimpleTask {
  id: number;
  type: TaskType;
  name: string;
}

export interface Task {
  id: number;
  type: TaskType;
  name: string;
  icon: string;
  friends: UserTask[];
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  interests: TaskInterest[];
  createdById: string;
  description: string;
}
