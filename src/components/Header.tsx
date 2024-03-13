import { useState } from "react";
import { collapseAside } from "../features/asideCollapseSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../supabase";
import logo from "../assets/colorfilter.svg";
import collapse from "../assets/collapse.svg";
import search from "../assets/search-normal.svg";
import questions from "../assets/message-question.svg";
import notif from "../assets/notification.svg";
import avatar from "../assets/avatar.svg";

const Header = () => {
  const dispatch = useDispatch();
  const collapseState = useSelector((store: any) => store.collapse);
  const { user } = useAuth();

  const [showUser, setShowUser] = useState(false);
  return (
    <header className="w-full flex px-6 py-[22px] border-b border-[#DBDBDB] items-center justify-between gap-x-10">
      <div className="flex justify-between gap-x-11 items-center">
        <div className="flex gap-x-2 items-center">
          <img src={logo} alt="Logo" />
          <p className="text-xxl text-[#0D062D] font-semibold lg:text-2xl">
            ProManager
          </p>
        </div>
        <img
          src={collapse}
          alt="collapse icon"
          onClick={() => dispatch(collapseAside())}
          className={`cursor-pointer hidden 
          ${collapseState ? "" : "rotate-180"}
          lg:flex`}
        />
      </div>

      <div className="relative ">
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
      <div className="flex gap-x-5 items-center">
        <div className="flex gap-x-2 items-center">
          <img src={questions} alt="questions" />
          <img src={notif} alt="notif" />
        </div>
        <div className="relative flex items-center gap-x-2">
          <img src={avatar} alt="user profile" className="cursor-pointer" onClick={() => setShowUser(!showUser)}/>
          {showUser && (
            <div className="z-10 absolute top-[62px] right-0 bg-white shadow border rounded-md p-4 flex flex-col">
              <p className="text-[#0D062D] font-medium leading-tight ">
                {user?.email}
              </p>
              <p className="text-[#787486] text-sm leading-tight">Lagos, NG</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
