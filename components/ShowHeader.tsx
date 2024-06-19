"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";

const ShowHeader = () => {
  const pathname = usePathname();
  const isRegistrationPage =
    pathname === "/" ||
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/set-password";
  return <>{isRegistrationPage ? null : <Header />}</>;
};

export default ShowHeader;
