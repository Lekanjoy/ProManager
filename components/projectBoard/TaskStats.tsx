import Image from "next/image";
import file from "@/public/assets/folder-2.svg";
import comment from "@/public/assets/comments.svg";
import member from "@/public/assets/member.svg";
import member1 from "@/public/assets/member1.svg";
import member2 from "@/public/assets/member2.svg";
import { taskDataObj } from "@/types";

const TaskStats = ({ currentTask }: { currentTask: taskDataObj }) => {
  return (
    <div className="flex items-center gap-x-6">
      <div className="flex">
        <Image src={member} alt="Team members avatar" />
        <Image src={member2} alt="Team members avatar" className="-ml-2" />
        <Image src={member1} alt="Team members avatar" className="-ml-2" />
      </div>
      <div className="flex gap-x-1 items-center text-xs">
        <Image src={comment} alt="Comment Icon" />
        <p>
          {currentTask?.comments.length} comment
          {currentTask?.comments.length > 1 && "s"}
        </p>
      </div>
      <div className="flex gap-x-1 items-center text-xs">
        <Image src={file} alt="files Icon" />
        <p>
          {currentTask?.files.length} file
          {currentTask?.files.length > 1 && "s"}
        </p>
      </div>
    </div>
  );
};

export default TaskStats;
