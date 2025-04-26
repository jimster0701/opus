import { TaskType } from "~/types/task";

export const defaultTask = {
  id: -1,
  type: TaskType.generated,
  name: "",
  icon: "🔮",
  userId: "",
  friends: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  interests: [],
  description: "",
};

export const defaultPost = {
  id: -1,
  name: "",
  task: defaultTask,
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  likedBy: [],
  tags: [],
  imageUrl: "",
  comments: [],
};
