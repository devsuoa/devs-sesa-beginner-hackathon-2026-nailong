"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/providers/UserProvider";

interface Booking {
  id: string;
  pickup: string;
  dropoff: string;
  shuttleId: string;
  shuttleName: string;
  totalPrice: string;
  status: string;
  createdAt: string;
  driver?: {
    name: string;
    id: string;
    rating: number;
  };
  eta?: string;
}

export default function HistoryPage() {
  const { user } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all"); // all, active, completed, cancelled

  useEffect(() => {
    // Load bookings from localStorage
    const loadBookings = () => {
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '{}');
      const bookingsList = Object.values(allBookings) as Booking[];
      
      // Sort by newest first
      const sorted = bookingsList.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return b.id.localeCompare(a.id);
      });
      
      setBookings(sorted);
      setLoading(false);
    };
    
    loadBookings();
    
    // Listen for storage events to update in real-time
    const handleStorageChange = () => {
      loadBookings();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; bg: string; icon: string }> = {
      CONFIRMED: { color: "text-blue-400", bg: "bg-blue-500/10", icon: "⏳" },
      SEARCHING_FOR_DRIVER: { color: "text-yellow-400", bg: "bg-yellow-500/10", icon: "🔍" },
      DRIVER_ASSIGNED: { color: "text-cyan-400", bg: "bg-cyan-500/10", icon: "🚗" },
      EN_ROUTE: { color: "text-purple-400", bg: "bg-purple-500/10", icon: "🚀" },
      ARRIVED: { color: "text-green-400", bg: "bg-green-500/10", icon: "✅" },
      COMPLETED: { color: "text-green-400", bg: "bg-green-500/10", icon: "✓" },
      CANCELLED: { color: "text-red-400", bg: "bg-red-500/10", icon: "✗" },
      DELIVERED: { color: "text-gray-400", bg: "bg-gray-500/10", icon: "📦" },
    };
    
    const config = statusConfig[status] || statusConfig.CONFIRMED;
    
    return (
      <span className={`px-2 py-1 rounded text-[10px] font-semibold tracking-wide ${config.color} ${config.bg}`}>
        {config.icon} {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getStatusType = (status: string): 'active' | 'completed' | 'cancelled' => {
    if (status === 'CANCELLED') return 'cancelled';
    if (status === 'COMPLETED' || status === 'DELIVERED' || status === 'ARRIVED') return 'completed';
    return 'active';
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return getStatusType(booking.status) === filter;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs">LOADING HISTORY...</p>
        </div>
      </div>
    );
  }

  // Check if there are ANY bookings at all
  const hasAnyBookings = bookings.length > 0;

  return (
    <div className="min-h-screen relative">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <h1 className="text-center text-3xl font-black tracking-[0.2em] text-white mb-2"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.7)" }}>
          RIDE HISTORY
        </h1>
        <p className="text-center text-[9px] tracking-[0.3em] text-white/40 mb-8">
          YOUR PAST JOURNEYS
        </p>

        {/* Only show filters if there are bookings */}
        {hasAnyBookings && (
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs tracking-[0.2em] transition-all duration-300 ${
                filter === 'all' 
                  ? 'text-white border-b-2 border-cyan-500' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              ALL ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-xs tracking-[0.2em] transition-all duration-300 ${
                filter === 'active' 
                  ? 'text-cyan-400 border-b-2 border-cyan-500' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              ACTIVE ({bookings.filter(b => getStatusType(b.status) === 'active').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-xs tracking-[0.2em] transition-all duration-300 ${
                filter === 'completed' 
                  ? 'text-green-400 border-b-2 border-green-500' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              COMPLETED ({bookings.filter(b => getStatusType(b.status) === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 text-xs tracking-[0.2em] transition-all duration-300 ${
                filter === 'cancelled' 
                  ? 'text-red-400 border-b-2 border-red-500' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              CANCELLED ({bookings.filter(b => getStatusType(b.status) === 'cancelled').length})
            </button>
          </div>
        )}

        {/* Show "Book Your First Ride" only when there are NO bookings at all */}
        {!hasAnyBookings ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 opacity-30">🚀</div>
            <p className="text-white/60 text-sm tracking-[0.2em] mb-2">NO RIDES BOOKED YET</p>
            <p className="text-white/30 text-xs tracking-[0.15em] mb-6">Your journey through the stars awaits</p>
            <Link href="/ride">
              <button className="px-8 py-3 text-sm tracking-[0.2em] text-white border border-cyan-500/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all duration-300">
                BOOK YOUR FIRST RIDE
              </button>
            </Link>
          </div>
        ) : filteredBookings.length === 0 ? (
          // Show message when filter has no results but there are other bookings
          <div className="text-center py-16">
            <div className="text-5xl mb-4 opacity-30">🔍</div>
            <p className="text-white/40 text-sm tracking-[0.2em]">
              No {filter} bookings found
            </p>
            <button
              onClick={() => setFilter('all')}
              className="mt-4 text-cyan-400 text-xs tracking-[0.15em] hover:underline"
            >
              View all bookings
            </button>
          </div>
        ) : (
          // Show filtered bookings list
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const isActive = getStatusType(booking.status) === 'active';
              const isCompleted = getStatusType(booking.status) === 'completed';
              const isCancelled = getStatusType(booking.status) === 'cancelled';
              
              const CardContent = (
                <div className={`
                  relative rounded-lg border bg-black/40 backdrop-blur-md p-5
                  transition-all duration-300
                  ${isActive 
                    ? 'border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] cursor-pointer' 
                    : isCompleted
                      ? 'border-green-500/20 opacity-70'
                      : 'border-red-500/20 opacity-60'
                  }
                `}>
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-[10px] tracking-[0.15em]">#{booking.id}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-white/40 text-[9px] tracking-[0.15em]">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{booking.totalPrice} cr</p>
                      <p className="text-white/40 text-[9px] tracking-[0.15em]">TOTAL</p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full border border-white/40" />
                      <span className="text-white/80">{booking.pickup}</span>
                    </div>
                    <div className="w-px h-4 bg-white/10 ml-1" />
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-white/60" style={{ clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }} />
                      <span className="text-white/80">{booking.dropoff}</span>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-[10px]">👨‍✈️</span>
                      </div>
                      <div>
                        <p className="text-white text-xs">
                          {booking.driver?.name || (isActive ? "Awaiting assignment" : "N/A")}
                        </p>
                        {booking.driver && (
                          <p className="text-white/40 text-[9px]">⭐ {booking.driver.rating}</p>
                        )}
                      </div>
                    </div>
                    
                    {isActive && booking.eta && (
                      <div className="text-right">
                        <p className="text-cyan-400 text-xs font-semibold">ETA {booking.eta} min</p>
                        <p className="text-white/30 text-[8px]">LIVE</p>
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="text-right">
                        <p className="text-green-400 text-xs">✓ Completed</p>
                      </div>
                    )}
                    
                    {isCancelled && (
                      <div className="text-right">
                        <p className="text-red-400 text-xs">✗ Cancelled</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Active indicator pulse for live bookings */}
                  {isActive && (
                    <div className="absolute top-3 right-3">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      </div>
                    </div>
                  )}
                </div>
              );
              
              // Active bookings are clickable and link to tracking
              if (isActive) {
                return (
                  <Link key={booking.id} href={`/ride/track/${booking.id}`}>
                    {CardContent}
                  </Link>
                );
              }
              
              // Completed and cancelled bookings are static
              return (
                <div key={booking.id}>
                  {CardContent}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}