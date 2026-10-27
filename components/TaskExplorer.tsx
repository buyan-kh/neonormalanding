"use client";

import { benchmarkTasks } from "@/lib/catalog";
import { traceFor } from "@/lib/traces";

type Stage = { title: string; lines: [string, string, string] };
type Environment = {
  eyebrow: string;
  summary: string;
  visual: "copy" | "duplex" | "matrix" | "survival";
  visualTitle: string;
  visualNote: string;
  stages: [Stage, Stage, Stage];
  checks: string[];
  output: string;
};

const environments: Record<string, Environment> = {
  "neonorma/ctdna-chip": {
    eyebrow: "LIQUID BIOPSY / COPY NUMBER",
    summary: "Infer what belongs to the tumor from a plasma sample, without a matched white-blood-cell normal.",
    visual: "copy",
    visualTitle: "A mixed signal, not a clean genome",
    visualNote: "A schematic view of segment-level copy-number changes.",
    stages: [
      { title: "Plasma data", lines: ["Copy-number segments", "Heterozygous SNPs", "Targeted variants"] },
      { title: "Joint analysis", lines: ["Tumor fraction & ploidy", "Subclonal copy number", "Tumor vs. CHIP"] },
      { title: "Structured result", lines: ["Estimated tumor fraction", "Copy-number calls", "Variant interpretation"] },
    ],
    checks: ["Purity and ploidy", "Allelic evidence", "CHIP uncertainty"],
    output: "The verifier checks whether the result uses the available evidence and handles uncertainty.",
  },
  "neonorma/mrd-duplex": {
    eyebrow: "LIQUID BIOPSY / RESIDUAL DISEASE",
    summary: "Separate residual tumor DNA from sequencing artifacts and variants originating in blood cells.",
    visual: "duplex",
    visualTitle: "Two strands tell a different story",
    visualNote: "A schematic of how duplex and blood-cell evidence change a variant call.",
    stages: [
      { title: "Sequencing data", lines: ["Duplex read families", "Matched WBC control", "Oxidative damage panel"] },
      { title: "Variant filtering", lines: ["Strand consensus", "Oxidative artifacts", "WBC / CHIP signal"] },
      { title: "Structured result", lines: ["MRD status", "Estimated ctDNA VAF", "Variant classifications"] },
    ],
    checks: ["Both strands", "Oxidative damage", "WBC evidence"],
    output: "The verifier checks the variant calls, not just whether the submission is valid JSON.",
  },
  "perturb-seq": {
    eyebrow: "PERTURB-SEQ / DRUG COMBINATIONS",
    summary: "Evaluate a drug pair while accounting for the experimental conditions that can distort the result.",
    visual: "matrix",
    visualTitle: "The answer lives across the dose matrix",
    visualNote: "A schematic of paired doses and the controls around them.",
    stages: [
      { title: "Experiment data", lines: ["Dose-response matrix", "Guide assignments", "Plate controls"] },
      { title: "Adjust & compare", lines: ["Knockdown efficiency", "Plate-position effects", "Synergy reference"] },
      { title: "Analysis", lines: ["Combination response", "Model assumptions", "Interpretable result"] },
    ],
    checks: ["Dose coverage", "Guide efficiency", "Plate controls"],
    output: "The verifier checks whether the analysis accounts for the experimental controls and assumptions.",
  },
  "oncology-trial": {
    eyebrow: "CLINICAL TRIAL / SURVIVAL",
    summary: "Compare treatments when benefits appear late and patients can switch arms or experience competing events.",
    visual: "survival",
    visualTitle: "A treatment effect can emerge over time",
    visualNote: "Schematic survival curves, shown to illustrate a delayed separation.",
    stages: [
      { title: "Trial records", lines: ["Assigned treatment arms", "Follow-up & events", "Treatment switches"] },
      { title: "Survival analysis", lines: ["Censoring & competing risks", "Delayed treatment effect", "Fixed-window comparison"] },
      { title: "Analysis", lines: ["Treatment comparison", "Time window & assumptions", "Interpretable result"] },
    ],
    checks: ["Assigned arms", "Follow-up", "RMST comparison"],
    output: "The verifier checks the treatment comparison and how follow-up and competing events are handled.",
  },
};

