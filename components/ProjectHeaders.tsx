"use client";
import Image from "next/image";
import { useTypedSelector } from "../store/store";
import spinner from "@/public/assets/Circles-menu-3.gif";
import { SelectFilter } from "./ui/components/SelectFilter";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { DateFilter } from "./ui/components/DateFilter";

interface filterProps {
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
  resetTasks: () => void;
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
}

const ProjectHeaders = ({
  filterValue,
  setFilterValue,
  resetTasks,
  date,
  setDate,
}: filterProps) => {
  const tasksData = useTypedSelector((store) => store.tasks.tasks);
  const loading = useTypedSelector((store) => store.tasks.loading);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const triggerRef = useRef<SVGSVGElement>(null);

  return (
    <section className="flex flex-col gap-y-10 py-10 mt-20">
      {loading ? (
        <Image unoptimized src={spinner} alt="Spinner" />
      ) : (
        <h1 className="text-secColor text-5xl font-semibold">
          {tasksData[0]?.team_name}
        </h1>
      )}
      <div className="flex gap-x-3 items-center text-primColor">
        <SelectFilter
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
        <div className="relative">
          <CalendarDays
            ref={triggerRef}
            className="cursor-pointer"
            size={16}
            onClick={() => setShowDatePicker(!showDatePicker)}
          />
          {showDatePicker && (
            <DateFilter
              date={date}
              setDate={setDate}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              triggerRef={triggerRef}
            />
          )}
        </div>

        {filterValue || date ? (
          <div
            onClick={resetTasks}
            className="h-5 flex items-center justify-center text-white gap-x-1 px-3 rounded text-xs bg-secColor/80 cursor-pointer"
          >
            <p>Reset</p>
            <X size={12} />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProjectHeaders;
