import { arrayMove } from "@dnd-kit/sortable";
import { createClient } from "../supabase/client";
import { Dispatch, SetStateAction } from "react";
import {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  CollisionDetection,
  closestCorners,
  closestCenter,
  pointerWithin,
} from "@dnd-kit/core";
import { ColumnDataType, taskDataObj } from "@/types";
import { User } from "@supabase/supabase-js";

export function onDragStart(
  event: DragStartEvent,
  setActiveTask: Dispatch<SetStateAction<null>>
) {
  if (event.active.data.current?.type === "Task") {
    setActiveTask(event.active.data.current.task);
  }
}

export function onDragEnd(
  event: DragEndEvent,
  setActiveTask: Dispatch<SetStateAction<null>>,
  setColumns: Dispatch<SetStateAction<ColumnDataType[]>>
) {
  setActiveTask(null);

  const { active, over } = event;
  if (!over) return;

  const activeId = active.id;
  const overId = over.id;

  if (activeId === overId) return;

  const isActiveAColumn = active.data.current?.type === "Column";
  if (!isActiveAColumn) return;

  setColumns((columns) => {
    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    return arrayMove(columns, activeColumnIndex, overColumnIndex);
  });
}

export function onDragOver(
  event: DragOverEvent,
  setTasks: Dispatch<SetStateAction<taskDataObj[] | null>>,
  user: User | null
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

      // Select matching team  and update current task status in database by Admin/Member after 10s
      setTimeout(async () => {
        const supabase = createClient();
        try {
          const { data: adminUpdate, error: adminError } = await supabase
            .from("teams")
            .update({ tasks: newTasks })
            .eq("admin_id", user?.id) 
            .select();

            const { data: memberUpdate, error: memberError } = await supabase
            .from("teams")
            .update({ tasks: newTasks })
            .contains('team_member @>', '["' + user?.id + '"]')
            .select();

            if(adminError && memberError) {
              alert('Failed to update task')
            }
            

        } catch (error) {
          console.log(error);
        }
      }, 10000);
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
