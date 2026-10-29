"use client";

import { useEffect, useRef } from "react";

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

type Motif = "record" | "home" | "grade" | "standard";

function field(motif: Motif, x: number, y: number) {
  const nx = x * 2 - 1;
  const ny = y * 2 - 1;
  if (motif === "record") {
    const band = Math.abs((y * 7) % 1 - 0.5);
    return band < 0.18 && x > 0.18 && x < 0.82 ? 0.95 : 0.08;
  }
  if (motif === "home") {
    const roof = ny < -0.05 && Math.abs(nx) < 0.15 + ( -ny) * 0.7;
    const wall = Math.abs(nx) < 0.42 && ny > -0.05 && ny < 0.62;
    return roof || wall ? 0.9 : 0.06;
  }
  if (motif === "grade") {
    const arm = Math.abs(ny - nx * 0.15 + 0.05) < 0.08 && nx > -0.2;
    const stem = Math.abs(nx + 0.35) < 0.07 && ny > -0.35 && ny < 0.15;
    return arm || stem ? 0.92 : 0.07;
  }
  const ring = Math.abs(Math.hypot(nx, ny) - 0.46);
  return ring < 0.08 ? 0.94 : 0.05;
}

export function DitherTile({ motif }: { motif: Motif }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;
    let last = 0;

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
      ctx.fillStyle = "#F6F4EF";
      ctx.fillRect(0, 0, w, h);
      const breath = reduce ? 1 : 0.9 + 0.1 * Math.sin(now / 1800);
      const step = Math.max(3, Math.round(Math.min(w, h) / 42));
      ctx.fillStyle = "#0A0A0A";
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const shade = field(motif, x / w, y / h) * breath;
          const threshold = (BAYER[(y / step) & 3][(x / step) & 3] + 0.5) / 16;
          if (shade > threshold) ctx.fillRect(x, y, step, step);
        }
      }
    };

    const loop = (now: number) => {
      if (now - last >= 33) {
        last = now;
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
  }, [motif]);

  return <canvas ref={ref} className="block aspect-square w-full" aria-hidden="true" />;
}
