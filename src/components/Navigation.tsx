/** biome-ignore-all lint/a11y/noSvgWithoutTitle: yes */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useUser } from "@/providers/UserProvider";
import type { User } from "@supabase/supabase-js";
import { parseUser } from "@/lib/utils";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "BOOK", href: "/book" },
  { label: "TRACK", href: "/track" },
  { label: "ORDERS", href: "/orders" },
];

function CornerPips() {
  return (
    <>
      <span className="corner-pip corner-pip--tl" />
      <span className="corner-pip corner-pip--tr" />
      <span className="corner-pip corner-pip--bl" />
      <span className="corner-pip corner-pip--br" />
    </>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#fff"
        opacity="0.9"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#fff"
        opacity="0.7"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#fff"
        opacity="0.5"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#fff"
        opacity="0.6"
      />
    </svg>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  function handleGoogleLogin() {
    window.location.href = "/api/auth/login";
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <>
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-1"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <nav className="fixed top-0 left-0 w-full z-10 flex items-center justify-between px-8 h-16 border-b border-white/8 bg-black/60 backdrop-blur-xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <Image src="/favicon.png" alt="NaiX Logo" width={64} height={64} />
          <div>
            <span
              className="font-black text-lg tracking-[0.12em] text-white"
              style={{
                fontFamily: "'Orbitron', monospace",
                textShadow:
                  "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)",
              }}
            >
              NAIX
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <ul className="flex items-center gap-1 list-none">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`nav-link${isActive ? " nav-link--active" : ""}`}
                >
                  <CornerPips />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Auth area */}
          {loading ? (
            <div className="w-24 h-8 rounded bg-white/5 animate-pulse" />
          ) : user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="login-btn"
            >
              <GoogleIcon />
              SIGN IN
            </button>
          )}
        </div>

        <div className="scan-line" />
      </nav>
    </>
  );
}

function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const parsedUser = parseUser(user);

  const initials = parsedUser.name
    ? parsedUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : parsedUser.email[0].toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
      >
        {/* Avatar */}
        {parsedUser.avatarUrl ? (
          <Image
            src={parsedUser.avatarUrl}
            alt={parsedUser.name ?? user.email}
            className="w-8 h-8 rounded-full border border-white/20 object-cover"
            width={32}
            height={32}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white text-[11px] font-bold"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            {initials}
          </div>
        )}

        {/* Name */}
        <span
          className="text-[10px] text-white/70 tracking-widest hidden sm:block"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {parsedUser.name?.split(" ")[0].toUpperCase() ??
            parsedUser.email.split("@")[0].toUpperCase()}
        </span>

        {/* Chevron */}
        <svg
          className={`w-3 h-3 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 bg-black/90 border border-white/10 backdrop-blur-xl z-50"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
          }}
        >
          <div className="px-4 py-3 border-b border-white/8">
            <p
              className="text-[10px] text-white/40 tracking-widest truncate"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {parsedUser.email}
            </p>
          </div>
          <Link href="/account">
            <button
              type="button"
              className="w-full text-left px-4 py-3 text-[10px] text-white/60 tracking-widest hover:text-white hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              ACCOUNT
            </button>
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full text-left px-4 py-3 text-[10px] tracking-widest text-red-400/70 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            SIGN OUT
          </button>
        </div>
      )}
    </div>
  );
}
