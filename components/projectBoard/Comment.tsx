import Image from "next/image";
import React, { useState } from "react";
import CommentActions from "../ui/components/CommentActions";
import member from "@/public/assets/member.svg";
import { useAuth } from "@/hooks/UseAuth";
import EditComment from "../ui/components/EditComment";
import DeleteDialog from "../ui/components/DeleteDialog";

type commentProps = {
  comment: {
    id: string;
    text: string;
    author: string;
  };
};

const Comment = ({ comment }: commentProps) => {
  const { user } = useAuth();
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);

  return (
    <div className=" w-full bg-[#F5F5F5] p-2 flex-col rounded-tl-none rounded-md flex  gap-x-2 break-words">
      <div className="w-full flex gap-x-1 justify-between items-center">
        <div className="flex gap-x-1 items-center">
          <Image src={member} alt="Team members avatar" />
          <p className="font-bold text-secColor text-xs">{comment.author}</p>
        </div>
        {/* Show comment actions if current user is the author */}
        {comment.author === user?.email && (
          <div className="mr-4">
            <CommentActions
              setShowDeleteCommentModal={setShowDeleteCommentModal}
            />
          </div>
        )}
      </div>
      <p className="text-sm text-primColor pl-8">{comment.text}</p>
      <EditComment />
      <DeleteDialog
        isAlertModalOpen={showDeleteCommentModal}
        setIsAlertModalOpen={setShowDeleteCommentModal}
        actionTakenOn={"Comment"}
      />
    </div>
  );
};

export default Comment;
