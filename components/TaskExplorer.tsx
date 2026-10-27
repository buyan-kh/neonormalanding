"use client";

import { useEffect, useRef, useState } from "react";
import { benchmarkModels, benchmarkTasks, isMeasured, referenceColor } from "@/lib/catalog";
import { modelFailed, traceFor, type TraceSpan } from "@/lib/traces";

const measured = benchmarkModels.filter(isMeasured);

function Swatch({ color, onDark = false }: { color: string; onDark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mr-2 inline-block size-[9px] shrink-0 ${onDark ? "ring-1 ring-white" : ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

function spanClass(span: TraceSpan, activeId: string, failed: boolean) {
  if (!span.checkId) return "";
  if (span.checkId === activeId) return "bg-[#0A0A0A] text-white";
  if (failed) return "underline decoration-[#0A0A0A] decoration-2 underline-offset-[3px]";
  return "";
}

export function TaskExplorer({
  taskId,
  modelId,
  checkId,
  onTask,
  onModel,
  onCheck,
}: {
  taskId: string;
  modelId: string;
  checkId: string | null;
  onTask: (taskId: string) => void;
  onModel: (modelId: string) => void;
  onCheck: (checkId: string) => void;
}) {
  const task = benchmarkTasks.find((item) => item.id === taskId) ?? benchmarkTasks[0];
  const model = benchmarkModels.find((item) => item.id === modelId) ?? benchmarkModels[0];
  const trace = traceFor(task.id);
  const measuredModel = isMeasured(model);
  const reward = measuredModel ? Number(task.frontier[model.rewardIndex]) : null;
  const active =
    trace.checks.find((check) => check.id === checkId) ??
    trace.checks.find((check) => modelFailed(check, model.id)) ??
    trace.checks[0];
  const activeFailed = modelFailed(active, model.id);
  const spans = trace.answers[model.id];
  const failedCount = trace.checks.filter((check) => modelFailed(check, model.id)).length;
  const timers = useRef<number[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const running = cursor !== null;

  useEffect(() => {
    const bucket = timers;
    return () => {
      bucket.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function stop() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setCursor(null);
  }

  function run() {
    stop();
    if (!measuredModel) return;
    const order = trace.checks.map((check) => check.id);
    const land =
      order.find((id) => {
        const check = trace.checks.find((item) => item.id === id);
        return check ? modelFailed(check, model.id) : false;
      }) ?? order[order.length - 1];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onCheck(land);
      return;
    }
    setCursor(-1);
    order.forEach((id, index) => {
      const timer = window.setTimeout(() => {
        setCursor(index);
        onCheck(id);
        if (index === order.length - 1) {
          setCursor(null);
          onCheck(land);
        }
      }, 420 * (index + 1));
      timers.current.push(timer);
    });
  }

  function revealed(index: number) {
    return cursor === null || index <= cursor;
  }

  return (
    <div className="grid gap-8 md:grid-cols-[210px_minmax(0,1fr)] md:gap-12">
      <ol className="border-t border-[#0A0A0A]/20">
        {benchmarkTasks.map((item, index) => {
          const on = item.id === task.id;
          const itemTrace = traceFor(item.id);
          const itemReward = measuredModel ? Number(item.frontier[model.rewardIndex]) : null;
          return (
            <li key={item.id} className="border-b border-[#0A0A0A]/20">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onTask(item.id)}
                className={`flex w-full items-baseline justify-between gap-3 py-3 text-left ${on ? "text-[#0A0A0A]" : "text-[#5A5852] hover:text-[#0A0A0A]"}`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-[11px] tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-[13px] leading-snug">{itemTrace.title}</span>
                </span>
                <span className="text-[11px] tabular-nums">{itemReward === null ? "—" : itemReward.toFixed(2)}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="border border-[#0A0A0A]">
        <div className="flex flex-wrap gap-2 border-b border-[#0A0A0A]/20 p-3 md:p-4" role="group" aria-label="Models">
          {benchmarkModels.map((item) => {
            const on = item.id === model.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                onClick={() => onModel(item.id)}
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

        <div className="grid gap-8 p-4 md:p-8">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-[#5A5852]">TASK</p>
            <h3 className="mt-3 text-[20px] leading-snug">{trace.title}</h3>
            <p className="mt-2 text-[12px] text-[#5A5852]">{task.name}</p>
            <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed">{trace.brief}</p>
            <p className="mt-3 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">{trace.records}</p>
            <p className="mt-4 text-[12px] tabular-nums text-[#5A5852]">{task.tokens} tokens</p>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="text-[10px] tracking-[0.16em] text-[#5A5852]">CHECKS</p>
              <p className="text-[11px] tabular-nums text-[#5A5852]" aria-live="polite">
                {running && cursor !== null && cursor >= 0
                  ? `Check ${cursor + 1} of ${trace.checks.length}`
                  : measuredModel
                    ? `${failedCount} of ${trace.checks.length} failed`
                    : "Not measured yet"}
              </p>
            </div>
            <div className="mt-3 border-t border-[#0A0A0A]/20">
              <div className="hidden grid-cols-[minmax(0,1fr)_auto_auto] gap-2 border-b border-[#0A0A0A]/20 py-2 text-[10px] tracking-[0.12em] text-[#5A5852] md:grid">
                <p>Check</p>
                {measured.map((item) => (
                  <p key={item.id} className="min-w-[9.5rem] text-right">
                    <Swatch color={item.color} />
                    {item.name}
                  </p>
                ))}
              </div>
              {trace.checks.map((check, index) => (
                <div
                  key={check.id}
                  className="grid gap-2 border-b border-[#0A0A0A]/20 py-2 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center"
                >
                  <p className="text-[13px] leading-snug">{check.label}</p>
                  {measured.map((item) => {
                    const fail = modelFailed(check, item.id);
                    const on = model.id === item.id && active.id === check.id;
                    const show = revealed(index);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          stop();
                          onModel(item.id);
                          onCheck(check.id);
                        }}
                        className={`w-fit justify-self-end px-2 py-1 text-[12px] ${
                          on ? "bg-[#0A0A0A] text-white" : fail ? "text-[#0A0A0A] hover:bg-[#0A0A0A]/5" : "text-[#5A5852] hover:bg-[#0A0A0A]/5"
                        }`}
                      >
                        <span className="md:hidden">
                          <Swatch color={item.color} onDark={on} />
                          {item.name}{" "}
                        </span>
                        {show ? (fail ? "FAIL" : "PASS") : "···"}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="border border-[#0A0A0A] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.16em] text-[#5A5852]">MODEL ANSWER</p>
                  <p className="mt-2 flex items-center text-[13px]">
                    <Swatch color={model.color} />
                    {model.name}
                  </p>
                </div>
                {measuredModel ? (
                  <button
                    type="button"
                    onClick={run}
                    disabled={running}
                    className="bg-[#0A0A0A] px-3 py-2 text-[12px] text-white hover:bg-[#262626] disabled:opacity-60"
                  >
                    {running ? "[Running]" : "[Run grader]"}
                  </button>
                ) : null}
              </div>
              {reward === null || !spans ? (
                <p className="mt-4 text-[13px] leading-relaxed text-[#5A5852]">
                  Not measured yet. The checks above are what the grader scores. Switch to GPT-6.1 Sol or GPT-6 Astra to read a graded answer.
                </p>
              ) : (
                <>
                  <p className="mt-4 text-[13px] leading-relaxed">
                    {spans.map((span, index) => {
                      const check = span.checkId ? trace.checks.find((item) => item.id === span.checkId) : undefined;
                      const failed = check ? modelFailed(check, model.id) : false;
                      const text = span.text.trim();
                      return (
                        <span key={index}>
                          {index > 0 ? " " : null}
                          {span.checkId ? (
                            <button
                              type="button"
                              aria-pressed={span.checkId === active.id}
                              onClick={() => {
                                stop();
                                onCheck(span.checkId!);
                              }}
                              className={`inline text-left ${spanClass(span, active.id, failed)}`}
                            >
                              {text}
                            </button>
                          ) : (
                            text
                          )}
                        </span>
                      );
                    })}
                  </p>
                  <p className="mt-4 text-[12px] tabular-nums text-[#5A5852]">
                    {reward.toFixed(4)} reward · known-correct {Number(task.reference).toFixed(4)}
                  </p>
                </>
              )}
            </div>

            <div className="border border-[#0A0A0A] p-4">
              <p className="text-[10px] tracking-[0.16em] text-[#5A5852]">WHAT THE GRADER ACCEPTS</p>
              <p className="mt-3 text-[13px] leading-snug">{active.label}</p>
              <p className="mt-3 text-[13px] leading-relaxed">{active.correct}</p>
              {measuredModel ? (
                <p className="mt-4 border-t border-[#0A0A0A]/20 pt-4 text-[13px] leading-relaxed text-[#5A5852]">
                  {activeFailed ? active.miss : "This check passed."}
                </p>
              ) : (
                <p className="mt-4 border-t border-[#0A0A0A]/20 pt-4 text-[13px] leading-relaxed text-[#5A5852]">
                  <Swatch color={referenceColor} />
                  The known-correct answer passes every check.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