function ScientificVisual({ environment }: { environment: Environment }) {
  const grid = [0, 1, 2, 3, 4];
  return (
    <div className="rl-visual overflow-hidden border-b border-[#0a0a0a]/10 bg-[#f8f8f8]">
      <div className="flex flex-wrap items-start justify-between gap-2 px-4 pt-4 md:px-5">
        <div><p className="font-mono text-[10px] tracking-[0.1em] text-[#929292]">SIGNAL / 01</p><p className="mt-1 text-[14px] font-medium text-[#333]">{environment.visualTitle}</p></div>
        <span className="rounded-full border border-[#dedede] px-2 py-1 font-mono text-[10px] text-[#888]">SCHEMATIC</span>
      </div>
      <div className="overflow-x-auto px-3 pb-2">
        <svg viewBox="0 0 760 200" role="img" aria-label={`${environment.visualTitle}. ${environment.visualNote}`} className="block h-auto w-full min-w-[560px]">
          <g stroke="#e6e6e6" strokeWidth="1">{grid.map((i) => <line key={i} x1="44" x2="716" y1={40 + i * 30} y2={40 + i * 30} />)}</g>
          {environment.visual === "copy" && <>
            <text x="45" y="23" fill="#999" fontSize="10" fontFamily="inherit">RELATIVE COPY SIGNAL</text>
            <path d="M45 100 H715" stroke="#b5b5b5" strokeWidth="1" strokeDasharray="3 5" />
            <path d="M45 102 H124 V76 H197 V90 H276 V53 H345 V94 H432 V117 H504 V78 H579 V101 H716" fill="none" stroke="#313131" strokeWidth="2" strokeLinejoin="round" className="rl-draw" />
            <path d="M45 111 H124 V86 H197 V100 H276 V64 H345 V104 H432 V127 H504 V89 H579 V111 H716" fill="none" stroke="#b2b2b2" strokeWidth="1" strokeLinejoin="round" className="rl-draw rl-delay-1" />
            {[124,197,276,345,432,504,579].map((x,i) => <circle key={x} cx={x} cy={[76,90,53,94,117,78,101][i]} r="3" fill="#535353" className="rl-point" style={{ animationDelay: `${i * 90}ms` }} />)}
            <text x="45" y="187" fill="#999" fontSize="10" fontFamily="inherit">SEGMENTS ALONG THE GENOME</text><text x="561" y="187" fill="#999" fontSize="10" fontFamily="inherit">TUMOR + NORMAL DNA</text>
          </>}
          {environment.visual === "duplex" && <>
            <text x="45" y="23" fill="#999" fontSize="10" fontFamily="inherit">DUPLEX EVIDENCE</text>
            {[0,1,2].map((i) => <g key={i} transform={`translate(${45 + i * 228} 40)`} className="rl-cell" style={{ animationDelay: `${i * 120}ms` }}>
              <rect width="210" height="111" rx="3" fill="white" stroke="#dedede" /><text x="14" y="23" fill="#333" fontSize="12" fontFamily="inherit" fontWeight="600">{["V04 / one strand", "V09 / WBC signal", "V14 / duplex"][i]}</text>
              <text x="14" y="49" fill="#999" fontSize="10" fontFamily="inherit">AB</text><line x1="43" x2="171" y1="46" y2="46" stroke="#e2e2e2" strokeWidth="5" strokeLinecap="round" /><line x1="43" x2={i === 2 ? "131" : "145"} y1="46" y2="46" stroke="#555" strokeWidth="5" strokeLinecap="round" className="rl-duplex-line" />
              <text x="14" y="73" fill="#999" fontSize="10" fontFamily="inherit">BA</text><line x1="43" x2="171" y1="70" y2="70" stroke="#e2e2e2" strokeWidth="5" strokeLinecap="round" />{i !== 0 && <line x1="43" x2={i === 2 ? "131" : "143"} y1="70" y2="70" stroke="#777" strokeWidth="5" strokeLinecap="round" className="rl-duplex-line rl-delay-1" />}
              <text x="14" y="96" fill="#888" fontSize="10" fontFamily="inherit">{["Strand support missing", "Present in blood control", "Both strands supported"][i]}</text>
            </g>)}
            <text x="45" y="187" fill="#999" fontSize="10" fontFamily="inherit">READ FAMILIES + MATCHED CONTROL</text>
          </>}
          {environment.visual === "matrix" && <>
            <text x="45" y="23" fill="#999" fontSize="10" fontFamily="inherit">DRUG A × DRUG B</text>
            {[0,1,2,3,4,5,6,7].flatMap((x) => [0,1,2,3].map((y) => <rect key={`${x}-${y}`} x={76 + x * 45} y={38 + y * 33} width="36" height="25" rx="2" fill={["#ededed", "#dadada", "#c5c5c5", "#adadad", "#8f8f8f"][(x * 2 + y * 3 + x * y) % 5]} className="rl-cell" style={{ animationDelay: `${(x + y) * 45}ms` }} />))}
            <path d="M474 52 H677 M474 84 H677 M474 116 H677" stroke="#e0e0e0" /><text x="474" y="44" fill="#999" fontSize="10" fontFamily="inherit">LOOK BEYOND A SINGLE WELL</text>
            <text x="474" y="75" fill="#555" fontSize="12" fontFamily="inherit">Dose coverage</text><text x="474" y="107" fill="#555" fontSize="12" fontFamily="inherit">Guide efficiency</text><text x="474" y="139" fill="#555" fontSize="12" fontFamily="inherit">Plate controls</text>
            <text x="76" y="187" fill="#999" fontSize="10" fontFamily="inherit">PAIRED DOSE CONDITIONS</text>
          </>}
          {environment.visual === "survival" && <>
            <text x="45" y="23" fill="#999" fontSize="10" fontFamily="inherit">PROPORTION EVENT-FREE</text>
            <path d="M45 45 H115 V58 H180 V68 H245 V77 H306 V85 H362 V100 H425 V108 H486 V117 H552 V128 H612 V139 H715" fill="none" stroke="#a3a3a3" strokeWidth="2" className="rl-draw" />
            <path d="M45 45 H115 V57 H180 V67 H245 V76 H306 V82 H362 V88 H425 V92 H486 V97 H552 V104 H612 V111 H715" fill="none" stroke="#313131" strokeWidth="2" className="rl-draw rl-delay-1" />
            <path d="M306 82 V85 H362 V100 H425 V108 H486 V117 H552 V128 H612 V139 H715 V111 H612 V104 H552 V97 H486 V92 H425 V88 H362 V82 Z" fill="#d5d5d5" opacity="0.5" className="rl-reveal" />
            <text x="465" y="68" fill="#777" fontSize="10" fontFamily="inherit">DELAYED SEPARATION</text><path d="M530 72 V85" stroke="#aaa" />
            <text x="45" y="187" fill="#999" fontSize="10" fontFamily="inherit">FOLLOW-UP TIME →</text><line x1="578" x2="596" y1="184" y2="184" stroke="#313131" strokeWidth="2" /><text x="601" y="187" fill="#888" fontSize="10" fontFamily="inherit">ARM A</text><line x1="652" x2="670" y1="184" y2="184" stroke="#aaa" strokeWidth="2" /><text x="675" y="187" fill="#888" fontSize="10" fontFamily="inherit">ARM B</text>
          </>}
        </svg>
      </div>
      <p className="border-t border-[#eaeaea] px-4 py-2 text-[11px] text-[#929292] md:px-5">{environment.visualNote}</p>
    </div>
  );
}

