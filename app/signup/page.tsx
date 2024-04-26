import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../login/submit-button";
import { taskDataObj } from "@/types";

export default function Signup({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const team_name = formData.get("team_name") as string;
    const description = formData.get("desc") as string;
    const supabase = createClient();

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/signup?message=Could not create user");
    }

    // Create new team after succesful registration
    const initialTeamData = {
      team_name,
      description,
      admin_id: signUpData?.user?.id!,
      team_member: [] as string[],
      tasks: [] as taskDataObj[],
    };

    const { data: newTeamData, error: newTeamDataError } = await supabase
      .from("teams")
      .insert([initialTeamData])
      .select();
    if (signUpData && newTeamData)
      return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in mt-10 flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <h1 className="mb-10 text-bold text-2xl lg:text-3xl">
          Get Your Team Started
        </h1>
        <label className="text-md" htmlFor="team_name">
          Team Name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="team_name"
          type="text"
          placeholder="My Team"
          required
        />
        <label className="text-md" htmlFor="desc">
          Description
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="text"
          name="desc"
          placeholder="Description of your team"
          required
        />
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="email"
          name="email"
          placeholder="team@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signUp}
          className="bg-green-700 rounded-md px-4 py-2 text-white mb-2"
          pendingText="Creating Team..."
        >
          Create Team Account
        </SubmitButton>
        <div className="flex gap-x-2 text-[15px] self-center">
          <p>Already have an account?</p>
          <Link href="/login" className=" font-medium underline">
            Login
          </Link>
        </div>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
