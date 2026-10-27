"use client";

import { useState } from "react";
import { benchmarkModels, benchmarkTasks, referenceColor } from "@/lib/catalog";

const reference = Number(benchmarkTasks[0]?.reference ?? 1);

function Swatch({ color, onDark = false }: { color: string; onDark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mr-2 inline-block size-[9px] shrink-0 ${onDark ? "ring-1 ring-white" : ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

function RewardTrack({ value, color }: { value: number; color: string }) {
  const width = `${Math.max(0, Math.min(1, value / reference)) * 100}%`;
  return (
    <div className="relative mt-3 h-[9px] bg-[#0A0A0A]/[0.06]" aria-hidden="true">
      <div className="absolute inset-y-0 left-0" style={{ width, backgroundColor: color }} />
    </div>
  );
}

export function TraceInspector() {
  const [taskId, setTaskId] = useState(benchmarkTasks[0].id);
  const [modelId, setModelId] = useState(benchmarkModels[0].id);
  const task = benchmarkTasks.find((item) => item.id === taskId) ?? benchmarkTasks[0];
  const model = benchmarkModels.find((item) => item.id === modelId) ?? benchmarkModels[0];
  const measured = model.rewardIndex !== undefined;
  const reward = measured ? Number(task.frontier[model.rewardIndex]) : null;

  return (
    <section id="failure-trace" className="scroll-mt-32 border-t border-[#0A0A0A]/20" aria-labelledby="trace-heading">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-20 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#525252]">FAILURE TRACE</p>
        <h2 id="trace-heading" className="mt-4 max-w-[16em] text-[28px] leading-[1.15] md:text-[40px]">
          Models print success. The biology fails.
        </h2>
        <p className="mt-6 max-w-[46ch] text-[13px] leading-relaxed text-[#5A5852]">
          Open a task, then switch models. The grader scores the biology. The reference solver is the pass line at 1.0000.
        </p>

        <div id="trace" className="mt-12 grid scroll-mt-32 gap-8 md:grid-cols-[210px_minmax(0,1fr)] md:gap-12">
          <ol className="border-t border-[#0A0A0A]/20">
            {benchmarkTasks.map((item, index) => {
              const on = item.id === task.id;
              return (
                <li key={item.id} className="border-b border-[#0A0A0A]/20">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setTaskId(item.id)}
                    className={`flex w-full items-baseline gap-3 py-3 text-left ${on ? "text-[#0A0A0A]" : "text-[#5A5852] hover:text-[#0A0A0A]"}`}
                  >
                    <span className="text-[11px] tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-[13px] leading-snug">{item.short}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <article className="border border-[#0A0A0A]">
            <div className="flex flex-wrap gap-2 border-b border-[#0A0A0A]/20 p-3 md:p-4" role="group" aria-label="Models">
              {benchmarkModels.map((item) => {
                const on = item.id === model.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setModelId(item.id)}
                    className={`inline-flex items-center border px-2 py-1 text-[12px] ${
                      on ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#0A0A0A]/25 text-[#0A0A0A] hover:border-[#0A0A0A]"
                    }`}
                  >
                    <Swatch color={item.color} onDark={on} />
                    {item.name}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-10 p-4 md:grid-cols-2 md:p-8">
              <div>
                <p className="text-[10px] tracking-[0.16em] text-[#5A5852]">TASK</p>
                <h3 className="mt-4 text-[20px] leading-snug">{task.name}</h3>
                <p className="mt-5 text-[13px] leading-relaxed text-[#5A5852]">{task.records}</p>
                <p className="mt-6 text-[12px] tabular-nums text-[#5A5852]">{task.tokens} tokens</p>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.16em] text-[#5A5852]">GRADE</p>
                <p className="mt-4 flex items-center text-[15px]">
                  <Swatch color={model.color} />
                  {model.name}
                </p>
                {reward === null ? (
                  <p className="mt-4 text-[13px] text-[#5A5852]">Not measured yet</p>
                ) : (
                  <>
                    <RewardTrack value={reward} color={model.color} />
                    <p className="mt-3 text-[13px] tabular-nums">
                      {reward.toFixed(4)} <span className="text-[#5A5852]">FAIL</span>
                    </p>
                  </>
                )}

                <div className="mt-8 border-t border-[#0A0A0A]/20">
                  <div className="flex items-start justify-between gap-4 border-b border-[#0A0A0A]/20 py-4">
                    <div>
                      <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">WHERE IT BREAKS</p>
                      <p className="mt-2 text-[13px] leading-relaxed">{task.failure}</p>
                    </div>
                    {reward === null ? null : <p className="shrink-0 text-[11px] tracking-[0.12em]">FAIL</p>}
                  </div>
                  <div className="flex items-center justify-between gap-4 py-4">
                    <p className="flex items-center text-[13px]">
                      <Swatch color={referenceColor} />
                      Reference solver
                    </p>
                    <p className="shrink-0 text-[13px] tabular-nums">
                      {reference.toFixed(4)} <span className="text-[#5A5852]">PASS</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
