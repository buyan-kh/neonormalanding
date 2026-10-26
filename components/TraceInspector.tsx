"use client";

import { useEffect, useState } from "react";
import { PixelIcon } from "@/components/PixelIcon";
import { TerminalWindow } from "@/components/TerminalWindow";
import { traceTasks } from "@/lib/catalog";

function formatLive(value: number, capText: string, done: boolean, showCap: boolean) {
  if (!done) return value.toFixed(2);
  if (showCap) return capText;
  return value.toFixed(2);
}

export function TraceInspector() {
  const [activeId, setActiveId] = useState(traceTasks[0].id);
  const [run, setRun] = useState(0);
  const active = traceTasks.find((task) => task.id === activeId) ?? traceTasks[0];
  const replayKey = `${activeId}:${run}`;
  const [trackedKey, setTrackedKey] = useState(replayKey);
  const [values, setValues] = useState(() => active.shortcuts.map(() => 1));
  if (trackedKey !== replayKey) {
    setTrackedKey(replayKey);
    setValues(active.shortcuts.map(() => 1));
  }

  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.replace("#", "");
      if (traceTasks.some((task) => task.id === id)) setActiveId(id);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    const task = traceTasks.find((item) => item.id === activeId) ?? traceTasks[0];
    const targets = task.shortcuts.map((shortcut) => shortcut.score);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    if (reduce) {
      raf = requestAnimationFrame(() => setValues(targets));
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      const eased = 1 - (1 - t) ** 3;
      setValues(targets.map((score) => 1 + (score - 1) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeId, run]);

  const done = active.shortcuts.every((shortcut, index) => values[index] <= shortcut.score + 0.02);

  function select(id: string) {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <section id="failure-trace" className="scroll-mt-32 border-t border-[#0A0A0A]/20" aria-labelledby="trace-heading">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#525252]">FAILURE TRACE</p>
        <h2 id="trace-heading" className="mt-3 max-w-[20em] text-[24px] leading-snug md:text-[30px]">
          Models print success. The biology fails.
        </h2>
        <p className="mt-4 max-w-[62ch] text-[13px] leading-relaxed text-[#525252]">
          The judge scores the prose. grade.py checks the biology.
        </p>

        <div id="trace" className="mt-6 flex max-w-full flex-wrap gap-2 scroll-mt-32" role="tablist" aria-label="Tasks">
          {traceTasks.map((task) => {
            const on = task.id === active.id;
            return (
              <button
                key={task.id}
                id={task.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => select(task.id)}
                className={`shrink-0 scroll-mt-32 px-2 py-1 text-[11px] ${on ? "bg-[#0A0A0A] text-white" : "border border-[#0A0A0A] text-[#0A0A0A]"}`}
              >
                {task.id}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TerminalWindow title={`${active.step} // Reward Hacking in the Wild`} className="h-full">
            <div className="grid gap-3 p-3 md:grid-cols-[148px_minmax(0,1fr)]">
              <div className="hidden flex-col gap-2 md:flex">
                <p className="text-[10px] text-[#525252]">{active.tokenLine}</p>
                <div className="relative h-24">
                  {[0, 1, 2, 3].map((card) => (
                    <div
                      key={card}
                      className="absolute border border-dashed border-[#0A0A0A]/50 bg-white p-1"
                      style={{ top: card * 10, left: card * 12, width: 88, height: 52 }}
                    >
                      <div className="space-y-1">
                        <span className="block h-px w-10 bg-[#0A0A0A]/70" />
                        <span className="block h-px w-14 bg-[#0A0A0A]/35" />
                        <span className="block h-px w-8 bg-[#0A0A0A]/35" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <PixelIcon type="dna" pixel={2} />
                  <PixelIcon type="scatter" pixel={2} />
                </div>
              </div>
              <div className="text-[12px] leading-relaxed">
                <p className="text-[#525252]">
                  &gt; {active.step} <span className="cursor-block inline-block h-2.5 w-2 bg-[#0A0A0A] align-middle" />
                </p>
                <p className="mt-2">{active.contradiction}</p>
                <p className="mt-3 text-[#525252]">Options:</p>
                <ol className="mt-1 space-y-1">
                  {active.options.map((option) => (
                    <li key={option.n} className={option.chosen ? "bg-[#0A0A0A] px-1 text-white" : "px-1 text-[#525252]"}>
                      ({option.n}) {option.text} -&gt; {option.result}
                    </li>
                  ))}
                </ol>
                <pre className="mt-3 whitespace-pre-wrap text-[11px] text-[#525252]">
                  {`${active.logLabel} = [\n  (...),\n  {...}\n]`}
                </pre>
                <p key={active.id} className="arm-line mt-2 border border-[#0A0A0A] px-1 py-1 text-[12px]">
                  {active.removed}
                </p>
                <p className="mt-3 text-[#525252]">Output:</p>
                <p className="mt-1 border border-[#0A0A0A] px-2 py-1">{'{ "status": "success" }'}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="border border-dashed border-[#0A0A0A] p-2">
                    <div className="flex items-center justify-between gap-2">
                      <p>Looks correct.</p>
                      <PixelIcon type="check" pixel={2} />
                    </div>
                    <PixelIcon type="scatter" pixel={2} className="mt-2" />
                  </div>
                  <div className="border border-dashed border-[#0A0A0A] p-2">
                    <div className="flex items-center justify-between gap-2">
                      <p>Reality.</p>
                      <PixelIcon type="cross" pixel={2} />
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-[#525252]">{active.reality}</p>
                  </div>
                </div>
              </div>
            </div>
          </TerminalWindow>

          <TerminalWindow title="LLM-as-Judge: 10/10 vs. Biophysical Reality: FAIL" className="h-full">
            <div className="flex h-full flex-col gap-3 p-3">
              <div className="border border-dashed border-[#0A0A0A] p-2">
                <div className="flex items-center gap-3">
                  <PixelIcon type="robot" pixel={2} label="Judge" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-[11px]">LLM-as-Judge</p>
                    <span className="block h-px w-full bg-[#0A0A0A]/35" />
                    <span className="block h-px w-4/5 bg-[#0A0A0A]/35" />
                    <span className="block h-px w-2/3 bg-[#0A0A0A]/35" />
                  </div>
                  <div className="border border-[#0A0A0A] px-2 py-1 text-[16px]">10/10</div>
                </div>
              </div>

              <div className="border border-dashed border-[#0A0A0A] p-2">
                <div className="flex items-start gap-3">
                  <PixelIcon type="analyst" pixel={2} label="Reality" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px]">Reality</p>
                      <PixelIcon type="cross" pixel={1} />
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed">{active.reality}</p>
                  </div>
                  <p className="border border-[#0A0A0A] px-2 py-1 text-[12px]" aria-live="polite">
                    {done ? "FAIL" : "RUN"}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-[#525252]">
                grade.py // &lt;50ms // {done ? "FAIL" : "replaying shortcuts"}
              </p>
              <div>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span>Reference solver</span>
                  <span className="tabular-nums">1.0000</span>
                </div>
                <div className="h-2 border border-[#0A0A0A]/50">
                  <div className="h-full w-full bg-[#0A0A0A]" />
                </div>
              </div>
              <ul className="space-y-2">
                {active.shortcuts.map((shortcut, index) => {
                  const value = values[index] ?? 1;
                  const capText = active.landAtCap ? `<= ${active.cap.toFixed(2)}` : value.toFixed(2);
                  return (
                    <li key={shortcut.name}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-[11px]">
                        <span className="truncate text-[#525252]">{shortcut.name}</span>
                        <span className="shrink-0 tabular-nums">
                          {formatLive(value, capText, done, active.landAtCap)}
                        </span>
                      </div>
                      <div className="h-2 border border-[#0A0A0A]/30">
                        <div className="h-full bg-[#0A0A0A]" style={{ width: `${Math.max(4, value * 100)}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="text-[12px]">{active.capLabel}</p>
              <button
                type="button"
                onClick={() => setRun((count) => count + 1)}
                className="mt-auto self-start border border-[#0A0A0A] px-2 py-1 text-[12px] hover:bg-[#0A0A0A] hover:text-white"
              >
                [Replay failure -&gt;]
              </button>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
