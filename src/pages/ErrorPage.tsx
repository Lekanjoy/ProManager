import { Link } from "react-router-dom";


const ErrorPage = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-y-4 w-full h-screen">
      <h1>Error 404</h1>
      <p>Page Not Found</p>
      <Link to="/" className="underline">Go Back Home</Link>
    </div>
  );
};

export default ErrorPage;
