"use client";

import { useEffect, useRef } from "react";

export function FrayLines() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.style.setProperty("--fray", "0.15");
      return;
    }
    let raf = 0;
    let running = false;
    let last = 0;
    const tick = (now: number) => {
      if (now - last >= 33) {
        last = now;
        const rect = node.getBoundingClientRect();
        const view = window.innerHeight || 1;
        const passed = (view * 0.65 - rect.top) / (rect.height + view * 0.4);
        const fray = Math.min(1, Math.max(0, passed));
        node.style.setProperty("--fray", fray.toFixed(3));
      }
      if (running) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    observer.observe(node);
    return () => {
      stop();
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="nu-fray" aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <span key={index} style={{ animationDelay: `${index * 40}ms` }} />
      ))}
    </div>
  );
}
