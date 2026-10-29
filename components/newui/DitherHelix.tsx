"use client";

import { useEffect, useRef } from "react";

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const PAPER = "#F6F4EF";
const INK = "#0A0A0A";
const TURNS = 1.85;

export function DitherHelix({
  still = false,
  className = "",
}: {
  still?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = still || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;
    let lastPaint = 0;

    const paint = (now: number) => {
      const bounds = canvas.getBoundingClientRect();
      const w = bounds.width;
      const h = bounds.height;
      if (w < 2 || h < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.floor(w * dpr);
      const bh = Math.floor(h * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, w, h);

      const yaw = reduce ? 0.7 : now / 1000 * 0.18;
      const breath = reduce ? 1 : 0.9 + 0.1 * Math.sin(now / 1700);
      const top = h * 0.06;
      const bottom = h * 0.94;
      const radius = Math.min(w * 0.34, (bottom - top) * 0.2);
      const strandRadius = Math.max(3.5, Math.min(w, h) * 0.012);
      const rungRadius = Math.max(1.6, strandRadius * 0.42);
      const step = 2;
      const cols = Math.ceil(w / step);
      const rows = Math.ceil(h / step);
      const density = new Float32Array(cols * rows);

      const stamp = (sx: number, sy: number, shade: number, rad: number) => {
        const r2 = rad * rad;
        const gx0 = Math.max(0, Math.floor((sx - rad) / step));
        const gx1 = Math.min(cols - 1, Math.ceil((sx + rad) / step));
        const gy0 = Math.max(0, Math.floor((sy - rad) / step));
        const gy1 = Math.min(rows - 1, Math.ceil((sy + rad) / step));
        for (let gy = gy0; gy <= gy1; gy += 1) {
          for (let gx = gx0; gx <= gx1; gx += 1) {
            const px = gx * step + step * 0.5;
            const py = gy * step + step * 0.5;
            const dx = px - sx;
            const dy = py - sy;
            if (dx * dx + dy * dy > r2) continue;
            const index = gy * cols + gx;
            if (shade > density[index]) density[index] = shade;
          }
        }
      };

      const at = (phase: number, yNorm: number) => {
        const theta = yNorm * Math.PI * TURNS + phase + yaw;
        const z = Math.sin(theta);
        const x = Math.cos(theta);
        const foreshorten = 1 + z * 0.16;
        return {
          sx: w / 2 + x * radius * foreshorten,
          sy: top + ((yNorm + 1) / 2) * (bottom - top),
          z,
        };
      };

      const strandShade = (z: number) => (z >= 0 ? 0.97 + 0.03 * z : 0.3 + 0.22 * (z + 1));

      const ySteps = Math.max(80, Math.round((bottom - top) / 1.5));
      for (let i = 0; i <= ySteps; i += 1) {
        const yNorm = -1 + (2 * i) / ySteps;
        for (const phase of [0, Math.PI]) {
          const point = at(phase, yNorm);
          stamp(point.sx, point.sy, strandShade(point.z), strandRadius);
        }
      }

      const rungs = 8;
      for (let r = 0; r < rungs; r += 1) {
        const yNorm = -0.86 + (1.72 * r) / (rungs - 1);
        const a = at(0, yNorm);
        const b = at(Math.PI, yNorm);
        const dist = Math.hypot(b.sx - a.sx, b.sy - a.sy);
        const n = Math.max(2, Math.round(dist / 2));
        for (let t = 0; t <= n; t += 1) {
          const u = t / n;
          const z = a.z + (b.z - a.z) * u;
          stamp(a.sx + (b.sx - a.sx) * u, a.sy + (b.sy - a.sy) * u, strandShade(z) * 0.9, rungRadius);
        }
      }

      ctx.fillStyle = INK;
      for (let gy = 0; gy < rows; gy += 1) {
        for (let gx = 0; gx < cols; gx += 1) {
          const value = density[gy * cols + gx];
          if (value <= 0) continue;
          const threshold = (BAYER[gy & 3][gx & 3] + 0.5) / 16;
          if (value * breath > threshold) ctx.fillRect(gx * step, gy * step, step, step);
        }
      }
    };

    const loop = (now: number) => {
      if (now - lastPaint >= 33) {
        lastPaint = now;
        paint(now);
      }
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    paint(performance.now());
    if (reduce) return () => stop();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    observer.observe(canvas);
    start();
    return () => {
      stop();
      observer.disconnect();
    };
  }, [still]);

  return (
    <canvas
      ref={ref}
      className={`block h-full w-full ${className}`}
      role="img"
      aria-label={still ? "Still dithered DNA helix" : "Slowly turning dithered DNA helix"}
    />
  );
}
