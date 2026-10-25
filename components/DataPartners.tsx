import { FlowLine } from "@/components/FlowLine";
import { TerminalWindow } from "@/components/TerminalWindow";

const stages = [
  {
    title: "Years 1 to 3",
    kicker: "Noisy Encounters, Lot Drift, Amended Labs",
    body: "Packaged into isolated Docker /workspace.",
  },
  {
    title: "Years 4 to 10+",
    kicker: "Longitudinal Outcomes & Confirmatory Scans",
    body: "Compiled into private Python verifiers (grade.py).",
  },
  {
    title: "Direct Lab Distribution",
    kicker: "100-to-500 task tranches",
    body: "Sold to frontier post-training teams on a 50/50 split.",
  },
];

export function DataPartners() {
  return (
    <section id="data-partners" className="scroll-mt-32 border-t border-[#EFECE6]/30">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#9E9A90]">04 // FOR HOSPITAL & BIOTECH DATA HOLDERS</p>
        <h2 className="mt-3 max-w-[20em] text-[24px] leading-snug md:text-[30px]">
          Dormant clinical archives become verifiable tasks.
        </h2>
        <div className="mt-6">
          <TerminalWindow title="Data Partner Refinery // 50:50 Revenue Share" bodyClassName="p-3 md:p-4">
            <p className="max-w-[80ch] text-[13px] leading-relaxed text-[#9E9A90]">
              Hospital networks and biotech labs turn dormant 10-to-15-year EHR, wet-lab, and radiology databases
              into $1,000 to $5,000 per-task RLVR tranches without exposing raw patient tables.
            </p>
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-stretch">
              {stages.map((stage, index) => (
                <div key={stage.title} className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex-1 border border-dashed border-[#EFECE6]/70 p-3">
                    <p className="text-[10px] text-[#9E9A90]">0{index + 1}</p>
                    <p className="mt-2 text-[13px]">{stage.title}</p>
                    <p className="mt-2 text-[12px] text-[#EFECE6]">{stage.kicker}</p>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#9E9A90]">{stage.body}</p>
                  </div>
                  {index < stages.length - 1 ? (
                    <>
                      <FlowLine className="hidden lg:block" length={40} />
                      <FlowLine className="lg:hidden" direction="vertical" length={28} />
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
