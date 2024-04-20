'use client'
import { useState, useEffect } from "react";
import { User} from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export function useAuth() {
  const supabase = createClient();
    const [user, setUser] = useState<User | null >(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const getCurrentUser = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
        setIsLoading(false); // Set loading to false when user data is retrieved
      };
  
      getCurrentUser();
    }, []);
  
    return { user, isLoading };
  }
  