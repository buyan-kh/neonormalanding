"use client";

import { useState } from "react";
import { RewardChart } from "@/components/RewardChart";
import { TaskExplorer } from "@/components/TaskExplorer";
import { benchmarkModels, benchmarkTasks, isMeasured, referenceColor, type RewardIndex } from "@/lib/catalog";
import { traceFor } from "@/lib/traces";

const reference = Number(benchmarkTasks[0]?.reference ?? 1);

function meanReward(rewardIndex: RewardIndex) {
  const total = benchmarkTasks.reduce((sum, task) => sum + Number(task.frontier[rewardIndex]), 0);
  return total / benchmarkTasks.length;
}

function formatReward(value: number) {
  return value.toFixed(4);
}

function formatShare(value: number) {
  return `${((value / reference) * 100).toFixed(1)}%`;
}

function ModelSwatch({ color, onDark = false }: { color: string; onDark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mr-2 inline-block size-[9px] shrink-0 align-baseline ${onDark ? "ring-1 ring-white" : ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

export function Evaluation() {
  const measured = benchmarkModels.filter(isMeasured);
  const ranked = measured
    .map((model) => {
      const mean = meanReward(model.rewardIndex);
      return { ...model, mean, gap: reference - mean };
    })
    .sort((a, b) => b.mean - a.mean);
  const best = ranked[0];
  const [taskId, setTaskId] = useState("neonorma/mrd-duplex");
  const [modelId, setModelId] = useState("sol");
  const [checkId, setCheckId] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(() => new Set());

  function openMiss(nextTask: string, nextModel: string, scroll = true) {
    setTaskId(nextTask);
    setModelId(nextModel);
    setCheckId(null);
    if (scroll) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("failure-trace")?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }
  }

  const stats = best
    ? [
        {
          label: "Highest estimate",
          value: formatShare(best.mean),
          note: `${best.name} · ${formatReward(best.mean)} reward`,
          color: best.color,
        },
        {
          label: "Known-correct answer",
          value: formatReward(reference),
          note: "Baseline on every task",
          color: referenceColor,
        },
        {
          label: "Gap",
          value: formatReward(best.gap),
          note: "Reward the best model leaves behind",
        },
      ]
    : [];

  return (
    <>
      <section id="calibration" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
        <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
          <p className="text-[13px] tracking-[0.18em] text-[#525252]">02 // BENCHMARKS</p>
          <h2 className="mt-4 max-w-[30em] text-[24px] leading-[1.15] md:text-[28px]">
            {best ? `The highest estimated score reaches ${formatShare(best.mean)} of the reference.` : "Benchmarks"}
          </h2>
          <p className="mt-3 max-w-[85ch] text-[13px] leading-relaxed text-[#5A5852]">
            {best
              ? `${best.name} has an estimated average reward of ${formatReward(best.mean)} across four mock tasks. The reference answer scores 1.0000.`
              : "No models have been measured yet."}
          </p>

          {stats.length > 0 ? (
            <dl className="mt-5 grid border border-[#0A0A0A]/10 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`px-3 py-3 ${index < stats.length - 1 ? "border-b border-[#0A0A0A]/20 sm:border-r sm:border-b-0" : ""}`}
                >
                  <dt className="text-[13px] tracking-[0.14em] text-[#5A5852]">{stat.label}</dt>
                  <dd className="mt-2 text-[22px] leading-none tabular-nums">{stat.value}</dd>
                  <dd className="mt-2 text-[13px] text-[#5A5852]">
                    {stat.color ? <ModelSwatch color={stat.color} /> : null}
                    {stat.note}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-4">
            <RewardChart taskId={taskId} modelId={modelId} onPick={(task, model) => openMiss(task, model, false)} />
          </div>
          <p className="mt-3 max-w-[72ch] text-[13px] leading-relaxed text-[#5A5852]">
            Scores across four tasks. Click a point to explore the task.
          </p>

          <div className="mt-6 border border-[#0A0A0A]/10">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#0A0A0A]/10 px-4 py-3">
              <h3 className="text-[15px] font-medium">Reward by task examples</h3>
              <p className="text-[13px] text-[#5A5852]">1.0000 is the reference</p>
            </div>
            <div className="grid md:grid-cols-2">
              {benchmarkTasks.map((task, taskIndex) => {
                const trace = traceFor(task.id);
                const expanded = expandedTasks.has(task.id);
                const models = [...measured].sort((a, b) => Number(task.frontier[b.rewardIndex]) - Number(task.frontier[a.rewardIndex]));
                return (
                  <section key={task.id} aria-label={trace.title} className={`p-4 ${taskIndex < 2 ? "border-b border-[#0A0A0A]/10" : ""} ${taskIndex % 2 === 0 ? "md:border-r md:border-[#0A0A0A]/10" : ""} ${taskIndex === 2 ? "border-b border-[#0A0A0A]/10 md:border-b-0" : ""}`}>
                    <div className="mb-4 flex items-baseline justify-between gap-3">
                      <h4 className="text-[14px] font-medium">{trace.title}</h4>
                      <span className="shrink-0 text-[12px] text-[#5A5852]">Reward</span>
                    </div>
                    <div className="space-y-1">
                      {(expanded ? models : models.slice(0, 3)).map((model) => {
                        const score = Number(task.frontier[model.rewardIndex]);
                        return (
                          <div
                            key={model.id}
                            className="grid w-full grid-cols-[110px_minmax(0,1fr)_50px] items-center gap-2 px-2 py-1 text-left text-[12px] sm:grid-cols-[135px_minmax(0,1fr)_52px]"
                          >
                            <span className="truncate">{model.name}</span>
                            <span className="h-2 overflow-hidden rounded-full bg-[#0A0A0A]/[0.06]" aria-hidden="true">
                              <span className="block h-full rounded-full" style={{ width: `${Math.max(0, Math.min(1, score / reference)) * 100}%`, backgroundColor: model.color }} />
                            </span>
                            <span className="text-right tabular-nums text-[#5A5852]">{formatReward(score)}</span>
                          </div>
                        );
                      })}
                    </div>
                    {models.length > 3 ? (
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setExpandedTasks((current) => {
                          const next = new Set(current);
                          if (next.has(task.id)) next.delete(task.id);
                          else next.add(task.id);
                          return next;
                        })}
                        className="mt-3 px-2 text-[12px] text-[#5A5852] underline decoration-[#0A0A0A]/30 underline-offset-4 hover:text-[#0A0A0A]"
                      >
                        {expanded ? "Show less" : `Show ${models.length - 3} more`}
                      </button>
                    ) : null}
                  </section>
                );
              })}
            </div>
          </div>
          <p className="mt-3 max-w-[72ch] text-[13px] leading-relaxed text-[#5A5852]">
          Means use the measured runs only. Reward is the deterministic grader, not an LLM judge. {" "}
          </p>
        </div>
      </section>

      <section id="failure-trace" className="scroll-mt-32 border-t border-[#0A0A0A]/20" aria-labelledby="trace-heading">
        <div className="mx-auto w-full max-w-[1080px] px-4 py-6 md:px-6">
          <p className="text-[13px] tracking-[0.18em] text-[#525252]">THE MISS</p>
          <h2 id="trace-heading" className="mt-2 max-w-[30em] text-[24px] leading-[1.15] md:text-[28px]">
            Models print success. The biology fails.
          </h2>
          <p className="mt-3 max-w-[58ch] text-[13px] leading-relaxed text-[#5A5852]">
            Explore a simulated Harbor v1.2 run: inspect the task files, run the weighted checks, and trace a result back to the submitted output.
          </p>
          <div id="trace" className="mt-4 scroll-mt-32">
            <TaskExplorer
              key={`${taskId}:${modelId}`}
              taskId={taskId}
              modelId={modelId}
              checkId={checkId}
              onTask={(id) => {
                setTaskId(id);
                setCheckId(null);
              }}
              onModel={setModelId}
              onCheck={setCheckId}
            />
          </div>
        </div>
      </section>
    </>
  );
}
