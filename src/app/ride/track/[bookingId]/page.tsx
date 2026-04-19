"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  status: string;
  priceCredits: number;
  serviceType: string;
  departureTime: string | null;
  estimatedArrival: string | null;
  actualArrival: string | null;
  aiBriefing: string | null;
  createdAt: string;
  origin: { id: string; name: string; currentConditions: string | null };
  destination: { id: string; name: string; currentConditions: string | null };
  driver: {
    id: string;
    vesselName: string;
    vesselType: string;
    rating: number;
    totalTrips: number;
    profile: { displayName: string };
  } | null;
}

const SHUTTLE_NAMES: Record<string, string> = {
  SHUTTLE:   "Orbit Classic",
  CARGO:     "Cargo Hauler",
  FOOD:      "Courier Pod",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="relative p-5 mb-4"
      style={{
        clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <p className="text-[9px] tracking-[0.3em] text-white/40 mb-4 uppercase"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        {`// ${title}`}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/6 last:border-0">
      <span className="text-[9px] tracking-[0.2em] text-white/45"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}>{label}</span>
      <span className="text-[11px] tracking-[0.1em] font-bold"
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: highlight ? "rgba(100,255,180,0.9)" : "#fff",
          textShadow: highlight ? "0 0 10px rgba(100,255,180,0.5)" : "none",
        }}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { border: string; color: string; bg: string }> = {
    PENDING:    { border: "rgba(255,200,100,0.3)", color: "rgba(255,200,100,0.9)", bg: "rgba(255,200,100,0.05)" },
    CONFIRMED:  { border: "rgba(100,255,180,0.3)", color: "rgba(100,255,180,0.9)", bg: "rgba(100,255,180,0.05)" },
    IN_TRANSIT: { border: "rgba(100,180,255,0.3)", color: "rgba(100,180,255,0.9)", bg: "rgba(100,180,255,0.05)" },
    DELIVERED:  { border: "rgba(100,255,180,0.3)", color: "rgba(100,255,180,0.9)", bg: "rgba(100,255,180,0.05)" },
    CANCELLED:  { border: "rgba(255,100,100,0.3)", color: "rgba(255,100,100,0.9)", bg: "rgba(255,100,100,0.05)" },
  };
  const s = colors[status] ?? colors.PENDING;

  return (
    <span
      className="inline-block px-3 py-1 text-[9px] font-black tracking-[0.2em]"
      style={{
        fontFamily: "'Orbitron', monospace",
        border: `1px solid ${s.border}`,
        color: s.color,
        background: s.bg,
        clipPath: "polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function ProgressBar({ booking }: { booking: Booking }) {
  const steps = ["PENDING", "CONFIRMED", "IN_TRANSIT", "DELIVERED"];
  const currentIndex = steps.indexOf(booking.status);

  return (
    <div className="flex items-center gap-0 mb-2">
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-2 h-2 rounded-full transition-all duration-500"
                style={{
                  background: done ? (active ? "rgba(100,255,180,1)" : "rgba(255,255,255,0.6)") : "rgba(255,255,255,0.1)",
                  boxShadow: active ? "0 0 8px rgba(100,255,180,0.8)" : "none",
                }}
              />
              <span className="text-[7px] tracking-wider whitespace-nowrap"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: done ? (active ? "rgba(100,255,180,0.8)" : "rgba(255,255,255,0.4)") : "rgba(255,255,255,0.15)",
                }}>
                {step.replace("_", " ")}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mx-1 mb-3 transition-all duration-500"
                style={{ background: i < currentIndex ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SpacecraftAnimation({ status }: { status: string }) {
  const progress =
    status === "PENDING"    ? 5  :
    status === "CONFIRMED"  ? 20 :
    status === "IN_TRANSIT" ? 60 :
    status === "DELIVERED"  ? 100 : 0;

  return (
    <div className="relative h-32 overflow-hidden">
      {/* Star field */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              top: `${Math.sin(i * 137.5) * 50 + 50}%`,
              left: `${(i * 5.3) % 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Track line */}
      <div className="absolute top-1/2 left-4 right-4 h-px -translate-y-1/2"
        style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Progress fill */}
      <div className="absolute top-1/2 left-4 h-px -translate-y-1/2 transition-all duration-1000"
        style={{
          width: `calc(${progress}% - 16px)`,
          background: "rgba(100,255,180,0.3)",
        }} />

      {/* Spacecraft */}
      <div
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
        style={{ left: `calc(${progress}% - 20px)` }}
      >
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
          <path d="M5 8 L28 8 L36 12 L28 16 L5 16 Z" fill="white" opacity="0.9" />
          <path d="M28 8 L36 12 L28 16 Z" fill="rgba(100,255,180,0.8)" />
          <circle cx="22" cy="12" r="3" fill="black" stroke="rgba(100,255,180,0.6)" strokeWidth="1" />
          {/* Flame */}
          <path d="M5 10 L-6 12 L5 14 Z" fill="rgba(100,255,180,0.6)">
            <animate attributeName="d" values="M5 10 L-6 12 L5 14 Z;M5 9 L-9 12 L5 15 Z;M5 10 L-6 12 L5 14 Z" dur="0.4s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>

      {/* Destination marker */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <div className="w-2 h-2 rounded-full"
          style={{
            background: status === "DELIVERED" ? "rgba(100,255,180,1)" : "rgba(255,255,255,0.2)",
            boxShadow: status === "DELIVERED" ? "0 0 8px rgba(100,255,180,0.8)" : "none",
          }} />
      </div>
    </div>
  );
}

function TrackingContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchBooking = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Booking not found.");
        return;
      }
      const data = await res.json();
      setBooking(data.booking);
    } catch {
      setError("Failed to load booking.");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
    // Poll every 10s so status updates from driver side reflect here
    const interval = setInterval(fetchBooking, 10000);
    return () => clearInterval(interval);
  }, [fetchBooking]);

  // Show rating modal when delivered
  useEffect(() => {
    if (booking?.status === "DELIVERED") setShowRating(true);
  }, [booking?.status]);

  async function handleCancel() {
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" });
      if (res.ok) {
        await fetchBooking();
        setShowCancelModal(false);
      }
    } catch {
      // silent
    } finally {
      setCancelling(false);
    }
  }

  async function handleSubmitRating() {
    if (rating === 0) return;
    setSubmittingRating(true);
    // You can wire this to a real ratings endpoint later
    await new Promise((r) => setTimeout(r, 1000));
    setSubmittingRating(false);
    setShowRating(false);
    router.push("/orders");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[10px] tracking-[0.3em] text-white/40 animate-pulse"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          LOADING MISSION DATA...
        </p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[10px] tracking-[0.3em] text-red-400/80"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          !! {(error ?? "BOOKING NOT FOUND").toUpperCase()}
        </p>
        <Link href="/ride"
          className="text-[10px] tracking-[0.2em] text-white/40 hover:text-white transition-colors"
          style={{ fontFamily: "'Orbitron', monospace" }}>
          ← BOOK A NEW RIDE
        </Link>
      </div>
    );
  }

  const isActive = booking.status === "PENDING" || booking.status === "CONFIRMED" || booking.status === "IN_TRANSIT";
  const isCancelled = booking.status === "CANCELLED";
  const isDelivered = booking.status === "DELIVERED";

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10 mt-16">

      {/* Header */}
      <p className="text-[9px] tracking-[0.4em] text-white/40 uppercase mb-2 text-center"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        {"// mission tracking"}
      </p>
      <h1 className="text-center text-3xl font-black tracking-[0.12em] text-white mb-2"
        style={{ fontFamily: "'Orbitron', monospace", textShadow: "0 0 20px rgba(255,255,255,0.4)" }}>
        {isCancelled ? "CANCELLED" : isDelivered ? "DELIVERED" : "EN ROUTE"}
      </h1>
      <p className="text-center text-[9px] tracking-[0.2em] text-white/30 mb-8"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        {booking.id}
      </p>

      {/* Status + progress */}
      <Card title="status">
        <div className="flex items-center justify-between mb-5">
          <StatusBadge status={booking.status} />
          {booking.estimatedArrival && isActive && (
            <span className="text-[9px] tracking-[0.15em] text-white/40"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              ETA {new Date(booking.estimatedArrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        <ProgressBar booking={booking} />
        {!isCancelled && <SpacecraftAnimation status={booking.status} />}
      </Card>

      {/* Route */}
      <Card title="route">
        <Row label="FROM" value={booking.origin.name} />
        <Row label="TO" value={booking.destination.name} />
        {booking.destination.currentConditions && (
          <Row label="CONDITIONS AT DEST" value={booking.destination.currentConditions} />
        )}
        <Row label="SERVICE" value={SHUTTLE_NAMES[booking.serviceType] ?? booking.serviceType} />
        <Row label="FARE" value={`${booking.priceCredits} CR`} highlight />
      </Card>

      {/* Driver */}
      <Card title="pilot">
        {booking.driver ? (
          <>
            <Row label="PILOT" value={booking.driver.profile.displayName} />
            <Row label="VESSEL" value={booking.driver.vesselName} />
            <Row label="RATING" value={`${booking.driver.rating.toFixed(2)} ★`} />
            <Row label="TOTAL TRIPS" value={booking.driver.totalTrips.toString()} />
          </>
        ) : (
          <div className="flex items-center gap-3 py-2">
            <div className="w-4 h-4 border border-white/20 border-t-white/60 rounded-full animate-spin" />
            <span className="text-[9px] tracking-[0.2em] text-white/30"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              SCANNING FOR AVAILABLE PILOTS...
            </span>
          </div>
        )}
      </Card>

      {/* AI Briefing */}
      {booking.aiBriefing && (
        <Card title="ai mission briefing">
          <p className="text-[10px] leading-loose tracking-[0.1em] text-white/55"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            {booking.aiBriefing}
          </p>
        </Card>
      )}

      {/* Cancelled message */}
      {isCancelled && (
        <div className="mb-4 px-5 py-4 text-center text-[10px] tracking-[0.2em] text-red-400/70"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            border: "1px solid rgba(239,68,68,0.15)",
            background: "rgba(239,68,68,0.03)",
          }}>
          THIS RIDE HAS BEEN CANCELLED
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <Link href="/orders"
          className="flex-1 relative flex items-center justify-center py-3 text-[10px] font-black tracking-[0.2em] text-white/50 hover:text-white transition-all"
          style={{
            fontFamily: "'Orbitron', monospace",
            clipPath: "polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)",
          }}>
          <span className="absolute inset-0 pointer-events-none"
            style={{ clipPath: "inherit", border: "1px solid rgba(255,255,255,0.1)" }} />
          MY ORDERS
        </Link>

        {isActive && (
          <button type="button" onClick={() => setShowCancelModal(true)}
            className="flex-1 relative flex items-center justify-center py-3 text-[10px] font-black tracking-[0.2em] transition-all"
            style={{
              fontFamily: "'Orbitron', monospace",
              color: "rgba(255,100,100,0.7)",
              clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%)",
            }}>
            <span className="absolute inset-0 pointer-events-none"
              style={{ clipPath: "inherit", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)" }} />
            CANCEL RIDE
          </button>
        )}
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative w-full max-w-sm p-6"
            style={{
              background: "rgba(0,0,0,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
            }}>
            <p className="text-[9px] tracking-[0.3em] text-white/30 mb-2"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>{"// confirm cancel"}</p>
            <h3 className="text-lg font-black tracking-[0.1em] text-white mb-2"
              style={{ fontFamily: "'Orbitron', monospace" }}>CANCEL RIDE?</h3>
            <p className="text-[10px] tracking-[0.1em] text-white/40 mb-6"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              THIS ACTION CANNOT BE UNDONE.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowCancelModal(false)}
                className="flex-1 relative py-2.5 text-[10px] font-black tracking-[0.2em] text-white/50 hover:text-white transition-all bg-transparent border-none"
                style={{ fontFamily: "'Orbitron', monospace", clipPath: "polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)" }}>
                <span className="absolute inset-0 pointer-events-none"
                  style={{ clipPath: "inherit", border: "1px solid rgba(255,255,255,0.1)" }} />
                GO BACK
              </button>
              <button type="button" onClick={handleCancel} disabled={cancelling}
                className="flex-1 relative py-2.5 text-[10px] font-black tracking-[0.2em] transition-all bg-transparent border-none disabled:opacity-40"
                style={{ fontFamily: "'Orbitron', monospace", color: "rgba(255,100,100,0.8)", clipPath: "polygon(0 0,calc(100% - 6px) 0,100% 50%,calc(100% - 6px) 100%,0 100%)" }}>
                <span className="absolute inset-0 pointer-events-none"
                  style={{ clipPath: "inherit", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }} />
                {cancelling ? "ABORTING..." : "YES, CANCEL"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating modal */}
      {showRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          <div className="relative w-full max-w-sm p-8 text-center"
            style={{
              background: "rgba(0,0,0,0.97)",
              border: "1px solid rgba(255,255,255,0.1)",
              clipPath: "polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))",
            }}>
            <p className="text-[9px] tracking-[0.4em] text-white/25 mb-3"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>{"// mission complete"}</p>
            <h2 className="text-2xl font-black tracking-widest text-white mb-1"
              style={{ fontFamily: "'Orbitron', monospace", textShadow: "0 0 20px rgba(255,255,255,0.4)" }}>
              SAFE LANDING
            </h2>
            <p className="text-[10px] tracking-[0.2em] text-white/40 mb-6"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              RATE YOUR PILOT
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-3xl transition-transform hover:scale-110 border-none bg-transparent cursor-pointer">
                  <span style={{ color: star <= (hoveredRating || rating) ? "rgba(255,220,50,1)" : "rgba(255,255,255,0.1)" }}>★</span>
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Any feedback? (optional)"
              className="w-full h-20 px-3 py-2 mb-5 bg-white/5 border border-white/10 text-white text-[10px] tracking-wider placeholder-white/20 focus:outline-none focus:border-white/25 resize-none"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            />

            <button type="button" onClick={handleSubmitRating} disabled={submittingRating || rating === 0}
              className="relative w-full py-3 font-black text-[10px] tracking-[0.25em] text-white disabled:opacity-30 transition-all bg-transparent border-none cursor-pointer"
              style={{ fontFamily: "'Orbitron', monospace", clipPath: "polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)" }}>
              <span className="absolute inset-0 pointer-events-none"
                style={{ clipPath: "inherit", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)" }} />
              {submittingRating ? "SUBMITTING..." : "SUBMIT RATING"}
            </button>

            <button type="button" onClick={() => { setShowRating(false); router.push("/orders"); }}
              className="mt-4 text-[9px] tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors bg-transparent border-none cursor-pointer"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              SKIP FOR NOW
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[10px] tracking-[0.3em] text-white/40 animate-pulse"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          LOADING MISSION DATA...
        </p>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}