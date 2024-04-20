import { teamData } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestResponse, User } from "@supabase/supabase-js";

const supabase = createClient();

export async function getTeamData(
  user: User | null
): Promise<teamData | undefined> {
  try {
    const { data: allTeams, error: teamsError }: PostgrestResponse<teamData> =
      await supabase.from("teams").select("*");

    if (teamsError) {
      throw teamsError;
    }

    if (!allTeams) {
      console.warn("No teams found in the database.");
      return;
    }

    const filteredTeam = allTeams.filter((team) => {
      return (
        team.admin_id === user?.id ||
        (team.team_member && team.team_member.includes(user?.id as string))
      );
    });

    if (!filteredTeam.length) {
      console.warn("The user is not an admin or a team member.");
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
