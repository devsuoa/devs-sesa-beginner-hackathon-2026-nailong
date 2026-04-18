"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import Image from "next/image";

type ToastType = "success" | "error";

function RoleToggle({
  label,
  description,
  active,
  onToggle,
  disabled,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className="relative w-full flex items-center justify-between px-4 py-3 text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
        background: active ? "rgba(255,255,255,0.05)" : "transparent",
      }}
    >
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: "inherit",
          border: `1px solid ${active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)"}`,
        }}
      />
      <div>
        <p
          className="text-[10px] font-black tracking-[0.2em] mb-0.5"
          style={{
            fontFamily: "'Orbitron', monospace",
            color: active ? "#fff" : "rgba(255,255,255,0.6)",
          }}
        >
          {label}
        </p>
        <p className="text-[8px] tracking-wider text-white/40">{description}</p>
      </div>

      <div
        className="relative shrink-0 w-10 h-5 transition-all"
        style={{
          background: active ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "99px",
        }}
      >
        <span
          className="absolute top-0.5 transition-all"
          style={{
            left: active ? "calc(100% - 18px)" : "2px",
            width: "14px",
            height: "14px",
            background: active ? "#fff" : "rgba(255,255,255,0.45)",
            borderRadius: "99px",
            boxShadow: active ? "0 0 8px rgba(255,255,255,0.6)" : "none",
          }}
        />
      </div>
    </button>
  );
}

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex-1 py-2.5 text-[10px] font-black tracking-[0.2em] text-white/50 hover:text-white/80 transition-all"
      style={{
        fontFamily: "'Orbitron', monospace",
        clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
      }}
    >
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: "inherit",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      {label}
    </button>
  );
}

export default function AccountPage() {
  const { user, profile } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [isRider, setIsRider] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [savedRoles, setSavedRoles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!profile) return;
    setName(profile.displayName ?? "");
    setIsRider(profile.roles?.includes("RIDER") ?? false);
    setIsDriver(profile.roles?.includes("DRIVER") ?? false);
    setSavedRoles(profile.roles ?? []);
  }, [profile]);

  function showToast(message: string, type: ToastType) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const initials = (name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSave() {
    if (!isRider && !isDriver) {
      showToast("You must keep at least one role.", "error");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, isRider, isDriver }),
    });
    setSaving(false);

    if (res.ok) {
      const { profile: updated } = await res.json();
      setSavedRoles(updated.roles ?? []);
      showToast("Changes saved.", "success");
    } else {
      const data = await res.json();
      showToast(data.error ?? "Failed to save.", "error");
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p
          className="text-[10px] tracking-[0.3em] text-white/55 animate-pulse"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          LOADING...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 text-[10px] tracking-[0.2em]"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
            background: toast.type === "success"
              ? "rgba(255,255,255,0.06)"
              : "rgba(239,68,68,0.08)",
            border: `1px solid ${toast.type === "success" ? "rgba(255,255,255,0.2)" : "rgba(239,68,68,0.3)"}`,
            color: toast.type === "success"
              ? "rgba(255,255,255,0.8)"
              : "rgba(239,68,68,0.9)",
          }}
        >
          {toast.type === "success" ? "// " : "!! "}
          {toast.message.toUpperCase()}
        </div>
      )}

      {/* Nav */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[10px] tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors"
        >
          ← BACK
        </button>
        <p className="text-[10px] tracking-[0.3em] text-white/55">
          {"// ACCOUNT SETTINGS"}
        </p>
        <div className="w-16" />
      </div>

      <div className="max-w-lg mx-auto px-6 py-10 space-y-8">
        {/* Avatar + name */}
        <div className="flex items-center gap-5">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full border border-white/10"
              width={64}
              height={64}
            />
          ) : (
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <span
                className="text-lg font-black tracking-wider text-white/70"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                {initials}
              </span>
            </div>
          )}
          <div>
            <p className="text-[9px] tracking-[0.3em] text-white/55 mb-1">
              IDENTITY
            </p>
            <p
              className="text-base font-black tracking-widest text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              {name || "UNNAMED USER"}
            </p>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Name */}
        <div>
          <p className="text-[9px] tracking-[0.3em] text-white/55 mb-3">
            DISPLAY NAME
          </p>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ENTER YOUR NAME"
            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] tracking-[0.2em] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
            }}
          />
        </div>

        <div className="h-px bg-white/10" />

        {/* Roles */}
        <div>
          <p className="text-[9px] tracking-[0.3em] text-white/55 mb-1">
            ACTIVE ROLES
          </p>
          <p className="text-[8px] text-white/40 tracking-widest mb-4">
            AT LEAST ONE ROLE MUST REMAIN ACTIVE
          </p>
          <div className="space-y-3">
            <RoleToggle
              label="RIDER"
              description="Book shuttles and deliveries"
              active={isRider}
              onToggle={() => setIsRider((v) => !v)}
              disabled={isRider && !isDriver}
            />
            <RoleToggle
              label="DRIVER"
              description="Pilot vessels and earn credits"
              active={isDriver}
              onToggle={() => setIsDriver((v) => !v)}
              disabled={isDriver && !isRider}
            />
          </div>
        </div>

        {/* Quick nav — updates after successful save via savedRoles */}
        {(savedRoles.includes("RIDER") || savedRoles.includes("DRIVER")) && (
          <>
            <div className="h-px bg-white/10" />
            <div>
              <p className="text-[9px] tracking-[0.3em] text-white/55 mb-3">
                QUICK NAV
              </p>
              <div className="flex gap-3">
                {savedRoles.includes("RIDER") && (
                  <NavButton
                    label="GO TO RIDE"
                    onClick={() => router.push("/ride")}
                  />
                )}
                {savedRoles.includes("DRIVER") && (
                  <NavButton
                    label="GO TO DRIVE"
                    onClick={() => router.push("/drive")}
                  />
                )}
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-white/10" />

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="relative w-full py-3 font-black text-[11px] tracking-[0.25em] text-white disabled:opacity-40 transition-all"
          style={{
            fontFamily: "'Orbitron', monospace",
            clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: "inherit",
              border: "1px solid rgba(255,255,255,0.45)",
            }}
          />
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="relative w-full py-3 font-black text-[11px] tracking-[0.25em] text-red-400/70 hover:text-red-400 disabled:opacity-40 transition-all"
          style={{
            fontFamily: "'Orbitron', monospace",
            clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
          }}
        >
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: "inherit",
              border: "1px solid rgba(239,68,68,0.15)",
            }}
          />
          {signingOut ? "SIGNING OUT..." : "SIGN OUT"}
        </button>
      </div>
    </div>
  );
}