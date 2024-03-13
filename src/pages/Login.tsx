import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../supabase";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // check if email and password are empty
    if (emailRef?.current?.value == "" || passwordRef?.current?.value == "") {
      toast.error("Missing credentials!", {
        pauseOnHover: false,
      });
      return;
    }

    setLoading(true);
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: emailRef?.current?.value as string,
        password: passwordRef?.current?.value as string,
      });

      if (data.user) {
        // Toast Notification
        toast.success("Login Successful!", {
          pauseOnHover: false,
        });
        navigate("/");
      } else {
        throw error;
      }

    } catch (error: any) {
      // Toast Notification
      toast.error("Login Unsuccessful: " + error?.message, {
        pauseOnHover: false,
      });
      console.log(error)
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
        onSubmit={handleLogin}
        className="border flex flex-col w-full  p-6 rounded-[10px] text-[15px] md:max-w-[400px] md:p-8"
      >
        <h1 className=" mb-[40px] text-[32px] font">Login</h1>
        <input
          ref={emailRef}
          type="email"
          placeholder="Email address"
          className="outline-none  border-b border-b-[#5A698F]  pl-4 pb-4 mb-6 bg-transparent"
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="
            outline-none  border-b border-b-[#5A698F] pl-4 pb-4 mb-[40px] bg-transparent"
        />
        <button
          disabled={loading}
          className={
            loading
              ? `bg-white text-black rounded-[6px] mb-6 py-4 cursor-not-allowed opacity-50`
              : "bg-secColor text-white rounded-[6px] mb-6 py-4 cursor-pointer duration-500 hover:bg-primaryColor hover:text-darkBlue"
          }
        >
          Login to your account
        </button>
        <div className="flex gap-x-2 text-[15px] self-center">
          <p className="">Don’t have an account?</p>
          <Link to="/signup" className="text-secColor font-medium ">
            Sign Up
          </Link>
        </div>
      </form>
      <ToastContainer />
    </section>
  );
};

export default Login;
