"use client";

import { useEffect, useRef } from "react";

const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const PAPER = "#F6F4EF";
const INK = "#0A0A0A";
const TURNS = 2;

function clamp(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

type Vec = { x: number; y: number; z: number };

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
    let shade = new Float32Array(0);
    let depth = new Float32Array(0);

    const paint = (now: number) => {
      const bounds = canvas.getBoundingClientRect();
      const cssW = bounds.width;
      const cssH = bounds.height;
      if (cssW < 2 || cssH < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const dot = Math.max(1, Math.round(1.5 * dpr));
      const cols = Math.max(80, Math.round(cssW / 1.5));
      const rows = Math.max(80, Math.round(cssH / 1.5));
      const width = cols * dot;
      const height = rows * dot;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const count = cols * rows;
      if (shade.length !== count) {
        shade = new Float32Array(count);
        depth = new Float32Array(count);
      }
      shade.fill(0);
      depth.fill(-1e9);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, width, height);

      const yaw = reduce ? 0.65 : (now / 1000) * 0.16;
      const ang = reduce ? 0.4 : now / 2600;
      let lx = 0.34 * Math.cos(ang) + 0.12;
      let ly = -0.62;
      let lz = 0.7 + 0.16 * Math.sin(ang);
      const llen = Math.hypot(lx, ly, lz) || 1;
      lx /= llen;
      ly /= llen;
      lz /= llen;

      const top = rows * 0.05;
      const bottom = rows * 0.95;
      const span = bottom - top;
      const radius = Math.min(cols * 0.33, span * 0.2);
      const tube = Math.max(6, radius * 0.11);
      const rungR = tube * 0.4;

      const at = (phase: number, yNorm: number): Vec => {
        const theta = yNorm * Math.PI * TURNS + phase + yaw;
        return {
          x: cols / 2 + Math.cos(theta) * radius,
          y: top + ((yNorm + 1) / 2) * span,
          z: Math.sin(theta) * radius,
        };
      };

      const write = (x: number, y: number, surfZ: number, nx: number, ny: number, nz: number) => {
        const index = y * cols + x;
        if (surfZ <= depth[index]) return;
        const ndotl = nx * lx + ny * ly + nz * lz;
        const diffuse = ndotl > 0 ? ndotl : 0;
        const specBase = nz * ndotl * 2 - lz;
        const spec = specBase > 0 ? specBase ** 18 : 0;
        const facing = 0.82 + 0.18 * clamp(surfZ / radius * 0.5 + 0.5);
        depth[index] = surfZ;
        shade[index] = clamp((0.22 + 0.62 * diffuse + 0.28 * spec) * facing);
      };

      const stampCylinder = (a: Vec, b: Vec, rad: number) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const len = Math.hypot(dx, dy, dz);
        if (len < 0.001) return;
        const dirx = dx / len;
        const diry = dy / len;
        const dirz = dz / len;
        const pad = rad + 1.25;
        const x0 = Math.max(0, Math.floor(Math.min(a.x, b.x) - pad));
        const x1 = Math.min(cols - 1, Math.ceil(Math.max(a.x, b.x) + pad));
        const y0 = Math.max(0, Math.floor(Math.min(a.y, b.y) - pad));
        const y1 = Math.min(rows - 1, Math.ceil(Math.max(a.y, b.y) + pad));
        const aCoeff = 1 - dirz * dirz;
        const rad2 = (rad + 0.6) * (rad + 0.6);

        for (let y = y0; y <= y1; y += 1) {
          for (let x = x0; x <= x1; x += 1) {
            const px = x + 0.5;
            const py = y + 0.5;
            const abx = b.x - a.x;
            const aby = b.y - a.y;
            const ab2 = abx * abx + aby * aby;
            let along = 0;
            if (ab2 > 0.01) {
              along = ((px - a.x) * abx + (py - a.y) * aby) / ab2;
              if (along < 0) along = 0;
              else if (along > 1) along = 1;
            }
            const qx = a.x + abx * along - px;
            const qy = a.y + aby * along - py;
            if (qx * qx + qy * qy > rad2) continue;

            const ox = px - a.x;
            const oy = py - a.y;
            const oz = -a.z;
            let surfZ = 0;
            let nx = 0;
            let ny = 0;
            let nz = 0;

            if (aCoeff < 1e-4) {
              const radial = Math.hypot(ox, oy);
              if (radial > rad) continue;
              const edge = rad > 0 ? radial / rad : 0;
              const fall = Math.sqrt(Math.max(0, 1 - edge * edge));
              nx = rad > 0.001 ? ox / rad : 0;
              ny = rad > 0.001 ? oy / rad : 0;
              nz = fall;
              const nlen = Math.hypot(nx, ny, nz) || 1;
              surfZ = Math.max(a.z, b.z);
              write(x, y, surfZ, nx / nlen, ny / nlen, nz / nlen);
              continue;
            }

            const dDo = dirx * ox + diry * oy + dirz * oz;
            const bCoeff = 2 * (oz - dDo * dirz);
            const cCoeff = ox * ox + oy * oy + oz * oz - dDo * dDo - rad * rad;
            const disc = bCoeff * bCoeff - 4 * aCoeff * cCoeff;
            if (disc < 0) continue;
            const s = (-bCoeff + Math.sqrt(disc)) / (2 * aCoeff);
            const t = ox * dirx + oy * diry + (s - a.z) * dirz;
            if (t < -0.45 || t > len + 0.45) continue;
            const cxp = a.x + dirx * t;
            const cyp = a.y + diry * t;
            const czp = a.z + dirz * t;
            nx = px - cxp;
            ny = py - cyp;
            nz = s - czp;
            const nlen = Math.hypot(nx, ny, nz) || 1;
            surfZ = s;
            write(x, y, surfZ, nx / nlen, ny / nlen, nz / nlen);
          }
        }
      };

      const steps = Math.max(96, Math.round(span / Math.max(4, tube * 0.72)));
      let prevA = at(0, -1);
      let prevB = at(Math.PI, -1);
      for (let i = 1; i <= steps; i += 1) {
        const yNorm = -1 + (2 * i) / steps;
        const nextA = at(0, yNorm);
        const nextB = at(Math.PI, yNorm);
        stampCylinder(prevA, nextA, tube);
        stampCylinder(prevB, nextB, tube);
        prevA = nextA;
        prevB = nextB;
      }

      const rungs = 11;
      for (let rung = 0; rung < rungs; rung += 1) {
        const yNorm = -0.9 + (1.8 * rung) / (rungs - 1);
        const a = at(0, yNorm);
        const b = at(Math.PI, yNorm);
        const rdx = b.x - a.x;
        const rdy = b.y - a.y;
        const rdz = b.z - a.z;
        const rlen = Math.hypot(rdx, rdy, rdz) || 1;
        const inset = Math.min(tube * 0.45, rlen * 0.18) / rlen;
        stampCylinder(
          { x: a.x + rdx * inset, y: a.y + rdy * inset, z: a.z + rdz * inset },
          { x: b.x - rdx * inset, y: b.y - rdy * inset, z: b.z - rdz * inset },
          rungR,
        );
      }

      ctx.fillStyle = INK;
      for (let y = 0; y < rows; y += 1) {
        const row = y * cols;
        for (let x = 0; x < cols; x += 1) {
          let value = shade[row + x];
          if (value < 0.08) continue;
          const threshold = (BAYER8[y & 7][x & 7] + 0.5) / 64;
          if (value > threshold) ctx.fillRect(x * dot, y * dot, dot, dot);
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

    paint(reduce ? 0 : performance.now());
    if (reduce) return () => stop();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    observer.observe(canvas);
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
