"use client";
import { useAuth } from "@/hooks/UseAuth";
import { useTypedSelector } from "@/store/store";
import { useState } from "react";
import { toast } from "react-toastify";
import { inviteMember } from "@/serverActions/inviteAction";

const InviteForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const tasksData = useTypedSelector((store) => store.tasks.tasks);
  const { user } = useAuth();

  const admin_id = tasksData[0]?.admin_id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Admin should only have the invitation privilege
    if (user?.id !== admin_id) {
      toast.warn("Member invites by admin only", {
        pauseOnHover: false,
      });
      setLoading(false);
      return;
    }

    try {
      await inviteMember(email, user?.id as string);
      setLoading(false);
      setEmail("");
      toast.success("Invitation sent", {
        pauseOnHover: false,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-4/5 flex flex-col gap-y-4 px-4 py-8 bg-white border shadow rounded lg:w-[500px]"
    >
      <h2 className=" text-xl font-semibold mb-4">Invite a team member</h2>
      <input
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Enter team member email address"
        className="border rounded-[6px] p-2 outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className={
          loading
            ? `bg-secColor/80 text-black rounded-[6px] border border-black py-2 cursor-not-allowed opacity-50`
            : "bg-secColor text-white rounded-[6px]  py-2 cursor-pointer"
        }
      >
        {loading ? "Inviting..." : "Invite"}
      </button>
    </form>
  );
};

export default InviteForm;
