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
  useSensors
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { customCollisionDetectionAlgorithm, onDragEnd, onDragOver, onDragStart } from "@/utils/dnd-kit/funct";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

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
  const [tasks, setTasks] = useState<taskDataObj[] | null>(null);
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
        onDragStart={(event: DragStartEvent) => onDragStart(event, setActiveTask)}
        onDragEnd={(event: DragEndEvent) => onDragEnd(event, setActiveTask, setColumns)}
        onDragOver={(event: DragOverEvent) => onDragOver(event, setTasks, user)}
        collisionDetection={customCollisionDetectionAlgorithm}
      >
          {columns.map((col) => {
            return (
              <TaskColumn
                key={col.id}
                column={col}
                tasks={tasks?.filter((task) => task.columnId === col.id) || []}
              />
            );
          })}
        {createPortal(
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>, document.body
        )}
      </DndContext>
    </section>
  );
};

export default ProjectContainer;