function EnvironmentGraph({ environment }: { environment: Environment }) {
  return (
    <svg viewBox="0 0 840 296" role="img" aria-labelledby="env-graph-title env-graph-desc" className="block h-auto w-full min-w-[560px]">
      <title id="env-graph-title">{`${environment.eyebrow}: environment flow`}</title>
      <desc id="env-graph-desc">{environment.stages.map((stage) => `${stage.title}: ${stage.lines.join(", ")}`).join(". ")}. The verifier checks {environment.checks.join(", ")}.</desc>
      <defs><pattern id="env-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="#dfdfdf" /></pattern></defs>
      <rect width="840" height="296" fill="#fafafa" />
      <rect width="840" height="296" fill="url(#env-grid)" />
      <path d="M252 113 H312 M546 113 H606" fill="none" stroke="#b7b7b7" strokeWidth="1.2" />
      <path d="M252 113 H312 M546 113 H606" fill="none" stroke="#555" strokeWidth="1.5" strokeDasharray="3 8" className="rl-flow" />
      <path d="M714 177 V205 H420 V222" fill="none" stroke="#b7b7b7" strokeWidth="1.2" />
      <path d="M714 177 V205 H420 V222" fill="none" stroke="#777" strokeWidth="1.5" strokeDasharray="3 8" className="rl-flow" />
      {environment.stages.map((stage, index) => {
        const x = 18 + index * 294;
        return <g key={stage.title} transform={`translate(${x} 49)`} className="rl-stage" style={{ animationDelay: `${index * 90}ms` }}>
          <text x="0" y="-12" fill="#888" fontSize="10" fontFamily="inherit" letterSpacing="1.2">{["01 / INPUTS", "02 / WORK", "03 / OUTPUT"][index]}</text>
          <rect x="0" y="0" width="234" height="128" rx="3" fill="white" stroke="#d5d5d5" />
          <text x="16" y="25" fill="#222" fontSize="13" fontWeight="600" fontFamily="inherit">{stage.title}</text>
          <line x1="16" x2="218" y1="36" y2="36" stroke="#ededed" />
          {stage.lines.map((line, lineIndex) => <g key={line}><circle cx="19" cy={58 + lineIndex * 24} r="2" fill="#a0a0a0" /><text x="30" y={62 + lineIndex * 24} fill="#555" fontSize="12" fontFamily="inherit">{line}</text></g>)}
        </g>;
      })}
      <rect x="251" y="222" width="338" height="53" rx="3" fill="#f1f1f1" stroke="#d4d4d4" />
      <circle cx="270" cy="241" r="4" fill="#777" className="rl-pulse" />
      <text x="283" y="245" fill="#333" fontSize="12" fontWeight="600" fontFamily="inherit">Deterministic verifier</text>
      <text x="283" y="261" fill="#777" fontSize="10" fontFamily="inherit">{environment.checks.join("  ·  ")}</text>
    </svg>
  );
}

