import Link from "next/link";
import AuthButton from "../components/AuthButton";

export default  function HomePage() {

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full p-3 flex  border-b border-b-foreground/10 h-16">
          <AuthButton />
      </nav>
      <div className="flex flex-col gap-y-3  items-center">
        <h1>Welcome</h1>
        <Link href="/dashboard" className="underline">Go to Dashboard</Link>
      </div>
    </div>
  );
}
