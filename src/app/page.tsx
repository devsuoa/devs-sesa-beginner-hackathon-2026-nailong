"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Starfield from "@/components/Starfield";

/* ── Glitch text ── */
function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span
        aria-hidden
        className="glitch-a absolute inset-0 text-[rgba(100,255,200,0.6)] select-none"
      >
        {text}
      </span>
      <span
        aria-hidden
        className="glitch-b absolute inset-0 text-[rgba(255,100,200,0.6)] select-none"
      >
        {text}
      </span>
      <span className="relative">{text}</span>
    </span>
  );
}

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
          else setCount(target);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ── Stat card ── */
function StatCard({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: string;
}) {
  // Split "12K+" into { num: 12, suffix: "K+" }
  // Handles "∞" and "0.3s" as special cases
  const isSpecial = value === "∞";
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const isDecimal = match ? match[1].includes(".") : false;

  const { count, ref } = useCountUp(
    isSpecial ? 0 : target * (isDecimal ? 10 : 1),
    2000,
  );
  const display = isSpecial
    ? "∞"
    : isDecimal
      ? (count / 10).toFixed(1) + suffix
      : count.toLocaleString() + suffix;

  return (
    <div
      ref={ref}
      className="relative px-8 py-6 text-center"
      style={{
        clipPath: "polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        animationDelay: delay,
      }}
    >
      <div
        className="text-3xl font-black tracking-tight text-white mb-1"
        style={{
          fontFamily: "'Orbitron',monospace",
          textShadow: "0 0 20px rgba(255,255,255,0.5)",
        }}
      >
        {display}
      </div>
      <div
        className="text-[9px] tracking-[0.3em]  text-white/55 uppercase"
        style={{ fontFamily: "'Share Tech Mono',monospace" }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Feature row ── */
function Feature({
  icon,
  title,
  desc,
  flip,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-12 ${flip ? "flex-row-reverse" : ""}`}
    >
      <div className="flex-1">
        <div className="mb-4 text-white/40">{icon}</div>
        <h3
          className="text-xl font-black tracking-widest text-white mb-3"
          style={{
            fontFamily: "'Orbitron',monospace",
            textShadow: "0 0 16px rgba(255,255,255,0.4)",
          }}
        >
          {title}
        </h3>
        <p
          className="text-[11px] leading-loose tracking-[0.15em] text-white/40"
          style={{ fontFamily: "'Share Tech Mono',monospace" }}
        >
          {desc}
        </p>
      </div>
      <div
        className="flex-1 h-48 relative"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
          clipPath:
            "polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    const interval = setInterval(() => setTick((t) => t + 1), 80);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
    };
  }, []);

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
  function scramble(text: string, progress: number) {
    return text
      .split("")
      .map((c, i) =>
        c === " "
          ? " "
          : i < progress
            ? c
            : chars[Math.floor(Math.random() * chars.length)],
      )
      .join("");
  }

  const heroProgress = Math.min(tick * 0.8, 16);
  const heroText = mounted ? scramble("NAIX", heroProgress) : "NAIX";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes glitch-a {
          0%,100%{clip-path:inset(0 0 95% 0);transform:translate(-2px,0)}
          20%{clip-path:inset(30% 0 50% 0);transform:translate(2px,0)}
          40%{clip-path:inset(60% 0 20% 0);transform:translate(-1px,0)}
          60%{clip-path:inset(80% 0 5% 0);transform:translate(1px,0)}
          80%{clip-path:inset(10% 0 80% 0);transform:translate(-2px,0)}
        }
        @keyframes glitch-b {
          0%,100%{clip-path:inset(50% 0 30% 0);transform:translate(2px,0)}
          20%{clip-path:inset(10% 0 70% 0);transform:translate(-2px,0)}
          40%{clip-path:inset(70% 0 10% 0);transform:translate(1px,0)}
          60%{clip-path:inset(20% 0 60% 0);transform:translate(-1px,0)}
          80%{clip-path:inset(85% 0 5% 0);transform:translate(2px,0)}
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes ring-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ring-spin-rev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes scan { 0%{background-position:-40% 0} 100%{background-position:140% 0} }
        @keyframes pulse-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes fade-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .glitch-a { animation: glitch-a 3s infinite linear; }
        .glitch-b { animation: glitch-b 3s infinite linear; }
        .float { animation: float 6s ease-in-out infinite; }
        .ring1 { animation: ring-spin 12s linear infinite; }
        .ring2 { animation: ring-spin-rev 8s linear infinite; }
        .ring3 { animation: ring-spin 20s linear infinite; }
        .scan-line {
          position:fixed;top:0;left:0;right:0;height:1px;z-index:100;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);
          background-size:30% 100%;background-repeat:no-repeat;
          animation:scan 6s ease-in-out infinite;
        }
        .fade-up { animation: fade-up 0.8s ease both; }
        .cta-btn {
          position:relative;display:inline-flex;align-items:center;gap:10px;
          padding:14px 36px;font-family:'Orbitron',monospace;font-size:11px;font-weight:900;
          letter-spacing:0.2em;color:#fff;background:transparent;border:none;cursor:pointer;
          clip-path:polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%);
          text-shadow:0 0 12px rgba(255,255,255,0.8);text-decoration:none;
          transition:text-shadow 0.2s;
        }
        .cta-btn::before {
          content:'';position:absolute;inset:0;clip-path:inherit;
          border:1px solid rgba(255,255,255,0.4);background:rgba(255,255,255,0.06);
          transition:all 0.2s;
        }
        .cta-btn:hover::before { background:rgba(255,255,255,0.12);box-shadow:0 0 30px rgba(255,255,255,0.15) inset; }
        .cta-btn:hover { text-shadow:0 0 20px rgba(255,255,255,1),0 0 40px rgba(255,255,255,0.5); }
        .cta-btn-outline {
          position:relative;display:inline-flex;align-items:center;gap:10px;
          padding:14px 36px;font-family:'Orbitron',monospace;font-size:11px;font-weight:900;
          letter-spacing:0.2em;color:rgba(255,255,255,0.5);background:transparent;border:none;cursor:pointer;
          clip-path:polygon(12px 0,100% 0,calc(100% - 0px) 100%,0 100%);
          text-decoration:none;transition:all 0.2s;
        }
        .cta-btn-outline::before {
          content:'';position:absolute;inset:0;clip-path:inherit;
          border:1px solid rgba(255,255,255,0.12);transition:all 0.2s;
        }
        .cta-btn-outline:hover { color:#fff; }
        .cta-btn-outline:hover::before { border-color:rgba(255,255,255,0.3); }
        .grid-bg {
          background-image:linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px);
          background-size:60px 60px;
        }
      `}</style>

      <Starfield />
      <div className="scan-line" />
      <div className="fixed inset-0 z-1 grid-bg pointer-events-none" />

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 text-center overflow-hidden">
        {/* Floating planet / orb */}
        <div
          className="float absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ marginTop: -scrollY * 0.3 }}
        >
          {/* Rings */}
          <div
            className="ring1 absolute w-125 h-125 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            style={{ border: "1px solid rgba(255,255,255,0.04)" }}
          />
          <div
            className="ring2 absolute w-95 h-95 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          />
          <div
            className="ring3 absolute w-65 h-65 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          />
          {/* Core planet */}
          <div
            className="w-32 h-32 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow:
                "0 0 60px rgba(255,255,255,0.05), inset 0 0 40px rgba(255,255,255,0.03)",
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative fade-up" style={{ animationDelay: "0.2s" }}>
          <p
            className="text-[9px] tracking-[0.5em] text-white/45 uppercase mb-6"
            style={{ fontFamily: "'Share Tech Mono',monospace" }}
          >
            {`// EST. ${new Date().getFullYear()}`}
          </p>

          <h1
            className="text-[clamp(48px,10vw,120px)] font-black leading-none tracking-[0.06em] text-white mb-6 relative"
            style={{
              fontFamily: "'Orbitron',monospace",
              textShadow: "0 0 80px rgba(255,255,255,0.4)",
            }}
          >
            <GlitchText text={heroText} />
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="h-px flex-1 max-w-16"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.45))",
              }}
            />
            <p
              className="text-[10px] tracking-[0.35em] text-white/55 uppercase"
              style={{ fontFamily: "'Share Tech Mono',monospace" }}
            >
              YOUR ORBIT. YOUR RIDE.
            </p>
            <div
              className="h-px flex-1 max-w-16"
              style={{
                background:
                  "linear-gradient(90deg,rgba(255,255,255,0.45),transparent)",
              }}
            />
          </div>

          <p
            className="text-[12px] leading-loose tracking-[0.15em]  text-white/55 max-w-lg mx-auto mb-12"
            style={{ fontFamily: "'Share Tech Mono',monospace" }}
          >
            BOOK A VESSEL. CROSS THE VOID.
            <br />
            ARRIVE ANYWHERE IN THE KNOWN UNIVERSE.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/book" className="cta-btn">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              BOOK A RIDE
            </Link>
            <Link href="/drive" className="cta-btn-outline">
              BECOME A PILOT
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
          style={{ animation: "float 2s ease-in-out infinite" }}
        >
          <span
            className="text-[8px] tracking-[0.4em] text-white"
            style={{ fontFamily: "'Share Tech Mono',monospace" }}
          >
            SCROLL
          </span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <rect
              x="1"
              y="1"
              width="10"
              height="18"
              rx="5"
              stroke="white"
              strokeWidth="1"
            />
            <circle cx="6" cy="6" r="2" fill="white">
              <animate
                attributeName="cy"
                values="5;12;5"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "12K+", label: "ACTIVE PILOTS" },
              { value: "94M", label: "KM TRAVELED" },
              { value: "∞", label: "DESTINATIONS" },
              { value: "0.3s", label: "AVG MATCH TIME" },
            ].map((s, i) => (
              <StatCard key={s.label} {...s} delay={`${i * 0.1}s`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-8">
        <div className="flex items-center gap-4">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,0.08))",
            }}
          />
          <span
            className="text-[8px] tracking-[0.4em] text-white/15"
            style={{ fontFamily: "'Share Tech Mono',monospace" }}
          >
            {"// SYSTEM FEATURES"}
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg,rgba(255,255,255,0.08),transparent)",
            }}
          />
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-24 px-8 max-w-5xl mx-auto space-y-28">
        <Feature
          title="INSTANT MATCHING"
          desc="OUR NEURAL DISPATCH SYSTEM MATCHES YOU WITH THE NEAREST AVAILABLE VESSEL IN MILLISECONDS. NO WAITING. NO DELAYS. JUST LAUNCH."
          icon={
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <circle cx="40" cy="40" r="6" fill="white" opacity="0.8" />
              <path
                d="M40 10 L40 20 M40 60 L40 70 M10 40 L20 40 M60 40 L70 40"
                stroke="white"
                strokeWidth="1"
                opacity="0.4"
              />
              <circle
                cx="40"
                cy="40"
                r="18"
                stroke="white"
                strokeWidth="0.5"
                strokeDasharray="4 6"
                opacity="0.3"
              />
            </svg>
          }
        />
        <Feature
          flip
          title="LIVE TRACKING"
          desc="FOLLOW YOUR PILOT THROUGH THE VOID IN REAL TIME. GALACTIC COORDINATES UPDATED EVERY 500 MILLISECONDS."
          icon={
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <ellipse
                cx="40"
                cy="40"
                rx="32"
                ry="12"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.3"
                transform="rotate(-20 40 40)"
              />
              <circle cx="40" cy="40" r="5" fill="white" opacity="0.8" />
              <circle cx="62" cy="22" r="3" fill="white" opacity="0.5" />
              <path
                d="M43 37 L59 25"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <circle
                cx="40"
                cy="40"
                r="14"
                stroke="white"
                strokeWidth="0.5"
                strokeDasharray="2 4"
                opacity="0.2"
              />
            </svg>
          }
        />
        <Feature
          title="MULTI-CLASS VESSELS"
          desc="ECONOMY SHUTTLE FOR THE EVERYDAY COMMUTE. CARGO HAULER FOR THE BIG LOADS. VIP CRUISER FOR WHEN ONLY THE BEST WILL DO."
          icon={
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect
                x="15"
                y="35"
                width="50"
                height="14"
                rx="2"
                stroke="white"
                strokeWidth="0.8"
                opacity="0.4"
              />
              <path
                d="M25 35 L35 20 L55 20 L65 35"
                stroke="white"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <circle
                cx="25"
                cy="52"
                r="5"
                stroke="white"
                strokeWidth="0.8"
                opacity="0.4"
              />
              <circle
                cx="55"
                cy="52"
                r="5"
                stroke="white"
                strokeWidth="0.8"
                opacity="0.4"
              />
              <path
                d="M40 35 L40 20"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </svg>
          }
        />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-[9px] tracking-[0.4em] text-white/40 uppercase text-center mb-3"
            style={{ fontFamily: "'Share Tech Mono',monospace" }}
          >
            {"// MISSION BRIEFING"}
          </p>
          <h2
            className="text-3xl font-black tracking-widest text-white text-center mb-16"
            style={{
              fontFamily: "'Orbitron',monospace",
              textShadow: "0 0 30px rgba(255,255,255,0.55)",
            }}
          >
            HOW IT WORKS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "SIGN IN",
                desc: "AUTHENTICATE WITH YOUR GALACTIC ID VIA GOOGLE OAUTH",
              },
              {
                step: "02",
                title: "BOOK",
                desc: "SELECT YOUR ORIGIN, DESTINATION, AND VESSEL CLASS",
              },
              {
                step: "03",
                title: "LAUNCH",
                desc: "A PILOT IS MATCHED AND YOUR JOURNEY BEGINS",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="relative p-6"
                style={{
                  clipPath:
                    "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <span
                  className="block text-[40px] font-black tracking-tight mb-4 leading-none"
                  style={{
                    fontFamily: "'Orbitron',monospace",
                    color: "rgba(255,255,255,0.06)",
                  }}
                >
                  {step}
                </span>
                <h3
                  className="text-[13px] font-black tracking-[0.15em] text-white mb-2"
                  style={{ fontFamily: "'Orbitron',monospace" }}
                >
                  {title}
                </h3>
                <p
                  className="text-[9px] tracking-[0.15em] leading-loose  text-white/55"
                  style={{ fontFamily: "'Share Tech Mono',monospace" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-32 px-8 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle,rgba(255,255,255,0.04),transparent 70%)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
        </div>

        <p
          className="relative text-[9px] tracking-[0.4em] text-white/40 uppercase mb-4"
          style={{ fontFamily: "'Share Tech Mono',monospace" }}
        >
          {"// READY FOR DEPARTURE"}
        </p>
        <h2
          className="relative text-[clamp(32px,6vw,72px)] font-black tracking-[0.08em] text-white mb-6"
          style={{
            fontFamily: "'Orbitron',monospace",
            textShadow: "0 0 60px rgba(255,255,255,0.45)",
          }}
        >
          THE UNIVERSE
          <br />
          AWAITS
        </h2>
        <p
          className="relative text-[11px] tracking-[0.2em] text-white/45 mb-12"
          style={{ fontFamily: "'Share Tech Mono',monospace" }}
        >
          JOIN THOUSANDS OF TRAVELERS CROSSING THE COSMOS DAILY
        </p>
        <Link
          href="/book"
          className="cta-btn"
          style={{ fontSize: "12px", padding: "16px 48px" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          BEGIN YOUR JOURNEY
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 border-t py-8 px-8"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span
            className="text-[11px] font-black tracking-[0.15em] text-white/40"
            style={{ fontFamily: "'Orbitron',monospace" }}
          >
            NAIX
          </span>
          <span
            className="text-[8px] tracking-[0.2em] text-white/15"
            style={{ fontFamily: "'Share Tech Mono',monospace" }}
          >
            © {new Date().getFullYear()} — ALL SECTORS RESERVED
          </span>
        </div>
      </footer>
    </>
  );
}
