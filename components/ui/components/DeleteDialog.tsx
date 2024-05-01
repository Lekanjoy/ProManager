import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

  interface DeleteDialogProps {
    isAlertModalOpen: boolean;
    setIsAlertModalOpen:  Dispatch<SetStateAction<boolean>>;
    deleteTask: () => void;
  }

const DeleteDialog = ({isAlertModalOpen, setIsAlertModalOpen, deleteTask}: DeleteDialogProps) => {

  return (
    <AlertDialog open={isAlertModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row">
            <AlertDialogAction onClick={() => setIsAlertModalOpen(false)}>
              Cancel
            </AlertDialogAction>
            <AlertDialogAction onClick={deleteTask} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}

export default DeleteDialog