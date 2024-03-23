"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { generateCommentId } from "../../hooks/generateId";
import { toggleModal } from "../../features/taskDetailsModalSlice";
import { setActionTriggered } from "../../features/isActionTriggeredSlice";
import { useAppDispatch, useTypedSelector } from "../../store/store";
import { taskDataObj } from "../../types";
import { toast } from "react-toastify";
import file from "@/public/assets/folder-2.svg";
import comment from "@/public/assets/comments.svg";
import member from "@/public/assets/member.svg";
import member1 from "@/public/assets/member1.svg";
import member2 from "@/public/assets/member2.svg";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

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

  async function addComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const newCommentData = {
      id: generateCommentId(),
      text: commentText,
      author: user?.id as string,
    };

    dispatch(setActionTriggered(true));

    // Retrieve the existing comments first
    const { data: existingTasks, error: taskError } = await supabase
      .from("teams")
      .select("tasks")
      .eq("admin_id", user?.id)
      .single();

    if (taskError) {
      toast.error("Please try again ", {
        pauseOnHover: false,
      });
      return;
    }

    const existingDataFromDatabase: taskDataObj[] = existingTasks?.tasks;
    const targetObject = existingDataFromDatabase.find(
      (item) => item.task_id === selectedTask.task_id
    );

    // Update the comments property
    targetObject?.comments.push(newCommentData);

    const { data: updatedTask, error: updateError } = await supabase
      .from("teams")
      .update({ tasks: existingDataFromDatabase })
      .eq("admin_id", user?.id)
      .select();

    if (!updateError && targetObject) {
      setTaskDetails(targetObject);
      setCommentText("");
      dispatch(setActionTriggered(false));
      setLoading(false);
      toast.success("Added new comment ", {
        pauseOnHover: false,
      });
    } else {
      console.error("Error updating task with comments:", updateError);
      setLoading(false);
      toast.error("Please try again ", {
        pauseOnHover: false,
      });
    }
  }

  return (
    <section className="z-50 bg-[rgba(0,0,0,0.5)] w-full h-screen fixed left-0 top-0 flex justify-center items-center">
      <div className="relative flex flex-col gap-y-3 bg-white shadow-md rounded-lg px-8 py-6 w-[500px] max-h-[420px] overflow-auto">
        <p
          className={`py-1 px-[6px] w-fit rounded text-white text-xs font-medium ${
            taskDetails.priority === "High"
              ? "bg-red-500"
              : taskDetails.priority === "Medium"
              ? "bg-yellow-300"
              : "bg-gray-500"
          }
          `}
        >
          {taskDetails.priority}
        </p>
        <div className=" my-2">
          <h1 className="text-secColor font-semibold mb-[6px] text-3xl ">
            {taskDetails.title}
          </h1>
          <p className="text-xs">{taskDetails.description}</p>
        </div>
        <div className="flex items-center gap-x-6">
          <div className="flex">
            <Image src={member} alt="Team members avatar" />
            <Image src={member2} alt="Team members avatar" className="-ml-2" />
            <Image src={member1} alt="Team members avatar" className="-ml-2" />
          </div>
          <div className="flex gap-x-1 items-center text-xs">
            <Image src={comment} alt="Comment Icon" />
            <p>{taskDetails.comments.length} comments</p>
          </div>
          <div className="flex gap-x-1 items-center text-xs">
            <Image src={file} alt="files Icon" />
            <p>
              {taskDetails.files.length} file
              {taskDetails.files.length > 1 && "s"}
            </p>
          </div>
        </div>

        {taskDetails.comments?.map((comment) => {
          return (
            <div
              key={comment.id}
              className=" w-full bg-[#F5F5F5] p-2 flex-col rounded-tl-none rounded-md flex gap-x-2"
            >
              <div className="flex gap-x-2  items-center">
                <Image src={member} alt="Team members avatar" />
                <p className="font-medium text-secColor text-sm">Jeff Arthur</p>
              </div>
              <p className="text-sm text-primColor pl-8">{comment.text}</p>
            </div>
          );
        })}

        <form
          onSubmit={addComment}
          className="relative w-full mt-2 grid gap-y-2"
        >
          <textarea
            rows={1}
            // cols={5}
            placeholder="Drop a comment . . . ."
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
      </div>
      <p
        onClick={() => dispatch(toggleModal())}
        className="absolute right-8 z-20 top-3 bg-red-500 text-white cursor-pointer w-4 h-4 flex justify-center items-center p-4 font-bold rounded-full"
      >
        X
      </p>
    </section>
  );
};

export default TaskCardDetails;
