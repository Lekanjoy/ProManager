import { teamData } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestResponse, User } from "@supabase/supabase-js";

const supabase = createClient();

export async function getTeamData(user: User | null): Promise<teamData | undefined> {
  // Select matching team database
  const { data: allTeams, error: teamsError }: PostgrestResponse<teamData> = await supabase
    .from("teams")
    .select("*");

  const filteredTeam = allTeams?.filter((team) => {
    return (
      team.admin_id === user?.id ||
      (team.team_member && team.team_member.includes(user?.id as string))
    );
  });
  
  if (teamsError) {
    console.error(teamsError);
  }

  if (filteredTeam) return filteredTeam[0];
}

