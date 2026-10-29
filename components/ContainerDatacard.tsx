"use client";

import { useState } from "react";
import { datacardPlainText, type TaskDatacard } from "@/lib/catalog";

export function ContainerDatacard({ taskName, card }: { taskName: string; card: TaskDatacard }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = datacardPlainText(taskName, card);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="border-t border-[#0A0A0A]/15 px-4 py-4 md:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.14em] text-[#5A5852]">CONTAINER DATACARD</p>
        <p className="font-mono text-[12px]">{card.ref}</p>
      </div>
      <dl className="mt-3 grid gap-2 text-[12px] sm:grid-cols-2">
        <div className="border border-[#0A0A0A] px-2 py-2">
          <dt className="text-[10px] tracking-[0.12em] text-[#5A5852]">HARNESSES</dt>
          <dd className="mt-1 font-mono">{card.harnesses}</dd>
        </div>
        <div className="border border-[#0A0A0A] px-2 py-2">
          <dt className="text-[10px] tracking-[0.12em] text-[#5A5852]">GRADER</dt>
          <dd className="mt-1 font-mono">{card.graderRuntime}</dd>
        </div>
        <div className="border border-[#0A0A0A] px-2 py-2 sm:col-span-2">
          <dt className="text-[10px] tracking-[0.12em] text-[#5A5852]">PREFLIGHT VERIFICATION</dt>
          <dd className="mt-1 font-mono">{card.preflight}</dd>
        </div>
      </dl>
      <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-words border border-[#0A0A0A] bg-white p-3 font-mono text-[11px] leading-relaxed text-[#0A0A0A]">
        {`${card.ref}/\n${card.tree
          .map((entry, index) => `${index === card.tree.length - 1 ? "└──" : "├──"} ${entry.name}\n    ${entry.note}`)
          .join("\n")}`}
      </pre>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-11 items-center bg-[#0A0A0A] px-3 py-2 text-[12px] text-white hover:bg-[#262626] lg:min-h-0"
        >
          {copied ? "[Copied Datacard]" : "[Copy Datacard]"}
        </button>
        <a href="#intake" className="inline-flex min-h-11 items-center border border-[#0A0A0A] px-3 py-2 text-[12px] hover:bg-[#0A0A0A] hover:text-white lg:min-h-0">
          [Request NDA Sample -&gt;]
        </a>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-[#5A5852]">
        Exact schemas and container artifacts ship with the evaluation sample under mutual NDA.
      </p>
    </div>
  );
}
