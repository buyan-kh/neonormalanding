"use client";

import { useEffect, useRef, useState } from "react";
import { benchmarkModels, benchmarkTasks } from "@/lib/catalog";
import { demoResult, demoReward, harborChecks, harborDemos, isDemoModel, mrdTaskId, type HarborCheckId } from "@/lib/harbor-demo";
import { traceFor } from "@/lib/traces";

const demoModels = ["sol", "astra", "opus", "oracle"] as const;
const fileList: Record<string, string[]> = {
  "neonorma/ctdna-chip": ["instruction.md", "docs/analysis.md", "data/segments.csv · 48 autosomal CBS segments", "data/snps.csv · 1,420 heterozygous SNPs", "data/variants.csv · 42 targeted duplex panel variants"],
  [mrdTaskId]: ["instruction.md", "data/duplex_families.csv", "data/wbc_control.csv", "data/oxog_panel.csv", "solution/solve.sh · reference solution"],
};
const sampleFamilies = `variant_id,gene,chrom_pos,change,ab_alt_reads,ba_alt_reads,total_duplex_depth\nV04,TP53,chr17:7577120,G>T,6,0,4800\nV09,DNMT3A,chr2:25457242,C>T,11,10,5100\nV14,KRAS,chr12:25398284,G>A,4,4,6200`;
const sampleWbc = `variant_id,wbc_alt_reads,wbc_total_depth\nV04,0,3900\nV09,18,4100\nV14,0,4400`;

function modelName(id: string) {
  return id === "oracle" ? "Reference Oracle" : benchmarkModels.find((model) => model.id === id)?.name ?? id;
}

function linkedCheck(line: string): HarborCheckId | null {
  if (line.includes("V04_TP53")) return "check_oxog_damage_filter";
  if (line.includes("V09_DNMT3A")) return "check_wbc_chip_subtraction";
  if (line.includes('"retained_tumor_variants"')) return "check_wbc_chip_subtraction";
  if (line.includes('"patient_status"')) return "check_schema_and_join";
  return null;
}

