"use client";

import { useEffect, useRef } from "react";

const RES = 512;
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

export type ServiceMotif = "lattice" | "target" | "pages" | "checks" | "trail" | "vault";

const PAPER = "#F6F4EF";
const INK = "#0A0A0A";

function clamp(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function lit(nx: number, ny: number, nz: number, lx: number, ly: number, lz: number) {
  return clamp(0.16 + 0.84 * (nx * lx + ny * ly + nz * lz));
}

function fillTri(
  buf: Float32Array,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  shade: number,
) {
  const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
  const maxX = Math.min(RES - 1, Math.ceil(Math.max(ax, bx, cx)));
  const minY = Math.max(0, Math.floor(Math.min(ay, by, cy)));
  const maxY = Math.min(RES - 1, Math.ceil(Math.max(ay, by, cy)));
  const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  if (Math.abs(area) < 0.5) return;
  const sign = area > 0 ? 1 : -1;
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const w0 = ((bx - ax) * (y - ay) - (by - ay) * (x - ax)) * sign;
      const w1 = ((cx - bx) * (y - by) - (cy - by) * (x - bx)) * sign;
      const w2 = ((ax - cx) * (y - cy) - (ay - cy) * (x - cx)) * sign;
      if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
        const index = y * RES + x;
        if (shade > buf[index]) buf[index] = shade;
      }
    }
  }
}

function fillQuad(
  buf: Float32Array,
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
  d: { x: number; y: number },
  shade: number,
) {
  fillTri(buf, a.x, a.y, b.x, b.y, c.x, c.y, shade);
  fillTri(buf, a.x, a.y, c.x, c.y, d.x, d.y, shade);
}

function project(x: number, y: number, z: number) {
  return {
    x: 256 + (x - z) * 48,
    y: 318 + (x + z) * 26 - y * 54,
  };
}

function drawLattice(buf: Float32Array, turn: number) {
  const lx = Math.cos(turn);
  const lz = Math.sin(turn);
  const top = clamp(0.2 + 0.55 * (0.55 + 0.45 * lz));
  const left = clamp(0.15 + 0.7 * (0.45 + 0.55 * lx));
  const right = clamp(0.1 + 0.5 * (0.55 - 0.45 * lx));
  const order: Array<[number, number, number]> = [];
  for (let i = 0; i < 5; i += 1) {
    for (let k = 0; k < 5; k += 1) {
      const corridor = (i === 2 && k > 0 && k < 4) || (k === 1 && i < 4);
      const nest = i > 0 && i < 4 && k > 1 && k < 4 && !corridor;
      const h = corridor ? 0.12 : nest ? 0.95 : 0.28 + ((i * 3 + k) % 3) * 0.16;
      order.push([i - 2, k - 2, h]);
    }
  }
  order.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  for (const [x, z, h] of order) {
    const s = 0.78;
    const p = (px: number, py: number, pz: number) => project(x + px, py, z + pz);
    const a = p(0, h, 0);
    const b = p(s, h, 0);
    const c = p(s, h, s);
    const d = p(0, h, s);
    const e = p(0, 0, 0);
    const f = p(s, 0, 0);
    const g = p(s, 0, s);
    const hh = p(0, 0, s);
    fillQuad(buf, e, f, b, a, left);
    fillQuad(buf, f, g, c, b, right);
    fillQuad(buf, a, b, c, d, top);
  }
}

function drawTarget(buf: Float32Array, turn: number) {
  const lx = 0.45 * Math.cos(turn) + 0.15;
  const ly = -0.35 + 0.2 * Math.sin(turn);
  const lz = 0.8;
  for (let y = 0; y < RES; y += 1) {
    for (let x = 0; x < RES; x += 1) {
      const nx = (x - 256) / 168;
      const ny = (y - 256) / 168;
      const r = Math.hypot(nx, ny);
      if (r > 1.05) continue;
      const ring = Math.floor(r * 5.2);
      const nz = Math.sqrt(Math.max(0, 1 - Math.min(1, r * r)));
      const band = ring % 2 === 0 ? 0.72 : 0.28;
      const gloss = lit(nx * 0.7, ny * 0.7, nz, lx, ly, lz);
      buf[y * RES + x] = clamp(band * 0.45 + gloss * 0.7);
    }
  }
}

