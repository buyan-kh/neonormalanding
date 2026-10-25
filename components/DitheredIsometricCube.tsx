"use client";

import { useEffect, useRef } from "react";

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const FACES: Array<{ normal: [number, number, number]; axis: "x" | "y" | "z"; sign: number }> = [
  { normal: [0, 0, 1], axis: "z", sign: 1 },
  { normal: [0, 0, -1], axis: "z", sign: -1 },
  { normal: [1, 0, 0], axis: "x", sign: 1 },
  { normal: [-1, 0, 0], axis: "x", sign: -1 },
  { normal: [0, 1, 0], axis: "y", sign: 1 },
  { normal: [0, -1, 0], axis: "y", sign: -1 },
];

function rotate(x: number, y: number, z: number, yaw: number, pitch: number) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  return [x1, y2, z2] as const;
}

export function DitheredIsometricCube({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = Array.from({ length: 36 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.018,
      vy: (Math.random() - 0.5) * 0.012,
    }));

    let raf = 0;
    let running = false;
    let last = performance.now();
    const pitch = Math.atan(1 / Math.sqrt(2));
    const n = 15;
    const light: [number, number, number] = [-0.45, 0.72, 0.53];
    const lightLen = Math.hypot(...light);
    light[0] /= lightLen;
    light[1] /= lightLen;
    light[2] /= lightLen;

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
      ctx.clearRect(0, 0, w, h);

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) {
        for (const particle of particles) {
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
          if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
        }
      }

      ctx.globalAlpha = 0.65;
      ctx.fillStyle = "#EFECE6";
      for (const particle of particles) {
        ctx.fillRect(Math.round(particle.x * w), Math.round(particle.y * h), 2, 2);
      }
      ctx.globalAlpha = 1;

      const yaw = reduce ? Math.PI / 4 : now / 1000 * 0.28;
      const scale = Math.min(w, h) * 0.34;
      const occupied = new Map<string, number>();

      for (const face of FACES) {
        const [nx, ny, nz] = rotate(face.normal[0], face.normal[1], face.normal[2], yaw, pitch);
        if (nz < 0.04) continue;
        const brightness = Math.max(0, nx * light[0] + ny * light[1] + nz * light[2]);
        const shade = 0.14 + brightness * 0.9;

        for (let i = 0; i < n; i += 1) {
          for (let j = 0; j < n; j += 1) {
            const edge = i === 0 || j === 0 || i === n - 1 || j === n - 1;
            const threshold = (BAYER[j & 3][i & 3] + 0.5) / 16;
            if (!edge && shade < threshold) continue;
            if (edge && shade < 0.12) continue;

            const u = -1 + (2 * i) / (n - 1);
            const v = -1 + (2 * j) / (n - 1);
            let x = u;
            let y = v;
            let z = face.sign;
            if (face.axis === "x") {
              x = face.sign;
              y = u;
              z = v;
            } else if (face.axis === "y") {
              x = u;
              y = face.sign;
              z = v;
            }
            const [rx, ry, rz] = rotate(x, y, z, yaw, pitch);
            const sx = Math.round((w / 2 + rx * scale) / 3) * 3;
            const sy = Math.round((h / 2 - ry * scale) / 3) * 3;
            const key = `${sx},${sy}`;
            const nearer = occupied.get(key);
            if (nearer !== undefined && nearer >= rz) continue;
            occupied.set(key, rz);
          }
        }
      }

      ctx.fillStyle = "#EFECE6";
      for (const key of occupied.keys()) {
        const [sx, sy] = key.split(",").map(Number);
        ctx.fillRect(sx, sy, 3, 3);
      }
    };

    const loop = (now: number) => {
      paint(now);
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
    const observer = new IntersectionObserver(([entry]) => {
      if (reduce) return;
      if (entry.isIntersecting) start();
      else stop();
    });
    observer.observe(canvas);
    if (!reduce) start();

    return () => {
      stop();
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={`block h-full w-full ${className}`}
      role="img"
      aria-label="Rotating dithered isometric cube"
    />
  );
}
