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
  setIsAlertModalOpen: Dispatch<SetStateAction<boolean>>;
  deleteAction: (id: string) => void;
  actionTakenOn: string;
  id?: string;
}

const DeleteDialog = ({
  id,
  isAlertModalOpen,
  setIsAlertModalOpen,
  deleteAction,
  actionTakenOn,
}: DeleteDialogProps) => {
  return (
    <AlertDialog open={isAlertModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Delete {actionTakenOn}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {actionTakenOn.toLowerCase()}?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row">
          <AlertDialogAction onClick={() => setIsAlertModalOpen(false)}>
            Cancel
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => deleteAction(id as string)}
            className="bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