function drawPages(buf: Float32Array, turn: number) {
  const lean = Math.sin(turn) * 10;
  const sheets = [
    { x: 78, y: 96, w: 250, h: 300, ink: 0.22 },
    { x: 108, y: 78, w: 268, h: 312, ink: 0.16 },
    { x: 146, y: 118, w: 250, h: 286, ink: 0.2 },
    { x: 188, y: 92, w: 246, h: 300, ink: 0.14 },
  ];
  for (const sheet of sheets) {
    for (let y = sheet.y; y < sheet.y + sheet.h && y < RES; y += 1) {
      for (let x = sheet.x; x < sheet.x + sheet.w && x < RES; x += 1) {
        const local = (y - sheet.y) / sheet.h;
        const sway = ((x - 256) / 256) * lean;
        if (x + sway < sheet.x || x + sway > sheet.x + sheet.w) continue;
        const line = local > 0.16 && Math.abs((y % 14) - 4) < 1.2 && x < sheet.x + sheet.w - 28 ? 0.55 : sheet.ink;
        const gutter = x > sheet.x + sheet.w * 0.46 && x < sheet.x + sheet.w * 0.54 ? 0.18 : 0;
        const edge = x > sheet.x + sheet.w - 8 ? 0.35 : 0;
        const index = y * RES + x;
        const value = clamp(line + gutter + edge);
        if (value > buf[index]) buf[index] = value;
      }
    }
  }
}

function drawChecks(buf: Float32Array, turn: number) {
  const n = 6;
  const cell = 58;
  const origin = 78;
  const drift = 0.5 + 0.5 * Math.sin(turn);
  for (let row = 0; row < n; row += 1) {
    for (let col = 0; col < n; col += 1) {
      const x0 = origin + col * (cell + 8);
      const y0 = origin + row * (cell + 8);
      const filled = (row * 5 + col * 3) % 5 < 3;
      const glow = 0.2 + 0.55 * (col / n) * (0.4 + 0.6 * drift) + 0.15 * (row / n);
      for (let y = y0; y < y0 + cell; y += 1) {
        for (let x = x0; x < x0 + cell; x += 1) {
          const border = x < x0 + 2 || y < y0 + 2 || x > x0 + cell - 3 || y > y0 + cell - 3;
          let value = border ? 0.78 : glow * 0.35;
          if (filled && !border) {
            const lx = x - x0;
            const ly = y - y0;
            const stem = Math.abs(lx - 16 - (ly - 34) * 0.45) < 2.2 && ly > 28 && ly < 44;
            const arm = Math.abs(ly - 36 - (lx - 22) * 0.35) < 2.2 && lx > 20 && lx < 44;
            value = stem || arm ? 0.92 : 0.5 + glow * 0.25;
          }
          buf[y * RES + x] = value;
        }
      }
    }
  }
}

function stamp(buf: Float32Array, cx: number, cy: number, rad: number, shade: number) {
  const r2 = rad * rad;
  const x0 = Math.max(0, Math.floor(cx - rad));
  const x1 = Math.min(RES - 1, Math.ceil(cx + rad));
  const y0 = Math.max(0, Math.floor(cy - rad));
  const y1 = Math.min(RES - 1, Math.ceil(cy + rad));
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2) continue;
      const nz = Math.sqrt(1 - d2 / r2);
      const value = shade * (0.35 + 0.65 * nz);
      const index = y * RES + x;
      if (value > buf[index]) buf[index] = value;
    }
  }
}

