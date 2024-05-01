"use client";
import { useTypedSelector } from "@/store/store";
import Header from "../Header";
import SideBar from "../SideBar";
import AddTaskModal from "../projectBoard/AddTaskModal";
import ProjectContainer from "../projectBoard/ProjectContainer";
import TaskCardDetails from "../projectBoard/TaskCardDetails";

const Dashboard = () => {
  const showModal = useTypedSelector((store) => store.modal);
  const showTask = useTypedSelector((store) => store.taskDetailsModal);

  return (
    <>
      <Header />
      <div className=" relative flex w-full ">
        <SideBar />
        <section className="px-6 w-full mb-20">
          <ProjectContainer />
        </section>
      </div>
      {/* Modal */}
      {showModal && <AddTaskModal />}
      {showTask && <TaskCardDetails />}
    </>
  );
};

export default Dashboard;
