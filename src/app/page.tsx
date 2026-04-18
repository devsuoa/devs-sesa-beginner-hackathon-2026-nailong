"use client";

import Starfield from "../components/Starfield";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-8">
      <Starfield />

      <div className="flex w-full max-w-6xl items-center justify-between gap-10">
        
        {/* LEFT: Image */}
        <div className="w-1/2 flex justify-center">
          <Image
            src="/landingPlanet.png"
            alt="Landing Planet"
            width={400}
            height={400}
            className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]"
          />
        </div>

        {/* RIGHT: Inputs + Button */}
        <div className="w-1/2 flex flex-col items-center">
          
          <div className="w-full h-16 bg-blue-200 flex items-center justify-center mb-4 text-black rounded-lg">
            Pick Up Planet
          </div>

          <div className="w-full h-16 bg-green-200 flex items-center justify-center mb-4 text-black rounded-lg">
            Drop Off Planet
          </div>

          <button
            className="relative w-full h-16 flex items-center justify-center mb-4
            text-white tracking-[0.2em] text-sm
            border border-white/20 bg-black/40 backdrop-blur-md
            transition-all duration-300
            hover:border-white/60 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
            active:scale-95"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            <span className="corner-pip corner-pip--tl" />
            <span className="corner-pip corner-pip--tr" />
            <span className="corner-pip corner-pip--bl" />
            <span className="corner-pip corner-pip--br" />

            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
