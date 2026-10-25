"use client";

import { useState } from "react";
import { FlowLine } from "@/components/FlowLine";
import { PixelIcon } from "@/components/PixelIcon";
import { WindowControls } from "@/components/TerminalWindow";
import { sandboxTasks, verifierRules } from "@/lib/catalog";
import type { PixelIconType } from "@/lib/icons";

const sources: Array<{ title: string; icon: PixelIconType; body?: string }> = [
  { title: "EHR / Clinical", icon: "ehr" },
  { title: "Wet-lab Assays", icon: "assay" },
  { title: "Imaging", icon: "ct-scan" },
  {
    title: "Genomics",
    icon: "sequence",
    body: "AGTCATG..\nGTTACGA..\nCAGTTCA..\nTCAGATT..\n+ Longitudinal Data",
  },
];

const verifySource = `def verify(output):
    check_physics()
    check_biology()
    check_statistics()
    check_no_shortcuts()
    return reward`;

function RuleList({ activeRules }: { activeRules: string[] }) {
  return (
    <ul className="space-y-1.5 text-[11px]">
      {verifierRules.map((rule) => {
        const on = activeRules.includes(rule.id);
        return (
          <li key={rule.id} className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 border border-[#EFECE6] ${on ? "bg-[#EFECE6]" : ""}`} />
            <span className={on ? "text-[#EFECE6]" : "text-[#9E9A90]"}>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Scatter() {
  const points = [
    [18, 62],
    [28, 58],
    [36, 70],
    [48, 40],
    [58, 46],
    [70, 28],
    [84, 34],
    [96, 18],
    [110, 22],
    [124, 12],
  ];
  return (
    <svg viewBox="0 0 150 90" className="mt-3 h-[90px] w-full" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M16 8 V78 H142" fill="none" stroke="#EFECE6" strokeWidth="1" />
      {points.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" fill="#EFECE6" />
      ))}
      <text x="4" y="12" fill="#9E9A90" fontSize="8" fontFamily="ui-monospace, monospace">
        1.0
      </text>
      <text x="4" y="78" fill="#9E9A90" fontSize="8" fontFamily="ui-monospace, monospace">
        0.0
      </text>
      <text x="18" y="88" fill="#9E9A90" fontSize="8" fontFamily="ui-monospace, monospace">
        10^3
      </text>
      <text x="112" y="88" fill="#9E9A90" fontSize="8" fontFamily="ui-monospace, monospace">
        10^5
      </text>
    </svg>
  );
}

function SandboxTasks({
  active,
  onPick,
}: {
  active: string | null;
  onPick: (id: string) => void;
}) {
  return (
    <>
      {sandboxTasks.map((task) => {
        const on = active === task.id;
        return (
          <button
            key={task.id}
            type="button"
            onClick={() => onPick(task.id)}
            onMouseEnter={() => onPick(task.id)}
            onFocus={() => onPick(task.id)}
            className={`flex w-full items-center gap-2 px-2 py-2 text-left ${on ? "bg-[#EFECE6]/10" : "hover:bg-[#EFECE6]/5"}`}
          >
            <PixelIcon type={task.icon} pixel={2} />
            <span className="min-w-0 flex-1">
              <span className="block text-[12px]">{task.title}</span>
              <span className="mt-1 block h-px border-t border-dashed border-[#EFECE6]/40" />
            </span>
            <span className="text-[10px] text-[#9E9A90]">...</span>
          </button>
        );
      })}
      <div className="flex items-center gap-2 px-2 py-2 text-[12px] text-[#9E9A90]">
        <span className="inline-block h-8 w-8 border border-dashed border-[#EFECE6]/50" />
        Task N: ...
      </div>
    </>
  );
}

function VerifierBody({ active }: { active: string | null }) {
  const task = sandboxTasks.find((item) => item.id === active) ?? null;
  return (
    <div className="flex h-full flex-col gap-3 p-2">
      <RuleList activeRules={task?.rules ?? []} />
      <p className="text-[11px] leading-relaxed text-[#9E9A90]">
        {task ? `armed // ${task.armed}` : "Select a task to inspect its verifier."}
      </p>
      <pre className="overflow-x-auto text-[11px] leading-relaxed text-[#EFECE6]">{verifySource}</pre>
    </div>
  );
}

function EvalBody() {
  return (
    <div className="p-2 text-[11px]">
      <p className="text-[#9E9A90]">r47_mrd_panel</p>
      <table className="mt-2 w-full">
        <thead>
          <tr className="text-left text-[#9E9A90]">
            <th className="pb-1 font-normal" scope="col">
              Model
            </th>
            <th className="pb-1 text-right font-normal" scope="col">
              Fail Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ["gpt-6.1-sol", "67%"],
            ["gpt-6-astra", "67%"],
            ["gpt-6-luna", "100%"],
          ].map(([model, rate]) => (
            <tr key={model} className="border-t border-dashed border-[#EFECE6]/30">
              <td className="py-1">{model}</td>
              <td className="py-1 text-right tabular-nums">{rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[#9E9A90]">Pass@1 vs Tokens</p>
      <Scatter />
    </div>
  );
}

export function PipelineShowcase() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="grid w-full min-w-[1042px] gap-y-2"
        style={{
          gridTemplateColumns: "158px 44px 48px 40px minmax(250px,1fr) 36px 220px 36px 210px",
          gridTemplateRows: "repeat(6, auto) auto",
        }}
      >
        <p className="col-start-2 row-start-1 self-end pb-1 text-center text-[10px] text-[#9E9A90]">Data</p>
        <p className="col-start-3 row-start-1 self-end pb-1 text-center text-[10px] text-[#9E9A90]">Swarm</p>

        {sources.map((source, index) => (
          <div key={source.title} className="h-full" style={{ gridColumn: 1, gridRow: index + 2 }}>
            <div className="flex h-full flex-col border border-dashed border-[#EFECE6]/70">
              <div className="flex items-center justify-between border-b border-dashed border-[#EFECE6]/70 px-1.5 py-1">
                <p className="truncate text-[10px]">{source.title}</p>
                <WindowControls />
              </div>
              <div className="flex flex-1 items-center gap-2 p-1.5">
                <PixelIcon type={source.icon} pixel={2} />
                {source.body ? (
                  <pre className="text-[9px] leading-tight text-[#9E9A90]">{source.body}</pre>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {sandboxTasks.map((task, index) => (
          <div
            key={`${task.id}-flow`}
            className="flex items-center justify-center"
            style={{ gridColumn: 2, gridRow: index + 2 }}
          >
            <FlowLine length={36} />
          </div>
        ))}

        {sandboxTasks.map((task, index) => (
          <div key={`${task.id}-bot`} className="flex items-center justify-center" style={{ gridColumn: 3, gridRow: index + 2 }}>
            <span className={active === task.id ? "bg-[#EFECE6]/15 p-0.5" : "p-0.5"}>
              <PixelIcon type="robot" pixel={2} label="Agent" />
            </span>
          </div>
        ))}

        {sandboxTasks.map((task, index) => (
          <div
            key={`${task.id}-join`}
            className="flex items-center justify-center"
            style={{ gridColumn: 4, gridRow: index + 2 }}
          >
            <FlowLine length={32} />
          </div>
        ))}

        <div className="col-start-5 row-start-1 row-span-6 grid grid-rows-subgrid border border-dashed border-[#EFECE6]/70">
          <div className="flex items-center justify-between border-b border-dashed border-[#EFECE6]/70 px-2 py-1">
            <p className="text-[11px]">RL Environment Sandbox</p>
            <WindowControls />
          </div>
          <SandboxTasks active={active} onPick={setActive} />
        </div>

        <div className="col-start-6 row-start-1 row-span-6 flex items-center justify-center">
          <FlowLine length={28} />
        </div>

        <div className="col-start-7 row-start-1 row-span-6 h-full border border-dashed border-[#EFECE6]/70">
          <div className="flex items-center justify-between border-b border-dashed border-[#EFECE6]/70 px-2 py-1">
            <p className="text-[11px]">Deterministic Verifier</p>
            <WindowControls />
          </div>
          <VerifierBody active={active} />
        </div>

        <div className="col-start-8 row-start-1 row-span-6 flex items-center justify-center">
          <FlowLine length={28} />
        </div>

        <div className="col-start-9 row-start-1 row-span-6 h-full border border-dashed border-[#EFECE6]/70">
          <div className="flex items-center justify-between border-b border-dashed border-[#EFECE6]/70 px-2 py-1">
            <p className="text-[11px]">Evaluation</p>
            <WindowControls />
          </div>
          <EvalBody />
        </div>

        <div className="col-start-3 col-span-3 row-start-7 flex items-center gap-2 pt-3">
          <FlowLine reverse length={120} />
          <span className="text-[10px] text-[#9E9A90]">Observations / Rewards</span>
        </div>
      </div>

    </div>
  );
}
