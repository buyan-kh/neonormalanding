import { DitheredIsometricCube } from "@/components/DitheredIsometricCube";
import { FlowLine } from "@/components/FlowLine";
import { PixelIcon } from "@/components/PixelIcon";
import { TerminalWindow } from "@/components/TerminalWindow";
import type { PixelIconType } from "@/lib/icons";

const checks = [
  "Encode domain rules",
  "Add real-world noise",
  "Generate variations",
  "Auto-verify (no LLM judge)",
];

const inputs: Array<{ label: string; icon: PixelIconType }> = [
  { label: "Hospital EHR", icon: "ehr" },
  { label: "Lab Assays", icon: "assay" },
  { label: "Imaging", icon: "ct-scan" },
  { label: "Genomics", icon: "dna" },
];

const breaks: Array<{ icon: PixelIconType; title: string; body: string; rate: string; note: string }> = [
  {
    icon: "antibody",
    title: "SPR Binding Kinetics",
    body: "Naive 1:1 Langmuir fit, missing mass transport and decay.",
    rate: "67% to 100%",
    note: "Fail Rate",
  },
  {
    icon: "ct-scan",
    title: "Longitudinal Oncology EHR + CT",
    body: "Calls a CT flare as progression and skips the confirmatory scan.",
    rate: "78%",
    note: "Fail Rate (25k to 90k tokens)",
  },
  {
    icon: "dna",
    title: "Liquid Biopsy cfDNA & MRD",
    body: "Calls ctDNA purity and MRD without copy inheritance or CHIP filters.",
    rate: "72%",
    note: "Fail Rate (25k to 90k tokens)",
  },
];

export function Refinery() {
  return (
    <section id="why-models-fail" className="scroll-mt-32 border-t border-[#EFECE6]/30">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#9E9A90]">01 // THE REFINERY ENGINE</p>
        <h2 className="mt-3 max-w-[22em] text-[24px] leading-snug md:text-[30px]">
          Standard Bio Tasks Are Dead. Real-World Scientific Workflows Break Frontier Models.
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <TerminalWindow title="Parametric Generator" bodyClassName="p-3">
            <div className="flex flex-wrap items-center gap-3">
              {inputs.map((input, index) => (
                <div key={input.label} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 border border-dashed border-[#EFECE6]/50 px-1.5 py-1">
                    <PixelIcon type={input.icon} pixel={2} />
                    <span className="text-[10px] text-[#9E9A90]">{input.label}</span>
                  </div>
                  {index < inputs.length - 1 ? <FlowLine length={28} /> : null}
                </div>
              ))}
            </div>
            <div className="mt-3 h-[300px] border border-dashed border-[#EFECE6]/40">
              <DitheredIsometricCube />
            </div>
            <ul className="mt-3 space-y-1 text-[12px]">
              {checks.map((check) => (
                <li key={check} className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-[#EFECE6]" />
                  {check}
                </li>
              ))}
            </ul>
          </TerminalWindow>

          <div className="flex flex-col gap-4">
            <TerminalWindow title="Standard Bio Tasks (Dead)" bodyClassName="p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <PixelIcon type="chart" pixel={3} />
                <p className="flex-1 text-[12px] leading-relaxed text-[#9E9A90]">
                  Survival analysis, interval censoring, competing risks, dose-response
                </p>
                <div className="border border-[#EFECE6]/70 px-2 py-1 text-right text-[12px]">
                  <p>Pass@1: 100%</p>
                  <p className="text-[#9E9A90]">(&lt;3.5k tokens)</p>
                </div>
              </div>
            </TerminalWindow>

            <TerminalWindow title="Real-World Scientific Tasks (Break Models)" bodyClassName="px-3">
              <ol>
                {breaks.map((item, index) => (
                  <li
                    key={item.title}
                    className="flex flex-col gap-3 border-b border-dashed border-[#EFECE6]/30 py-3 last:border-b-0 sm:flex-row sm:items-start"
                  >
                    <PixelIcon type={item.icon} pixel={3} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px]">
                        {index + 1}. {item.title}
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#9E9A90]">{item.body}</p>
                    </div>
                    <div className="shrink-0 border border-[#EFECE6]/70 px-2 py-1 text-right text-[12px]">
                      <p className="text-[10px] text-[#9E9A90]">{item.note}</p>
                      <p className="tabular-nums">{item.rate}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </TerminalWindow>

            <TerminalWindow title="Automated Verification" bodyClassName="p-3">
              <ul className="space-y-2 text-[12px]">
                <li className="flex items-center justify-between gap-3">
                  <span>Reference solver</span>
                  <span className="tabular-nums">1.0000</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Shortcut heuristics (5x)</span>
                  <span className="tabular-nums">&lt;= 0.42</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Frontier models</span>
                  <span>67% to 100% fail</span>
                </li>
              </ul>
            </TerminalWindow>
          </div>
        </div>
      </div>
    </section>
  );
}
