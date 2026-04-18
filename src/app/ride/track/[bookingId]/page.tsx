"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import type { Booking } from "@/generated/prisma/client";

function TrackingContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("CONFIRMING");
  const [driverAssigned, setDriverAssigned] = useState(false);
  const [eta, setEta] = useState("--");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  
  // Load booking data
  useEffect(() => {
    const loadBooking = () => {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
      const foundBooking = bookings[bookingId];
      
      if (foundBooking) {
        setBooking(foundBooking);
        setStatus(foundBooking.status);
        
        // If booking is already cancelled or completed, don't start progress
        if (foundBooking.status === 'CANCELLED' || foundBooking.status === 'COMPLETED') {
          setProgress(foundBooking.status === 'COMPLETED' ? 100 : 0);
          setDriverAssigned(false);
          setLoading(false);
          // Show rating modal if completed and not yet rated
          if (foundBooking.status === 'COMPLETED' && !foundBooking.rated) {
            setShowRating(true);
          }
          return;
        }
        
        // If booking has saved progress, restore it
        if (foundBooking.progress) {
          setProgress(foundBooking.progress);
          setStatus(foundBooking.trackingStatus || "EN ROUTE");
          setDriverAssigned(true);
          setEta(foundBooking.eta || "15");
        }
      }
      setLoading(false);
    };
    
    loadBooking();
  }, [bookingId]);
  
  // Simulate booking progress (only if not cancelled/completed)
  useEffect(() => {
    if (!booking || loading) return;
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') return;
    
    const timer1 = setTimeout(() => setStatus("CONFIRMED"), 1000);
    const timer2 = setTimeout(() => setStatus("SEARCHING FOR DRIVER"), 2000);
    const timer3 = setTimeout(() => {
      setDriverAssigned(true);
      setStatus("EN ROUTE");
      setEta(booking.eta || "15");
    }, 4000);
    
    const timer4 = setTimeout(() => setProgress(15), 5000);
    const timer5 = setTimeout(() => setProgress(30), 7000);
    const timer6 = setTimeout(() => setProgress(45), 9000);
    const timer7 = setTimeout(() => setProgress(60), 11000);
    const timer8 = setTimeout(() => setProgress(75), 13000);
    const timer9 = setTimeout(() => setProgress(90), 15000);
    
    // Stop at 95% and wait for user confirmation
    const timer10 = setTimeout(() => {
      setProgress(95);
      setStatus("ARRIVING");
      setEta("1");
    }, 16000);
    
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
  }, [booking, loading, bookingId]);

  // Save progress to localStorage
  useEffect(() => {
    if (!booking || loading) return;
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') return;
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
    if (bookings[bookingId]) {
      bookings[bookingId].progress = progress;
      bookings[bookingId].trackingStatus = status;
      bookings[bookingId].eta = eta;
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [progress, status, eta, booking, loading, bookingId]);

  const handleCancelRide = () => {
    setCancelling(true);
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
    if (bookings[bookingId]) {
      bookings[bookingId].status = "CANCELLED";
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
    
    setTimeout(() => {
      setCancelling(false);
      setShowCancelModal(false);
      router.push('/ride/history');
    }, 1000);
  };

  const handleConfirmArrival = () => {
    setCompleting(true);
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
    if (bookings[bookingId]) {
      bookings[bookingId].status = "COMPLETED";
      bookings[bookingId].progress = 100;
      bookings[bookingId].completedAt = new Date().toISOString();
      bookings[bookingId].rated = false;
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
    
    setTimeout(() => {
      setCompleting(false);
      setShowArrivalModal(false);
      setProgress(100);
      setStatus("COMPLETED");
      setEta("0");
      setShowRating(true);
    }, 1000);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      alert("Please select a rating before submitting");
      return;
    }
    
    setSubmittingRating(true);
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
    if (bookings[bookingId]) {
      bookings[bookingId].rated = true;
      bookings[bookingId].rating = rating;
      bookings[bookingId].feedback = feedback;
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
    
    setTimeout(() => {
      setSubmittingRating(false);
      setShowRating(false);
      router.push('/ride/history');
    }, 1500);
  };

  const getShuttleName = () => {
    const names: Record<string, string> = {
      orbit: "Orbit Classic",
      express: "Warp Express",
      nailong: "Nailong Runner",
      cargo: "Cargo Hauler",
      class: "Command Class",
    };
    return booking ? names[booking.serviceType] || "Orbit Classic" : "Unknown";
  };

  const isActive = booking && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && progress < 100;
  const isCancelled = booking?.status === 'CANCELLED';
  const isCompleted = booking?.status === 'COMPLETED';
  const isArriving = status === "ARRIVING" && progress >= 95 && !isCompleted;

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
          {isCancelled ? "RIDE CANCELLED" : isCompleted ? "RIDE COMPLETED" : "TRACKING"}
        </h1>
        <p className="text-center text-[9px] tracking-[0.3em] text-white/40 mb-8">
          BOOKING ID: {booking.id}
        </p>

        {/* Arrival Ready Message */}
        {isArriving && !isCompleted && !isCancelled && (
          <div className="relative rounded-lg border border-green-500/30 bg-green-500/10 backdrop-blur-md p-6 mb-6 animate-pulse">
            <div className="text-center">
              <div className="text-4xl mb-2">📍</div>
              <p className="text-green-400 text-sm font-semibold">Arriving at destination!</p>
              <p className="text-white/60 text-xs mt-2">Your driver is approaching your dropoff location</p>
              <button
                onClick={() => setShowArrivalModal(true)}
                className="mt-4 px-6 py-2 text-sm tracking-[0.2em] text-white bg-green-500/20 border border-green-500/40 hover:bg-green-500/30 transition-all rounded"
              >
                CONFIRM ARRIVAL
              </button>
            </div>
          </div>
        )}

        {/* Show cancellation message if cancelled */}
        {isCancelled && (
          <div className="relative rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur-md p-6 mb-6">
            <div className="text-center">
              <div className="text-4xl mb-2">✗</div>
              <p className="text-red-400 text-sm font-semibold">This ride has been cancelled</p>
              <p className="text-white/40 text-xs mt-2">You can book a new ride from the dashboard</p>
              <Link href="/ride">
                <button className="mt-4 px-6 py-2 text-sm tracking-[0.2em] text-white border border-cyan-500/40 hover:border-cyan-400 transition-all">
                  BOOK NEW RIDE
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Only show tracking content for active rides */}
        {isActive && (
          <>
            {/* Animated Spacecraft SVG */}
            <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-8 mb-6 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="stars" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="white" />
                      <circle cx="20" cy="15" r="0.5" fill="white" />
                      <circle cx="35" cy="8" r="0.8" fill="white" />
                      <circle cx="10" cy="30" r="0.6" fill="white" />
                      <circle cx="30" cy="35" r="1" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#stars)" />
                </svg>
              </div>
              
              <div className="relative h-48 flex items-center justify-center">
                <div 
                  className="absolute transition-transform duration-1000"
                  style={{ transform: `translateX(${progress}%)` }}
                >
                  <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="shuttleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00d4ff"/>
                        <stop offset="100%" stopColor="#0099ff"/>
                      </linearGradient>
                      <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff6600"/>
                        <stop offset="50%" stopColor="#ff4400"/>
                        <stop offset="100%" stopColor="#ff0000" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M20 30 L80 30 L90 40 L80 50 L20 50 Z" fill="url(#shuttleGrad)" stroke="#00d4ff" strokeWidth="1"/>
                    <path d="M80 30 L100 40 L80 50 Z" fill="#00d4ff" stroke="#00d4ff" strokeWidth="1"/>
                    <path d="M20 30 L0 25 L0 35 Z" fill="#0088cc"/>
                    <path d="M20 50 L0 45 L0 55 Z" fill="#0088cc"/>
                    <circle cx="70" cy="40" r="5" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1"/>
                    <path d="M15 35 L-10 40 L15 45 Z" fill="url(#flameGrad)">
                      <animate attributeName="d" 
                        values="M15 35 L-10 40 L15 45 Z;M15 33 L-15 40 L15 47 Z;M15 35 L-10 40 L15 45 Z"
                        dur="0.5s" repeatCount="indefinite"/>
                    </path>
                    <circle cx="15" cy="40" r="8" fill="#ff6600" opacity="0.3">
                      <animate attributeName="r" values="8;12;8" dur="0.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.3;0.1;0.3" dur="0.5s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-white/40 text-[8px] tracking-[0.15em] mb-2">
                  <span className={progress >= 0 ? "text-cyan-400" : ""}>DEPARTURE</span>
                  <span className={progress >= 50 ? "text-cyan-400" : ""}>IN TRANSIT</span>
                  <span className={progress >= 95 ? "text-green-400" : ""}>ARRIVAL</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {progress >= 95 && progress < 100 && (
                  <div className="flex justify-center mt-2">
                    <span className="text-green-400 text-[8px] tracking-[0.15em] animate-pulse">
                      ✓ APPROACHING DESTINATION
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6">
              <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">BOOKING STATUS</h2>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${progress >= 95 ? 'bg-green-500' : 'bg-cyan-500'} animate-pulse`} />
                    <div className={`absolute inset-0 w-3 h-3 rounded-full ${progress >= 95 ? 'bg-green-500' : 'bg-cyan-500'} animate-ping`} />
                  </div>
                  <span className="text-white font-mono text-sm tracking-wider">{status}</span>
                </div>
                <span className="text-cyan-400 text-xs">BOOKING #{booking.id}</span>
              </div>
              
              {progress < 95 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-white/30 text-[8px]">
                    <span>ETA: {eta} minutes</span>
                    <span>{Math.floor(progress / 6)} min elapsed</span>
                  </div>
                </div>
              )}
            </div>

            {/* Driver Details Card */}
            <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6">
              <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">DRIVER ASSIGNMENT</h2>
              
              {driverAssigned ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
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
                      <p className="text-white/40 text-[9px] tracking-[0.15em]">LICENSE</p>
                      <p className="text-white text-sm">{booking.driver?.license || "SPC-0000"}</p>
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
                    {progress >= 95 
                      ? "Approaching destination. Prepare for landing sequence."
                      : `Optimal route calculated. ${Math.ceil((100 - progress) / 6)} minutes to destination.`
                    }
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
                    All systems operational. {getShuttleName()} performing optimally.
                  </p>
                </div>
                <div className="mt-3 p-3 rounded bg-white/5 border border-white/10">
                  <p className="text-cyan-400 text-[10px] tracking-[0.15em]">
                    🖖 "Live long and prosper, traveler."
                  </p>
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
          </>
        )}

        {/* Action Buttons - Cancel button always visible for active rides */}
        <div className="flex gap-4">
          <Link href="/ride/history" className="flex-1">
            <button className="w-full h-12 flex items-center justify-center
              text-white tracking-[0.2em] text-sm
              border border-white/20 bg-black/40 backdrop-blur-md
              transition-all duration-300
              hover:border-white/40 hover:bg-white/5">
              {isActive ? "BACK TO HISTORY" : "VIEW HISTORY"}
            </button>
          </Link>
          
          {/* Cancel button - show for ALL active rides (including when arriving) */}
          {isActive && (
            <button 
              onClick={() => setShowCancelModal(true)}
              className="flex-1 relative w-full h-12 flex items-center justify-center
                text-white tracking-[0.2em] text-sm font-semibold
                border border-red-500/40 bg-gradient-to-r from-red-500/20 to-orange-500/20
                transition-all duration-300
                hover:border-red-400 hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]
                active:scale-95">
              CANCEL RIDE
            </button>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-black/90 border border-red-500/30 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-white text-lg font-semibold mb-2">Cancel Ride?</h3>
              <p className="text-white/60 text-sm mb-6">
                Are you sure you want to cancel this ride? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 h-10 text-white/80 text-sm border border-white/20 hover:border-white/40 transition-all"
                >
                  GO BACK
                </button>
                <button
                  onClick={handleCancelRide}
                  disabled={cancelling}
                  className="flex-1 h-10 text-white text-sm font-semibold bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 transition-all disabled:opacity-50"
                >
                  {cancelling ? "CANCELLING..." : "YES, CANCEL"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Arrival Confirmation Modal */}
      {showArrivalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowArrivalModal(false)} />
          <div className="relative bg-black/90 border border-green-500/30 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="text-white text-lg font-semibold mb-2">Welcome to Your Destination!</h3>
              <p className="text-white/60 text-sm mb-6">
                Have you arrived safely? Confirm to complete your journey with NAIX.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowArrivalModal(false)}
                  className="flex-1 h-10 text-white/80 text-sm border border-white/20 hover:border-white/40 transition-all"
                >
                  NOT YET
                </button>
                <button
                  onClick={handleConfirmArrival}
                  disabled={completing}
                  className="flex-1 h-10 text-white text-sm font-semibold bg-green-500/20 border border-green-500/40 hover:bg-green-500/30 transition-all disabled:opacity-50"
                >
                  {completing ? "COMPLETING..." : "YES, ARRIVED"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => !submittingRating && setShowRating(false)} />
          <div className="relative bg-gradient-to-b from-gray-900 to-black border border-cyan-500/30 rounded-lg p-8 max-w-md w-full animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-2xl font-black tracking-[0.2em] text-white mb-2">
                THANK YOU!
              </h2>
              <p className="text-cyan-400 text-sm tracking-[0.15em] mb-4">
                for choosing NAIX
              </p>
              <p className="text-white/60 text-sm mb-6">
                How was your ride with {booking.driver?.name || "Captain Vega"}?
              </p>
              
              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span className={
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]"
                        : "text-gray-600"
                    }>
                      ★
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Rating Labels */}
              <div className="flex justify-between text-[8px] tracking-[0.15em] mb-6 text-white/40">
                <span>POOR</span>
                <span>FAIR</span>
                <span>GOOD</span>
                <span>VERY GOOD</span>
                <span>EXCELLENT</span>
              </div>
              
              {/* Feedback Textarea */}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with us..."
                className="w-full h-24 px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white text-sm placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none resize-none mb-6"
              />
              
              {/* Submit Button */}
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating}
                className="w-full py-3 text-white tracking-[0.2em] text-sm font-semibold
                  border border-cyan-500/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20
                  transition-all duration-300 hover:border-cyan-400 
                  hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingRating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    SUBMITTING...
                  </div>
                ) : (
                  "SUBMIT & CONTINUE"
                )}
              </button>
              
              {/* Skip link */}
              {!submittingRating && (
                <button
                  onClick={() => {
                    setShowRating(false);
                    router.push('/ride/history');
                  }}
                  className="mt-4 text-white/30 text-[10px] tracking-[0.15em] hover:text-white/50 transition-colors"
                >
                  Skip for now
                </button>
              )}
            </div>
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