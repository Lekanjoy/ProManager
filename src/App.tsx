import { useSelector} from "react-redux";
import Header from "./components/Header";
import ProjectHeaders from "./components/ProjectHeaders";
import SideBar from "./components/SideBar";
import ProjectContainer from "./components/projectBoard/ProjectContainer";
import AddTaskModal from "./components/projectBoard/AddTaskModal";
import TaskCardDetails from "./components/projectBoard/TaskCardDetails";

function App() {
  const showModal = useSelector((store) => store.modal);
  const showTask = useSelector((store) => store.taskDetailsModal);

  return (
    <main className="relative min-h-screen bg-white w-full">
      <Header />
      <div className=" relative flex w-full ">
        <SideBar />
        <section className=" flex flex-col px-12 w-full mb-20">
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

export default App;
