"use client";

import { useParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";

function TrackingContent() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("CONFIRMING");
  const [driverAssigned, setDriverAssigned] = useState(false);
  const [eta, setEta] = useState("--");
  
  // Load booking data
  useEffect(() => {
    const loadBooking = () => {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
      const foundBooking = bookings[bookingId];
      
      if (foundBooking) {
        setBooking(foundBooking);
        setStatus(foundBooking.status);
      }
      setLoading(false);
    };
    
    loadBooking();
  }, [bookingId]);
  
  // Simulate booking progress
  useEffect(() => {
    if (!booking) return;
    
    const timer1 = setTimeout(() => setStatus("CONFIRMED"), 1000);
    const timer2 = setTimeout(() => setStatus("SEARCHING FOR DRIVER"), 2000);
    const timer3 = setTimeout(() => {
        setDriverAssigned(true);
        setStatus("DRIVER ASSIGNED");
        setEta(booking.eta || "12");
    }, 4000);
    
    // Progress updates
    const timer4 = setTimeout(() => setProgress(15), 5000);
    const timer5 = setTimeout(() => setProgress(30), 7000);
    const timer6 = setTimeout(() => setProgress(45), 9000);
    const timer7 = setTimeout(() => setProgress(60), 11000);
    const timer8 = setTimeout(() => setProgress(75), 13000);
    const timer9 = setTimeout(() => setProgress(90), 15000);
    const timer10 = setTimeout(() => {
        setProgress(100);
        setStatus("ARRIVED");
        setEta("0");
    }, 17000);
    
    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
        clearTimeout(timer7);
        clearTimeout(timer8);
        clearTimeout(timer9);
        clearTimeout(timer10);
    };
    }, [booking]);

  const getShuttleName = () => {
    const names: Record<string, string> = {
      orbit: "Orbit Classic",
      express: "Warp Express",
      nailong: "Nailong Runner",
      cargo: "Cargo Hauler",
      class: "Command Class",
    };
    return booking ? names[booking.shuttleId] || "Orbit Classic" : "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs">LOADING BOOKING DATA...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-400 text-sm">Booking not found</p>
          <Link href="/ride" className="mt-4 inline-block text-cyan-400 text-sm">
            Return to booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="w-full max-w-2xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-center text-3xl font-black tracking-[0.2em] text-white mb-2"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.7)" }}>
          TRACKING
        </h1>
        <p className="text-center text-[9px] tracking-[0.3em] text-white/40 mb-8">
          BOOKING ID: {booking.id}
        </p>

        {/* Animated Spacecraft SVG */}
        <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-8 mb-6 overflow-hidden">
          {/* ... your existing SVG animation code ... */}
          <div className="relative h-48 flex items-center justify-center">
            <div 
              className="absolute transition-transform duration-1000"
              style={{ transform: `translateX(${progress}%)` }}
            >
              {/* Your shuttle SVG here */}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-white/40 text-[8px] tracking-[0.15em] mb-2">
              <span>DEPARTURE</span>
              <span>IN TRANSIT</span>
              <span>ARRIVAL</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6">
          <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">BOOKING STATUS</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-500 animate-ping" />
              </div>
              <span className="text-white font-mono text-sm tracking-wider">{status}</span>
            </div>
            <span className="text-cyan-400 text-xs">BOOKING #{booking.id}</span>
          </div>
        </div>

        {/* Driver Details Card */}
        <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6">
          <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">DRIVER ASSIGNMENT</h2>
          
          {driverAssigned ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {/* Driver avatar SVG */}
                  <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="28" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5"/>
                    <circle cx="30" cy="22" r="8" fill="#00d4ff" opacity="0.8"/>
                    <path d="M15 45 Q30 35 45 45" fill="none" stroke="#00d4ff" strokeWidth="2"/>
                    <circle cx="30" cy="30" r="2" fill="#fff" opacity="0.5"/>
                  </svg>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <p className="text-white font-semibold">{booking.driver?.name || "Captain Vega"}</p>
                  <p className="text-white/40 text-xs tracking-[0.15em]">ID: {booking.driver?.id || "NX-001"}</p>
                  <p className="text-cyan-400 text-xs">⭐ {booking.driver?.rating || 4.98} • {booking.driver?.rides || 1200} rides</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-white/40 text-[9px] tracking-[0.15em]">VEHICLE</p>
                  <p className="text-white text-sm">{getShuttleName()}</p>
                </div>
                <div>
                  <p className="text-white/40 text-[9px] tracking-[0.15em]">ETA</p>
                  <p className="text-white text-sm">{eta} MIN</p>
                </div>
                <div>
                  <p className="text-white/40 text-[9px] tracking-[0.15em]">LICENSE</p>
                  <p className="text-white text-sm">{booking.driver?.license || "SPC-0000"}</p>
                </div>
                <div>
                  <p className="text-white/40 text-[9px] tracking-[0.15em]">STATUS</p>
                  <p className="text-green-400 text-sm">EN ROUTE</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white/40 text-xs tracking-[0.15em]">SCANNING FOR AVAILABLE PILOTS...</p>
              </div>
            </div>
          )}
        </div>

        {/* AI Briefing Card */}
        <div className="relative rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-blue-500/5 backdrop-blur-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#00d4ff" opacity="0.6"/>
            </svg>
            <h2 className="text-purple-400/80 text-sm tracking-[0.2em]">AI MISSION BRIEFING</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-cyan-400 text-xs">🚀</span>
              <p className="text-white/70 text-sm leading-relaxed">
                Optimal route calculated. Estimated travel time: {Math.floor(Math.random() * 30 + 15)} minutes.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-yellow-400 text-xs">🌡️</span>
              <p className="text-white/70 text-sm leading-relaxed">
                Space weather: Clear. Solar winds nominal. Safe for transit.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-400 text-xs">📡</span>
              <p className="text-white/70 text-sm leading-relaxed">
                All systems operational. {getShuttleName()} is prepped and ready.
              </p>
            </div>
            <div className="mt-3 p-3 rounded bg-white/5 border border-white/10">
              <p className="text-cyan-400 text-[10px] tracking-[0.15em]">🖖 "Live long and prosper, traveler."</p>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6">
          <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">ROUTE DETAILS</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60 text-sm">From:</span>
              <span className="text-white font-semibold">{booking.pickup}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60 text-sm">To:</span>
              <span className="text-white font-semibold">{booking.dropoff}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-white/60 text-sm">Distance:</span>
              <span className="text-cyan-400 font-semibold">{booking.distance} million km</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/dashboard" className="flex-1">
            <button className="w-full h-12 flex items-center justify-center
              text-white tracking-[0.2em] text-sm
              border border-white/20 bg-black/40 backdrop-blur-md
              transition-all duration-300
              hover:border-white/40 hover:bg-white/5">
              BACK TO DASHBOARD
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs">LOADING MISSION DATA...</p>
        </div>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}