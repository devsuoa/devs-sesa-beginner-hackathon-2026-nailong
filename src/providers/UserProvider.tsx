"use client";
 
import type { Profile } from "@/generated/prisma/client";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
 
type UserContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
};
 
const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
});
 
export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setProfile(data.profile ?? null);
  }, []);
  
  useEffect(() => {
    const supabase = createClient();
 
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }
 
    getSession();
 
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile();
      else setProfile(null);
      setLoading(false);
    });
 
    return () => subscription.unsubscribe();
  }, [fetchProfile]);
 
  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
}
 
export function useUser() {
  return useContext(UserContext);
}