import { useRef } from "react";
import { toggleModal } from "../../features/showModalSlice";
import { supabase } from "../../../supabase";
import { setActionTriggered } from "../../features/isActionTriggeredSlice";
import { useAppDispatch } from "../../store/store";
import { taskDataObj } from "../../types";

const AddTaskModal = () => {
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLInputElement | null>(null);
  const severityRef = useRef<HTMLSelectElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleNewTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate user input
    if (!titleRef?.current?.value.trim() || !textRef?.current?.value.trim()) {
      alert("Please provide all task details");
      return;
    }

    const newTaskData: Omit<taskDataObj, "task_id"> = {
      title: titleRef?.current?.value ,
      text: textRef?.current?.value,
      severity: severityRef?.current?.value as string,
      comments: [],
      files: fileRef?.current?.value === "" ? [] : [fileRef?.current?.value] as string[],
    };
    
    dispatch(setActionTriggered(true));

    try {
      const { data, error } = await supabase
        .from("tasks")
        .upsert([newTaskData]);

      if (error) {
        throw error;
      }
      if (!error) {
        dispatch(setActionTriggered(false));
        dispatch(toggleModal());
        alert("Task with comments and files inserted successfully");
      }
    } catch (error) {
      console.error("Error inserting task with comments and files:", error);
    }
  }

  return (
    <section className="bg-[rgba(0,0,0,0.5)] w-full h-screen fixed left-0 top-0 flex justify-center items-center">
      <form
        onSubmit={handleNewTask}
        className="flex flex-col gap-y-3 bg-white shadow-md rounded-lg p-4 w-[400px]"
      >
        <p className="text-2xl font-semibold mb-3 text-secColor">
          Add New Task
        </p>
        <input
          ref={titleRef}
          type="text"
          placeholder="Enter Title"
          className="border p-2 rounded"
        />
        <input
          ref={textRef}
          type="text"
          placeholder="Enter Text"
          className="border p-2 rounded"
        />
        <select ref={severityRef} className="border p-2 rounded">
          <option value="" disabled>
            Select priority
          </option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input ref={fileRef} type="file" className="bg-white text-primColor" />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 font-medium"
        >
          Add Task
        </button>
      </form>
      <p
        onClick={() => dispatch(toggleModal())}
        className="absolute right-12 top-8 text-red-400 bg-white cursor-pointer w-4 h-4 flex justify-center items-center p-4 font-bold rounded-full"
      >
        X
      </p>
    </section>
  );
};

export default AddTaskModal;
