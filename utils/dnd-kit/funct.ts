import { arrayMove } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction } from "react";
import {
  DragStartEvent,
  DragOverEvent,
  CollisionDetection,
  closestCorners,
  closestCenter,
  pointerWithin,
} from "@dnd-kit/core";
import { taskDataObj } from "@/types";

export function onDragStart(
  event: DragStartEvent,
  setActiveTask: Dispatch<SetStateAction<null>>
) {
  if (event.active.data.current?.type === "Task") {
    setActiveTask(event.active.data.current.task);
  }
}

export function onDragOver(
  event: DragOverEvent,
  setTasks: Dispatch<SetStateAction<taskDataObj[] | null>>,
) {
  const { active, over } = event;
  if (!over) return;

  const activeId = active.id;
  const overId = over.id;

  if (activeId === overId) return;

  const isActiveATask = active.data.current?.type === "Task";
  const isOverATask = over.data.current?.type === "Task";

  if (!isActiveATask) return;

  // Im dropping a Task over another Task
  if (isActiveATask && isOverATask) {
    setTasks((tasks) => {
      if (!tasks) return null; // Return null if tasks is falsy

      const activeIndex = tasks.findIndex((t) => t.task_id === activeId);
      const overIndex = tasks.findIndex((t) => t.task_id === overId);

      if (activeIndex === -1 || overIndex === -1) return tasks; // Return the original array if activeId or overId is not found

      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        const newTasks = [...tasks];
        newTasks[activeIndex] = {
          ...tasks[activeIndex],
          columnId: tasks[overIndex].columnId,
        };
        return arrayMove(newTasks, activeIndex, overIndex - 1);
      }

      return arrayMove([...tasks], activeIndex, overIndex) || tasks; // Return the updated array or the original array if arrayMove returns falsy
    });
  }

  const isOverAColumn = over.data.current?.type === "Column";

  // Im dropping a Task over a column
  if (isActiveATask && isOverAColumn) {
    setTasks((tasks) => {
      if (tasks === undefined || tasks === null) return null; // Return null if tasks is undefined or null

      const activeIndex = tasks.findIndex((t) => t.task_id === activeId);
      if (activeIndex === -1) return tasks; // Return the original array if activeId is not found

      const newTasks = [...tasks]; // Create a new array using the spread operator
      newTasks[activeIndex] = { ...tasks[activeIndex], columnId: overId };

      return arrayMove(newTasks, activeIndex, activeIndex) || tasks; // Return the updated array or the original array if arrayMove returns falsy
    });
  }
}


export const customCollisionDetectionAlgorithm: CollisionDetection = (args) => {
  const closestCornersCollisions = closestCorners(args);
  const closestCenterCollisions = closestCenter(args);
  const pointerWithinCollisions = pointerWithin(args);

  if (
    closestCornersCollisions.length > 0 &&
    closestCenterCollisions.length > 0 &&
    pointerWithinCollisions.length > 0
  ) {
    return pointerWithinCollisions;
  }

  return [];
};
