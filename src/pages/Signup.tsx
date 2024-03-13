import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../supabase";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const teamNameRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (passwordRef?.current?.value !== confirmPasswordRef?.current?.value) {
      // Toast Notification
      toast.error("Passwords do not match.", {
        pauseOnHover: false,
      });
      return;
    }
    setLoading(true);
    try {
      let { data: signUpData, error: signUpDataError } =
        await supabase.auth.signUp({
          email: emailRef?.current?.value as string,
          password: confirmPasswordRef?.current?.value as string,
        });

      // Create new team after succesful registration
      const initialTeamData = {
        team_name: teamNameRef.current?.value,
        description: descriptionRef.current?.value,
        admin_id: signUpData?.user?.id,
        team_member: [],
        tasks: [],
      };

      const { data: newTeamData, error: newTeamDataError } = await supabase
        .from("teams")
        .insert([initialTeamData])
        .select();

      if (newTeamData && signUpData?.user) {
        toast.success("Signup Successful!", {
          pauseOnHover: false,
        });
        navigate("/login");
      } else {
        throw newTeamDataError;
      }
    } catch (error) {
      // Toast Notification
      toast.error("Error Creating Account", {
        pauseOnHover: false,
      });
    }
    setLoading(false);
  }

  return (
    <section className="bg-gray-300 flex flex-col justify-center items-center w-full h-screen px-6 font-light">
      {/* <img
        src={moviesLogo}
        alt="Entertainment Webapp Logo"
        className="mb-[58px]"
      /> */}
      <form
        onSubmit={handleSignUp}
        className="border flex flex-col w-full  p-6 rounded-[10px] text-[15px] md:max-w-[400px] md:p-8"
      >
        <h1 className=" mb-[40px] text-[32px] font">Sign Up as an Organisation</h1>
        <input
          required
          ref={teamNameRef}
          type="text"
          placeholder="Team name"
          className="outline-none  border-b border-b-[#5A698F]  pl-4 pb-4 mb-6 bg-transparent"
        />{" "}
        <input
          required
          ref={descriptionRef}
          type="text"
          placeholder="Description"
          className="outline-none  border-b border-b-[#5A698F]  pl-4 pb-4 mb-6 bg-transparent"
        />{" "}
        <input
          required
          ref={emailRef}
          type="email"
          placeholder="Email address"
          className="outline-none  border-b border-b-[#5A698F]  pl-4 pb-4 mb-6 bg-transparent"
        />
        <input
          required
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="outline-none  border-b border-b-[#5A698F] pl-4 pb-4 mb-6 bg-transparent"
        />
        <input
          required
          ref={confirmPasswordRef}
          type="password"
          placeholder="Repeat Password"
          className="outline-none  border-b border-b-[#5A698F] pl-4 pb-4 mb-[40px] bg-transparent"
        />
        <button
          disabled={loading}
          className={
            loading
              ? `bg-white text-black rounded-[6px] mb-6 py-4 cursor-not-allowed opacity-50`
              : "bg-secColor text-white rounded-[6px] mb-6 py-4 cursor-pointer"
          }
        >
          Create an account
        </button>
        <div className="flex gap-x-2 text-[15px] self-center">
          <p>Already have an account?</p>
          <Link to="/login" className="text-secColor font-medium ">
            Login
          </Link>
        </div>
      </form>
      <ToastContainer />
    </section>
  );
};

export default Signup;
