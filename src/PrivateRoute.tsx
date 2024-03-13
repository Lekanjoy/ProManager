import { Navigate, Outlet } from "react-router-dom";
import {useAuth } from "../supabase";


export default function PrivateRoute() {
  const { user, isLoading } = useAuth();  

  if (isLoading) {
    return (
      <div className=" flex justify-center  items-center text-center w-full h-screen animate-pulse">
        <p>Please wait while we confirm your login status...</p>
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" />;
}
