"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/UseAuth";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const supabase = createClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [isDataPresent, setIsDataPresent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("userProfile")
          .select("*")
          .eq("userID", user.id);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setIsDataPresent(true);
          setFullName(data[0].fullName);
          setRole(data[0].role);
        } else {
          setIsDataPresent(false);
          console.error("Profile not found for user", user.id);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Please set your profile",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfile();
  }, [user]);

  const updateProfile = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("userProfile")
        .update({ fullName, role })
        .eq("userID", user.id)
        .select();

      if (error) {
        setIsLoading(false);
        setIsButtonDisabled(false);

        throw error;
      }
      if (data) {
        setIsLoading(false);
        setIsButtonDisabled(true);
        toast({
          variant: "success",
          description: "Profile updated",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setIsButtonDisabled(false);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error updating profile",
      });
      console.error("Error updating profile:", error);
    }
  };

  const insertProfile = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("userProfile")
        .insert({ fullName, email: user.email, role })
        .select();

      if (error) {
        setIsLoading(false);
        setIsButtonDisabled(false);
        throw error;
      }
      if (data) {
        setIsLoading(false);
        setIsButtonDisabled(true);

        toast({
          variant: "success",
          description: "Profile added",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setIsButtonDisabled(false);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error setting profile",
      });
      console.error("Error inserting profile:", error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center px-6 lg:px-20">
      <Card className="w-full lg:w-2/4">
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>
            Modify and update your profile here and save changes after.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="flex flex-col gap-y-3">
            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setIsButtonDisabled(false);
              }}
            />
            <Input placeholder="Email Address" value={user?.email} disabled />
            <Input
              placeholder="Role (e.g developer, designer...)"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setIsButtonDisabled(false);
              }}
            />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          {
            // Check whether to display insert or update button
            isDataPresent ? (
              <Button
                onClick={updateProfile}
                disabled={isButtonDisabled}
                className={
                  isLoading
                    ? "opacity-40 cursor-not-allowed"
                    : "opacity-100 cursor-pointer"
                }
              >
                Update
              </Button>
            ) : (
              <Button
                onClick={insertProfile}
                disabled={isButtonDisabled}
                className={
                  isLoading
                    ? "opacity-40 cursor-not-allowed"
                    : "opacity-100 cursor-pointer"
                }
              >
                Save changes
              </Button>
            )
          }
        </CardFooter>
      </Card>
    </div>
  );
}
