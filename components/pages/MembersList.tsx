"use client";
import SideBar from "@/components/SideBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/UseAuth";
import { getTeamData } from "@/hooks/getTeamData";
import { userProfileData } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useTypedSelector } from "@/store/store";

export default function MembersList() {
  const { user } = useAuth();
  const supabase = createClient();
  const [teamProfiles, setTeamProfiles] = useState<userProfileData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const teamData = await getTeamData(user);

        const teamMembersId = teamData?.team_member || [];
        const adminID = teamData?.admin_id;
        const combinedMembersId = [...teamMembersId, adminID];

        if (combinedMembersId.length > 0) {
          const { data, error } = await supabase
            .from("userProfile")
            .select("*")
            .in("userID", combinedMembersId);

          if (error) {
            setLoading(false);
            console.error("Error fetching user profiles:", error);
          } else {
            setTeamProfiles(data);
            setLoading(false);
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching team data:", error);
      }
    };

    fetchData();
  }, [user]);

  const collapseStore = useTypedSelector((store) => store.collapse);
  return (
    <section
      className={`relative w-full flex  ${collapseStore ? "px-0" : "px-6"}`}
    >
      <div className="mt-[90px] p-0 lg:mt-[95px]">
        <SideBar />
      </div>
      <Card
        className={` mt-32 ${
          collapseStore
            ? "lg:w-[75%] lg:ml-[23%]  lg:ease-in-out lg:duration-1000"
            : "w-full lg:pl-6 lg:ease-in-out lg:duration-1000"
        } xl:col-span-2`}
      >
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Team Members</CardTitle>
            <CardDescription>All contributors in your team.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="text-right">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow className=" animate-pulse bg-gray-300/20">
                  <TableCell className="py-8 min-w-full"></TableCell>
                  <TableCell className="py-8 min-w-full"></TableCell>
                </TableRow>
              )}

              {teamProfiles.length === 0 && !loading ? (
                <TableRow>
                  <TableCell className="py-8 min-w-full text-lg">
                    No team member yet. Please invite!
                  </TableCell>
                  <TableCell className="py-8 min-w-full text-lg"></TableCell>
                </TableRow>
              ) : (
                teamProfiles?.map((profile) => {
                  return (
                    <TableRow key={profile.userID}>
                      <TableCell>
                        <div className="font-medium">{profile?.fullName}</div>
                        <div className="text-xs text-muted-foreground md:inline lg:text-sm">
                          {profile?.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {profile?.role}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
