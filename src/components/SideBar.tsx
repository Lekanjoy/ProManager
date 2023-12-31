import { useState } from "react";
import { useSelector } from "react-redux";
import home from "../assets/category.svg";
import messages from "../assets/message.svg";
import tasks from "../assets/task-square.svg";
import members from "../assets/profile-user.svg";
import settings from "../assets/setting-2.svg";

interface navDataProps {
  id: number;
  name: string;
  icon: string;
}

const navData: navDataProps[] = [
  {
    id: 0,
    name: "Home",
    icon: home,
  },
  {
    id: 1,
    name: "Messages",
    icon: messages,
  },
  {
    id: 2,
    name: "Tasks",
    icon: tasks,
  },
  {
    id: 3,
    name: "Members",
    icon: members,
  },
  {
    id: 4,
    name: "Settings",
    icon: settings,
  },
];

const SideBar = () => {
  const collapseStore = useSelector((store: any) => store.collapse);

  return (
    <aside
      className={` bg-white flex flex-col pl-[22px] pt-8 min-h-[85vh]  border-r border-[#DBDBDB] 
          ${collapseStore ? "sidebar" : "sidebar-hidden"}
          `}
    >
      <nav className="flex flex-col gap-y-7">
        {navData.map((navItem) => {
          return (
            <div
              key={navItem.id}
              className={`flex gap-x-4  ${
                collapseStore ? "sidebar" : "sidebar-hidden"
              }`}
            >
              <img src={navItem.icon} alt={navItem.name} />
              <p className="text-primColor font-medium ">{navItem.name}</p>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
