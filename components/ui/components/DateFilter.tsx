"use client";
import { Calendar } from "@/components/ui/calendar";
import  UseCloseOnOutsideClick  from "@/hooks/UseCloseOnOutsideClick";
import { Dispatch, RefObject, SetStateAction, useRef } from "react";

interface dateFilterProps {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  showDatePicker: boolean;
  setShowDatePicker: Dispatch<SetStateAction<boolean>>;
  triggerRef: RefObject<SVGSVGElement>
}

export function DateFilter({
  date,
  setDate,
  showDatePicker,
  setShowDatePicker,
  triggerRef
}: dateFilterProps) {
  const calendarRef = useRef<HTMLDivElement>(null)

  return (
    <UseCloseOnOutsideClick Ref={calendarRef} isOpen={showDatePicker} setIsOpen={setShowDatePicker}  excludeRef={triggerRef}>
        <Calendar
          mode="single" 
          selected={date}
          onSelect={setDate}
          onDayClick={() => setShowDatePicker(false)}
          className="rounded-md border absolute bg-background top-[32px] -left-5 lg:-left-0"
        />
    </UseCloseOnOutsideClick>
  );
}
