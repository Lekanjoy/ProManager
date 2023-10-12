import React from "react";
import logo from "../assets/colorfilter.svg";
import collapse from "../assets/collapse.svg";
import search from "../assets/search-normal.svg";
import calendar from "../assets/calendar-2.svg";
import questions from "../assets/message-question.svg";
import notif from "../assets/notification.svg";
import avatar from "../assets/avatar.svg";
import { collapseAside } from "../features/asideCollapseSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
    const dispatch = useDispatch();
    const collapseState = useSelector((store:any )=> store.collapse)

  return (
    <header className="w-full flex pl-[22px] pr-12 py-[22px] border-b border-[#DBDBDB] items-center justify-between gap-x-10">
      <div className="w-[20%]  flex justify-between gap-x-11 items-center">
        <div className="flex gap-x-2 items-center">
          <img src={logo} alt="Logo" />
          <p className="text-2xl text-[#0D062D] font-semibold">ProManager</p>
        </div>
        <img
          src={collapse}
          alt="collapse icon"
          onClick={() => dispatch(collapseAside())}
          className={`cursor-pointer 
          ${collapseState ? "" : "rotate-180"}
          `}
        />
      </div>

      <div className="relative w-[50%]">
        <input
          type="search"
          placeholder="Search for anything..."
          className="w-full bg-[#F5F5F5] pl-10 pr-2 py-3 rounded-md"
        />
        <img
          src={search}
          alt="search icon"
          className="absolute top-[13px] left-2"
        />
      </div>
      <div className=" w-[20%] flex gap-x-6 items-center">
        <div className="flex gap-x-6 items-center">
          <img src={calendar} alt="calendar" />
          <img src={questions} alt="questions" />
          <img src={notif} alt="notif" />
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex flex-col">
            <p className="text-[#0D062D] font-medium leading-tight">Olalekan</p>
            <p className="text-[#787486] text-sm leading-tight">Lagos, NG</p>
          </div>
          <img src={avatar} alt="user profile" />
        </div>
      </div>
    </header>
  );
};

export default Header;
