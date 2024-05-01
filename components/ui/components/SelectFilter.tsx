"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

export interface filterProps {
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
}

export function SelectFilter({ filterValue, setFilterValue }: filterProps) {
  const handleValueChange = (value: string) => {
    setFilterValue(value);
  };

  return (
    <Select value={filterValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Filters" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Priority</SelectLabel>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
