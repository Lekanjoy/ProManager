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
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/UseAuth";
import {
  customCollisionDetectionAlgorithm,
  onDragOver,
  onDragStart,
} from "@/utils/dnd-kit/funct";
import { createPortal } from "react-dom";
import { createClient } from "@/utils/supabase/client";
import TaskCard from "./TaskCard";
import ProjectHeaders from "../ProjectHeaders";


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
  const [filterValue, setFilterValue] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<taskDataObj[] | null>(
    null
  );
  const [date, setDate] = useState<Date | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  // Subscribe to all realtime events change in datbase
  useEffect(() => {
    const supabase = createClient();
    const teams = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        (payload) => {
          const newTasks = (payload.new as { tasks: taskDataObj[] }).tasks;
          setTasks(newTasks);
        }
      )
      .subscribe();

    return () => {
      teams.unsubscribe();
    };
  }, []);

  // Make tasks available locally after fetching
  useEffect(() => {
    setTasks(tasksData[0]?.tasks);
  }, [tasksData]);

  // Filter tasks based on priority and/or date
  const dateString = date?.toLocaleDateString();
  useEffect(() => {
    let newFilteredTasks = tasks;

    if (filterValue && date) {
      newFilteredTasks =
        tasks &&
        tasks?.filter(
          (task) =>
            task.priority === filterValue && task.created_at === dateString
        );
    } else if (filterValue) {
      newFilteredTasks =
        tasks && tasks?.filter((task) => task.priority === filterValue);
    } else if (date) {
      newFilteredTasks =
        tasks && tasks?.filter((task) => task.created_at === dateString);
    } else {
      newFilteredTasks = null;
    }

    setFilteredTasks(newFilteredTasks);
  }, [filterValue, date, dateString, tasks]);

  const tasksToDisplay = filteredTasks ?? tasks;

  // Reset Tasks
  const resetTasks = () => {
    setTasks(tasksData[0]?.tasks);
    setFilteredTasks(null);
    setFilterValue("");
    setDate(undefined);
  };

  // Update Database after Task Reorder
  const [isTaskDropped, setIsTaskDropped] = useState(false);
  useEffect(() => {
    if (isTaskDropped) {
      // Select matching team  and update current task status in database by Admin/Member after 10s
      setTimeout(async () => {
        const supabase = createClient();
        try {
          const { data: adminUpdate, error: adminError } = await supabase
            .from("teams")
            .update({ tasks })
            .eq("admin_id", user?.id as string)
            .select();

          const { data: memberUpdate, error: memberError } = await supabase
            .from("teams")
            .update({ tasks })
            .contains("team_member @>", '["' + user?.id + '"]')
            .select();

          if (adminError && memberError) {
            alert("Failed to update task");
          }
        } catch (error) {
          console.log(error);
        }
      }, 5000);
      setIsTaskDropped(false); // Reset the flag after updating database
    }
  }, [isTaskDropped, tasks]);

  return (
    <>
      <ProjectHeaders
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        resetTasks={resetTasks}
        date={date}
        setDate={setDate}
      />
      <section className="w-full grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-2 lg:grid-cols-3 lg:gap-x-4">
        <DndContext
          sensors={sensors}
          onDragStart={(event: DragStartEvent) =>
            onDragStart(event, setActiveTask)
          }
          onDragOver={(event: DragOverEvent) =>
            onDragOver(event, setTasks)
          }
          onDragEnd={(event: DragEndEvent) => {
            setIsTaskDropped(true);
          }}
          collisionDetection={customCollisionDetectionAlgorithm}
        >
          {columns.map((col) => {
            return (
              <TaskColumn
                key={col.id}
                column={col}
                tasks={
                  tasksToDisplay?.filter((task) => task.columnId === col.id) ||
                  []
                }
              />
            );
          })}
          {createPortal(
            <DragOverlay>
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </section>
    </>
  );
};

export default ProjectContainer;