export function TaskExplorer({ taskId, onTask }: { taskId: string; onTask: (taskId: string) => void }) {
  const task = benchmarkTasks.find((item) => item.id === taskId) ?? benchmarkTasks[0];
  const environment = environments[task.id];

  return (
    <div className="grid gap-4 md:grid-cols-[210px_minmax(0,1fr)] md:gap-6">
      <div>
        <p className="mb-2 text-[11px] tracking-[0.12em] text-[#777]">ENVIRONMENTS</p>
        <ol className="border-t border-[#0A0A0A]/15">
          {benchmarkTasks.map((item, index) => <li key={item.id} className="border-b border-[#0A0A0A]/15"><button type="button" aria-pressed={item.id === task.id} onClick={() => onTask(item.id)} className={`flex w-full items-baseline gap-3 rounded-sm px-2 py-3 text-left text-[13px] transition-colors duration-200 ${item.id === task.id ? "bg-[#f1f1f1] font-medium text-[#111]" : "text-[#777] hover:bg-[#f8f8f8] hover:text-[#111]"}`}><span className="font-mono text-[11px] text-[#999]">{String(index + 1).padStart(2, "0")}</span><span>{traceFor(item.id).title}</span></button></li>)}
        </ol>
      </div>
      <div key={task.id} className="rl-enter min-w-0 border border-[#0A0A0A]/15">
        <div className="border-b border-[#0A0A0A]/10 px-4 py-4 md:px-5">
          <p className="text-[10px] tracking-[0.12em] text-[#888]">{environment.eyebrow}</p>
          <h3 className="mt-2 text-[19px] leading-snug">{traceFor(task.id).title}</h3>
          <p className="mt-2 max-w-[70ch] text-[13px] leading-relaxed text-[#666]">{environment.summary}</p>
        </div>
        <ScientificVisual environment={environment} />
        <div className="overflow-x-auto"><EnvironmentGraph environment={environment} /></div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[#0A0A0A]/10 px-4 py-3 text-[12px] text-[#666] md:px-5">
          <p>{environment.output}</p><span className="shrink-0 font-mono text-[10px] text-[#999]">HARBOR / TASK → VERIFIER</span>
        </div>
      </div>
    </div>
  );
}
