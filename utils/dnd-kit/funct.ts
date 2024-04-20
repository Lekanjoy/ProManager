import { arrayMove } from "@dnd-kit/sortable";
import { createClient } from "../supabase/client";
import { Dispatch, SetStateAction } from "react";
import { DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { ColumnDataType, taskDataObj } from "@/types";
import { User } from "@supabase/supabase-js";

interface onDragStartProps {
  event: DragStartEvent;
  setActiveColumn: Dispatch<SetStateAction<null>>;
  setActiveTask: Dispatch<SetStateAction<null>>;
}

export function onDragStart(
  event: DragStartEvent,
  setActiveColumn: Dispatch<SetStateAction<null>>,
  setActiveTask: Dispatch<SetStateAction<null>>
) {
  if (event.active.data.current?.type === "Column") {
    setActiveColumn(event.active.data.current.column);
    return;
  }

  if (event.active.data.current?.type === "Task") {
    setActiveTask(event.active.data.current.task);
  }
}

export function onDragEnd(
  event: DragEndEvent,
  setActiveColumn: Dispatch<SetStateAction<null>>,
  setActiveTask: Dispatch<SetStateAction<null>>,
  setColumns: Dispatch<SetStateAction<ColumnDataType[]>>
) {
  setActiveColumn(null);
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

export function onDragOver(event: DragOverEvent, setTasks: Dispatch<SetStateAction<taskDataObj[] | null>>, user: User) {
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
      const activeIndex = tasks.findIndex((t) => t.task_id === activeId);
      const overIndex = tasks.findIndex((t) => t.task_id === overId);

      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        const newTasks = [...tasks];
        newTasks[activeIndex] = {
          ...tasks[activeIndex],
          columnId: tasks[overIndex].columnId,
        };

        return arrayMove(newTasks, activeIndex, overIndex - 1);
      }

      return arrayMove([...tasks], activeIndex, overIndex);
    });
  }

  const isOverAColumn = over.data.current?.type === "Column";

  // Im dropping a Task over a column
  if (isActiveATask && isOverAColumn) {
    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.task_id === activeId);
      const newTasks = [...tasks]; // Create a new array using the spread operator
      newTasks[activeIndex] = Object.assign({}, tasks[activeIndex], {
        columnId: overId,
      });

      // Select matching team  and update current task status in database after 10s
      setTimeout(async () => {
        const supabase = createClient();

        try {
          const { data, error } = await supabase
            .from("teams")
            .update({ tasks: newTasks })
            .eq("admin_id", user?.id)
            .select();
          console.log("updated");
        } catch (error) {
          console.log(error);
        }
      }, 10000);
      return arrayMove(newTasks, activeIndex, activeIndex); // Return the modified new array
    });
  }
}

// function onDragOver(event: DragOverEvent) {
//   const { active, over } = event;
//   if (!over) return;

//   const activeId = active.id;
//   const overId = over.id;

//   if (activeId === overId) return;

//   const isActiveATask = active.data.current?.type === "Task";
//   const isOverATask = over.data.current?.type === "Task";
//   const isOverAColumn = over.data.current?.type === "Column";

//   if (!isActiveATask) return;

//   setTasks((prevTasks) => {
//     const newTasks = prevTasks?.map((task) => ({ ...task })); // Create a new copy of tasks array
//     const activeIndex = newTasks?.findIndex((t) => t.task_id === activeId);
//     let overIndex;

//     if (activeIndex && activeIndex !== -1 && newTasks) {
//       if (isOverAColumn) {
//         // Dropping a Task over a Column
//         newTasks[activeIndex] = {
//           ...newTasks[activeIndex],
//           columnId: overId,
//         };
//         console.log(overIndex);

//         // Select matching team  and update current task status in database after 10s
//         // setTimeout(async () => {
//         //   try {
//         //     const { data, error } = await supabase
//         //       .from("teams")
//         //       .update({ tasks: newTasks })
//         //       .eq("admin_id", user?.id)
//         //       .select();
//         //     console.log("updated");
//         //   } catch (error) {
//         //     console.log(error);
//         //   }
//         // }, 10000);
//       } else if (isOverATask) {
//         // Dropping a Task over another Task
//         overIndex = newTasks.findIndex((t) => t.task_id === overId);
//         console.log(overIndex);
//         if (
//           overIndex !== -1 &&
//           newTasks[activeIndex].columnId !== newTasks[overIndex].columnId
//         ) {
//           newTasks[activeIndex] = {
//             ...newTasks[activeIndex],
//             columnId: newTasks[overIndex].columnId,
//           };
//         }
//       }

//       // Reorder tasks using array-move library
//       return arrayMove(newTasks, activeIndex, overIndex);
//     }

//     return prevTasks; // Return previous tasks if active task not found
//   });
// }
