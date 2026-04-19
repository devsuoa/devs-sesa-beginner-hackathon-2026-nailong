"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/providers/UserProvider";

type Job = {
  id: string;
  origin: string;
  destination: string;
  payout: number;
  serviceType: string;
  distance?: string;
};

function PulseDot() {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full mr-2"
      style={{
        background: "rgba(100,255,180,0.9)",
        boxShadow: "0 0 6px rgba(100,255,180,0.8)",
        animation: "pulse-dot 2s infinite",
      }}
    />
  );
}

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className="fixed bottom-8 left-1/2 z-50 px-6 py-3 text-[9px] tracking-[0.2em] transition-all duration-300"
      style={{
        fontFamily: "'Orbitron', monospace",
        background: "rgba(0,0,0,0.9)",
        border: "1px solid rgba(100,255,180,0.3)",
        color: "rgba(100,255,180,0.9)",
        clipPath:
          "polygon(8px 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,8px 100%,0 50%)",
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(20px)",
        opacity: visible ? 1 : 0,
      }}
    >
      {message}
    </div>
  );
}

function ServiceBadge({ type }: { type: string }) {
  const styles: Record<string, { border: string; color: string }> = {
    SHUTTLE: {
      border: "rgba(100,180,255,0.2)",
      color: "rgba(100,180,255,0.7)",
    },
    CARGO: { border: "rgba(255,180,100,0.2)", color: "rgba(255,180,100,0.7)" },
    VIP: { border: "rgba(200,100,255,0.2)", color: "rgba(200,100,255,0.7)" },
  };
  const s = styles[type] ?? {
    border: "rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.4)",
  };

  return (
    <span
      className="text-[8px] tracking-[0.15em] px-2.5 py-0.5"
      style={{
        border: `1px solid ${s.border}`,
        color: s.color,
        clipPath: "polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
      }}
    >
      {type}
    </span>
  );
}

