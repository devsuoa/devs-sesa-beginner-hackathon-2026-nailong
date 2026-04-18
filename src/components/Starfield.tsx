/** biome-ignore-all lint/style/noNonNullAssertion: guaranteeed that is defined */
"use client";

import { useEffect, useRef } from "react";

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const stars: { x: number; y: number; z: number; px: number; py: number }[] = [];
    const N = 500;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < N; i++) {
      stars.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(), px: 0, py: 0 });
    }

    const speed = 0.0004;
    function draw() {
      const w = canvas.width, h = canvas.height;
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.px = (s.x / s.z) * w * 0.5 + w * 0.5;
        s.py = (s.y / s.z) * h * 0.5 + h * 0.5;
        s.z -= speed;
        if (s.z <= 0) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; }

        const x = (s.x / s.z) * w * 0.5 + w * 0.5;
        const y = (s.y / s.z) * h * 0.5 + h * 0.5;
        const size = Math.max(0.2, (1 - s.z) * 2.5);
        const alpha = Math.min(1, (1 - s.z) * 1.5);

        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.9})`;
        ctx.lineWidth = size;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 -z-10" />;
}
