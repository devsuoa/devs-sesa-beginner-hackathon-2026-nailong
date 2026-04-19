"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";

export default function RidePage() {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      window.location.href = "/api/auth/login";
      return;
    }

    if (!profile?.roles?.includes("RIDER")) {
      router.replace("/");
      return;
    }

    router.replace("/ride");
  }, [user, profile, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[10px] tracking-[0.3em] text-white/35 animate-pulse"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        CHECKING CLEARANCE...
      </p>
    </div>
  );
}