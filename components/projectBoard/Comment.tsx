import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import CommentActions from "../ui/components/CommentActions";
import member from "@/public/assets/member.svg";
import { useAuth } from "@/hooks/UseAuth";
import EditComment from "../ui/components/EditComment";
import DeleteDialog from "../ui/components/DeleteDialog";
import { getTeamData } from "@/hooks/getTeamData";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "../ui/use-toast";
import { taskDataObj } from "@/types";
import { useTypedSelector } from "@/store/store";

type commentProps = {
  comment: {
    id: string;
    text: string;
    author: string;
  };
  setTaskDetails: Dispatch<SetStateAction<taskDataObj>>;
};

const Comment = ({ comment, setTaskDetails }: commentProps) => {
  const supabase = createClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const tasksData = useTypedSelector((store) => store.tasks.tasks);

  const selectedTask: taskDataObj = useTypedSelector(
    (store) => store.tasks.selectedTask
  );
  const { id, text, author } = comment;

  async function deleteComment(id: string) {
    // Delete selected Comment
    const teamData = await getTeamData(user);

    if (teamData && teamData.tasks) {
      const updatedTasks = teamData.tasks.map((task) => {
        const comments = task.comments.filter((comment) => comment.id !== id);
        return { ...task, comments }; // Create a new task object with filtered comments
      });

      const newEditedTaskData = updatedTasks.filter(
        (task) => task.task_id === selectedTask.task_id
      );

      //Update database with filtered comments
      const { data: updatedTaskAdmin, error: updateErrorAdmin } = await supabase
        .from("teams")
        .update({ tasks: updatedTasks })
        .eq("admin_id", user?.id as string)
        .select();

      const { data: updatedTaskMember, error: updateErrorMember } =
        await supabase
          .from("teams")
          .update({ tasks: updatedTasks })
          .contains("team_member @>", '["' + user?.id + '"]')
          .select();

      // Combine the results
      const updatedTask = updatedTaskAdmin?.concat(updatedTaskMember ?? []);

      if (updatedTask && updatedTask?.length > 0) {
        setShowDeleteCommentModal(false);
        setTaskDetails(newEditedTaskData[0]);
        toast({
          variant: "success",
          description: "Comment Deleted",
        });
      } else {
        console.error("Error deleting comment");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Comment delete failed",
        });
      }
    }
  }

  async function editComment(id: string, editTextValue: string) {
    // Exit early if editTextValue is empty or only whitespace
    if (editTextValue.trim() === "") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Comment field cannot be empty",
      });
      return;
    }
    const teamData = await getTeamData(user);
    // Update selected comment
    if (teamData && teamData.tasks) {
      const updatedTasks = teamData.tasks.map((task) => {
        const updatedComments = task.comments.map((comment) => {
          if (comment.id === id) {
            // Update comment text
            return { ...comment, text: editTextValue };
          }
          return comment;
        });
        return { ...task, comments: updatedComments };
      });

      const newEditedTaskData = updatedTasks.filter(
        (task) => task.task_id === selectedTask.task_id
      );
      //Update database with edited comment
      const { data: updatedTaskAdmin, error: updateErrorAdmin } = await supabase
        .from("teams")
        .update({ tasks: updatedTasks })
        .eq("admin_id", user?.id as string)
        .select();

        const { data: updatedTaskMember, error: updateErrorMember } =
        await supabase
          .from("teams")
          .update({ tasks: updatedTasks })
          .contains("team_member @>", '["' + user?.id + '"]')
          .select();

      // Combine the results
      const updatedTask = updatedTaskAdmin?.concat(updatedTaskMember ?? []);

      if (updatedTask && updatedTask?.length > 0) {
        setTaskDetails(newEditedTaskData[0]);
        setShowEditModal(false);
        toast({
          variant: "success",
          description: "Comment Edited",
        });
      } else {
        console.error("Error editing comment");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Comment edit failed",
        });
      }
    }
  }

  return (
    <div className=" w-full bg-[#F5F5F5] p-2 flex-col rounded-tl-none rounded-md flex  gap-x-2 break-words">
      <div className="w-full flex gap-x-1 justify-between items-center">
        <div className="flex gap-x-1 items-center">
          <Image src={member} alt="Team members avatar" />
          <p className="font-bold text-secColor text-xs">{author}</p>
        </div>
        {/* Show comment actions only if current user is the author */}
        {author === user?.email && (
          <div className="mr-4">
            <CommentActions
              setShowDeleteCommentModal={setShowDeleteCommentModal}
              setShowEditModal={setShowEditModal}
            />
          </div>
        )}
      </div>
      <p className="text-sm text-primColor pl-8">{text}</p>
      <EditComment
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        comment={comment}
        editComment={editComment}
      />
      <DeleteDialog
        isAlertModalOpen={showDeleteCommentModal}
        setIsAlertModalOpen={setShowDeleteCommentModal}
        actionTakenOn={"Comment"}
        id={id}
        deleteAction={deleteComment}
      />
    </div>
  );
};

export default Comment;
