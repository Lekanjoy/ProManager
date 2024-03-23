'use client'
import Header from "@/components/Header";
import ProjectHeaders from "@/components/ProjectHeaders";
import SideBar from "@/components/SideBar";
import AddTaskModal from "@/components/projectBoard/AddTaskModal";
import ProjectContainer from "@/components/projectBoard/ProjectContainer";
import TaskCardDetails from "@/components/projectBoard/TaskCardDetails";
import { useTypedSelector } from "@/store/store";
import AuthButton from "@/components/AuthButton";
import {  useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";


export default  function DashboardPage() {
  const supabase = createClient();
  const showModal = useTypedSelector((store) => store.modal);
  const showTask = useTypedSelector((store) => store.taskDetailsModal);
  const router = useRouter()

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push( "/login")
  }

}
getUser()

  return (
    <main className="relative min-h-screen bg-white w-full">
      <Header />
      <div className=" relative flex w-full ">
        <SideBar />
        <section className=" flex flex-col px-6 w-full mb-20">
          <ProjectHeaders />
          <ProjectContainer />
        </section>
      </div>
      {/* Modal */}
      {showModal && <AddTaskModal />}
      {showTask && <TaskCardDetails />}
    </main>
  );
}


