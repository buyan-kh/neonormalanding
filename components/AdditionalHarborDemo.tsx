"use client";

import { useEffect, useRef, useState } from "react";
import { isDemoModel, type DemoModelId } from "@/lib/harbor-demo";
import { scenarios, scenarioReward } from "@/lib/harbor-scenarios";

export function AdditionalHarborDemo({ taskId, modelId }: { taskId: string; modelId: string }) {
  const scenario = scenarios[taskId];
  const id: DemoModelId | null = isDemoModel(modelId) ? modelId : null;
  const [cursor, setCursor] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<"submission" | "trajectory">("submission");
  const timers = useRef<number[]>([]);
  const running = cursor !== null;
  useEffect(() => { const bucket = timers; return () => bucket.current.forEach((id) => window.clearTimeout(id)); }, []);
  if (!scenario) return <p className="text-[13px] text-[#666]">No example is available for this task.</p>;
  if (!id) return <p className="text-[13px] text-[#666]">Choose Sol, Astra, Opus, or the reference oracle above to view this example.</p>;
  const outcomes = scenario.outcomes[id];
  const check = scenario.checks[selected];
  const reward = scenarioReward(taskId, id, completed ? Infinity : cursor ?? -1);
  const output = Object.fromEntries(scenario.checks.map((item, index) => [item.field, outcomes[index] ? item.passValue : item.failValue]));
  const result = { reward: Number(scenarioReward(taskId, id).toFixed(4)), passed: outcomes.every(Boolean) ? 1 : 0, ...Object.fromEntries(scenario.checks.map((item, index) => [item.id, outcomes[index] ? 1 : 0])) };
  function run() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setCompleted(false);
    const first = outcomes.findIndex((passed) => !passed);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setSelected(first < 0 ? 0 : first); setCompleted(true); return; }
    setCursor(-1);
    scenario.checks.forEach((_, index) => { timers.current.push(window.setTimeout(() => { setCursor(index); setSelected(index); }, index * 300)); });
    timers.current.push(window.setTimeout(() => { setCursor(null); setCompleted(true); setSelected(first < 0 ? 0 : first); }, scenario.checks.length * 300));
  }
  return <>
    <div className="border border-[#D0D0D0] bg-[#F6F6F6]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDD] px-4 py-3"><div><p className="text-[13px] font-medium">Harbor v1.2 <span className="font-normal text-[#737373]">· illustrative example run</span></p><p className="mt-1 font-mono text-[11px] text-[#666]">schema_version = &quot;1.2&quot; · network_mode = &quot;no-network&quot;</p></div><button type="button" onClick={run} disabled={running} className="rounded-sm bg-[#D9D9D9] px-3 py-2 text-[13px] hover:bg-[#C9C9C9] disabled:opacity-50">{running ? "Running…" : completed ? "Run again" : "Run grader"}</button></div>
      <div className="flex flex-wrap justify-between gap-2 px-4 py-3 text-[12px]" aria-live="polite"><span className="text-[#666]">{running ? "Running verifier checks…" : completed ? "Example run complete · exit_code: 0" : "Ready · simulated output"}</span><span className="font-mono tabular-nums">reward {reward.toFixed(4)}</span></div>
    </div>
    <div><div className="mb-2 flex justify-between gap-2 text-[13px]"><span className="font-medium">Verifier checks</span><span className="text-[#737373]">Weight · contribution</span></div><div className="border-t border-[#DDD]">{scenario.checks.map((item,index) => { const visible = completed || (cursor !== null && index <= cursor); return <button key={item.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-[#E5E5E5] px-2 py-2 text-left text-[12px] ${selected === index ? "bg-[#F2F2F2]" : "hover:bg-[#F8F8F8]"}`}><span><span className="block font-mono text-[11px] text-[#666]">{item.id}</span>{item.label}</span><span className="font-mono tabular-nums"><span className="text-[#777]">{item.weight.toFixed(2)} · </span>{visible ? `${outcomes[index] ? "PASS" : "FAIL"} +${(outcomes[index] ? item.weight : 0).toFixed(2)}` : "—"}</span></button>; })}</div></div>
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="min-w-0 overflow-hidden border border-[#D0D0D0]"><div role="tablist" aria-label="Example output files" className="flex flex-wrap border-b border-[#DDD] bg-[#F6F6F6]"><button type="button" role="tab" aria-selected={tab === "submission"} onClick={() => setTab("submission")} className={`px-3 py-2 font-mono text-[11px] ${tab === "submission" ? "bg-white" : "text-[#777]"}`}>/workspace/output/submission.json</button><button type="button" role="tab" aria-selected={tab === "trajectory"} onClick={() => setTab("trajectory")} className={`px-3 py-2 font-mono text-[11px] ${tab === "trajectory" ? "bg-white" : "text-[#777]"}`}>/logs/agent/trajectory.json</button></div><div className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed">{tab === "submission" ? <><div>{"{"}</div>{scenario.checks.map((item,index) => <button key={item.id} type="button" onClick={() => setSelected(index)} className={`block whitespace-pre text-left underline decoration-[#AAA] underline-offset-2 ${index === selected ? "bg-[#E4E4E4]" : ""}`}>{`  ${JSON.stringify(item.field)}: ${JSON.stringify(output[item.field])}${index < scenario.checks.length - 1 ? "," : ""}`}</button>)}<div>{"}"}</div></> : <p>{scenario.checks.map((item,index) => <span key={item.id}>{index ? " " : ""}<button type="button" onClick={() => setSelected(index)} className={`inline text-left underline decoration-[#AAA] underline-offset-2 ${index === selected ? "bg-[#E4E4E4]" : ""}`}>{outcomes[index] ? item.expected : item.miss}</button></span>)}</p>}</div></div>
      <div className="min-w-0 overflow-hidden border border-[#D0D0D0]"><div className="border-b border-[#DDD] bg-[#F6F6F6] px-3 py-2 font-mono text-[11px]">/logs/verifier/reward.json</div><div className="p-3"><pre className="overflow-x-auto font-mono text-[11px] leading-relaxed">{completed ? JSON.stringify(result,null,2) : "Run the example to see verifier output."}</pre><div className="mt-3 border-t border-[#DDD] pt-3 text-[12px] leading-relaxed"><p className="font-medium">Grader diagnostic · {check.label}</p><p className="mt-1 text-[#666]">Expected: {check.expected}</p>{completed && <p className="mt-1">{outcomes[selected] ? "PASS · Requirement satisfied." : `FAIL · ${check.miss}`}</p>}</div></div></div>
    </div>
    <p className="text-[12px] leading-relaxed text-[#666]">Illustrative scenario, files, checks, and outputs; these are not recorded runs or validated clinical results. Reward is the sum of passed check weights.</p>
  </>;
}
