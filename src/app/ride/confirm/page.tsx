"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Starfield from "@/components/Starfield";

// Distance matrix between planets (in light minutes or whatever unit)
const DISTANCES: Record<string, Record<string, number>> = {
  "Mars 🔴": { "Venus 🟠": 45, "Jupiter 🪐": 350, "Saturn 💫": 650, "Uranus 🌀": 1800, "Neptune 🌊": 2800, "Mercury ☀️": 85 },
  "Venus 🟠": { "Mars 🔴": 45, "Jupiter 🪐": 380, "Saturn 💫": 680, "Uranus 🌀": 1830, "Neptune 🌊": 2830, "Mercury ☀️": 30 },
  "Jupiter 🪐": { "Mars 🔴": 350, "Venus 🟠": 380, "Saturn 💫": 300, "Uranus 🌀": 1400, "Neptune 🌊": 2300, "Mercury ☀️": 420 },
  "Saturn 💫": { "Mars 🔴": 650, "Venus 🟠": 680, "Jupiter 🪐": 300, "Uranus 🌀": 1000, "Neptune 🌊": 1900, "Mercury ☀️": 720 },
  "Uranus 🌀": { "Mars 🔴": 1800, "Venus 🟠": 1830, "Jupiter 🪐": 1400, "Saturn 💫": 1000, "Neptune 🌊": 900, "Mercury ☀️": 1850 },
  "Neptune 🌊": { "Mars 🔴": 2800, "Venus 🟠": 2830, "Jupiter 🪐": 2300, "Saturn 💫": 1900, "Uranus 🌀": 900, "Mercury ☀️": 2850 },
  "Mercury ☀️": { "Mars 🔴": 85, "Venus 🟠": 30, "Jupiter 🪐": 420, "Saturn 💫": 720, "Uranus 🌀": 1850, "Neptune 🌊": 2850 },
};

// Shuttle details
const SHUTTLE_DETAILS = {
  orbit: { name: "Orbit Classic", speed: 10, comfort: "Standard" },
  nova: { name: "Nova Cruiser", speed: 15, comfort: "Enhanced" },
  nailong: { name: "Nailong Runner", speed: 25, comfort: "Luxury" },
  quantum: { name: "Quantum X", speed: 40, comfort: "Premium" },
  void: { name: "Void Phantom", speed: 60, comfort: "Elite" },
};

export default function ConfirmRide() {
  const searchParams = useSearchParams();
  
  const pickup = searchParams.get("pickup") || "";
  const dropoff = searchParams.get("dropoff") || "";
  const shuttleId = searchParams.get("shuttle") || "";
  const basePrice = parseInt(searchParams.get("price") || "0");

  // Calculate distance between planets
  const distance = pickup && dropoff && DISTANCES[pickup]?.[dropoff] 
    ? DISTANCES[pickup][dropoff] 
    : 0;

  // Calculate additional costs
  const distanceCost = distance * 2; // 2 cr per unit distance
  const fuelSurcharge = distanceCost * 0.1; // 10% fuel charge
  const tax = (basePrice + distanceCost) * 0.05; // 5% tax
  
  const totalPrice = basePrice + distanceCost + fuelSurcharge + tax;

  const shuttleDetails = SHUTTLE_DETAILS[shuttleId as keyof typeof SHUTTLE_DETAILS];

  return (
    <div className="min-h-screen relative">
      <Starfield />
      
      <div className="w-full max-w-2xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-center text-4xl font-black tracking-[0.2em] text-white mb-8"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.7)" }}>
          CONFIRM YOUR RIDE
        </h1>

        {/* Trip Details Card */}
        <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6">
          <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">TRIP DETAILS</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">From:</span>
              <span className="text-white font-semibold">{pickup}</span>
            </div>
            
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">To:</span>
              <span className="text-white font-semibold">{dropoff}</span>
            </div>
            
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Distance:</span>
              <span className="text-white font-semibold">{distance.toLocaleString()} million km</span>
            </div>
          </div>
        </div>

        {/* Shuttle Details Card */}
        <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6">
          <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">SHUTTLE DETAILS</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Model:</span>
              <span className="text-white font-semibold">{shuttleDetails?.name || "Unknown"}</span>
            </div>
            
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Comfort Class:</span>
              <span className="text-white font-semibold">{shuttleDetails?.comfort || "Standard"}</span>
            </div>
            
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Base Price:</span>
              <span className="text-white font-semibold">{basePrice} cr</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown Card */}
        <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-8">
          <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">PRICE BREAKDOWN</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Base Shuttle Price:</span>
              <span className="text-white">{basePrice} cr</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/60">Distance Cost ({distance} km @ 2 cr/km):</span>
              <span className="text-white">{distanceCost} cr</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/60">Fuel Surcharge (10%):</span>
              <span className="text-white">{fuelSurcharge.toFixed(2)} cr</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/60">Tax (5%):</span>
              <span className="text-white">{tax.toFixed(2)} cr</span>
            </div>
            
            <div className="border-t border-white/20 my-2 pt-2"></div>
            
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">TOTAL:</span>
              <span className="text-cyan-400">{totalPrice.toFixed(2)} cr</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/ride" className="flex-1">
            <button className="w-full h-12 flex items-center justify-center
              text-white tracking-[0.2em] text-sm
              border border-white/20 bg-black/40 backdrop-blur-md
              transition-all duration-300
              hover:border-white/40 hover:bg-white/5">
              BACK
            </button>
          </Link>
          
          <Link href="/ride/payment" className="flex-1">
            <button className="relative w-full h-12 flex items-center justify-center
              text-white tracking-[0.2em] text-sm font-semibold
              border border-white/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20
              transition-all duration-300
              hover:border-white/80 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]
              active:scale-95">
              PROCEED TO PAYMENT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}