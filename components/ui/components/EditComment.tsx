"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface editCommentProps {
  showEditModal: boolean;
  setShowEditModal: Dispatch<SetStateAction<boolean>>;
  comment: { id: string; text: string; author: string };
  editComment: (id: string, editTextValue: string) => Promise<void>;
}

export default function EditComment({
  showEditModal,
  setShowEditModal,
  comment,
  editComment,
}: editCommentProps) {
  const [editValue, setEditValue] = useState(comment?.text);

  useEffect(() => {
    setEditValue(comment?.text);
  }, [showEditModal]);

  const handleEditValue = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  return (
    <Dialog open={showEditModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit comment</DialogTitle>
          <div
            onClick={() => setShowEditModal(false)}
            className="absolute cursor-pointer right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </div>
          <DialogDescription>
            Make changes to your comment here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <Input
            id="comment"
            onChange={handleEditValue}
            value={editValue}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button onClick={() => editComment(comment?.id, editValue)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
