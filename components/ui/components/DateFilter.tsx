"use client";
import { Calendar } from "@/components/ui/calendar";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface dateFilterProps {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  showDatePicker: boolean;
  setShowDatePicker: Dispatch<SetStateAction<boolean>>;
}

export function DateFilter({
  date,
  setDate,
  showDatePicker,
  setShowDatePicker,
}: dateFilterProps) {
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      event.target instanceof Node &&
      !calendarRef.current.contains(event.target)
    ) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  return (
    <div ref={calendarRef}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        onDayClick={() => setShowDatePicker(false)}
        className="rounded-md border absolute bg-background top-[32px]"
      />
    </div>
  );
}
