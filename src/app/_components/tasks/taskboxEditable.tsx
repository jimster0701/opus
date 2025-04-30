"use client";
import { type Task } from "~/types/task";
import { useState } from "react";
import TaskboxCreate from "../create/taskboxCreate";
import Taskbox from "./taskbox";
import { type Session } from "~/types/session";

interface TaskboxEditableProps {
  task: Task;
  session: Session;
}

export default function TaskboxEditable(props: TaskboxEditableProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedTask, setUpdatedTask] = useState<Task>(props.task);
  setEditMode(false);
  if (editMode) return <Taskbox task={updatedTask} />;
  else
    return (
      <TaskboxCreate
        task={updatedTask}
        user={props.session.user}
        onTaskChange={setUpdatedTask}
      />
    );
}
