import { useTypedSelector } from "../store/store";
import filter from "../assets/filter.svg";
import date from "../assets/calendar.svg";
import chevronDown from "../assets/arrow-down.svg";

const ProjectHeaders = () => {
  const tasksData = useTypedSelector((store) => store.tasks.tasks);

  return (
    <section className="flex flex-col gap-y-10 py-10">
      <h1 className="text-secColor text-5xl font-semibold">{tasksData[0]?.team_name}</h1>
      <div className="flex gap-x-3 text-primColor">
        <button className="flex gap-x-1 items-center rounded-md py-[6px] px-4 border border-primColor text-sm outline-none">
          <img src={filter} alt="Filter icon" /> <p>Filter</p>
          <img src={chevronDown} alt="arrow down icon" className="pl-2" />
        </button>
        <button className="flex gap-x-1 items-center rounded-md py-[6px] px-4 border border-primColor text-sm outline-none">
          <img src={date} alt="date icon" /> <p>Today</p>
          <img src={chevronDown} alt="arrow down icon" className="pl-2" />
        </button>
      </div>
    </section>
  );
};

export default ProjectHeaders;
