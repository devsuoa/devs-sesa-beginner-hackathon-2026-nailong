"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

// Distance matrix between planets
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
  express: { name: "Warp Express", speed: 15, comfort: "Enhanced" },
  nailong: { name: "Nailong Runner", speed: 25, comfort: "Luxury" },
  cargo: { name: "Cargo Hauler", speed: 35, comfort: "Utility" },
  class: { name: "Command Class", speed: 50, comfort: "Premium" },
};

// Generate a unique booking ID
function generateBookingId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NX-${year}${month}${day}-${random}`;
}

// Store booking in localStorage (temporary until database is set up)
function saveBooking(bookingId: string, bookingData: any) {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
  bookings[bookingId] = {
    ...bookingData,
    createdAt: new Date().toISOString(),
    status: 'CONFIRMED'
  };
  localStorage.setItem('bookings', JSON.stringify(bookings));
}

function ConfirmRideContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const pickup = searchParams.get("pickup") || "";
  const dropoff = searchParams.get("dropoff") || "";
  const shuttleId = searchParams.get("shuttle") || "";
  const basePrice = parseInt(searchParams.get("price") || "0");

  // Calculate distance between planets
  const distance = pickup && dropoff && DISTANCES[pickup]?.[dropoff] 
    ? DISTANCES[pickup][dropoff] 
    : 0;

  // Calculate additional costs
  const distanceCost = distance * 2;
  const fuelSurcharge = distanceCost * 0.1;
  const tax = (basePrice + distanceCost) * 0.05;
  
  const totalPrice = basePrice + distanceCost + fuelSurcharge + tax;
  const shuttleDetails = SHUTTLE_DETAILS[shuttleId as keyof typeof SHUTTLE_DETAILS];

  const handleConfirmRide = () => {
    // Generate a unique booking ID
    const bookingId = generateBookingId();
    
    // Create booking data
    const bookingData = {
      id: bookingId,
      pickup,
      dropoff,
      shuttleId,
      shuttleName: shuttleDetails?.name,
      basePrice,
      distance,
      distanceCost,
      fuelSurcharge,
      tax,
      totalPrice: totalPrice.toFixed(2),
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      eta: "12",
      driver: {
        name: "Captain Vega",
        id: `NX-${Math.floor(Math.random() * 1000)}`,
        rating: 4.98,
        rides: 1200,
        vehicle: shuttleDetails?.name,
        license: `SPC-${Math.floor(Math.random() * 9000 + 1000)}`
      }
    };
    
    // Save to localStorage (temporary)
    saveBooking(bookingId, bookingData);
    
    console.log("Booking created:", bookingData);
    
    // Redirect to dynamic tracking page with booking ID
    router.push(`/ride/track/${bookingId}`);
  };

  return (
    <div className="min-h-screen relative">
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
              <span className="text-white font-semibold">{pickup || "Not selected"}</span>
            </div>
            
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">To:</span>
              <span className="text-white font-semibold">{dropoff || "Not selected"}</span>
            </div>
            
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Distance:</span>
              <span className="text-white font-semibold">{distance ? `${distance.toLocaleString()} million km` : "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Shuttle Details Card */}
        <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6">
          <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">SHUTTLE DETAILS</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Model:</span>
              <span className="text-white font-semibold">{shuttleDetails?.name || "Not selected"}</span>
            </div>
            
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Comfort Class:</span>
              <span className="text-white font-semibold">{shuttleDetails?.comfort || "N/A"}</span>
            </div>
            
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Base Price:</span>
              <span className="text-white font-semibold">{basePrice ? `${basePrice} cr` : "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown Card */}
        {(basePrice > 0 && distance > 0) && (
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
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link 
            href="/ride" 
            className="flex-1 w-full h-12 flex items-center justify-center
              text-white tracking-[0.2em] text-sm
              border border-white/20 bg-black/40 backdrop-blur-md
              transition-all duration-300
              hover:border-white/40 hover:bg-white/5"
          >
            BACK
          </Link>
          
          <button
            onClick={handleConfirmRide}
            className="flex-1 relative w-full h-12 flex items-center justify-center
              text-white tracking-[0.2em] text-sm font-semibold
              border border-cyan-500/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20
              transition-all duration-300
              hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]
              active:scale-95"
          >
            CONFIRM RIDE
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmRide() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <ConfirmRideContent />
    </Suspense>
  );
}