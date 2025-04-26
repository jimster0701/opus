import { TaskType } from "~/types/task";

export const defaultTask = {
  id: 1,
  type: TaskType.generated,
  name: "Task Title",
  icon: "🔮",
  userId: "",
  friends: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  interests: [],
  description: "Do this...",
};

export const defaultPost = {
  id: 0,
  task: defaultTask,
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  likedBy: [],
  tags: [],
  imageUrl: "",
  comments: [],
};