function JobCard({
  job,
  onAccept,
}: {
  job: Job;
  onAccept: (id: string) => void;
}) {
  const [accepting, setAccepting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  async function handleAccept() {
    setAccepting(true);
    await onAccept(job.id);
    setLeaving(true);
  }

  return (
    <div
      className="mt-20 relative px-6 py-5 border transition-all duration-300"
      style={{
        borderColor: leaving ? "transparent" : "rgba(255,255,255,0.08)",
        background: leaving ? "transparent" : "rgba(255,255,255,0.02)",
        clipPath:
          "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
        opacity: leaving ? 0 : 1,
        transform: leaving ? "translateX(12px)" : "translateX(0)",
      }}
      onMouseEnter={(e) => {
        if (!leaving) {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(255,255,255,0.45)";
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255,255,255,0.04)";
        }
      }}
      onMouseLeave={(e) => {
        if (!leaving) {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255,255,255,0.02)";
        }
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        {/* Route */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[11px] tracking-widest text-white/70">
            <div className="w-1.5 h-1.5 rounded-full border border-white/40 shrink-0" />
            {job.origin}
          </div>
          <div className="w-px h-3 bg-white/10 ml-0.75" />
          <div className="flex items-center gap-2 text-[11px] tracking-widest text-white/70">
            <div
              className="w-1.5 h-1.5 shrink-0 bg-white/60"
              style={{ clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)" }}
            />
            {job.destination}
          </div>
        </div>

        {/* Payout */}
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-2xl font-black tracking-[0.08em] text-white"
            style={{
              fontFamily: "'Orbitron', monospace",
              textShadow: "0 0 12px rgba(255,255,255,0.4)",
            }}
          >
            {job.payout}
          </span>
          <span className="text-[8px] tracking-[0.2em]  text-white/55">
            CREDITS
          </span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ServiceBadge type={job.serviceType} />
          {job.distance && (
            <span className="text-[8px] tracking-[0.15em] text-white/45">
              {job.distance}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={accepting}
          onClick={handleAccept}
          className="relative px-5 py-1.5 text-[9px] font-black tracking-[0.2em] text-white border-none bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            fontFamily: "'Orbitron', monospace",
            clipPath:
              "polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%)",
            textShadow: "0 0 8px rgba(255,255,255,0.6)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.textShadow = "0 0 14px rgba(255,255,255,1)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.textShadow = "0 0 8px rgba(255,255,255,0.6)";
          }}
        >
          {/* Border overlay */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: "inherit",
              border: "1px solid rgba(255,255,255,0.55)",
              background: "rgba(255,255,255,0.04)",
            }}
          />
          {accepting ? "..." : "ACCEPT"}
        </button>
      </div>
    </div>
  );
}

function ToggleButton({
  online,
  onToggle,
  loading,
}: {
  online: boolean;
  onToggle: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-5">
      <button
        type="button"
        onClick={onToggle}
        disabled={loading}
        className="relative w-40 h-40 rounded-full border-none bg-transparent cursor-pointer disabled:cursor-not-allowed"
        aria-label={online ? "Go offline" : "Go online"}
      >
        {/* Rings */}
        {[0, 12, 24].map((inset) => (
          <span
            key={inset}
            className="absolute rounded-full transition-all duration-500"
            style={{
              inset,
              border: `1px solid ${online ? "rgba(100,255,180,0.25)" : "rgba(255,255,255,0.1)"}`,
              boxShadow:
                online && inset === 0
                  ? "0 0 30px rgba(100,255,180,0.08)"
                  : "none",
            }}
          />
        ))}

        {/* Inner button */}
        <span
          className="absolute rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-500"
          style={{
            inset: 36,
            background: online
              ? "rgba(100,255,180,0.06)"
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${online ? "rgba(100,255,180,0.4)" : "rgba(255,255,255,0.4)"}`,
            boxShadow: online ? "0 0 20px rgba(100,255,180,0.1) inset" : "none",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              color: online ? "rgba(100,255,180,0.9)" : "rgba(255,255,255,0.55)",
              filter: online
                ? "drop-shadow(0 0 6px rgba(100,255,180,0.8))"
                : "none",
              transition: "all 0.4s",
            }}
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span
            className="text-[9px] font-black tracking-[0.2em] transition-all duration-400"
            style={{
              fontFamily: "'Orbitron', monospace",
              color: online ? "rgba(100,255,180,0.9)" : "rgba(255,255,255,0.4)",
              textShadow: online ? "0 0 10px rgba(100,255,180,0.6)" : "none",
            }}
          >
            {loading ? "..." : online ? "ONLINE" : "OFFLINE"}
          </span>
        </span>
      </button>

      <span
        className="text-[9px] tracking-[0.3em] uppercase transition-all duration-400"
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: online ? "rgba(100,255,180,0.5)" : "rgba(255,255,255,0.5)",
        }}
      >
        {online ? "YOU ARE LIVE — RECEIVING JOBS" : "TAP TO GO ONLINE"}
      </span>
    </div>
  );
}

export default function DrivePage() {
  const { profile } = useUser();
  const [online, setOnline] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [toast, setToast] = useState(false);

const fetchJobs = useCallback(async () => {
  setLoadingJobs(true);
  try {
    const res = await fetch("/api/bookings/available");
    const data = await res.json();
    
    // Map the API response to the Job shape the UI expects
    const mapped = data.bookings.map((b: any) => ({
      id: b.id,
      origin: b.origin.name,           // ← extract .name from the object
      destination: b.destination.name, // ← extract .name from the object
      payout: b.priceCredits,
      serviceType: b.serviceType,
    }));
    
    setJobs(mapped);
  } catch (err) {
    console.error("Failed to fetch jobs:", err);
  } finally {
    setLoadingJobs(false);
  }
}, []);

  async function handleToggle() {
    setToggling(true);
    try {
      const newStatus = online ? "OFFLINE" : "ONLINE";
      await fetch("/api/driver/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const nowOnline = !online;
      setOnline(nowOnline);
      if (nowOnline) await fetchJobs();
      else setJobs([]);
    } catch (err) {
      console.error("Failed to toggle availability:", err);
    } finally {
      setToggling(false);
    }
  }

  async function handleAccept(jobId: string) {
    try {
      await fetch(`/api/bookings/${jobId}/accept`, { method: "PATCH" });
      // Small delay so the leaving animation plays before removal
      setTimeout(() => {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        showToast();
      }, 300);
    } catch (err) {
      console.error("Failed to accept job:", err);
    }
  }

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  // Poll for new jobs every 15s while online
  useEffect(() => {
    if (!online) return;
    const interval = setInterval(fetchJobs, 15000);
    return () => clearInterval(interval);
  }, [online, fetchJobs]);

  if (!profile?.roles.includes("DRIVER")) {
    return (
      <div className="mt-32 relative z-5 max-w-3xl mx-auto px-8 py-10">
        <p
          className="text-96 tracking-[0.4em] text-white/45 uppercase mb-2 text-center"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {"// access denied"}
        </p>
      </div>
    );
  } else
    return (
      <>
        <div className="mt-32 relative z-5 max-w-3xl mx-auto px-8 py-10">
          {/* Header */}
          <p
            className="text-[9px] tracking-[0.4em] text-white/45 uppercase mb-2 text-center"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {"// console"}
          </p>
          <h1
            className="text-2xl font-black tracking-[0.12em] text-white mb-1 text-center"
            style={{
              fontFamily: "'Orbitron', monospace",
              textShadow: "0 0 20px rgba(255,255,255,0.5)",
            }}
          >
            DRIVER DASHBOARD
          </h1>
          <p
            className="text-[10px] tracking-[0.2em]  text-white/55 mb-12 text-center"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            WELCOME BACK, {profile?.displayName.toUpperCase() || "PILOT"}
          </p>

          {/* Toggle */}
          <div className="flex justify-center mb-12">
            <ToggleButton
              online={online}
              onToggle={handleToggle}
              loading={toggling}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-white/6 mb-8" />

          {/* Job feed */}
          {online ? (
            loadingJobs ? (
              <div
                className="text-center text-[9px] tracking-[0.3em] text-white/45 py-12"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                SCANNING FOR JOBS...
              </div>
            ) : jobs.length === 0 ? (
              <div
                className="text-center text-[9px] tracking-[0.3em] text-white/40 py-12"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                NO JOBS AVAILABLE — STANDING BY
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-[11px] font-bold tracking-[0.2em] text-white/60"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                  >
                    <PulseDot />
                    LIVE JOBS
                  </span>
                  <span
                    className="text-[9px] tracking-[0.2em] text-white/45"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    {jobs.length} AVAILABLE
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} onAccept={handleAccept} />
                  ))}
                </div>
              </>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-40">
              <div
                className="text-5xl"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                ◎
              </div>
              <p
                className="text-[10px] tracking-[0.25em] text-white/40 text-center"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                GO ONLINE TO SEE
                <br />
                AVAILABLE JOBS
              </p>
            </div>
          )}
        </div>

        <Toast message="JOB ACCEPTED — STAND BY" visible={toast} />
      </>
    );
}
