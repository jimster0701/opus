export enum TaskType {
  generated = "generated",
  generatedFriend = "generatedFriend",
  custom = "custom",
  customFriend = "customFriend",
}

export interface Task {
  id: number;
  type: TaskType | string;
  name: string;
  icon: string;
  userId: string;
  friends?: string[];
  createdAt: Date;
  updatedAt: Date;
  interests: string[];
  description: string;
}
