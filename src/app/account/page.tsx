// src/app/account/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import Image from "next/image";
import { parseUser } from "@/lib/utils";

export default function AccountPage() {
  const { user, profile } = useUser();
  const parsedUser = parseUser(user);
  const router = useRouter();
  const [displayName, setDisplayName] = useState(parsedUser.name);
  const initials = (displayName || parsedUser.name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const [isRider, setIsRider] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    setError("");
    if (!isRider && !isDriver) {
      setError("You must keep at least one role.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, isRider, isDriver }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to save.");
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
          className="text-[10px] tracking-[0.3em]  text-white/55 animate-pulse"
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
      {/* Nav */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[10px] tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors"
        >
          ← BACK
        </button>
        <p className="text-[10px] tracking-[0.3em]  text-white/55">
          {"// ACCOUNT SETTINGS"}
        </p>
        <div className="w-16" />
      </div>

      <div className="max-w-lg mx-auto px-6 py-10 space-y-8">
        {/* Avatar + name */}
        <div className="flex items-center gap-5">
          {parsedUser.avatarUrl ? (
            <Image
              src={parsedUser.avatarUrl}
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
            <p className="text-[9px] tracking-[0.3em]  text-white/55 mb-1">
              IDENTITY
            </p>
            <p
              className="text-base font-black tracking-widest text-white"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              {displayName || "UNNAMED PILOT"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Display name */}
        <div>
          <p className="text-[9px] tracking-[0.3em]  text-white/55 mb-3">
            DISPLAY NAME
          </p>
          <input
            ref={nameRef}
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="ENTER YOUR NAME"
            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] tracking-[0.2em] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              clipPath:
                "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
            }}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Roles */}
        <div>
          <p className="text-[9px] tracking-[0.3em]  text-white/55 mb-1">
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

        {/* Quick nav — only show relevant links */}
        {(isRider || isDriver) && (
          <>
            <div className="h-px bg-white/10" />
            <div>
              <p className="text-[9px] tracking-[0.3em]  text-white/55 mb-3">
                QUICK NAV
              </p>
              <div className="flex gap-3">
                {isRider && (
                  <NavButton
                    label="GO TO RIDE"
                    onClick={() => router.push("/ride")}
                  />
                )}
                {isDriver && (
                  <NavButton
                    label="GO TO DRIVE"
                    onClick={() => router.push("/drive")}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <p className="text-[9px] tracking-widest text-red-400/80">{error}</p>
        )}

        {/* Save */}
        <div className="h-px bg-white/10" />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="relative w-full py-3 font-black text-[11px] tracking-[0.25em] text-white disabled:opacity-40 transition-all"
          style={{
            fontFamily: "'Orbitron', monospace",
            clipPath:
              "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
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
          {saving ? "SAVING..." : saved ? "SAVED" : "SAVE CHANGES"}
        </button>

        {/* Sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="relative w-full py-3 font-black text-[11px] tracking-[0.25em] text-red-400/70 hover:text-red-400 disabled:opacity-40 transition-all"
          style={{
            fontFamily: "'Orbitron', monospace",
            clipPath:
              "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
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

      {/* Toggle pill */}
      <div
        className="relative shrink-0 w-10 h-5 transition-all"
        style={{
          background: active
            ? "rgba(255,255,255,0.4)"
            : "rgba(255,255,255,0.05)",
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
