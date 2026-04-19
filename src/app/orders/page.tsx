"use client";
 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
 
type Booking = {
  id: string;
  status: string;
  serviceType: string;
  priceCredits: number;
  createdAt: string;
  estimatedArrival: string | null;
  origin: { name: string };
  destination: { name: string };
  driver: {
    vesselName: string;
    profile: { displayName: string };
  } | null;
};
 
const STATUS_STYLES: Record<string, { border: string; color: string; bg: string }> = {
  PENDING:    { border: "rgba(255,200,100,0.3)", color: "rgba(255,200,100,0.9)", bg: "rgba(255,200,100,0.05)" },
  CONFIRMED:  { border: "rgba(100,255,180,0.3)", color: "rgba(100,255,180,0.9)", bg: "rgba(100,255,180,0.05)" },
  IN_TRANSIT: { border: "rgba(100,180,255,0.3)", color: "rgba(100,180,255,0.9)", bg: "rgba(100,180,255,0.05)" },
  DELIVERED:  { border: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", bg: "transparent" },
  CANCELLED:  { border: "rgba(255,100,100,0.3)", color: "rgba(255,100,100,0.7)", bg: "rgba(255,100,100,0.03)" },
};
 
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING;
  return (
    <span
      className="text-[8px] font-black tracking-[0.2em] px-2.5 py-0.5"
      style={{
        fontFamily: "'Orbitron', monospace",
        border: `1px solid ${s.border}`,
        color: s.color,
        background: s.bg,
        clipPath: "polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%)",
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}
 
function BookingCard({ booking, onClick }: { booking: Booking; onClick: () => void }) {
  const isActive = ["PENDING", "CONFIRMED", "IN_TRANSIT"].includes(booking.status);
 
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left relative p-5 transition-all duration-200 border-none bg-transparent"
      style={{
        clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
        border: "1px solid rgba(255,255,255,0.08)",
        background: isActive ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLButtonElement).style.background = isActive ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)";
      }}
    >
      {/* Active pulse indicator */}
      {isActive && (
        <span
          className="absolute top-4 right-5 w-1.5 h-1.5 rounded-full"
          style={{
            background: "rgba(100,255,180,0.9)",
            boxShadow: "0 0 6px rgba(100,255,180,0.8)",
            animation: "pulse-dot 2s infinite",
          }}
        />
      )}
 
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col gap-1.5 flex-1 pr-6">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] text-white/70"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <div className="w-1.5 h-1.5 rounded-full border border-white/40 shrink-0" />
            {booking.origin.name}
          </div>
          <div className="w-px h-3 bg-white/10 ml-[3px]" />
          <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] text-white/70"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <div className="w-1.5 h-1.5 shrink-0 bg-white/60"
              style={{ clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }} />
            {booking.destination.name}
          </div>
        </div>
 
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span
            className="text-xl font-black tracking-[0.08em] text-white"
            style={{
              fontFamily: "'Orbitron', monospace",
              textShadow: "0 0 10px rgba(255,255,255,0.3)",
            }}
          >
            {booking.priceCredits}
          </span>
          <span className="text-[8px] tracking-[0.2em] text-white/40"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            CREDITS
          </span>
        </div>
      </div>
 
      {/* Bottom row */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2.5">
          <StatusBadge status={booking.status} />
          <span className="text-[8px] tracking-[0.1em] text-white/30"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            {booking.serviceType}
          </span>
        </div>
        <span className="text-[8px] tracking-[0.1em] text-white/25"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          {new Date(booking.createdAt).toLocaleDateString(undefined, {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
          })}
        </span>
      </div>
 
      {/* Driver info if assigned */}
      {booking.driver && (
        <div className="mt-3 pt-3 border-t border-white/6 flex items-center gap-2">
          <span className="text-[8px] tracking-[0.15em] text-white/30"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            PILOT:
          </span>
          <span className="text-[9px] tracking-[0.1em] text-white/55"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            {booking.driver.profile.displayName} — {booking.driver.vesselName}
          </span>
        </div>
      )}
 
      {/* View arrow */}
      <div className="absolute bottom-4 right-5 text-white/20 text-[10px]"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        →
      </div>
    </button>
  );
}
 
const FILTERS = ["ALL", "ACTIVE", "DELIVERED", "CANCELLED"] as const;
type Filter = (typeof FILTERS)[number];
 
export default function OrdersPage() {
  const { user } = useUser();
  const router = useRouter();
 
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
 
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(data.bookings ?? []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchBookings();
  }, [user]);
 
  const filtered = bookings.filter((b) => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE") return ["PENDING", "CONFIRMED", "IN_TRANSIT"].includes(b.status);
    if (filter === "DELIVERED") return b.status === "DELIVERED";
    if (filter === "CANCELLED") return b.status === "CANCELLED";
    return true;
  });
 
  const activeCount = bookings.filter((b) =>
    ["PENDING", "CONFIRMED", "IN_TRANSIT"].includes(b.status)
  ).length;
 
  return (
    <div className="relative z-5 max-w-2xl mx-auto px-6 py-10 mt-16">
 
      {/* Header */}
      <p
        className="text-[9px] tracking-[0.4em] text-white/40 uppercase mb-2"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        {"// mission log"}
      </p>
      <div className="flex items-end justify-between mb-8">
        <h1
          className="text-2xl font-black tracking-[0.12em] text-white"
          style={{
            fontFamily: "'Orbitron', monospace",
            textShadow: "0 0 20px rgba(255,255,255,0.4)",
          }}
        >
          MY ORDERS
        </h1>
        {activeCount > 0 && (
          <span
            className="text-[9px] tracking-[0.2em] mb-1"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: "rgba(100,255,180,0.8)",
            }}
          >
            {activeCount} ACTIVE
          </span>
        )}
      </div>
 
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="relative shrink-0 px-4 py-1.5 text-[9px] font-black tracking-[0.2em] transition-all border-none bg-transparent cursor-pointer"
            style={{
              fontFamily: "'Orbitron', monospace",
              color: filter === f ? "#fff" : "rgba(255,255,255,0.35)",
              textShadow: filter === f ? "0 0 8px rgba(255,255,255,0.6)" : "none",
              clipPath: "polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
            }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: "inherit",
                border: `1px solid ${filter === f ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                background: filter === f ? "rgba(255,255,255,0.05)" : "transparent",
              }}
            />
            {f}
          </button>
        ))}
      </div>
 
      {/* Content */}
      {loading ? (
        <div
          className="text-center text-[9px] tracking-[0.3em] text-white/30 py-20 animate-pulse"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          RETRIEVING MISSION LOG...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div
            className="text-4xl text-white/10"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            ◎
          </div>
          <p
            className="text-[9px] tracking-[0.3em] text-white/30 text-center"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {filter === "ALL" ? "NO ORDERS YET" : `NO ${filter} ORDERS`}
          </p>
          {filter === "ALL" && (
            <button
              type="button"
              onClick={() => router.push("/ride")}
              className="relative mt-2 px-6 py-2.5 text-[9px] font-black tracking-[0.2em] text-white border-none bg-transparent cursor-pointer"
              style={{
                fontFamily: "'Orbitron', monospace",
                clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%)",
                textShadow: "0 0 8px rgba(255,255,255,0.5)",
              }}
            >
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: "inherit",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.03)",
                }}
              />
              BOOK A RIDE
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onClick={() => router.push(`/ride/track/${booking.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
 