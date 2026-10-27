"use client";

import { useEffect, useRef, useState } from "react";
import { benchmarkModels, benchmarkTasks, isMeasured, referenceColor } from "@/lib/catalog";
import { modelFailed, traceFor, type TraceSpan } from "@/lib/traces";

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
  if (span.checkId === activeId) return "bg-[#E4E4E4] text-[#303030]";
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
  const [hasRun, setHasRun] = useState(false);
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
    if (!measuredModel || !spans) return;
    setHasRun(true);
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
    <div className="grid gap-4 md:grid-cols-[210px_minmax(0,1fr)] md:gap-6">
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
                  <span className="text-[13px] tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-[13px] leading-snug">{itemTrace.title}</span>
                </span>
                <span className="text-[13px] tabular-nums">{itemReward === null ? "—" : itemReward.toFixed(2)}</span>
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
                className={`inline-flex items-center border px-2 py-1 text-[13px] ${
                  on ? "border-[#C5C5C5] bg-[#E4E4E4] text-[#303030]" : "border-[#0A0A0A]/25 text-[#0A0A0A] hover:border-[#0A0A0A]"
                }`}
              >
                <Swatch color={item.color} onDark={on} />
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 p-4 md:p-5">
          <div>
            <p className="text-[13px] tracking-[0.16em] text-[#5A5852]">TASK</p>
            <h3 className="mt-3 text-[20px] leading-snug">{trace.title}</h3>
            <p className="mt-2 text-[13px] text-[#5A5852]">{task.name}</p>
            <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed">{trace.brief}</p>
            <p className="mt-3 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">{trace.records}</p>
            <p className="mt-4 text-[13px] tabular-nums text-[#5A5852]">~{task.reasoningTokens[model.rewardIndex].toLocaleString("en-US")} tokens{model.rewardIndex > 0 ? " (estimate)" : ""}</p>
          </div>

          <div className="overflow-hidden border border-[#D0D0D0] bg-[#F6F6F6]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DEDEDE] px-4 py-3">
              <div>
                <p className="text-[13px] font-medium text-[#303030]">Harbor v1.2 <span className="ml-1 font-normal text-[#737373]">· mock run</span></p>
                <p className="mt-1 text-[12px] text-[#737373]">Example grader output for {model.name}</p>
              </div>
              <button
                type="button"
                onClick={run}
                disabled={running || !spans}
                className="rounded-sm bg-[#D9D9D9] px-3 py-2 text-[13px] text-[#303030] hover:bg-[#C9C9C9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {running ? "Running…" : hasRun ? "Run again" : "Run mock grader"}
              </button>
            </div>
            <div className="space-y-1.5 px-4 py-3 font-mono text-[12px] leading-relaxed text-[#505050]" aria-live="polite">
              <p><span className="text-[#858585]">task</span> &nbsp; {task.id}</p>
              <p><span className="text-[#858585]">model</span> &nbsp;{model.name}</p>
              {!spans ? (
                <p className="pt-1 text-[#737373]">No example output for this model. Select Sol or Astra to run the demo.</p>
              ) : !hasRun ? (
                <p className="pt-1 text-[#737373]">Ready to run example checks.</p>
              ) : (
                <>
                  {trace.checks.map((check, index) => (revealed(index) ? (
                    <p key={check.id} className="flex gap-2"><span className={modelFailed(check, model.id) ? "text-[#555555]" : "text-[#777777]"}>[{modelFailed(check, model.id) ? "FAIL" : "PASS"}]</span><span>{check.label}</span></p>
                  ) : null))}
                  {running ? <p className="pt-1 text-[#737373]">Running checks…</p> : <p className="border-t border-[#DEDEDE] pt-2 tabular-nums">reward: {reward?.toFixed(4)} &nbsp;·&nbsp; {trace.checks.length - failedCount}/{trace.checks.length} checks passed</p>}
                </>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="text-[13px] tracking-[0.16em] text-[#5A5852]">CHECKS</p>
              <p className="text-[13px] tabular-nums text-[#5A5852]" aria-live="polite">
                {running && cursor !== null && cursor >= 0
                  ? `Check ${cursor + 1} of ${trace.checks.length}`
                  : spans
                    ? `${failedCount} of ${trace.checks.length} failed`
                    : "Check results unavailable"}
              </p>
            </div>
            <div className="mt-3 border-t border-[#0A0A0A]/20">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-[#0A0A0A]/20 py-2 text-[13px] tracking-normal text-[#5A5852]">
                <p>Check</p>
                <p className="text-right"><Swatch color={model.color} />{model.name}</p>
              </div>
              {trace.checks.map((check, index) => (
                <div
                  key={check.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-[#0A0A0A]/20 py-2"
                >
                  <p className="text-[13px] leading-snug">{check.label}</p>
                  {(() => {
                    const fail = modelFailed(check, model.id);
                    const show = revealed(index);
                    return (
                      <span
                        className={`w-fit justify-self-end px-2 py-1 text-[13px] ${fail ? "text-[#0A0A0A]" : "text-[#5A5852]"}`}
                      >
                        {spans ? (show ? (fail ? "FAIL" : "PASS") : "···") : "—"}
                      </span>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="overflow-hidden border border-[#D0D0D0]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DEDEDE] bg-[#F6F6F6] px-4 py-2">
                <p className="font-mono text-[12px] text-[#505050]">model_response.txt</p>
                <p className="flex items-center text-[12px] text-[#737373]"><Swatch color={model.color} />{model.name} · example</p>
              </div>
              <div className="p-4">
              {reward === null || !spans ? (
                <p className="mt-4 text-[13px] leading-relaxed text-[#5A5852]">
                  A graded answer is not available for this model. Switch to GPT-6.1 Sol or GPT-6 Astra to read one.
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
                  <p className="mt-4 text-[13px] tabular-nums text-[#5A5852]">{reward.toFixed(4)} reward</p>
                </>
              )}
              </div>
            </div>

            <div className="overflow-hidden border border-[#D0D0D0]">
              <div className="flex items-center justify-between gap-2 border-b border-[#DEDEDE] bg-[#F6F6F6] px-4 py-2">
                <p className="font-mono text-[12px] text-[#505050]">grader_feedback.txt</p>
                <span className="text-[12px] text-[#737373]">example</span>
              </div>
              <div className="space-y-3 p-4 text-[13px] leading-relaxed">
              <p><span className="font-mono text-[12px] text-[#737373]">check: </span>{active.label}</p>
              <p><span className="font-mono text-[12px] text-[#737373]">expected: </span>{active.correct}</p>
              {spans ? (
                <p className="border-t border-[#DEDEDE] pt-3 text-[#5A5852]">
                  <span className="font-mono text-[12px] text-[#737373]">result: </span>{activeFailed ? <>FAIL · {active.miss}</> : "PASS · The model met this requirement."}
                </p>
              ) : (
                <p className="border-t border-[#DEDEDE] pt-3 text-[#5A5852]">
                  <Swatch color={referenceColor} />
                  Check results are not available for this model.
                </p>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
