import { teamData } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestResponse, User } from "@supabase/supabase-js";

export async function getTeamData(
  user: User | null
): Promise<teamData | undefined> {
  const supabase = createClient();

  try {
    const { data: filteredTeam, error: teamsError } = (await supabase
      .from("teams")
      .select("*")
      .or(
        `admin_id.eq.${user?.id},team_member.cs.${JSON.stringify([user?.id])}`
      )) as PostgrestResponse<teamData>;

    if (teamsError) {
      throw teamsError;
    }

    if (!filteredTeam) {
      console.warn("No teams found in the database.");
      return;
    }
    return filteredTeam[0];
  } catch (error) {
    if (error) {
      console.error("PostgrestError:", error);
    } else {
      console.error("Unexpected error:", error);
    }
    return;
  }
}
