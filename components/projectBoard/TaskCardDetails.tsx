"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getTeamData } from "@/hooks/getTeamData";
import { useAuth } from "@/hooks/UseAuth";
import { toggleModal } from "../../features/taskDetailsModalSlice";
import { useAppDispatch, useTypedSelector } from "../../store/store";
import { taskDataObj, teamData } from "../../types";
import { Trash2 } from "lucide-react";
import DeleteDialog from "../ui/components/DeleteDialog";
import Comment from "./Comment";
import CommentField from "./CommentField";
import TaskStats from "./TaskStats";
import { useToast } from "../ui/use-toast";
import { setActionTriggered } from "@/features/isActionTriggeredSlice";

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

  const priorityStyle =
    currentTask?.priority === "High"
      ? "bg-red-500"
      : currentTask?.priority === "Medium"
      ? "bg-yellow-300"
      : "bg-gray-500";

  return (
    <>
      <section className="z-[50] bg-[rgba(0,0,0,0.5)] w-full h-screen fixed left-0 top-0 px-4 flex justify-center items-center">
        <div className="relative z-40 flex flex-col gap-y-3 bg-background shadow-md rounded-lg px-6 py-6  max-h-[420px] overflow-auto w-full lg:w-[500px]">
          <div className="flex justify-between items-center">
            <p
              className={`py-1 px-[6px] w-fit rounded text-white text-xs font-medium ${priorityStyle}
            `}
            >
              {currentTask?.priority}
            </p>
            <div
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex p-2 rounded-full items-center justify-center bg-black/10 cursor-pointer hover:scale-125 duration-200 ease-in-out"
            >
              <Trash2 size={16} color="red" />
            </div>
          </div>
          <div className=" my-2">
            <h1 className="text-foreground font-semibold mb-[6px] text-3xl ">
              {currentTask?.title}
            </h1>
            <p className="text-xs">{currentTask?.description}</p>
          </div>
          <TaskStats currentTask={currentTask} />
          {/* List out all comments */}
          {currentTask?.comments?.map((comment) => {
            return <Comment key={comment.id} comment={comment} />;
          })}
          {/* Comment input field */}
          <CommentField
            setLoading={setLoading}
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            loading={loading}
          />
        </div>
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
