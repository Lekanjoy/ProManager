"use client";
import { useRef, useState } from "react";
import { collapseAside } from "../features/asideCollapseSlice";
import logo from "@/public/assets/colorfilter.svg";
import collapse from "@/public/assets/collapse.svg";
import search from "@/public/assets/search-normal.svg";
import avatar from "@/public/assets/avatar.svg";
import Image from "next/image";
import { useAuth } from "@/hooks/UseAuth";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import UseCloseOnOutsideClick from "@/hooks/UseCloseOnOutsideClick";
import Link from "next/link";
import { useAppDispatch, useTypedSelector } from "@/store/store";
import { InviteDialog } from "./ui/components/InviteDialog";

const Header = () => {
  const dispatch = useAppDispatch();
  const collapseState = useTypedSelector((store) => store.collapse);
  const { user } = useAuth();
  const [showUser, setShowUser] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userProfileRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  const logOut = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggingOut(false);
    return router.push("/login");
  };

  return (
    <header className="w-full fixed z-50 bg-white left-0 top-0 flex px-6 py-[22px] shadow-md items-center justify-between gap-x-10">
      <div className="flex justify-between gap-x-11 items-center">
        <Link href={"/"} className="flex gap-x-2 items-center">
          <Image src={logo} alt="Logo" />
          <p className="text-xxl text-[#0D062D] font-semibold lg:text-2xl">
            ProManager
          </p>
        </Link>
        <Image
          src={collapse}
          alt="collapse icon"
          onClick={() => dispatch(collapseAside())}
          className={`cursor-pointer hidden 
          ${collapseState ? "" : "rotate-180"}
          lg:flex`}
        />
      </div>

      <div className="relative hidden lg:block">
        <input
          type="search"
          placeholder="Search for anything..."
          className="w-full bg-[#F5F5F5] pl-10 pr-2 py-3 rounded-md"
        />
        <Image
          src={search}
          alt="search icon"
          className="absolute top-[13px] left-2"
        />
      </div>
      <div className="flex gap-x-2 items-center lg:gap-x-5">
        <div className="flex gap-x-2 items-center text-primColor">
          <InviteDialog />
        </div>
        <div className="relative flex items-center gap-x-2">
          <Image
            src={avatar}
            alt="user profile"
            className="cursor-pointer w-8 h-8"
            onClick={() => setShowUser(!showUser)}
            ref={triggerRef}
          />
          <span className="absolute right-0 top-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
          {showUser && (
            <UseCloseOnOutsideClick
              Ref={userProfileRef}
              isOpen={showUser}
              setIsOpen={setShowUser}
              excludeRef={triggerRef}
            >
              <div className="z-10 absolute top-[62px] right-0 bg-white shadow border rounded-md p-4 flex flex-col">
                <p className="text-[#0D062D] font-medium leading-tight ">
                  Hello, {user?.email}
                </p>
                <button
                  disabled={isLoggingOut}
                  onClick={logOut}
                  className={`text-white px-2 py-1 bg-secColor mt-4 rounded ${
                    isLoggingOut && "cursor-not-allowed bg-secColor/60"
                  }`}
                >
                  Logout
                </button>
              </div>
            </UseCloseOnOutsideClick>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
