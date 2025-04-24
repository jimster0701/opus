export enum TaskType {
  generated,
  generatedFriend,
  custom,
  customFriend,
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
