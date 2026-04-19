"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";

// Frontend Booking type
interface FrontendBooking {
  id: string;
  status: string;
  progress?: number;
  trackingStatus?: string;
  eta?: string;
  rated?: boolean;
  rating?: number;
  feedback?: string;
  completedAt?: string;
  createdAt?: string;
  pickup?: string;
  dropoff?: string;
  distance?: number;
  totalPrice?: string;
  serviceType?: string;
  driver?: {
    name: string;
    id: string;
    rating: number;
    rides: number;
    license: string;
  };
}

// Planet coordinates for the map
const PLANET_COORDINATES: Record<string, { x: number; y: number; color: string; size: number }> = {
  "Mars 🔴": { x: 15, y: 45, color: "#e74c3c", size: 12 },
  "Venus 🟠": { x: 30, y: 30, color: "#f39c12", size: 11 },
  "Jupiter 🪐": { x: 55, y: 25, color: "#d4a373", size: 18 },
  "Saturn 💫": { x: 70, y: 35, color: "#e8d5b7", size: 16 },
  "Uranus 🌀": { x: 80, y: 55, color: "#a8dadc", size: 13 },
  "Neptune 🌊": { x: 75, y: 70, color: "#457b9d", size: 13 },
  "Mercury ☀️": { x: 10, y: 60, color: "#e67e22", size: 9 },
};

function TrackingContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  
  const [booking, setBooking] = useState<FrontendBooking | null>(null);
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
  const [rocketPosition, setRocketPosition] = useState({ x: 0, y: 0 });
  
  // Get planet coordinates
  const pickupCoord = booking?.pickup ? PLANET_COORDINATES[booking.pickup] : null;
  const dropoffCoord = booking?.dropoff ? PLANET_COORDINATES[booking.dropoff] : null;
  
  // Load booking data
  useEffect(() => {
    const loadBooking = () => {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '{}');
      const foundBooking = bookings[bookingId] as FrontendBooking;
      
      if (foundBooking) {
        setBooking(foundBooking);
        setStatus(foundBooking.status);
        
        if (foundBooking.status === 'CANCELLED' || foundBooking.status === 'COMPLETED') {
          setProgress(foundBooking.status === 'COMPLETED' ? 100 : 0);
          setDriverAssigned(false);
          setLoading(false);
          if (foundBooking.status === 'COMPLETED' && !foundBooking.rated) {
            setShowRating(true);
          }
          return;
        }
        
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
  
  // Simulate booking progress
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
  }, [booking, loading]);

  // Update rocket position based on progress
  useEffect(() => {
    if (!pickupCoord || !dropoffCoord) return;
    
    const t = progress / 100;
    const x = pickupCoord.x + (dropoffCoord.x - pickupCoord.x) * t;
    const y = pickupCoord.y + (dropoffCoord.y - pickupCoord.y) * t;
    setRocketPosition({ x, y });
  }, [progress, pickupCoord, dropoffCoord]);

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
    return booking ? names[booking.serviceType || "orbit"] || "Orbit Classic" : "Unknown";
  };

  const isActive = booking && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && progress < 100;
  const isCancelled = booking?.status === 'CANCELLED';
  const isCompleted = booking?.status === 'COMPLETED';
  const isArriving = status === "ARRIVING" && progress >= 95 && !isCompleted;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs">LOADING BOOKING DATA...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <p className="text-red-400 text-sm">Booking not found</p>
          <Link href="/ride" className="mt-4 inline-block text-white/60 hover:text-white transition-all">
            Return to booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black">
      <div className="w-full max-w-2xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-center text-3xl font-black tracking-[0.2em] text-white mb-2"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.5)" }}>
          {isCancelled ? "RIDE CANCELLED" : isCompleted ? "RIDE COMPLETED" : "TRACKING"}
        </h1>
        <p className="text-center text-[9px] tracking-[0.3em] text-white/40 mb-8">
          BOOKING ID: {booking.id}
        </p>

        {/* Arrival Ready Message */}
        {isArriving && !isCompleted && !isCancelled && (
          <div className="relative rounded-lg border border-blue-500/50 bg-blue-500/10 backdrop-blur-md p-6 mb-6 animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <div className="text-center">
              <div className="text-4xl mb-2">📍</div>
              <p className="text-blue-400 text-sm font-semibold">Arriving at destination!</p>
              <p className="text-white/40 text-xs mt-2">Your driver is approaching your dropoff location</p>
              <button
                onClick={() => setShowArrivalModal(true)}
                className="mt-4 px-6 py-2 text-sm tracking-[0.2em] text-white bg-blue-500/20 border border-blue-500/40 hover:bg-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all rounded"
              >
                CONFIRM ARRIVAL
              </button>
            </div>
          </div>
        )}

        {/* Show cancellation message if cancelled */}
        {isCancelled && (
          <div className="relative rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur-md p-6 mb-6 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
            <div className="text-center">
              <div className="text-4xl mb-2">✗</div>
              <p className="text-red-400 text-sm font-semibold">This ride has been cancelled</p>
              <p className="text-white/40 text-xs mt-2">You can book a new ride from the dashboard</p>
              <Link href="/ride">
                <button className="mt-4 px-6 py-2 text-sm tracking-[0.2em] text-white border border-white/30 hover:border-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all">
                  BOOK NEW RIDE
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Only show tracking content for active rides */}
        {isActive && (
          <>
            {/* Space Map - Planet to Planet Journey */}
            <div className="relative rounded-lg border border-white/20 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-md p-6 mb-6 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <div className="absolute inset-0 opacity-30">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="stars2" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="0.8" fill="white" />
                      <circle cx="15" cy="10" r="0.5" fill="white" />
                      <circle cx="25" cy="20" r="0.6" fill="white" />
                      <circle cx="8" cy="25" r="0.4" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#stars2)" />
                </svg>
              </div>
              
              <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4 text-center">JOURNEY MAP</h2>
              
              {/* SVG Map */}
              <svg viewBox="0 0 100 100" className="w-full h-64">
                {/* Travel Path */}
                {pickupCoord && dropoffCoord && (
                  <>
                    {/* Path line */}
                    <line
                      x1={pickupCoord.x}
                      y1={pickupCoord.y}
                      x2={dropoffCoord.x}
                      y2={dropoffCoord.y}
                      stroke="rgba(59,130,246,0.3)"
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                    />
                    
                    {/* Animated dash line */}
                    <line
                      x1={pickupCoord.x}
                      y1={pickupCoord.y}
                      x2={dropoffCoord.x}
                      y2={dropoffCoord.y}
                      stroke="rgba(59,130,246,0.6)"
                      strokeWidth="1.5"
                      strokeDasharray="4 6"
                    >
                      <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
                    </line>
                  </>
                )}
                
                {/* Planets */}
                {Object.entries(PLANET_COORDINATES).map(([name, coord]) => (
                  <g key={name}>
                    {/* Glow */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={coord.size + 2}
                      fill={coord.color}
                      opacity="0.15"
                    />
                    {/* Planet */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={coord.size}
                      fill={coord.color}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="0.5"
                    />
                    {/* Planet name label */}
                    <text
                      x={coord.x}
                      y={coord.y - coord.size - 2}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.5)"
                      fontSize="3"
                      className="text-[3px]"
                    >
                      {name.split(' ')[0]}
                    </text>
                    
                    {/* Pickup marker */}
                    {booking.pickup === name && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={coord.size + 4}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1"
                      >
                        <animate attributeName="r" values={`${coord.size + 4};${coord.size + 6}`} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    
                    {/* Dropoff marker */}
                    {booking.dropoff === name && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={coord.size + 4}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1"
                      >
                        <animate attributeName="r" values={`${coord.size + 4};${coord.size + 6}`} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                ))}
                
                {/* Rocket Ship */}
                {pickupCoord && dropoffCoord && (
                  <g
                    transform={`translate(${rocketPosition.x}, ${rocketPosition.y})`}
                  >
                    <g transform="rotate(-45)">
                      <polygon points="-4,-3 6,0 -4,3" fill="#3b82f6" stroke="white" strokeWidth="0.5"/>
                      <polygon points="-2,-1.5 4,0 -2,1.5" fill="white" opacity="0.5"/>
                      <circle cx="-2" cy="0" r="1" fill="#1a1a2e"/>
                      {/* Engine flame */}
                      <polygon points="-6,-2 -10,0 -6,2" fill="#60a5fa" opacity="0.8">
                        <animate attributeName="points" values="-6,-2 -10,0 -6,2;-6,-3 -12,0 -6,3;-6,-2 -10,0 -6,2" dur="0.3s" repeatCount="indefinite" />
                      </polygon>
                    </g>
                  </g>
                )}
              </svg>
              
              {/* Legend */}
              <div className="flex justify-center gap-6 mt-4 text-[8px] text-white/40">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Pickup</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Dropoff</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500" style={{ clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }} />
                  <span>Current Position</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <div className="flex justify-between text-white/60 text-xs mb-2">
                <span>{booking.pickup}</span>
                <span>{Math.round(progress)}% Complete</span>
                <span>{booking.dropoff}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-white/30 text-[8px] mt-2">
                <span>Distance: {booking.distance || 0} million km</span>
                <span>ETA: {eta} min</span>
              </div>
            </div>

            {/* Status Card */}
            <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">BOOKING STATUS</h2>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${progress >= 95 ? 'bg-blue-400' : 'bg-gray-400'} animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
                    <div className={`absolute inset-0 w-3 h-3 rounded-full ${progress >= 95 ? 'bg-blue-400' : 'bg-gray-400'} animate-ping`} />
                  </div>
                  <span className="text-white font-mono text-sm tracking-wider">{status}</span>
                </div>
                <span className="text-white/60 text-xs">BOOKING #{booking.id.slice(-8)}</span>
              </div>
            </div>

            {/* Driver Details Card */}
            <div className="relative rounded-lg border border-white/20 bg-black/40 backdrop-blur-md p-6 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <h2 className="text-white/80 text-sm tracking-[0.2em] mb-4">DRIVER ASSIGNMENT</h2>
              
              {driverAssigned && booking.driver ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="28" fill="#1a1a2e" stroke="#3b82f6" strokeWidth="1.5"/>
                        <circle cx="30" cy="22" r="8" fill="#3b82f6" opacity="0.8"/>
                        <path d="M15 45 Q30 35 45 45" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                        <circle cx="30" cy="30" r="2" fill="#fff" opacity="0.5"/>
                      </svg>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-[0_0_5px_rgba(0,255,0,0.5)]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{booking.driver.name}</p>
                      <p className="text-white/40 text-xs tracking-[0.15em]">ID: {booking.driver.id}</p>
                      <p className="text-blue-400 text-xs">⭐ {booking.driver.rating} • {booking.driver.rides} rides</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-white/40 text-[9px] tracking-[0.15em]">VEHICLE</p>
                      <p className="text-white text-sm">{getShuttleName()}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[9px] tracking-[0.15em]">LICENSE</p>
                      <p className="text-white text-sm">{booking.driver.license}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-xs tracking-[0.15em]">SCANNING FOR AVAILABLE PILOTS...</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Briefing Card */}
            <div className="relative rounded-lg border border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-transparent backdrop-blur-md p-6 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#3b82f6" opacity="0.8"/>
                </svg>
                <h2 className="text-blue-400/80 text-sm tracking-[0.2em]">AI MISSION BRIEFING</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-blue-400 text-xs">🚀</span>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {progress >= 95 
                      ? "Approaching destination. Prepare for landing sequence."
                      : `Traveling from ${booking.pickup} to ${booking.dropoff}. ${Math.ceil((100 - progress) / 6)} minutes remaining.`
                    }
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-white/60 text-xs">📊</span>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Total distance: {booking.distance} million km. Current progress: {Math.round(progress)}%.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-white/60 text-xs">🌡️</span>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Space weather: Clear. Solar winds nominal. Safe for transit.
                  </p>
                </div>
                <div className="mt-3 p-3 rounded bg-blue-500/5 border border-blue-500/20">
                  <p className="text-blue-400/60 text-[10px] tracking-[0.15em]">
                    🖖 "Live long and prosper, traveler."
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/ride/history" className="flex-1">
            <button className="w-full h-12 flex items-center justify-center
              text-white tracking-[0.2em] text-sm
              border border-white/20 bg-black/40 backdrop-blur-md
              transition-all duration-300
              hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              {isActive ? "BACK TO HISTORY" : "VIEW HISTORY"}
            </button>
          </Link>
          
          {isActive && (
            <button 
              onClick={() => setShowCancelModal(true)}
              className="flex-1 relative w-full h-12 flex items-center justify-center
                text-white tracking-[0.2em] text-sm font-semibold
                border border-red-500/40 bg-red-500/10
                transition-all duration-300
                hover:border-red-400 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]
                active:scale-95">
              CANCEL RIDE
            </button>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-black/95 border border-white/20 rounded-lg p-6 max-w-md w-full shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-white text-lg font-semibold mb-2">Cancel Ride?</h3>
              <p className="text-white/60 text-sm mb-6">
                Are you sure you want to cancel this ride? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 h-10 text-white/80 text-sm border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
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
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowArrivalModal(false)} />
          <div className="relative bg-black/95 border border-blue-500/30 rounded-lg p-6 max-w-md w-full shadow-[0_0_40px_rgba(59,130,246,0.2)]">
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="text-white text-lg font-semibold mb-2">Welcome to {booking.dropoff}!</h3>
              <p className="text-white/60 text-sm mb-6">
                Have you arrived safely at {booking.dropoff}? Confirm to complete your journey with NAIX.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowArrivalModal(false)}
                  className="flex-1 h-10 text-white/80 text-sm border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
                >
                  NOT YET
                </button>
                <button
                  onClick={handleConfirmArrival}
                  disabled={completing}
                  className="flex-1 h-10 text-white text-sm font-semibold bg-blue-500/20 border border-blue-500/40 hover:bg-blue-500/30 transition-all disabled:opacity-50"
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
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => !submittingRating && setShowRating(false)} />
          <div className="relative bg-black/95 border border-white/20 rounded-lg p-8 max-w-md w-full shadow-[0_0_50px_rgba(255,255,255,0.1)] animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-2xl font-black tracking-[0.2em] text-white mb-2">
                THANK YOU!
              </h2>
              <p className="text-blue-400 text-sm tracking-[0.15em] mb-4">
                for choosing NAIX
              </p>
              <p className="text-white/60 text-sm mb-6">
                How was your ride from {booking.pickup} to {booking.dropoff} with {booking.driver?.name || "Captain Vega"}?
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
                        ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(255,255,0,0.5)]"
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
                className="w-full h-24 px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white text-sm placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none resize-none mb-6"
              />
              
              {/* Submit Button */}
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating}
                className="w-full py-3 text-white tracking-[0.2em] text-sm font-semibold
                  border border-blue-500/40 bg-blue-500/10
                  transition-all duration-300 hover:border-blue-400 hover:bg-blue-500/20 
                  hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingRating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-blue-400 rounded-full animate-spin" />
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
      <div className="min-h-screen flex items-center justify-center bg-black">
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