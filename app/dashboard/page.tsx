import { createClient } from "@/utils/supabase/client";
import Dashboard from "@/components/dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <main className="relative min-h-screen bg-white w-full bg-background text-foreground">
      <Dashboard />
    </main>
  );
}
