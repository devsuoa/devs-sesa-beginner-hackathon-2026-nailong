"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShuttleOptions from "@/components/ShuttleOptions";

const SHUTTLE_PRICES = {
  orbit:   120,
  express: 180,
  nailong: 240,
  cargo:   380,
  class:   520,
};

type Location = {
  id: string;
  name: string;
  type: string;
  currentConditions: string | null;
};

function LocationSelect({
  label,
  value,
  onChange,
  locations,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  locations: Location[];
  disabled?: boolean;
  placeholder: string;
}) {
  return (
    <div
      className="relative flex items-center gap-4 p-4 transition-all"
      style={{
        clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.02)",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <label
        className="w-1/3 text-[9px] tracking-[0.3em] text-white/50 uppercase shrink-0"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-2/3 h-10 bg-transparent text-white outline-none cursor-pointer text-[11px] tracking-[0.1em]"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        <option value="" className="bg-black text-white/50">{placeholder}</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id} className="bg-black">
            {loc.name}
            {loc.currentConditions ? ` — ${loc.currentConditions}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Ride() {
  const router = useRouter();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [selectedShuttle, setSelectedShuttle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/api/locations");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load locations");
        setLocations(data.locations);
      } catch (err) {
        setLocationsError("Failed to load locations. Please refresh.");
      } finally {
        setLoadingLocations(false);
      }
    }
    fetchLocations();
  }, []);

  function handleOriginChange(id: string) {
    setOriginId(id);
    if (destinationId === id) setDestinationId("");
    setError(null);
  }

  function handleDestinationChange(id: string) {
    if (id === originId) {
      setError("Origin and destination cannot be the same.");
      return;
    }
    setDestinationId(id);
    setError(null);
  }

  function handleConfirm() {
    if (!originId || !destinationId || !selectedShuttle) {
      setError("Please select an origin, destination, and shuttle.");
      return;
    }

    const shuttlePrice = SHUTTLE_PRICES[selectedShuttle as keyof typeof SHUTTLE_PRICES];
    if (!shuttlePrice) {
      setError("Invalid shuttle selection.");
      return;
    }

    const origin      = locations.find((l) => l.id === originId);
    const destination = locations.find((l) => l.id === destinationId);

    const params = new URLSearchParams({
      pickup:        origin?.name      ?? "",
      dropoff:       destination?.name ?? "",
      originId,
      destinationId,
      shuttle:       selectedShuttle,
      price:         shuttlePrice.toString(),
    });

    router.push(`/ride/confirm?${params.toString()}`);
  }

  const availableDestinations = locations.filter((l) => l.id !== originId);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 mt-24 px-4 pb-12">

      {/* Header */}
      <div className="text-center mb-2">
        <p
          className="text-[9px] tracking-[0.4em] text-white/40 uppercase mb-2"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {"// plot your course"}
        </p>
        <h1
          className="text-3xl font-black tracking-[0.12em] text-white"
          style={{
            fontFamily: "'Orbitron', monospace",
            textShadow: "0 0 20px rgba(255,255,255,0.5)",
          }}
        >
          BOOK YOUR RIDE
        </h1>
      </div>

      {/* Error */}
      {(error || locationsError) && (
        <div
          className="px-4 py-3 text-[9px] tracking-[0.2em] text-red-400/80"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            border: "1px solid rgba(239,68,68,0.2)",
            background: "rgba(239,68,68,0.04)",
          }}
        >
          !! {(error ?? locationsError)?.toUpperCase()}
        </div>
      )}

      {/* Locations */}
      {loadingLocations ? (
        <div
          className="text-center text-[9px] tracking-[0.3em] text-white/30 py-8 animate-pulse"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          SCANNING LOCATIONS...
        </div>
      ) : (
        <>
          <LocationSelect
            label="ORIGIN"
            value={originId}
            onChange={handleOriginChange}
            locations={locations}
            placeholder="Select origin"
          />

          <LocationSelect
            label="DESTINATION"
            value={destinationId}
            onChange={handleDestinationChange}
            locations={availableDestinations}
            disabled={!originId}
            placeholder={!originId ? "Select origin first" : "Select destination"}
          />
        </>
      )}

      {/* Shuttle options */}
      <ShuttleOptions onSelectShuttle={setSelectedShuttle} />

      {/* Confirm button */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!originId || !destinationId || !selectedShuttle}
        className="relative w-full py-4 flex items-center justify-center font-black text-[11px] tracking-[0.25em] text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          fontFamily: "'Orbitron', monospace",
          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
          textShadow: "0 0 10px rgba(255,255,255,0.6)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.textShadow = "0 0 20px rgba(255,255,255,1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.textShadow = "0 0 10px rgba(255,255,255,0.6)"; }}
      >
        <span
          className="absolute inset-0 pointer-events-none transition-all"
          style={{
            clipPath: "inherit",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        CONFIRM ROUTE →
      </button>
    </div>
  );
}