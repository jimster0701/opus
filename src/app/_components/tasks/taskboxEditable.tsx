"use client";
import { type TaskInterest, type Task } from "~/types/task";
import { useState } from "react";
import Taskbox from "./taskbox";
import { type Session } from "~/types/session";
import TaskboxUpdate from "./taskboxUpdate";

interface TaskboxEditableProps {
  task: Task;
  session: Session;
  userId?: string;
  removeTask: (taskId: number) => void;
}

export default function TaskboxEditable(props: TaskboxEditableProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [task, setTask] = useState<Task>(props.task);

  const finishUpdate = (
    task: Task,
    updatedInterests: TaskInterest[],
    deleteTask: boolean
  ) => {
    if (!deleteTask) {
      setEditMode(false);
      setTask({ ...task, interests: updatedInterests });
    } else {
      props.removeTask(task.id);
    }
  };

  if (!editMode)
    return (
      <Taskbox task={task} setEditMode={setEditMode} userId={props.userId} />
    );
  else
    return (
      <TaskboxUpdate
        task={props.task}
        user={props.session.user}
        onComplete={finishUpdate}
      />
    );
}
