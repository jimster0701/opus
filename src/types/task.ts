export enum TaskType {
  generated = "generated",
  generatedFriend = "generatedFriend",
  custom = "custom",
  customFriend = "customFriend",
}

export interface Task {
  id: number;
  type: TaskType;
  name: string;
  icon: string;
  interests: string;
  friends?: string[];
  description: string;
}
