"use client";
import more from "@/public/assets/_. ..svg";
import comment from "@/public/assets/comments.svg";
import file from "@/public/assets/folder-2.svg";
import member from "@/public/assets/member.svg";
import member1 from "@/public/assets/member1.svg";
import member2 from "@/public/assets/member2.svg";
import { toggleModal } from "../../features/taskDetailsModalSlice";
import { selectTask } from "../../features/addNewTaskSlice";
import { useAppDispatch } from "../../store/store";
import { taskDataObj } from "@/types";
import Image from "next/image";

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

  return (
    <div
      onClick={viewTaskDetails}
      className="w-full bg-white p-5 rounded-2xl text-primColor cursor-pointer"
    >
      <div className="flex items-center justify-between mb-1">
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
        <Image src={more} alt="More options Icon" />
      </div>
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
          <p>{comments.length} comments</p>
        </div>
        <div className="flex gap-x-1 items-center text-xs">
          <Image src={file} alt="files Icon" />
          <p>
            {files.length} file{files.length > 1 && "s"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
