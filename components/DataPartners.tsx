import { FlowLine } from "@/components/FlowLine";
import { TerminalWindow } from "@/components/TerminalWindow";

const stages = [
  {
    title: "Isolated Ingestion // De-Identified Longitudinal Slices",
    kicker: "Chain of title",
    body: "Multi-table clinical, wet-lab, and operational records are ingested into isolated workspaces with strict chain-of-title. Underlying databases are never exposed or distributed as static corpora.",
  },
  {
    title: "Deterministic Verification // <50ms Python Graders",
    kicker: "Private grade.py",
    body: "Held-out longitudinal outcomes are compiled into private Python verifiers (grade.py) with automated preflight proofs that falsify single-stage heuristics and enforce physical and clinical constraints.",
  },
  {
    title: "Direct Lab Distribution // Revenue-Share Licensing",
    kicker: "50/50 net revenue share",
    body: "Compiled environment tranches are licensed directly to frontier AI research labs and post-training teams under a transparent 50/50 net revenue-share partnership.",
  },
];

export function DataPartners() {
  return (
    <section id="data-partners" className="scroll-mt-32 border-t border-[#EFECE6]/30">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#9E9A90]">04 // DATA PARTNERSHIPS & INSTITUTIONAL LICENSING</p>
        <h2 className="mt-3 max-w-[20em] text-[24px] leading-snug md:text-[30px]">
          Transform proprietary clinical and scientific records into verifiable post-training environments.
        </h2>
        <div className="mt-6">
          <TerminalWindow title="Institutional Licensing // 50/50" bodyClassName="p-3 md:p-4">
            <p className="max-w-[80ch] text-[13px] leading-relaxed text-[#9E9A90]">
              Neo Norma partners directly with health systems, biotechnology organizations, and enterprise data
              holders under a co-licensing revenue-share model. Raw records remain private while our refinery
              compiles longitudinal workflows into containerized Harbor/Docker evaluation and RL environments for
              frontier AI labs.
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
