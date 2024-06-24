import Image from "next/image";
import React, { useState } from "react";
import CommentActions from "../ui/components/CommentActions";
import member from "@/public/assets/member.svg";
import { useAuth } from "@/hooks/UseAuth";
import EditComment from "../ui/components/EditComment";
import DeleteDialog from "../ui/components/DeleteDialog";
import { getTeamData } from "@/hooks/getTeamData";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "../ui/use-toast";
import { setActionTriggered } from "@/features/isActionTriggeredSlice";
import { useAppDispatch } from "@/store/store";

type commentProps = {
  comment: {
    id: string;
    text: string;
    author: string;
    authorId: string;
  };
};

const Comment = ({ comment }: commentProps) => {
  const supabase = createClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { id, text, author, authorId } = comment;

  async function deleteComment(id: string) {
    dispatch(setActionTriggered(true));

    // Delete selected Comment
    const teamData = await getTeamData(user);

    if (teamData && teamData.tasks) {
      const updatedTasks = teamData.tasks.map((task) => {
        const comments = task.comments.filter((comment) => comment.id !== id);
        return { ...task, comments }; // Create a new task object with filtered comments
      });

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
        dispatch(setActionTriggered(false));
        setShowDeleteCommentModal(false);
        toast({
          variant: "success",
          description: "Comment Deleted",
        });
      } else {
        dispatch(setActionTriggered(false));
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

    dispatch(setActionTriggered(true));

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
        dispatch(setActionTriggered(false));
        setShowEditModal(false);
        toast({
          variant: "success",
          description: "Comment Edited",
        });
      } else {
        dispatch(setActionTriggered(false));
        console.error("Error editing comment");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Comment edit failed",
        });
      }
    }
  }

  // Check if current user is author
  const isAuthor = user?.id === authorId;

  return (
    <div data-testid="comment" className={` w-full bg-[#F5F5F5] p-2 flex-col rounded-tl-none rounded-md flex  gap-x-2 break-words  ${isAuthor ? 'border-l-4 border-l-[#00796b]' : ''}`}>
      <div className="w-full flex gap-x-1 justify-between items-center">
        <div className="flex gap-x-1 items-center">
          <Image src={member} alt="Team members avatar" />
          <p className="font-bold text-secColor text-xs">{author}</p>
        </div>
        {/* Show comment actions only if current user is the author */}
        {isAuthor && (
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
