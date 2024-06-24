import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import TaskStats from "./TaskStats";
import CommentField from "./CommentField";
import Comment from "./Comment";
import { taskDataObj } from "@/types";
import { User } from "@supabase/supabase-js";

interface cardDetailsProps {
  currentTask: taskDataObj;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  commentText: string;
  setCommentText: Dispatch<SetStateAction<string>>;
  user: User | null;
  loading: boolean;
}

const CardDetails = ({
  currentTask,
  setIsDeleteModalOpen,
  setLoading,
  commentText,
  setCommentText,
  user,
  loading,
}: cardDetailsProps) => {
  // Update scroll position when comments change
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.scrollTop = card.scrollHeight;
    }
  }, [currentTask?.comments]);

  const priorityStyle =
    currentTask?.priority === "High"
      ? "bg-red-500"
      : currentTask?.priority === "Medium"
      ? "bg-yellow-300"
      : "bg-gray-500";

  return (
    <div
      data-testid="cardDetails"
      ref={cardRef}
      className="z-[23] relative overflow-x-hidden flex flex-col gap-y-3 bg-white shadow-md rounded-lg px-6 py-6 max-h-[420px] overflow-auto w-full lg:w-[500px]"
    >
      <div className="sticky bg-white z-[5] w-full py-2 -top-[24px]  right-0">
        <div className="flex justify-between items-center">
          <p
            className={`py-1 px-[6px] w-fit rounded text-white text-xs font-medium ${priorityStyle}`}
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
        <div className="my-2">
          <h1 className="text-foreground font-semibold mb-[6px] text-3xl">
            {currentTask?.title}
          </h1>
          <p className="text-xs">{currentTask?.description}</p>
        </div>
        <TaskStats currentTask={currentTask} />
      </div>
      {currentTask?.comments?.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <div className=" w-full sticky bottom-0">
        <div className="min-w-full absolute inset-0 p-4 -left-10 -right-10 blurCard"></div>
        <div className="relative p-4">
          <CommentField
            setLoading={setLoading}
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
