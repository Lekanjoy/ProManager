"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toggleModal } from "../../features/taskDetailsModalSlice";
import { selectTask } from "../../features/addNewTaskSlice";
import { useAppDispatch } from "../../store/store";
import { taskDataObj } from "@/types";
import Image from "next/image";
import comment from "@/public/assets/comments.svg";
import file from "@/public/assets/folder-2.svg";
import member from "@/public/assets/member.svg";
import member1 from "@/public/assets/member1.svg";
import member2 from "@/public/assets/member2.svg";
import { GripIcon } from "lucide-react";

interface ITaskCardProps {
  task: taskDataObj;
}

const TaskCard = ({ task }: ITaskCardProps) => {
  const { title, description, priority, comments, files } = task;
  const dispatch = useAppDispatch();

  const viewTaskDetails = () => {
    dispatch(toggleModal());
    dispatch(selectTask(task));
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.task_id,
    data: {
      type: "Task",
      task,
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
        className="opacity-30 bg-foreground/20 p-2.5 h-[150px] min-h-[150px] items-center flex text-left rounded-xl border border-secColor  cursor-grab relative"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full bg-white p-4 rounded-2xl text-primColor"
    >
      <div {...attributes} {...listeners}  className="flex items-center justify-between mb-1 cursor-grab">
        <p
          className={`py-1 px-[6px] rounded text-[#fff] text-xs font-medium ${
            priority === "High"
              ? "bg-red-500"
              : priority === "Medium"
              ? "bg-yellow-300"
              : "bg-gray-500"
          }`}
        >
          {priority}
        </p>
        <GripIcon size={16}/>
      </div>
      <div onClick={viewTaskDetails} className="cursor-pointer">
        <div className=" mb-8">
          <p className="text-secColor font-semibold mb-[6px]">{title}</p>
          <p className="text-xs">{description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex">
            <Image src={member} alt="Team members avatar" />
            <Image src={member2} alt="Team members avatar" className="-ml-2" />
            <Image src={member1} alt="Team members avatar" className="-ml-2" />
          </div>
          <div className="flex gap-x-1 items-center text-xs">
            <Image src={comment} alt="Comment Icon" />
            <p>{comments.length} comment{comments.length > 1 && "s"}</p>
          </div>
          <div className="flex gap-x-1 items-center text-xs">
            <Image src={file} alt="files Icon" />
            <p>
              {files.length} file{files.length > 1 && "s"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
