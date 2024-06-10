import Link from "next/link";
import Image from "next/image";
import AuthButton from "../components/AuthButton";
import heroBg from "@/public/assets/Design.png";
import logo from "@/public/assets/colorfilter.svg";
import Vector from "@/public/assets/Vector.png";

export default function HomePage() {
  return (
    <div className="flex-1 w-full flex flex-col h-screen">
      <nav className="w-full bg-white shadow  flex justify-between items-center px-3 border-b border-b-foreground/10 h-[10vh] md:px-5 lg:px-12 lg:py-4">
        <Link href={'/'} className="flex gap-x-2 items-center">
          <Image src={logo} alt="Logo" />
          <p className="text-xl text-[#0D062D] font-semibold lg:text-2xl">
            ProManager
          </p>
        </Link>
        <AuthButton />
      </nav>
      <div className="w-full px-3 mt-10 flex flex-col gap-y-8 items-center h-[90vh] md:px-5 md:flex-row md:mt-0 lg:px-12 lg:flex-row">
        <div className="w-full flex flex-col gap-y-3 lg:w-1/2">
          <h1 className="font-semibold leading-[1.4] text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px] ">
            Manage your{" "}
            <span className="relative">
              Team <Image src={Vector} alt="vector" className="absolute top-0 right-0"/>
            </span>{" "}
            Effortlessly - Minimal and Bloat-Free.
          </h1>
          <p className="">
            Just the features you expect to focus on what’s important
          </p>
          <Link
            href="/dashboard"
            className="px-3 py-2 w-fit bg-[#0D062D] text-white rounded-md"
          >
            Get Started
          </Link>
        </div>
        <div className="w-full flex justify-center md:w-1/2 md:flex md:justify-end">
          <div className="relative w-[300px] h-[300px]  bg-gray-300 rounded-full lg:w-[500px] lg:min-h-[500px]">
            <div className="">
              <Image
                src={heroBg}
                alt="Hero background"
                className="absolute top-[10px] right-[5px] z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
