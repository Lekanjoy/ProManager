import more from "../../assets/_. ..svg";
import comment from "../../assets/comments.svg";
import file from "../../assets/folder-2.svg";
import member from "../../assets/member.svg";
import member1 from "../../assets/member1.svg";
import member2 from "../../assets/member2.svg";
import { toggleModal } from "../../features/taskDetailsModalSlice";
import { useDispatch } from "react-redux";
import { selectTask } from "../../features/addNewTaskSlice";

const TaskCard = ({ task }) => {
  const { title, text, severity, comments, files } = task;
  const dispatch = useDispatch()

const viewTaskDetails = () => {
  dispatch(toggleModal());
  dispatch(selectTask(task));
}

  return (
    <div
      onClick={viewTaskDetails}
      className="w-full bg-white p-5 rounded-2xl text-primColor cursor-pointer"
    >
      <div className="flex items-center justify-between mb-1">
        <p
          className={`py-1 px-[6px] rounded bg-[rgba(223,_168,_116,_0.20)] text-[#D58D49] text-xs font-medium`}
        >
          {severity}
        </p>
        <img src={more} alt="More options Icon" />
      </div>
      <div className=" mb-8">
        <p className="text-secColor font-semibold mb-[6px]">{title}</p>
        <p className="text-xs">{text}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex">
          <img src={member} alt="Team members avatar" />
          <img src={member2} alt="Team members avatar" className="-ml-2" />
          <img src={member1} alt="Team members avatar" className="-ml-2" />
        </div>
        <div className="flex gap-x-1 items-center text-xs">
          <img src={comment} alt="Comment Icon" />
          <p>{comments.length} comments</p>
        </div>
        <div className="flex gap-x-1 items-center text-xs">
          <img src={file} alt="files Icon" />
          <p>{files.length} files</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
