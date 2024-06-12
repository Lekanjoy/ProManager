import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../login/submit-button";

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const recoverPassword = async (formData: FormData) => {
    "use server";
    const supabase = createClient();

    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return redirect(`/forgot-password?message=${error.message}`);
    }

    return redirect(
      `/forgot-password?message=Check your mail for recovery link.`
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <div className="mb-10 ">
          <h1 className="text-bold text-2xl mb-3 lg:text-3xl">
            Forgot Password
          </h1>
          <p className="text-sm font-light">
            Enter the affected account email you wish to recover and a password
            recovery mail will be sent to you.
          </p>
        </div>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <SubmitButton
          formAction={recoverPassword}
          className="bg-green-700 rounded-md text-white px-4 py-2 text-foreground mb-2"
          pendingText="Reseting..."
        >
          Reset
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
