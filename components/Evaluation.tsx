"use client";

import { useState } from "react";
import { RewardChart } from "@/components/RewardChart";
import { TaskExplorer } from "@/components/TaskExplorer";
import { benchmarkModels, benchmarkTasks, isMeasured, referenceColor } from "@/lib/catalog";
import { failedCheckCount, totalChecks, traceFor } from "@/lib/traces";

const reference = Number(benchmarkTasks[0]?.reference ?? 1);
const checks = totalChecks();

function meanReward(rewardIndex: 0 | 1) {
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
  const unmeasured = benchmarkModels.filter((model) => !isMeasured(model));
  const ranked = measured
    .map((model) => {
      const mean = meanReward(model.rewardIndex);
      return { ...model, mean, gap: reference - mean, failed: failedCheckCount(model.id) };
    })
    .sort((a, b) => b.mean - a.mean);
  const best = ranked[0];
  const [taskId, setTaskId] = useState(benchmarkTasks[0].id);
  const [modelId, setModelId] = useState(best?.id ?? benchmarkModels[0].id);
  const [checkId, setCheckId] = useState<string | null>(null);

  function openMiss(nextTask: string, nextModel: string) {
    setTaskId(nextTask);
    setModelId(nextModel);
    setCheckId(null);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("failure-trace")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  }

  const stats = best
    ? [
        {
          label: "Best model",
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
        <div className="mx-auto w-full max-w-[1240px] px-4 py-20 md:px-6">
          <p className="text-[11px] tracking-[0.18em] text-[#525252]">02 // BENCHMARKS</p>
          <h2 className="mt-4 max-w-[16em] text-[28px] leading-[1.15] md:text-[40px]">
            {best ? `The best model reaches ${formatShare(best.mean)} of the correct answer.` : "Benchmarks"}
          </h2>
          <p className="mt-6 max-w-[62ch] text-[13px] leading-relaxed text-[#5A5852]">
            {best
              ? `${best.name} averages ${formatReward(best.mean)} across four held-out tasks. The grader's own solution scores 1.0000. Click a point to open the miss.`
              : "No models have been measured yet."}
          </p>

          {stats.length > 0 ? (
            <dl className="mt-10 grid border border-[#0A0A0A] sm:grid-cols-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`px-3 py-3 ${index < stats.length - 1 ? "border-b border-[#0A0A0A]/20 sm:border-r sm:border-b-0" : ""}`}
                >
                  <dt className="text-[10px] tracking-[0.14em] text-[#5A5852]">{stat.label}</dt>
                  <dd className="mt-2 text-[28px] leading-none tabular-nums">{stat.value}</dd>
                  <dd className="mt-2 text-[11px] text-[#5A5852]">
                    {stat.color ? <ModelSwatch color={stat.color} /> : null}
                    {stat.note}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-4">
            <RewardChart taskId={taskId} modelId={modelId} onPick={openMiss} />
          </div>
          <p className="mt-3 max-w-[72ch] text-[11px] leading-relaxed text-[#5A5852]">
            Each mark is one model on one task. The line at 1.00 is the known-correct answer, and the upright line is how far the model fell short. By length, the horizontal axis is the size of the task in tokens.
          </p>

          <div className="mt-6 overflow-x-auto border border-[#0A0A0A]">
            <table className="w-full min-w-[520px] border-collapse text-left text-[12px]">
              <caption className="border-b border-[#0A0A0A] px-3 py-2 text-left text-[11px] text-[#0A0A0A]">
                Reward by task. Click a score to open that miss.
              </caption>
              <thead>
                <tr className="border-b border-[#0A0A0A]/20 text-[10px] tracking-[0.12em] text-[#5A5852]">
                  <th className="px-3 py-2 font-normal" scope="col">
                    Task
                  </th>
                  {measured.map((model) => (
                    <th key={model.id} className="px-3 py-2 font-normal" scope="col">
                      <ModelSwatch color={model.color} />
                      {model.name}
                    </th>
                  ))}
                  <th className="px-3 py-2 font-normal" scope="col">
                    Length
                  </th>
                </tr>
              </thead>
              <tbody>
                {benchmarkTasks.map((task) => {
                  const trace = traceFor(task.id);
                  return (
                    <tr key={task.id} className="border-b border-[#0A0A0A]/15">
                      <th className="px-3 py-2 text-left font-normal" scope="row">
                        <button
                          type="button"
                          onClick={() => openMiss(task.id, modelId)}
                          className={`text-left underline decoration-[#0A0A0A]/30 underline-offset-4 hover:decoration-[#0A0A0A] ${task.id === taskId ? "text-[#0A0A0A]" : "text-[#5A5852]"}`}
                        >
                          {trace.title}
                        </button>
                      </th>
                      {measured.map((model) => {
                        const score = Number(task.frontier[model.rewardIndex]);
                        const on = task.id === taskId && model.id === modelId;
                        return (
                          <td key={model.id} className="px-3 py-2">
                            <button
                              type="button"
                              aria-pressed={on}
                              onClick={() => openMiss(task.id, model.id)}
                              className={`block w-full max-w-[9rem] px-1 py-1 text-left ${on ? "bg-[#0A0A0A] text-white" : "hover:bg-[#0A0A0A]/5"}`}
                            >
                              <span className="tabular-nums">{formatReward(score)}</span>
                              <span className={`mt-1 block h-[6px] ${on ? "bg-white/20" : "bg-[#0A0A0A]/10"}`}>
                                <span
                                  className="block h-full"
                                  style={{ width: `${Math.max(0, Math.min(1, score / reference)) * 100}%`, backgroundColor: on ? "#ffffff" : model.color }}
                                />
                              </span>
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 tabular-nums text-[#5A5852]">{task.tokens}</td>
                    </tr>
                  );
                })}
                <tr>
                  <th className="px-3 py-2 text-left font-normal" scope="row">
                    Mean
                  </th>
                  {measured.map((model) => (
                    <td key={model.id} className="px-3 py-2 tabular-nums">
                      {formatReward(meanReward(model.rewardIndex))}
                    </td>
                  ))}
                  <td className="px-3 py-2" />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-[72ch] text-[11px] leading-relaxed text-[#5A5852]">
            {ranked.map((model) => `${model.name} fails ${model.failed} of ${checks} checks.`).join(" ")} A shared miss can still leave two different rewards, because the grader gives partial credit.
            {unmeasured.length > 0 ? ` Not measured yet: ${unmeasured.map((model) => model.name).join(", ")}.` : ""}
          </p>
        </div>
      </section>

      <section id="failure-trace" className="scroll-mt-32 border-t border-[#0A0A0A]/20" aria-labelledby="trace-heading">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-20 md:px-6">
          <p className="text-[11px] tracking-[0.18em] text-[#525252]">THE MISS</p>
          <h2 id="trace-heading" className="mt-4 max-w-[16em] text-[28px] leading-[1.15] md:text-[40px]">
            Models print success. The biology fails.
          </h2>
          <p className="mt-6 max-w-[58ch] text-[13px] leading-relaxed text-[#5A5852]">
            Click a failed check, or the sentence itself. The line the grader accepts sits beside it. Run the grader to watch the checks land.
          </p>
          <div id="trace" className="mt-12 scroll-mt-32">
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
