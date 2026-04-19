"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";

type Role = "RIDER" | "DRIVER";

export function useAuthGuard(requiredRole?: Role) {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Not logged in → send to auth
    if (!user) {
      router.replace("/auth");
      return;
    }

    // Logged in but no profile yet → send to onboarding
    if (!profile) {
      router.replace("/onboarding");
      return;
    }

    // Wrong role
    if (requiredRole && !profile.roles.includes(requiredRole)) {
      router.replace("/");
      return;
    }
  }, [user, profile, loading, requiredRole, router]);

  return { user, profile, loading };
}