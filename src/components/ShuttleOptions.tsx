"use client";

import { useState } from "react";
import Image from "next/image";

const SHUTTLES = [
  {
    id: "orbit",
    name: "Orbit Classic",
    img: "/shuttleClassic.png",
    price: "120 cr",
  },
  {
    id: "express",
    name: "Warp Express",
    img: "/shuttleExpress.png",
    price: "180 cr",
  },
  {
    id: "nailong",
    name: "Nailong Runner",
    img: "/shuttleNailong.png",
    price: "240 cr",
  },
  {
    id: "cargo",
    name: "Cargo Hauler",
    img: "/shuttleCargo.png",
    price: "380 cr",
  },
  {
    id: "class",
    name: "Command Class",
    img: "/shuttleLuxury.png",
    price: "520 cr",
  },
];

export default function ShuttleOptions({
  onSelectShuttle,
}: {
  onSelectShuttle: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelectShuttle(id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 relative">
      <h2 className="text-center text-white text-xs tracking-[0.3em] mb-4">
        SELECT YOUR SHUTTLE
      </h2>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-black via-black/50 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-black via-black/50 to-transparent pointer-events-none z-10" />

        <div className="flex gap-4 overflow-x-auto overflow-y-visible pb-3 px-1 pt-4 scrollbar-hide">
          {SHUTTLES.map((s) => {
            const isActive = selected === s.id;

            return (
              <div
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className={`
                  relative min-w-55 shrink-0 cursor-pointer
                  rounded-lg border backdrop-blur-md
                  transition-all duration-300 transform-gpu
                  ${
                    isActive
                      ? "border-white/70 bg-white/10 scale-105 shadow-[0_0_25px_rgba(255,255,255,0.55)] z-20"
                      : "border-white/20 bg-black/40 hover:border-white/40 hover:bg-white/5 z-0"
                  }
                `}
              >
                <div className="h-32 relative overflow-hidden">
                  <Image
                    src={s.img}
                    alt={s.name}
                    fill
                    className="object-contain p-3 scale-220"
                    sizes="(max-width: 220px) 100vw, 220px"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-white text-xs tracking-[0.2em]">
                    {s.name}
                  </p>
                  <p className="text-white/50 text-[10px] mt-1">{s.price}</p>
                </div>
                {isActive && (
                  <div className="absolute inset-0 rounded-lg border border-white/30 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
