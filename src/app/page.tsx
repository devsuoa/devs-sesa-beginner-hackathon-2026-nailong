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
            className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] animate-[float_6s_ease-in-out_infinite]"
          />
        </div>

        {/* RIGHT: Inputs + Button */}
        <div className="w-1/2 flex flex-col items-center">

			<h1
				className="mb-8 text-center text-4xl md:text-5xl font-black tracking-[0.15em] text-white animate-[float_6s_ease-in-out_infinite] hover:tracking-[0.25em] transition-all duration-500"
				style={{
					textShadow:
					"0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)",
				}}
			>
				NAILONG EXPRESS
			</h1>
          
        	{/* Pick Up */}
			<div className="relative w-full mb-8 flex items-center gap-4">
			<span className="corner-pip corner-pip--tl" />
			<span className="corner-pip corner-pip--tr" />
			<span className="corner-pip corner-pip--bl" />
			<span className="corner-pip corner-pip--br" />

			<label className="w-1/3">
				PICK UP
			</label>

			<input
				type="text"
				placeholder="Earth 🌍"
				className="w-2/3 h-12 px-4
				bg-black/40 border border-white/20
				text-white placeholder-white/30
				backdrop-blur-md outline-none
				tracking-wide
				transition-all duration-300
				focus:border-white/60 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(100,200,255,0.5)]"
			/>
			</div>

			{/* Drop Off */}
			<div className="relative w-full mb-8 flex items-center gap-4">
			<span className="corner-pip corner-pip--tl" />
			<span className="corner-pip corner-pip--tr" />
			<span className="corner-pip corner-pip--bl" />
			<span className="corner-pip corner-pip--br" />

			<label className="w-1/3">
				DROP OFF
			</label>

			<input
				type="text"
				placeholder="Mars 🔴"
				className="w-2/3 h-12 px-4
				bg-black/40 border border-white/20
				text-white placeholder-white/30
				backdrop-blur-md outline-none
				tracking-wide
				transition-all duration-300
				focus:border-white/60 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(100,200,255,0.5)]"
			/>
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
