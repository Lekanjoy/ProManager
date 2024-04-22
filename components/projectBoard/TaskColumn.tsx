"use client";
import Image from "next/image";
import todoMark from "@/public/assets/todo-mark.svg";
import addTask from "@/public/assets/add-square.svg";
import TaskCard from "./TaskCard";
import { toggleModal } from "../../features/showModalSlice";
import { useEffect, useMemo } from "react";
import { fetchInitialData } from "../../features/addNewTaskSlice";
import { ColumnDataType, taskDataObj } from "../../types";
import { useAppDispatch, useTypedSelector } from "../../store/store";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface columnDataI {
  tasks: taskDataObj[];
  column: ColumnDataType;
}

const TaskColumn = ({ tasks, column }: columnDataI) => {
  const dispatch = useAppDispatch();
  const isTriggered = useTypedSelector((store) => store.isTriggered);
  const loading = useTypedSelector((store) => store.tasks.loading);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.task_id);
  }, [tasks]);

  useEffect(() => {
    dispatch(fetchInitialData());
    console.log("I am re-rendered in task column");
  }, [isTriggered]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" bg-red-300
      opacity-40
      border-2
      border-pink-500
      w-full
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" min-h-[700px] bg-[#F5F5F5] rounded-t-2xl border px-5 pt-5 pb-10"
    >
      <div className="flex justify-between pb-6 border-b-[3px] border-[#5030E5] mb-7">
        <div className="flex items-center gap-x-1">
          <Image src={todoMark} alt="Todo Line" />
          <p className="text-secColor font-medium text-sm">{column.title}</p>
          <p className="bg-[#E0E0E0] w-5 h-5 rounded-full text-xs text-[#625F6D] font-medium flex items-center justify-center">
            {tasks?.length || 0}
          </p>
        </div>
        <Image
          onClick={() => dispatch(toggleModal())}
          src={addTask}
          alt="Add Task Icon"
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-y-5 ">
        <SortableContext items={tasksIds}>
          {loading
            ? Array(4)
                .fill("")
                .map((_, i) => (
                  <p
                    key={i}
                    className="w-full h-32 bg-white p-5 rounded-2xl text-primColor cursor-pointer animate-pulse"
                  ></p>
                ))
            : tasks?.map((task) => {
                return <TaskCard key={task.task_id} task={task} />;
              })}
        </SortableContext>
      </div>
    </div>
  );
};

export default TaskColumn;
