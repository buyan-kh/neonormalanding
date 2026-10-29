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
const SAMPLES = 96;
const TURNS = 2.35;
const RADIUS = 0.62;

function shadeOf(z: number) {
  return 0.16 + 0.84 * (z + RADIUS) / (RADIUS * 2);
}

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

      const yaw = reduce ? 0.85 : now / 1000 * 0.22;
      const breath = reduce ? 1 : 0.82 + 0.18 * Math.sin(now / 1600);
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const scale = Math.min(w, h) * 0.4;
      const step = 3;
      const cols = Math.ceil(w / step);
      const rows = Math.ceil(h / step);
      const density = new Float32Array(cols * rows);

      const splat = (sx: number, sy: number, shade: number) => {
        const gx = Math.round(sx / step);
        const gy = Math.round(sy / step);
        if (gx < 1 || gy < 1 || gx >= cols - 1 || gy >= rows - 1) return;
        const write = (x: number, y: number, value: number) => {
          const index = y * cols + x;
          if (value > density[index]) density[index] = value;
        };
        write(gx, gy, shade);
        write(gx + 1, gy, shade * 0.72);
        write(gx - 1, gy, shade * 0.72);
        write(gx, gy + 1, shade * 0.72);
        write(gx, gy - 1, shade * 0.72);
      };

      const project = (x: number, y: number, z: number) => {
        const xr = x * cosY + z * sinY;
        const zr = -x * sinY + z * cosY;
        const depth = 1 + zr * 0.22;
        return {
          sx: w / 2 + xr * scale * depth,
          sy: h / 2 - y * scale * 1.05,
          z: zr,
        };
      };

      const strand = (phase: number, index: number) => {
        const y = -1 + (2 * index) / (SAMPLES - 1);
        const theta = y * Math.PI * TURNS + phase;
        return { x: Math.cos(theta) * RADIUS, y, z: Math.sin(theta) * RADIUS };
      };

      for (let i = 0; i < SAMPLES; i += 1) {
        for (const phase of [0, Math.PI]) {
          const point = strand(phase, i);
          const view = project(point.x, point.y, point.z);
          splat(view.sx, view.sy, shadeOf(view.z));
        }
        if (i % 7 === 0) {
          const a = strand(0, i);
          const b = strand(Math.PI, i);
          for (let t = 0; t <= 6; t += 1) {
            const u = t / 6;
            const view = project(
              a.x + (b.x - a.x) * u,
              a.y,
              a.z + (b.z - a.z) * u,
            );
            splat(view.sx, view.sy, shadeOf(view.z) * 0.92);
          }
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
