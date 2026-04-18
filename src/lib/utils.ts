import type { User } from "@supabase/supabase-js";

export type ParsedUser = {
  email: string;
  avatarUrl: string | null;
  name: string | null;
}

export const parseUser = (user: User | null): ParsedUser | null => (user ? {
  email: user?.email ?? "",
  avatarUrl: user?.user_metadata?.avatar_url ?? null,
  name: user?.user_metadata?.full_name ?? "Unnamed User"
} : null);