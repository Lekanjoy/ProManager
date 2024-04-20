"use client";
import { useTypedSelector } from "@/store/store";
import TaskColumn from "./TaskColumn";
import { ColumnDataType, taskDataObj, teamData } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { onDragEnd, onDragOver, onDragStart } from "@/utils/dnd-kit/funct";

const defaultCols: ColumnDataType[] = [
  {
    id: "todo",
    title: "To Do",
  },
  {
    id: "progress",
    title: "In Progress",
  },
  {
    id: "completed",
    title: "Completed",
  },
];

const ProjectContainer = () => {
  const { user } = useAuth();
  const tasksData: teamData[] = useTypedSelector((store) => store.tasks.tasks);

  const [columns, setColumns] = useState(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<taskDataObj[] | null>(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );


  

  useEffect(() => {
    setTasks(tasksData[0]?.tasks);
  }, [tasksData]);

  return (
    <section className="w-full grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-2 lg:grid-cols-3 lg:gap-x-4">
      <DndContext
        sensors={sensors}
        onDragStart={(event: DragStartEvent,) => onDragStart(event,setActiveColumn, setActiveTask)}
        onDragEnd={(event: DragEndEvent) => onDragEnd(event, setActiveColumn, setActiveTask, setColumns)}
        onDragOver={(event: DragOverEvent) => onDragOver(event, setTasks, user)}
      >
        {/* <div> */}
        <SortableContext items={columnsId}>
          {columns.map((col) => {
            return (
              <TaskColumn
                key={col.id}
                column={col}
                tasks={tasks?.filter((task) => task.columnId === col.id) || []}
              />
            );
          })}
        </SortableContext>
        {/* </div> */}

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <TaskColumn
                column={activeColumn}
                tasks={
                  tasks?.filter((task) => task.columnId === activeColumn.id) ||
                  []
                }
              />
            )}
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>, document.body
        )}
      </DndContext>
    </section>
  );
};

export default ProjectContainer;
