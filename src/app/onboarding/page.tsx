"use client";

import { useRouter } from "next/navigation";
import RoleSelectModal from "@/components/RoleSelectModal";

type Role = "RIDER" | "DRIVER";

export default function OnboardingPage() {
  const router = useRouter();

  async function handleRoleSelect(roles: Role[]) {
    const res = await fetch("/api/auth/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roles }),
    });

    if (!res.ok) return;

    // Dual role → go to /ride by default (they can switch to /drive from nav)
    // Driver only → go to /drive
    // Rider only → go to /ride
    const destination = "/account";

    router.push(destination);
  }

  return (
    <div className="min-h-screen bg-black">
      <RoleSelectModal onSelect={handleRoleSelect} />
    </div>
  );
}