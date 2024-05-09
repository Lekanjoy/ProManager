'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ChangeEvent, useState } from "react"

export default function EditComment() {
    const [editValue, setEditValue] = useState('');

    const handleEditValue = (e: ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value)
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit comment</DialogTitle>
          <DialogDescription>
            Make changes to your comment here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
          <div className="flex flex-col gap-y-4">
            <Input id="comment" onChange={(e) => handleEditValue(e)} value={editValue} className="col-span-3" />
          </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
