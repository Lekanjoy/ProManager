"use server";
import { createClient } from "../utils/supabase/server";

export const inviteMember = async (email: string, user: string) => {
  const supabaseAdmin = createClient();
  // Invite team member
  let { data: invitedUserData, error } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(email);

  if (error) {
    console.log(error);
    throw new Error();
  }

  // Add Invited User to current team database
  if (invitedUserData) {
    // Retrieve the existing team_member
    const { data: teamMembers, error: teamError } = await supabaseAdmin
      .from("teams")
      .select("team_member")
      .eq("admin_id", user)
      .single();

    // Add newly invited userId to team_member column in database
    const existingTeamMember = teamMembers?.team_member as string[];
    existingTeamMember.push(invitedUserData?.user?.id as string);

    // Update Team member column in database
    const { data: updatedMembers, error: updateError } = await supabaseAdmin
      .from("teams")
      .update({ team_member: existingTeamMember })
      .eq("admin_id", user)
      .select();
  }
};
