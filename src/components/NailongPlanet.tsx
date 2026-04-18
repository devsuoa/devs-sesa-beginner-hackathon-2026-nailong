"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function NailongPlanet() {
    const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nailongs = [
      createNailong(),
      createNailong(),
    ];

    function createNailong() {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        size: 120 + Math.random() * 80,
        rotation: Math.random() * 360,          // starting angle
        rotSpeed: (Math.random() - 0.5) * 0.5,  // slow spin
        el: document.createElement("div"),
      };
    }

    nailongs.forEach((nailong) => {
      nailong.el.style.position = "absolute";
      nailong.el.style.width = `${nailong.size}px`;
      nailong.el.style.height = `${nailong.size}px`;
      nailong.el.style.pointerEvents = "none";
      nailong.el.style.opacity = "0.8";

      nailong.el.innerHTML = `
        <img src="/nailongPlanet.png" style="width:100%;height:100%;object-fit:contain;" />
      `;

      container.appendChild(nailong.el);
    });

    function animate() {
      nailongs.forEach((nailong) => {
        nailong.x += nailong.dx;
        nailong.y += nailong.dy;

        // bounce / wrap around screen
        if (nailong.x > window.innerWidth) nailong.x = -100;
        if (nailong.x < -100) nailong.x = window.innerWidth;

        if (nailong.y > window.innerHeight) nailong.y = -100;
        if (nailong.y < -100) nailong.y = window.innerHeight;

        nailong.rotation += nailong.rotSpeed;

        nailong.el.style.transform = `translate(${nailong.x}px, ${nailong.y}px) rotate(${nailong.rotation}deg)`;
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}