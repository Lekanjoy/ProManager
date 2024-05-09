"use client";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getTeamData } from "@/hooks/getTeamData";
import { useAuth } from "@/hooks/UseAuth";
import { generateCommentId } from "../../hooks/generateId";
import { toggleModal } from "../../features/taskDetailsModalSlice";
import { setActionTriggered } from "../../features/isActionTriggeredSlice";
import { useAppDispatch, useTypedSelector } from "../../store/store";
import { taskDataObj } from "../../types";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import DeleteDialog from "../ui/components/DeleteDialog";
import Comment from "./Comment";
import CommentField from "./CommentField";
import TaskStats from "./TaskStats";

const TaskCardDetails = () => {
  const supabase = createClient();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [commentText, setCommentText] = useState("");
  const selectedTask: taskDataObj = useTypedSelector(
    (store) => store.tasks.selectedTask
  );
  const [taskDetails, setTaskDetails] = useState(selectedTask);
  const [loading, setLoading] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  async function addComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const newCommentData = {
      id: generateCommentId(),
      text: commentText,
      author: user?.email as string, //TODO: This should be display name after user has set it
    };

    dispatch(setActionTriggered(true));

    const teamData = await getTeamData(user);

    const existingDataFromDatabase = teamData?.tasks;
    const targetObject = existingDataFromDatabase?.find(
      (item) => item.task_id === selectedTask.task_id
    );

    // // Update the comments property
    targetObject?.comments.push(newCommentData);

    // Select matching team database and update tasks column comment for current admin or team member
    const { data: updatedTaskAdmin, error: updateErrorAdmin } = await supabase
      .from("teams")
      .update({ tasks: existingDataFromDatabase })
      .eq("admin_id", user?.id as string)
      .select();

    const { data: updatedTaskMember, error: updateErrorMember } = await supabase
      .from("teams")
      .update({ tasks: existingDataFromDatabase })
      .contains("team_member @>", '["' + user?.id + '"]')
      .select();

    // Combine the results
    const updatedTask = updatedTaskAdmin?.concat(updatedTaskMember ?? []);

    if (updatedTask && updatedTask?.length > 0 && targetObject) {
      setTaskDetails(targetObject);
      setCommentText("");
      dispatch(setActionTriggered(false));
      setLoading(false);
      toast.success("Added new comment ", {
        pauseOnHover: false,
      });
    } else {
      console.error("Error updating task with comment");
      setLoading(false);
      toast.error("Please try again ", {
        pauseOnHover: false,
      });
    }
  }

  async function deleteTask() {
    // Admin should only have the task deletion privilege
    const teamData = await getTeamData(user);
    if (user?.id !== teamData?.admin_id) {
      toast.warn("Delete action by admin only", {
        pauseOnHover: false,
      });
      return;
    }

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
      setIsAlertModalOpen(false);
      dispatch(toggleModal());
      toast.success("Task Deleted ", {
        pauseOnHover: false,
      });
    } else {
      console.error("Error deleting task");
      toast.error("Something went wrong!", {
        pauseOnHover: false,
      });
    }
  }

  const priorityStyle =
    taskDetails.priority === "High"
      ? "bg-red-500"
      : taskDetails.priority === "Medium"
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
              {taskDetails.priority}
            </p>
            <div
              onClick={() => setIsAlertModalOpen(true)}
              className="flex p-2 rounded-full items-center justify-center bg-black/10 cursor-pointer hover:scale-125 duration-200 ease-in-out"
            >
              <Trash2 size={16} color="red" />
            </div>
          </div>
          <div className=" my-2">
            <h1 className="text-foreground font-semibold mb-[6px] text-3xl ">
              {taskDetails.title}
            </h1>
            <p className="text-xs">{taskDetails.description}</p>
          </div>

          <TaskStats taskDetails={taskDetails} />

          {/* List out all comments */}
          {taskDetails.comments?.map((comment) => {
            return <Comment key={comment.id} comment={comment} />;
          })}
          {/* List out all comments */}

          {/* Comment input field */}
          <CommentField
            addComment={addComment}
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            loading={loading}
          />
          {/* Comment input field */}
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
        isAlertModalOpen={isAlertModalOpen}
        setIsAlertModalOpen={setIsAlertModalOpen}
        deleteAction={deleteTask}
        actionTakenOn={"Task"}
      />
    </>
  );
};

export default TaskCardDetails;