export function TaskExplorer({ taskId, modelId, checkId, onTask, onModel, onCheck }: {
  taskId: string; modelId: string; checkId: string | null;
  onTask: (taskId: string) => void; onModel: (modelId: string) => void; onCheck: (checkId: string) => void;
}) {
  const task = benchmarkTasks.find((item) => item.id === taskId) ?? benchmarkTasks[0];
  const trace = traceFor(task.id);
  const model = benchmarkModels.find((item) => item.id === modelId);
  const demo = task.id === mrdTaskId && isDemoModel(modelId) ? harborDemos[modelId] : null;
  const [cursor, setCursor] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [tab, setTab] = useState<"submission" | "trajectory">("submission");
  const timers = useRef<number[]>([]);
  const running = cursor !== null;
  const active = harborChecks.find((check) => check.id === checkId) ?? harborChecks.find((check) => demo && demo.checks[check.id] === 0) ?? harborChecks[0];

  useEffect(() => {
    const bucket = timers;
    return () => bucket.current.forEach((id) => window.clearTimeout(id));
  }, []);

  function run() {
    if (!demo || !isDemoModel(modelId)) return;
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setCompleted(false);
    const firstFailed = harborChecks.find((check) => demo?.checks[check.id] === 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onCheck((firstFailed ?? harborChecks[0]).id);
      setCompleted(true);
      return;
    }
    setCursor(-1);
    harborChecks.forEach((check, index) => {
      const timer = window.setTimeout(() => {
        setCursor(index);
        onCheck(check.id);
      }, 300 * index);
      timers.current.push(timer);
    });
    timers.current.push(window.setTimeout(() => {
      setCursor(null);
      setCompleted(true);
      onCheck((firstFailed ?? harborChecks[0]).id);
    }, 300 * harborChecks.length));
  }

  const currentReward = demo && isDemoModel(modelId) ? demoReward(modelId, completed ? harborChecks.length - 1 : cursor ?? -1) : 0;
  const result = demo && isDemoModel(modelId) ? demoResult(modelId) : null;
  const tokenCount = model ? task.reasoningTokens[model.rewardIndex] : null;
  const output = demo ? JSON.stringify(demo.submission, null, 2).split("\n") : [];

  return (
    <div className="grid gap-4 md:grid-cols-[210px_minmax(0,1fr)] md:gap-6">
      <ol className="border-t border-[#0A0A0A]/20">
        {benchmarkTasks.map((item, index) => {
          const reward = modelId === "oracle" ? 1 : model ? Number(item.frontier[model.rewardIndex]) : null;
          return <li key={item.id} className="border-b border-[#0A0A0A]/20"><button type="button" aria-pressed={item.id === task.id} onClick={() => onTask(item.id)} className={`flex w-full items-baseline justify-between gap-2 py-3 text-left text-[13px] ${item.id === task.id ? "text-[#0A0A0A]" : "text-[#666] hover:text-black"}`}><span className="flex gap-2"><span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span><span>{traceFor(item.id).title}</span></span><span className="shrink-0 tabular-nums">{reward === null ? "—" : reward.toFixed(2)}</span></button></li>;
        })}
      </ol>
      <div className="min-w-0 border border-[#0A0A0A]/30">
        <div className="flex flex-wrap gap-2 border-b border-[#0A0A0A]/15 p-3" role="group" aria-label="Example models">
          {demoModels.map((id) => <button key={id} type="button" aria-pressed={modelId === id} onClick={() => onModel(id)} className={`border px-2 py-1 text-[13px] ${modelId === id ? "border-[#C5C5C5] bg-[#E4E4E4] text-[#303030]" : "border-[#0A0A0A]/25 hover:border-[#0A0A0A]"}`}>{modelName(id)}{id === "oracle" ? " (1.00)" : ""}</button>)}
          {!isDemoModel(modelId) && <span className="self-center text-[12px] text-[#666]">No artifact example for {modelName(modelId)}; select a model above.</span>}
        </div>
        <div className="grid gap-5 p-4 md:p-5">
          <div>
            <p className="text-[12px] text-[#737373]">{task.id}</p>
            <h3 className="mt-1 text-[20px] leading-snug">{trace.title}</h3>
            <p className="mt-2 max-w-[75ch] text-[13px] leading-relaxed">{task.id === mrdTaskId ? "A stage III colorectal cancer patient’s post-surgery plasma was sequenced with duplex UMI adapters. Use the duplex families, paired WBC control, and oxidative damage panel to classify variants and write /workspace/output/submission.json with MRD status, estimated ctDNA VAF, and a classification for each variant." : trace.brief}</p>
            <p className="mt-2 max-w-[75ch] text-[13px] leading-relaxed text-[#666]">{trace.records}</p>
            {tokenCount !== null && <p className="mt-2 text-[12px] tabular-nums text-[#666]">~{tokenCount.toLocaleString("en-US")} reasoning tokens{model && model.rewardIndex > 0 ? " (estimate)" : ""}</p>}
          </div>
          <details className="border border-[#D8D8D8] text-[13px]">
            <summary className="cursor-pointer px-3 py-2 text-[#404040] hover:bg-[#F4F4F4]">Inspect /workspace/ files &amp; task.toml</summary>
            <div className="space-y-3 border-t border-[#E3E3E3] p-3">
              {fileList[task.id] ? <><p className="font-mono text-[12px] text-[#666]">/workspace/</p><ul className="space-y-1 font-mono text-[12px]">{fileList[task.id].map((file) => <li key={file}>{file}</li>)}</ul></> : <p>Workspace details are not available for this example.</p>}
              <p className="text-[12px] text-[#666]">task.toml configuration excerpt (illustrative; the full file was not supplied)</p>
              <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed">{'schema_version = "1.2"\nnetwork_mode = "no-network"'}</pre>
              {task.id === mrdTaskId && <><p className="font-mono text-[12px]">instruction.md · prompt summary</p><p className="text-[12px] leading-relaxed">Analyze the post-surgery duplex plasma sample alongside the paired WBC control and oxidative damage panel. Write <code>/workspace/output/submission.json</code> with MRD status, ctDNA VAF, and a classification for each variant: <code>tumor_mrd</code>, <code>oxog_artifact</code>, <code>chip_hematopoietic</code>, or <code>germline</code>.</p><p className="text-[12px] text-[#666]">Safe sample rows</p><div className="overflow-x-auto"><p className="font-mono text-[12px]">data/duplex_families.csv</p><pre className="mt-1 text-[11px] leading-relaxed">{sampleFamilies}</pre></div><div className="overflow-x-auto"><p className="font-mono text-[12px]">data/wbc_control.csv</p><pre className="mt-1 text-[11px] leading-relaxed">{sampleWbc}</pre></div><p className="text-[12px] text-[#666]">The oxidative calibration panel is an input; sample rows were not provided.</p></>}
            </div>
          </details>
          {task.id !== mrdTaskId ? <div className="border border-[#DDD] bg-[#F7F7F7] p-4 text-[13px] text-[#666]">A Harbor artifact walkthrough is available for <button type="button" onClick={() => onTask(mrdTaskId)} className="text-[#222] underline underline-offset-2">Blood test for leftover cancer</button>. The current task’s grader artifacts and checks have not yet been supplied.</div> : !demo ? <div className="border border-[#DDD] bg-[#F7F7F7] p-4 text-[13px] text-[#666]">Choose Sol, Astra, Opus, or the reference oracle above to view this example.</div> : <>
            <div className="border border-[#D0D0D0] bg-[#F6F6F6]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDD] px-4 py-3">
                <div><p className="text-[13px] font-medium">Harbor v1.2 <span className="font-normal text-[#737373]">· example run</span></p><p className="mt-1 font-mono text-[11px] text-[#666]">schema_version = &quot;1.2&quot; · network_mode = &quot;no-network&quot;</p></div>
                <button type="button" onClick={run} disabled={running} className="rounded-sm bg-[#D9D9D9] px-3 py-2 text-[13px] hover:bg-[#C9C9C9] disabled:opacity-50">{running ? "Running…" : completed ? "Run again" : "Run grader"}</button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[12px]" aria-live="polite"><span className="text-[#666]">{running ? "Running verifier checks…" : completed ? "Example run complete · exit_code: 0" : "Ready · simulated output"}</span><span className="font-mono tabular-nums">reward {currentReward.toFixed(4)}</span></div>
            </div>
            <div>
              <div className="mb-2 flex justify-between gap-2 text-[13px]"><span className="font-medium">Verifier checks</span><span className="text-[#737373]">Weight · contribution</span></div>
              <div className="border-t border-[#DDD]">
                {harborChecks.map((check, index) => {
                  const visible = completed || (cursor !== null && index <= cursor);
                  const passed = demo.checks[check.id] === 1;
                  return <button key={check.id} type="button" onClick={() => onCheck(check.id)} aria-pressed={active.id === check.id} className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-[#E5E5E5] px-2 py-2 text-left text-[12px] ${active.id === check.id ? "bg-[#F2F2F2]" : "hover:bg-[#F8F8F8]"}`}><span><span className="block font-mono text-[11px] text-[#666]">{check.id}</span><span>{check.label}</span></span><span className="text-right font-mono tabular-nums"><span className="text-[#777]">{check.weight.toFixed(2)} · </span>{visible ? `${passed ? "PASS" : "FAIL"} +${(passed ? check.weight : 0).toFixed(2)}` : "—"}</span></button>;
                })}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 overflow-hidden border border-[#D0D0D0]">
                <div className="flex flex-wrap border-b border-[#DDD] bg-[#F6F6F6]" role="tablist" aria-label="Example output files">
                  <button type="button" role="tab" aria-selected={tab === "submission"} onClick={() => setTab("submission")} className={`px-3 py-2 font-mono text-[11px] ${tab === "submission" ? "bg-white text-black" : "text-[#777]"}`}>/workspace/output/submission.json</button>
                  <button type="button" role="tab" aria-selected={tab === "trajectory"} onClick={() => setTab("trajectory")} className={`px-3 py-2 font-mono text-[11px] ${tab === "trajectory" ? "bg-white text-black" : "text-[#777]"}`}>/logs/agent/trajectory.json</button>
                </div>
                <div className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed">
                  {tab === "submission" ? <div aria-label="Example submission JSON">{output.map((line, index) => { const id = linkedCheck(line); const selected = id === active.id || (line.includes("V04_TP53") && active.id === "check_duplex_strand_consensus"); return id ? <button key={index} type="button" onClick={() => onCheck(id)} className={`block whitespace-pre text-left underline decoration-[#AAA] underline-offset-2 ${selected ? "bg-[#E4E4E4]" : ""}`}>{line}</button> : <div key={index} className="whitespace-pre">{line || " "}</div>; })}</div> : <p aria-label="Example trajectory summary">{harborChecks.map((check, index) => <span key={check.id}>{index > 0 ? " " : ""}<button type="button" onClick={() => onCheck(check.id)} className={`inline text-left underline decoration-[#AAA] underline-offset-2 ${active.id === check.id ? "bg-[#E4E4E4]" : ""}`}>{demo.trajectory[check.id]}</button></span>)}</p>}
                </div>
              </div>
              <div className="min-w-0 overflow-hidden border border-[#D0D0D0]">
                <div className="border-b border-[#DDD] bg-[#F6F6F6] px-3 py-2 font-mono text-[11px]">/logs/verifier/reward.json</div>
                <div className="p-3"><pre className="overflow-x-auto font-mono text-[11px] leading-relaxed">{completed && result ? JSON.stringify(result, null, 2) : "Run the example to see verifier output."}</pre><div className="mt-3 border-t border-[#DDD] pt-3 text-[12px] leading-relaxed"><p className="font-medium">Grader diagnostic · {active.label}</p><p className="mt-1 text-[#666]">Expected: {active.expected}</p>{completed && <p className="mt-1">{demo.checks[active.id] ? "PASS · Requirement satisfied." : `FAIL · ${active.diagnostic}`}</p>}</div></div>
              </div>
            </div>
            <p className="text-[12px] leading-relaxed text-[#666]">Example artifacts and checks are simulated. Reward is the sum of passed check weights; <code>passed: 1</code> requires all critical biological checks to pass. A successful process and positive MRD call alone do not verify the analysis: V04 lacks reverse-strand support, V09 appears in WBCs, and only V14 is tumor-derived in this example (4/6,200 ≈ 0.00065).</p>
          </>}
        </div>
      </div>
    </div>
  );
}
