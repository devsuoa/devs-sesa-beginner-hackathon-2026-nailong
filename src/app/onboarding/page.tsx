"use client";

import { useRouter } from "next/navigation";
import RoleSelectModal from "@/components/RoleSelectModal";

export default function OnboardingPage() {
  const router = useRouter();

  async function handleRoleSelect(role: "rider" | "driver") {
    await fetch("/api/auth/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.push(role === "driver" ? "/drive" : "/ride");
  }

  return (
    <div className="min-h-screen bg-black">
      <RoleSelectModal onSelect={handleRoleSelect} />
    </div>
  );
}