function drawTrail(buf: Float32Array, turn: number) {
  const lx = 0.55 + 0.35 * Math.cos(turn);
  const point = (t: number, bend: number) => ({
    x: 250 + Math.sin(t * 6.2 + bend) * 120 + Math.cos(t * 2.4) * 36,
    y: 64 + t * 390,
    z: Math.sin(t * 4 + bend + turn),
  });
  const lay = (bend: number, from: number, to: number) => {
    for (let t = from; t <= to; t += 0.012) {
      const p = point(t, bend);
      const depth = 0.45 + 0.55 * (p.z * 0.5 + 0.5);
      stamp(buf, p.x, p.y, 7 + depth * 6, clamp(0.25 + 0.75 * depth * lx));
    }
  };
  lay(0, 0, 1);
  lay(1.7, 0.28, 0.72);
  lay(-1.5, 0.55, 0.95);
}

function drawVault(buf: Float32Array, turn: number) {
  const lx = 0.35 * Math.cos(turn) - 0.15;
  const ly = -0.45;
  const lz = 0.75 + 0.2 * Math.sin(turn);
  const len = Math.hypot(lx, ly, lz) || 1;
  for (let y = 80; y < 430; y += 1) {
    for (let x = 70; x < 430; x += 1) {
      const nx = (x - 230) / 150;
      const ny = (y - 250) / 150;
      const r2 = nx * nx + ny * ny;
      if (r2 > 1) continue;
      const nz = Math.sqrt(1 - r2);
      let value = lit(nx, ny, nz, lx / len, ly / len, lz / len);
      const hole = ny > -0.05 && Math.hypot(nx, ny + 0.02) < 0.1;
      const slot = Math.abs(nx) < 0.035 && ny > -0.02 && ny < 0.28;
      if (hole || slot) value = 0.08;
      buf[y * RES + x] = value;
    }
  }
  for (let y = 300; y < 392; y += 1) {
    for (let x = 360; x < 470; x += 1) {
      const shaft = y > 338 && y < 354;
      const bit = x > 444 && y > 318 && y < 374 && (y < 334 || y > 358 || x < 456);
      const bow = Math.hypot(x - 372, y - 346) < 22 && Math.hypot(x - 372, y - 346) > 12;
      if (shaft || bit || bow) buf[y * RES + x] = Math.max(buf[y * RES + x], 0.82);
    }
  }
}

function renderShade(motif: ServiceMotif, turn: number) {
  const buf = new Float32Array(RES * RES);
  if (motif === "lattice") drawLattice(buf, turn);
  else if (motif === "target") drawTarget(buf, turn);
  else if (motif === "pages") drawPages(buf, turn);
  else if (motif === "checks") drawChecks(buf, turn);
  else if (motif === "trail") drawTrail(buf, turn);
  else drawVault(buf, turn);
  return buf;
}

export function DitherTile({ motif }: { motif: ServiceMotif }) {
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
      const css = bounds.width;
      if (css < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const cells = Math.max(96, Math.round(css / 1.5));
      const dot = Math.max(1, Math.round((css * dpr) / cells));
      const size = cells * dot;
      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, size, size);
      const turn = reduce ? 0.6 : now / 2200;
      const shade = renderShade(motif, turn);
      const shimmer = reduce ? 0 : Math.sin(now / 900) * 0.035;
      ctx.fillStyle = INK;
      for (let gy = 0; gy < cells; gy += 1) {
        for (let gx = 0; gx < cells; gx += 1) {
          const sx = Math.min(RES - 1, Math.floor((gx + 0.5) * (RES / cells)));
          const sy = Math.min(RES - 1, Math.floor((gy + 0.5) * (RES / cells)));
          const value = shade[sy * RES + sx];
          const threshold = (BAYER8[gy & 7][gx & 7] + 0.5) / 64 + shimmer;
          if (value > threshold) ctx.fillRect(gx * dot, gy * dot, dot, dot);
        }
      }
    };

    const loop = (now: number) => {
      if (now - last >= 66) {
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
  }, [motif]);

  return <canvas ref={ref} className="block aspect-square w-full" aria-hidden="true" />;
}
