import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/UseAuth";
import { useState } from "react";
import { useToast } from "../use-toast";
import { getTeamData } from "@/hooks/getTeamData";
import { inviteMember } from "@/serverActions/inviteAction";
import { X } from "lucide-react";

export function InviteDialog() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  async function sendMemberInvitation() {
      
      if (email.trim().length === 0) {
          toast({
        variant: "destructive",
        description: "Please provide an email address",
      });
      return;
    }
    
    setLoading(true);
    //  Only Admin should have invitation privilege
    const data = await getTeamData(user);
    if (user?.id !== data?.admin_id) {
      toast({
        variant: "destructive",
        title: "Uh oh! Unauthorized!",
        description: "Member invites by admin only",
      });
      setLoading(false);
      return;
    }

    try {
      await inviteMember(email, user?.id as string);
      setLoading(false);
      setEmail("");
      toast({
        variant: "success",
        description: "Invitation sent",
      });
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: "Invitation failed",
      });
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-[#421bf1] py-1 text-white">Invite </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left">Invite Team Member</DialogTitle>
          <DialogDescription className="text-left max-w-[75%] lg:max-w-full">
            Enter the email address of team member. Click invite when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-y-4">
            <Label htmlFor="email">Email</Label>
            <Input
              required
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter team member email address"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
        <DialogClose asChild className="absolute top-4 right-2 cursor-pointer">
            <X/>
          </DialogClose>
          <Button
            onClick={sendMemberInvitation}
            type="submit"
            className={
              loading
                ? `bg-secColor/80 text-black rounded-[6px] border border-black py-2 cursor-not-allowed opacity-50`
                : "bg-secColor text-white rounded-[6px]  py-2 cursor-pointer"
            }
          >
            {loading ? "Inviting..." : "Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
