"use client";
import { useEffect, useState} from "react";
import { createClient } from "@/utils/supabase/client";
import { getTeamData } from "@/hooks/getTeamData";
import { useAuth } from "@/hooks/UseAuth";
import { toggleModal } from "../../features/taskDetailsModalSlice";
import { useAppDispatch, useTypedSelector } from "../../store/store";
import { taskDataObj, teamData } from "../../types";
import DeleteDialog from "../ui/components/DeleteDialog";
import { useToast } from "../ui/use-toast";
import { setActionTriggered } from "@/features/isActionTriggeredSlice";
import CardDetails from "./CardDetails";

const TaskCardDetails = () => {
  const supabase = createClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [commentText, setCommentText] = useState("");
  const selectedTask: taskDataObj = useTypedSelector(
    (store) => store.tasks.selectedTask
  );
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const tasksData: teamData[] = useTypedSelector((store) => store.tasks.tasks);
  const [tasks, setTasks] = useState<taskDataObj[] | null>(null);

  // Make tasks available locally after fetching
  useEffect(() => {
    setTasks(tasksData[0]?.tasks);
  }, [tasksData]);

  // Subscribe to all realtime events change in datbase
  useEffect(() => {
    const supabase = createClient();
    const teams = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        (payload) => {
          const newTasks = (payload.new as { tasks: taskDataObj[] }).tasks;
          setTasks(newTasks);
        }
      )
      .subscribe();

    return () => {
      teams.unsubscribe();
    };
  }, []);

  const currentTask = tasks?.find(
    (task) => task.task_id === selectedTask.task_id
  ) as taskDataObj;

  async function deleteTask() {
    // Admin should only have the task deletion privilege
    const teamData = await getTeamData(user);
    if (user?.id !== teamData?.admin_id) {
      toast({
        variant: "destructive",
        title: "Uh oh! Unauthorized!",
        description: "Delete action by admin only",
      });
      return;
    }
    dispatch(setActionTriggered(true));

    // Delete selected Task
    const existingDataFromDatabase = teamData?.tasks;
    const newDataForDatabase = existingDataFromDatabase?.filter(
      (item) => item.task_id !== selectedTask.task_id
    );

    // Select matching team database and update tasks column after deletion for only admin
    const { data, error } = await supabase
      .from("teams")
      .update({ tasks: newDataForDatabase })
      .eq("admin_id", user?.id as string)
      .select();

    if (data) {
      dispatch(setActionTriggered(false));
      setIsDeleteModalOpen(false);
      dispatch(toggleModal());
      toast({
        variant: "success",
        description: "Task Deleted",
      });
    } else {
      dispatch(setActionTriggered(false));
      console.error("Error deleting task");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: "Task deletion failed",
      });
    }
  }


  return (
    <>
      <section data-testid="overlay" className="z-[10] bg-[rgba(0,0,0,0.5)] w-full h-screen fixed left-0 top-0 px-4 flex justify-center items-center">
      <CardDetails
        currentTask={currentTask}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        setLoading={setLoading}
        commentText={commentText}
        setCommentText={setCommentText}
        user={user}
        loading={loading}
      />
        {/* Close Modal */}
        <p
          onClick={() => dispatch(toggleModal())}
          className="absolute right-8 z-20 top-3 bg-red-500 text-white cursor-pointer w-4 h-4 flex justify-center items-center p-4 font-bold rounded-full"
        >
          X
        </p>
      </section>
      {/* Delete Alert Dialog */}
      <DeleteDialog
        isAlertModalOpen={isDeleteModalOpen}
        setIsAlertModalOpen={setIsDeleteModalOpen}
        deleteAction={deleteTask}
        actionTakenOn={"Task"}
      />
    </>
  );
};

export default TaskCardDetails;
