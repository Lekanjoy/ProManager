import progressMark from "../../assets/inProgress-mark.svg";
import addTask from "../../assets/add-square.svg";

const InProgress = () => {
  const taskTotal = 4;
  return (
    <div className=" min-h-[500px] bg-[#F5F5F5] rounded-t-2xl border px-5 pt-5 pb-10">
      <div className="flex justify-between pb-6 border-b-[3px] border-[#FFA500]">
        <div className="flex items-center gap-x-1">
          <img src={progressMark} alt="" />
          <p className="text-secColor font-medium text-sm">In Progress</p>
          <p className="bg-[#E0E0E0] w-5 h-5 rounded-full text-xs text-[#625F6D] font-medium flex items-center justify-center">
            {taskTotal}
          </p>
        </div>
        <img src={addTask} alt="" />
      </div>
    </div>
  );
};

export default InProgress;
