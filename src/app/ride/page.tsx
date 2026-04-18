"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShuttleOptions from "@/components/ShuttleOptions";

const PLANETS = [
  "Mars 🔴",
  "Venus 🟠",
  "Jupiter 🪐",
  "Saturn 💫",
  "Uranus 🌀",
  "Neptune 🌊",
  "Mercury ☀️",
];

// Shuttle prices mapping - UPDATED to match ShuttleOptions IDs
const SHUTTLE_PRICES = {
  orbit: 120,      // matches "orbit"
  express: 180,    // matches "express" (not "nova")
  nailong: 240,    // matches "nailong"
  cargo: 380,      // matches "cargo" (not "quantum")
  class: 520,      // matches "class" (not "void")
};

export default function Ride() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedShuttle, setSelectedShuttle] = useState<string | null>(null);
  const router = useRouter();

  const handlePickupChange = (value: string) => {
    setPickup(value);
    // If dropoff is the same as the new pickup, clear dropoff
    if (dropoff === value) {
      setDropoff("");
    }
  };

  const handleDropoffChange = (value: string) => {
    // Prevent setting dropoff same as pickup
    if (value === pickup) {
      alert("Pickup and dropoff locations cannot be the same!");
      return;
    }
    setDropoff(value);
  };

  const handleConfirm = () => {
    // Validate all fields
    if (!pickup || !dropoff || !selectedShuttle) {
      alert("Please fill all fields and select a shuttle");
      return;
    }

    if (pickup === dropoff) {
      alert("Pickup and dropoff locations cannot be the same!");
      return;
    }

    // Get the price safely
    const shuttlePrice = SHUTTLE_PRICES[selectedShuttle as keyof typeof SHUTTLE_PRICES];
    
    if (!shuttlePrice) {
      alert("Invalid shuttle selection. Please select a valid shuttle.");
      console.error("Invalid shuttle ID:", selectedShuttle);
      return;
    }

    console.log("Navigating with:", { pickup, dropoff, selectedShuttle, shuttlePrice });

    // Encode the data and pass via URL
    const params = new URLSearchParams({
      pickup: pickup,
      dropoff: dropoff,
      shuttle: selectedShuttle,
      price: shuttlePrice.toString(),
    });

    router.push(`/ride/confirm?${params.toString()}`);
  };

  // Filter out the selected pickup from dropoff options
  const getAvailableDropoffPlanets = () => {
    return PLANETS.filter(planet => planet !== pickup);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-8">
      {/* TITLE */}
      <h1
        className="text-center text-3xl font-black tracking-[0.2em] text-white mb-2 mt-8"
        style={{
          textShadow:
            "0 0 20px rgba(255,255,255,0.7), 0 0 40px rgba(255,255,255,0.55)",
        }}
      >
        BOOK YOUR RIDE
      </h1>

      {/* PICK UP */}
      <div className="relative flex items-center gap-4 p-4 rounded-lg border border-white/20 bg-black/40 backdrop-blur-md hover:border-white/40 transition">
        <label className="w-1/3 text-white/60 tracking-[0.2em] text-xs">
          PICK UP
        </label>

        <select
          value={pickup}
          onChange={(e) => handlePickupChange(e.target.value)}
          className="w-2/3 h-12 px-3 bg-transparent text-white outline-none cursor-pointer"
        >
          <option value="" className="bg-black">Select planet</option>
          {PLANETS.map((p) => (
            <option key={p} value={p} className="bg-black">
              {p}
            </option>
          ))}
        </select>

        <span className="corner-pip corner-pip--tl" />
        <span className="corner-pip corner-pip--tr" />
        <span className="corner-pip corner-pip--bl" />
        <span className="corner-pip corner-pip--br" />
      </div>

      {/* DROP OFF */}
      <div className="relative flex items-center gap-4 p-4 rounded-lg border border-white/20 bg-black/40 backdrop-blur-md hover:border-white/40 transition">
        <label className="w-1/3 text-white/60 tracking-[0.2em] text-xs">
          DROP OFF
        </label>

        <select
          value={dropoff}
          onChange={(e) => handleDropoffChange(e.target.value)}
          className="w-2/3 h-12 px-3 bg-transparent text-white outline-none cursor-pointer"
          disabled={!pickup}
          style={{ opacity: !pickup ? 0.5 : 1 }}
        >
          <option value="" className="bg-black">
            {!pickup ? "Select pickup first" : "Select destination"}
          </option>
          {getAvailableDropoffPlanets().map((p) => (
            <option key={p} value={p} className="bg-black">
              {p}
            </option>
          ))}
        </select>

        <span className="corner-pip corner-pip--tl" />
        <span className="corner-pip corner-pip--tr" />
        <span className="corner-pip corner-pip--bl" />
        <span className="corner-pip corner-pip--br" />
      </div>

      {/* SHUTTLE OPTIONS */}
      <ShuttleOptions onSelectShuttle={setSelectedShuttle} />

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleConfirm}
        type="button"
        className="relative w-full h-14 flex items-center justify-center
        text-white tracking-[0.25em] text-sm font-semibold
        border border-white/20 bg-black/40 backdrop-blur-md
        transition-all duration-300
        hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]
        active:scale-95"
      >
        <span className="corner-pip corner-pip--tl" />
        <span className="corner-pip corner-pip--tr" />
        <span className="corner-pip corner-pip--bl" />
        <span className="corner-pip corner-pip--br" />

        CONFIRM ROUTE
      </button>
    </div>
  );
}