'use client'
import { useRef, useState } from "react";
import { toggleModal } from "../../features/showModalSlice";
import { useAuth } from "@/hooks/UseAuth";
import { setActionTriggered } from "../../features/isActionTriggeredSlice";
import { useAppDispatch } from "../../store/store";
import { generateCommentId } from "../../hooks/generateId";
import { createClient } from "@/utils/supabase/client";
import { getTeamData } from "@/hooks/getTeamData";
import { useToast } from "../ui/use-toast";

const AddTaskModal = () => {
  const supabase = createClient();
  const { user } = useAuth();
  const { toast } = useToast();

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLInputElement | null>(null);
  const severityRef = useRef<HTMLSelectElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleNewTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate user input
    if (!titleRef?.current?.value.trim() || !textRef?.current?.value.trim()) {
      toast({
        title: "Uh oh! Something went wrong",
        description: "Please provide all task details",          
      });
      return;
    }

    const newTaskData = [
      {
        task_id: generateCommentId(),
        columnId: 'todo',
        created_at: new Date().toLocaleDateString(),
        title: titleRef?.current?.value,
        description: textRef?.current?.value,
        priority: severityRef?.current?.value as string,
        comments: [],
        files:
          fileRef?.current?.value === ""
            ? []
            : ([fileRef?.current?.value] as string[]),
      },
    ];

    dispatch(setActionTriggered(true));
    setLoading(true);

     //Check if team member wants to create task
     const data = await getTeamData(user);
     if (user?.id !==  data?.admin_id) {
       toast({
        variant: "destructive",
        title: "Uh oh! Unauthorized!",
        description: "Admins only: Task creation restricted",          
      });
       setLoading(false);
       return;
     }

    // Make only admin to create tasks
    try {
      const { data: existingTask, error } = await supabase
        .from("teams")
        .select("tasks")
        .eq("admin_id", user?.id as string)
        .single();

      if (error) {
        setLoading(false);
        throw error;
      }
      if (!error) {
        // Combine existing and new taks into a single array
        const combinedTasks = [...(existingTask.tasks || []), ...newTaskData];

        // Update the team's task with the combined array
        const { data: updatedTask, error: updateError } = await supabase
          .from("teams")
          .update({ tasks: combinedTasks })
          .eq("admin_id", user?.id as string)
          .select();

        dispatch(setActionTriggered(false));
        dispatch(toggleModal());
        // Toast Notification
        toast({
          variant: "success",
          description: "New task created successfully",          
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: "Error creating task",          
      });
    }
  }

  return (
    <section className="bg-[rgba(0,0,0,0.5)] w-full h-screen fixed left-0 top-0 px-4 flex justify-center items-center z-10">
      <form
        onSubmit={handleNewTask}
        className="flex flex-col gap-y-3 bg-background text-foreground shadow-md rounded-lg p-4 w-full lg:w-[400px]"
      >
        <p className="text-2xl font-semibold mb-3 ">
          Add New Task
        </p>
        <input
          ref={titleRef}
          type="text"
          placeholder="Enter Title"
          className="border p-2 rounded bg-transparent"
        />
        <input
          ref={textRef}
          type="text"
          placeholder="Enter Text"
          className="border p-2 rounded bg-transparent"
        />
        <select ref={severityRef} required className="border text-foreground p-2 rounded bg-transparent">
          <option value="" disabled selected>
            Select priority
          </option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input ref={fileRef} type="file" className="bg-white text-primColor" />
        <button
          disabled={loading}
          type="submit"
          className={`p-2 font-medium ${
            loading
              ? "bg-white shadow border text-black cursor-not-allowed"
              : "bg-blue-500 text-white  cursor-pointer"
          }`}
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
