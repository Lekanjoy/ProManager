"use client";
import { useTypedSelector } from "@/store/store";
import SideBar from "../SideBar";
import AddTaskModal from "../projectBoard/AddTaskModal";
import ProjectContainer from "../projectBoard/ProjectContainer";
import TaskCardDetails from "../projectBoard/TaskCardDetails";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/UseAuth";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import Link from "next/link";

const Dashboard = () => {
  const showModal = useTypedSelector((store) => store.modal);
  const showTask = useTypedSelector((store) => store.taskDetailsModal);
  const supabase = createClient();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        console.error("User is not authenticated");
        return;
      }
      const { data, error } = await supabase
        .from("userProfile")
        .select("*")
        .eq("userID", user?.id);

      if (error) {
        toast({
          title: "Please set your profile",
          action: (
            <ToastAction altText="Settings">
              <Link href="/settings">Settings</Link>
            </ToastAction>
          ),
        });
        console.error("Profile not found for user");
        throw error;
      }
    };

    getProfile();
  }, [user]);

  const collapseStore = useTypedSelector((store) => store.collapse);

  return (
    <>
      <div className=" relative flex w-full ">
        <div className="mt-[95px] p-0">
          <SideBar />
        </div>
        <section
          className={`px-6 w-full mb-20 z-[1] ${
            collapseStore
              ? "lg:pl-[20%] lg:ml-3 lg:ease-in-out lg:duration-1000"
              : "lg:pl-6 lg:ease-in-out lg:duration-1000"
          }`}
        >
          <ProjectContainer />
        </section>
      </div>
      {/* Modals */}
      {showModal && <AddTaskModal />}
      {showTask && <TaskCardDetails />}
    </>
  );
};

export default Dashboard;
