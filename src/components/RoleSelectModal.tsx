"use client";

import { useState } from "react";

type Role = "rider" | "driver";

interface RoleSelectModalProps {
  onSelect: (role: Role) => void;
}

export default function RoleSelectModal({ onSelect }: RoleSelectModalProps) {
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);
    onSelect(selected);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 bg-black border border-white/10 p-8"
        style={{
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        }}
      >
        {/* Corner accents */}
        <span className="absolute top-0 left-0 w-4 h-[1px] bg-white/60" />
        <span className="absolute top-0 left-0 w-[1px] h-4 bg-white/60" />
        <span className="absolute bottom-0 right-0 w-4 h-[1px] bg-white/60" />
        <span className="absolute bottom-0 right-0 w-[1px] h-4 bg-white/60" />

        {/* Header */}
        <p
          className="text-[9px] tracking-[0.4em] text-white/30 mb-2"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          // IDENTITY PROTOCOL
        </p>
        <h2
          className="text-xl font-black tracking-[0.12em] text-white mb-1"
          style={{
            fontFamily: "'Orbitron', monospace",
            textShadow: "0 0 20px rgba(255,255,255,0.5)",
          }}
        >
          WHO ARE YOU?
        </h2>
        <p
          className="text-[10px] text-white/35 tracking-widest mb-8"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          SELECT YOUR ROLE TO CONTINUE
        </p>

        {/* Role cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <RoleCard
            role="rider"
            selected={selected === "rider"}
            onClick={() => setSelected("rider")}
            icon={
              <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10 mx-auto mb-3">
                <circle cx="20" cy="12" r="5" stroke="white" strokeWidth="1.2" opacity="0.8" />
                <path d="M8 34c0-6.627 5.373-12 12-12h0c6.627 0 12 5.373 12 12" stroke="white" strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
                <circle cx="32" cy="30" r="6" stroke="white" strokeWidth="1" opacity="0.4" />
                <path d="M28 30h8M32 26v8" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
              </svg>
            }
            label="RIDER"
            description="Book a ride across the cosmos"
          />
          <RoleCard
            role="driver"
            selected={selected === "driver"}
            onClick={() => setSelected("driver")}
            icon={
              <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10 mx-auto mb-3">
                <ellipse cx="20" cy="20" rx="12" ry="5" stroke="white" strokeWidth="1.2" opacity="0.8" transform="rotate(-15 20 20)" />
                <circle cx="20" cy="20" r="3" fill="white" opacity="0.8" />
                <circle cx="20" cy="20" r="6" stroke="white" strokeWidth="0.8" opacity="0.3" />
                <circle cx="30" cy="12" r="2" fill="white" opacity="0.5" />
                <circle cx="10" cy="28" r="1.5" fill="white" opacity="0.3" />
              </svg>
            }
            label="DRIVER"
            description="Pilot vessels through the stars"
          />
        </div>

        {/* Confirm button */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selected || loading}
          className="relative w-full py-3 font-black text-[11px] tracking-[0.25em] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          style={{
            fontFamily: "'Orbitron', monospace",
            clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            background: selected ? "rgba(255,255,255,0.08)" : "transparent",
            border: "none",
            textShadow: selected ? "0 0 12px rgba(255,255,255,0.8)" : "none",
          }}
        >
          {/* Border overlay */}
          <span
            className="absolute inset-0 pointer-events-none transition-all"
            style={{
              clipPath: "inherit",
              border: `1px solid ${selected ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: selected ? "0 0 20px rgba(255,255,255,0.1) inset" : "none",
            }}
          />
          {loading ? "INITIALISING..." : "CONFIRM IDENTITY"}
        </button>
      </div>
    </div>
  );
}

function RoleCard({
  role,
  selected,
  onClick,
  icon,
  label,
  description,
}: {
  role: Role;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative p-5 text-center transition-all cursor-pointer bg-transparent border-none"
      style={{
        clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
      }}
    >
      {/* Background + border */}
      <span
        className="absolute inset-0 transition-all pointer-events-none"
        style={{
          clipPath: "inherit",
          background: selected ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${selected ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}`,
          boxShadow: selected
            ? "0 0 20px rgba(255,255,255,0.1) inset, 0 0 20px rgba(255,255,255,0.05)"
            : "none",
        }}
      />

      {/* Corner pips when selected */}
      {selected && (
        <>
          <span className="absolute -top-px left-1.5 w-1 h-1 bg-white shadow-[0_0_6px_white]" />
          <span className="absolute -top-px right-1.5 w-1 h-1 bg-white shadow-[0_0_6px_white]" />
          <span className="absolute -bottom-px left-1.5 w-1 h-1 bg-white shadow-[0_0_6px_white]" />
          <span className="absolute -bottom-px right-1.5 w-1 h-1 bg-white shadow-[0_0_6px_white]" />
        </>
      )}

      <div
        className="relative"
        style={{
          filter: selected ? "drop-shadow(0 0 8px rgba(255,255,255,0.6))" : "none",
        }}
      >
        {icon}
      </div>

      <p
        className="text-[11px] font-black tracking-[0.2em] mb-1 transition-all"
        style={{
          fontFamily: "'Orbitron', monospace",
          color: selected ? "#fff" : "rgba(255,255,255,0.5)",
          textShadow: selected ? "0 0 10px rgba(255,255,255,0.8)" : "none",
        }}
      >
        {label}
      </p>
      <p
        className="text-[8px] tracking-wider leading-relaxed"
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: selected ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
        }}
      >
        {description}
      </p>
    </button>
  );
}