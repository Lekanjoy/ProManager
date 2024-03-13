import { useState, useEffect } from "react";
import { User, createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Custom Hook for Current User
export function useAuth() {
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
