"use client";
import { setActionTriggered } from "@/features/isActionTriggeredSlice";
import { generateCommentId } from "@/hooks/generateId";
import { getTeamData } from "@/hooks/getTeamData";
import { useAppDispatch, useTypedSelector } from "@/store/store";
import { taskDataObj } from "@/types";
import { User } from "@supabase/supabase-js";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useToast } from "../ui/use-toast";
import { createClient } from "@/utils/supabase/client";

type commentFieldProps = {
  setLoading: Dispatch<SetStateAction<boolean>>;
  commentText: string;
  setCommentText: Dispatch<SetStateAction<string>>;
  user: User | null;
  loading: boolean;
};

const CommentField = ({
  setLoading,
  commentText,
  setCommentText,
  user,
  loading,
}: commentFieldProps) => {
  const supabase = createClient();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const selectedTask: taskDataObj = useTypedSelector(
    (store) => store.tasks.selectedTask
  );
  const [authorName, setAuthorName] = useState(" ");


  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("userProfile")
          .select("*")
          .eq("userID", user.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setAuthorName(data[0].fullName);
        } else {
          console.error("Profile not found for user", user.id);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Please set your profile",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfile();
  }, [user]);
  

  async function addComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const newCommentData = {
      id: generateCommentId(),
      text: commentText,
      author: authorName || (user?.email as string),
      authorId: user?.id as string
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
      setCommentText("");
      dispatch(setActionTriggered(false));
      setLoading(false);
      toast({
        variant: "success",
        description: "Comment added",
      });
    } else {
      console.error("Error updating task with comment");
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Comment failed",
      });
    }
  }

  // TODO: Make this component fixed

  return (
    <form onSubmit={addComment} className="relative w-full mt-2 grid gap-y-2">
      <textarea
        rows={1}
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className=" border border-primColor rounded-tl-none resize-none text-sm text-secColor placeholder:text-secColor w-full rounded-md py-3 px-2"
      ></textarea>
      {commentText.length > 0 && (
        <button
          disabled={loading}
          className={` text-white px-3 py-1 rounded-lg  justify-self-end  w-fit ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-secColor"
          }`}
        >
          Send
        </button>
      )}
    </form>
  );
};

export default CommentField;
