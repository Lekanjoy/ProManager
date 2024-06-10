import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <form action={signOut}>
      <button className="py-2 px-3 text-sm w-fit rounded-md no-underline bg-[#0D062D] text-white flex justify-center items-center">
        Logout
      </button>
    </form>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 text-sm w-fit bg-[#0D062D] text-white flex justify-center items-center rounded-md no-underline "
    >
      Try Now ⚡
    </Link>
  );
}
