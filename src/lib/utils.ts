import type { User } from "@supabase/supabase-js";

export const parseUser = (user: User | null) => (user ? {
  email: user.email ?? "",
  avatarUrl: user.user_metadata?.avatar_url ?? null,
  name: user.user_metadata?.full_name ?? null
} : {
  email: "",
  avatarUrl: null,
  name: null
})