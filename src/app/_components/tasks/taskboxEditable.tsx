"use client";
import { type TaskInterest, type Task } from "~/types/task";
import { useState } from "react";
import Taskbox from "./taskbox";
import { type Session } from "~/types/session";
import TaskboxUpdate from "./taskboxUpdate";

interface TaskboxEditableProps {
  task: Task;
  session: Session;
}

export default function TaskboxEditable(props: TaskboxEditableProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [task, setTask] = useState<Task>(props.task);

  const finishUpdate = (task: Task, updatedInterests: TaskInterest[]) => {
    setEditMode(false);
    setTask({ ...task, interests: updatedInterests });
  };

  if (!editMode) return <Taskbox task={task} setEditMode={setEditMode} />;
  else
    return (
      <TaskboxUpdate
        task={props.task}
        user={props.session.user}
        onComplete={finishUpdate}
      />
    );
}
