"use client";

import { useState } from "react";
import Image from "next/image";

const SHUTTLES = [
  {
    id: "orbit",
    name: "Orbit Classic",
    img: "/shuttle1.png",
    price: "120 cr",
  },
  {
    id: "nova",
    name: "Nova Cruiser",
    img: "/shuttle2.png",
    price: "180 cr",
  },
  {
    id: "warp",
    name: "Warp Runner",
    img: "/shuttle3.png",
    price: "240 cr",
  },
  {
    id: "quantum",
    name: "Quantum X",
    img: "/shuttle4.png",
    price: "380 cr",
  },
  {
    id: "void",
    name: "Void Phantom",
    img: "/shuttle5.png",
    price: "520 cr",
  },
];

export default function ShuttleOptions() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">

      {/* Title */}
      <h2
        className="text-center text-white text-xs tracking-[0.3em] mb-4"
      >
        SELECT YOUR SHUTTLE
      </h2>

      {/* Scroll row */}
      <div className="flex gap-4 overflow-x-auto pb-3 px-1 scrollbar-hide">

        {SHUTTLES.map((s) => {
          const isActive = selected === s.id;

          return (
            <div
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`
                relative min-w-[220px] flex-shrink-0 cursor-pointer
                rounded-lg border backdrop-blur-md
                transition-all duration-300
                ${
                  isActive
                    ? "border-white/70 bg-white/10 scale-105 shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                    : "border-white/20 bg-black/40 hover:border-white/40 hover:bg-white/5"
                }
              `}
            >
              {/* Image */}
              <div className="h-32 relative">
                <Image
                  src={s.img}
                  alt={s.name}
                  fill
                  className="object-contain p-3"
                />
              </div>

              {/* Info */}
              <div className="p-3 text-center">
                <p className="text-white text-xs tracking-[0.2em]">
                  {s.name}
                </p>
                <p className="text-white/50 text-[10px] mt-1">
                  {s.price}
                </p>
              </div>

              {/* Glow border */}
              {isActive && (
                <div className="absolute inset-0 rounded-lg border border-white/30 pointer-events-none" />
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}