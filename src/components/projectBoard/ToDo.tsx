import todoMark from "../../assets/todo-mark.svg";
import addTask from "../../assets/add-square.svg";
import TaskCard from "./TaskCard";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../../features/showModalSlice";
import { useEffect, useState } from "react";
import { fetchInitialData } from "../../features/addNewTaskSlice";
import { taskDataObj } from "../../types";

const ToDo = () => {
  const dispatch = useDispatch();
  const tasksData: taskDataObj[] = useSelector((store) => store.tasks.tasks);
  const isTriggered = useSelector((state) => state.isTriggered);
  const taskTotal = tasksData.length;

  useEffect(() => {
    dispatch(fetchInitialData());
  }, [isTriggered]);

  return (
    <div className=" min-h-[500px] bg-[#F5F5F5] rounded-t-2xl border px-5 pt-5 pb-10">
      <div className="flex justify-between pb-6 border-b-[3px] border-[#5030E5] mb-7">
        <div className="flex items-center gap-x-1">
          <img src={todoMark} alt="" />
          <p className="text-secColor font-medium text-sm">To Do</p>
          <p className="bg-[#E0E0E0] w-5 h-5 rounded-full text-xs text-[#625F6D] font-medium flex items-center justify-center">
            {taskTotal}
          </p>
        </div>
        <img
          onClick={() => dispatch(toggleModal())}
          src={addTask}
          alt="Add Task Icon"
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-y-5 ">
        {tasksData.map((task) => {
          return <TaskCard key={task.task_id} task={task} />;
        })}
      </div>
    </div>
  );
};

export default ToDo;
