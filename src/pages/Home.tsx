import Header from "../components/Header";
import SideBar from "../components/SideBar";
import ProjectHeaders from "../components/ProjectHeaders";
import ProjectContainer from "../components/projectBoard/ProjectContainer";
import AddTaskModal from "../components/projectBoard/AddTaskModal";
import TaskCardDetails from "../components/projectBoard/TaskCardDetails";
import { useTypedSelector } from "../store/store";

const Home = () => {
  const showModal = useTypedSelector((store) => store.modal);
  const showTask = useTypedSelector((store) => store.taskDetailsModal);
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
};

export default Home;
