"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

// Distance matrix between planets (for display only)
const DISTANCES: Record<string, Record<string, number>> = {
  "Mars 🔴": {
    "Venus 🟠": 45,
    "Jupiter 🪐": 350,
    "Saturn 💫": 650,
    "Uranus 🌀": 1800,
    "Neptune 🌊": 2800,
    "Mercury ☀️": 85,
  },
  "Venus 🟠": {
    "Mars 🔴": 45,
    "Jupiter 🪐": 380,
    "Saturn 💫": 680,
    "Uranus 🌀": 1830,
    "Neptune 🌊": 2830,
    "Mercury ☀️": 30,
  },
  "Jupiter 🪐": {
    "Mars 🔴": 350,
    "Venus 🟠": 380,
    "Saturn 💫": 300,
    "Uranus 🌀": 1400,
    "Neptune 🌊": 2300,
    "Mercury ☀️": 420,
  },
  "Saturn 💫": {
    "Mars 🔴": 650,
    "Venus 🟠": 680,
    "Jupiter 🪐": 300,
    "Uranus 🌀": 1000,
    "Neptune 🌊": 1900,
    "Mercury ☀️": 720,
  },
  "Uranus 🌀": {
    "Mars 🔴": 1800,
    "Venus 🟠": 1830,
    "Jupiter 🪐": 1400,
    "Saturn 💫": 1000,
    "Neptune 🌊": 900,
    "Mercury ☀️": 1850,
  },
  "Neptune 🌊": {
    "Mars 🔴": 2800,
    "Venus 🟠": 2830,
    "Jupiter 🪐": 2300,
    "Saturn 💫": 1900,
    "Uranus 🌀": 900,
    "Mercury ☀️": 2850,
  },
  "Mercury ☀️": {
    "Mars 🔴": 85,
    "Venus 🟠": 30,
    "Jupiter 🪐": 420,
    "Saturn 💫": 720,
    "Uranus 🌀": 1850,
    "Neptune 🌊": 2850,
  },
};

const SHUTTLE_DETAILS = {
  orbit: { name: "Orbit Classic", comfort: "Standard", serviceType: "SHUTTLE" },
  express: {
    name: "Warp Express",
    comfort: "Enhanced",
    serviceType: "SHUTTLE",
  },
  nailong: {
    name: "Nailong Runner",
    comfort: "Luxury",
    serviceType: "SHUTTLE",
  },
  cargo: { name: "Cargo Hauler", comfort: "Utility", serviceType: "CARGO" },
  class: { name: "Command Class", comfort: "Premium", serviceType: "SHUTTLE" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/8 last:border-0">
      <span
        className="text-[9px] tracking-[0.2em] text-white/45"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        {label}
      </span>
      <span
        className="text-[11px] tracking-[0.1em] text-white font-bold"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        {value}
      </span>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative p-5 mb-4"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <p
        className="text-[9px] tracking-[0.3em] text-white/40 mb-4 uppercase"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        {`// ${title} `}
      </p>
      {children}
    </div>
  );
}

function ConfirmRideContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  // Your book page should pass these — location names for display,
  // location IDs for the API call
  const pickup = searchParams.get("pickup") || ""; // display name e.g. "Mars 🔴"
  const dropoff = searchParams.get("dropoff") || ""; // display name
  const originId = searchParams.get("originId") || ""; // UUID from DB
  const destinationId = searchParams.get("destinationId") || ""; // UUID from DB
  const shuttleId = searchParams.get("shuttle") || "";
  const basePrice = parseInt(searchParams.get("price") || "0", 10);

  const distance =
    pickup && dropoff && DISTANCES[pickup]?.[dropoff]
      ? DISTANCES[pickup][dropoff]
      : 0;

  const distanceCost = distance * 2;
  const fuelSurcharge = distanceCost * 0.1;
  const tax = (basePrice + distanceCost) * 0.05;
  const totalPrice = basePrice + distanceCost + fuelSurcharge + tax;

  const shuttleDetails =
    SHUTTLE_DETAILS[shuttleId as keyof typeof SHUTTLE_DETAILS];
  const serviceType = shuttleDetails?.serviceType ?? "SHUTTLE";

  useEffect(() => {
    if (!destinationId || !serviceType) return;
    setBriefingLoading(true);
    fetch(
      `/api/briefing?destinationId=${destinationId}&serviceType=${serviceType}`,
    )
      .then((r) => r.json())
      .then((d) => setBriefing(d.briefing ?? null))
      .catch(() => null)
      .finally(() => setBriefingLoading(false));
  }, [destinationId, serviceType]);

  async function handleConfirmRide() {
    if (!originId || !destinationId) {
      setError("Missing location IDs — go back and reselect your route.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originId, destinationId, serviceType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create booking.");
        setLoading(false);
        return;
      }

      // Redirect to tracking page with the real booking ID from DB
      router.push(`/ride/track/${data.booking.id}`);
    } catch (err) {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative">
      <div className="w-full max-w-xl mx-auto px-6 py-10 relative z-10 mt-16">
        {/* Header */}
        <p
          className="text-[9px] tracking-[0.4em] text-white/40 uppercase mb-2 text-center"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {"// pre-launch checklist"}
        </p>
        <h1
          className="text-center text-3xl font-black tracking-[0.12em] text-white mb-8"
          style={{
            fontFamily: "'Orbitron', monospace",
            textShadow: "0 0 20px rgba(255,255,255,0.5)",
          }}
        >
          CONFIRM RIDE
        </h1>

        {/* Error */}
        {error && (
          <div
            className="mb-4 px-5 py-3 text-[10px] tracking-[0.15em] text-red-400/90"
            style={{
              border: "1px solid rgba(239,68,68,0.25)",
              background: "rgba(239,68,68,0.05)",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            !! {error.toUpperCase()}
          </div>
        )}

        {/* Trip details */}
        <Card title="trip details">
          <Row label="FROM" value={pickup || "—"} />
          <Row label="TO" value={dropoff || "—"} />
          {distance > 0 && (
            <Row label="DISTANCE" value={`${distance.toLocaleString()}M KM`} />
          )}
        </Card>

        {/* Shuttle details */}
        <Card title="vessel">
          <Row label="MODEL" value={shuttleDetails?.name || "—"} />
          <Row label="CLASS" value={shuttleDetails?.comfort || "—"} />
          <Row label="SERVICE TYPE" value={serviceType} />
          <Row label="BASE PRICE" value={`${basePrice} CR`} />
        </Card>

        {/* Price breakdown */}
        {basePrice > 0 && distance > 0 && (
          <Card title="price breakdown">
            <Row label="BASE FARE" value={`${basePrice} CR`} />
            <Row
              label={`DISTANCE (${distance}M KM × 2)`}
              value={`${distanceCost} CR`}
            />
            <Row
              label="FUEL SURCHARGE (10%)"
              value={`${fuelSurcharge.toFixed(2)} CR`}
            />
            <Row label="TAX (5%)" value={`${tax.toFixed(2)} CR`} />
            {/* Total */}
            <div className="flex justify-between items-center pt-3 mt-1">
              <span
                className="text-[10px] tracking-[0.2em] text-white font-black"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                TOTAL
              </span>
              <span
                className="text-xl font-black tracking-[0.1em] text-white"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  textShadow: "0 0 12px rgba(255,255,255,0.5)",
                }}
              >
                {totalPrice.toFixed(2)} CR
              </span>
            </div>
          </Card>
        )}

        <Card title="ai mission briefing">
          {briefingLoading ? (
            <p
              className="text-[9px] tracking-[0.2em] text-white/30 animate-pulse"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              GENERATING BRIEFING...
            </p>
          ) : briefing ? (
            <p
              className="text-[10px] leading-loose tracking-[0.1em] text-white/55"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              {briefing}
            </p>
          ) : (
            <p
              className="text-[9px] tracking-[0.2em] text-white/20"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              BRIEFING UNAVAILABLE
            </p>
          )}
        </Card>

        {/* Missing IDs warning */}
        {(!originId || !destinationId) && (
          <div
            className="mb-4 px-5 py-3 text-[9px] tracking-[0.15em] text-white/40"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            !! LOCATION IDs MISSING — UPDATE YOUR BOOK PAGE TO PASS originId AND
            destinationId AS QUERY PARAMS
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <Link
            href="/ride"
            className="flex-1 relative flex items-center justify-center py-3 text-[10px] font-black tracking-[0.2em] text-white/50 hover:text-white transition-all"
            style={{
              fontFamily: "'Orbitron', monospace",
              clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
              border: "none",
            }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: "inherit",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            BACK
          </Link>

          <button
            type="button"
            onClick={handleConfirmRide}
            disabled={loading || !originId || !destinationId}
            className="flex-1 relative flex items-center justify-center py-3 text-[10px] font-black tracking-[0.2em] text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Orbitron', monospace",
              clipPath:
                "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
              border: "none",
              textShadow: "0 0 10px rgba(255,255,255,0.6)",
            }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: "inherit",
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.05)",
              }}
            />
            {loading ? "LAUNCHING..." : "CONFIRM RIDE"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmRide() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p
            className="text-[10px] tracking-[0.3em] text-white/40 animate-pulse"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            LOADING...
          </p>
        </div>
      }
    >
      <ConfirmRideContent />
    </Suspense>
  );
}
