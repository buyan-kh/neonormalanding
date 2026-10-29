"use client";

import { useEffect, useRef } from "react";
import { pixelIcons } from "@/lib/icons";

export function ResolveMark() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rows = pixelIcons.ehr;
    const n = rows.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;
    let last = 0;
    let started = 0;

    const paint = (now: number) => {
      const bounds = canvas.getBoundingClientRect();
      const size = Math.min(bounds.width, bounds.height);
      if (size < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = Math.floor(size * dpr);
      if (canvas.width !== px) {
        canvas.width = px;
        canvas.height = px;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, size, size);
      const t = reduce ? 1 : Math.min(1, (now - started) / 1600);
      const cell = size / n;
      ctx.fillStyle = "#0A0A0A";
      for (let y = 0; y < n; y += 1) {
        for (let x = 0; x < n; x += 1) {
          const on = rows[y][x] === "#";
          const noise = ((x * 17 + y * 13) % 10) / 10;
          const show = on ? noise < 0.25 + t * 0.85 : noise > 0.92 - t * 0.7;
          if (show) ctx.fillRect(Math.floor(x * cell), Math.floor(y * cell), Math.ceil(cell), Math.ceil(cell));
        }
      }
    };

    const loop = (now: number) => {
      if (!started) started = now;
      if (now - last >= 33) {
        last = now;
        paint(now);
      }
      if (running && (reduce || now - started < 1800)) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      started = 0;
      raf = requestAnimationFrame(loop);
    };
    paint(performance.now());
    if (reduce) return () => cancelAnimationFrame(raf);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="block h-28 w-28" role="img" aria-label="A mark resolving from noise" />;
}
