import { FlowLine } from "@/components/FlowLine";
import { PipelineShowcase } from "@/components/PipelineShowcase";

const stages = [
  "Raw Clinical & Wet-Lab Data",
  "Parametric Refinery",
  "Harbor/Docker RL Sandbox",
  "Pure-Python Verifier",
  "Frontier Evaluation",
];

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 pb-16 pt-10 md:px-6 md:pt-14">
      <p className="text-[11px] tracking-[0.16em] text-[#9E9A90]">
        HARBOR & DOCKER NATIVE // DETERMINISTIC PYTHON VERIFIERS
      </p>
      <h1 className="mt-4 max-w-[18em] text-[26px] leading-[1.2] text-[#EFECE6] md:text-[34px]">
        Verifiable RL Environments for Clinical Oncology, Genomics & Wet-Lab Biology.
      </h1>
      <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#9E9A90] md:text-sm">
        Frontier labs already trained on the public internet. We compile noisy clinical and wet-lab records into
        RLVR (Reinforcement Learning with Verifiable Rewards) tasks that break frontier models.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href="#sample"
          className="inline-flex items-center justify-center bg-[#EFECE6] px-3 py-2 text-[12px] text-[#070707] hover:bg-white"
        >
          [Request 5-Task Sample -&gt;]
        </a>
        <a
          href="#partner"
          className="inline-flex items-center justify-center border border-[#EFECE6] px-3 py-2 text-[12px] text-[#EFECE6] hover:bg-[#EFECE6] hover:text-[#070707]"
        >
          [Data Partners (50/50) -&gt;]
        </a>
      </div>

      <div className="mt-10 overflow-x-auto pb-2">
        <ol className="flex w-max items-center gap-3">
          {stages.map((stage, index) => (
            <li key={stage} className="flex shrink-0 items-center gap-3">
              <span className="border border-dashed border-[#EFECE6]/70 px-2 py-1 text-[11px] whitespace-nowrap text-[#EFECE6]">
                {stage}
              </span>
              {index < stages.length - 1 ? <FlowLine length={52} /> : null}
            </li>
          ))}
        </ol>
        <p className="mt-3 w-max text-[11px] whitespace-nowrap text-[#9E9A90]">
          Raw Clinical & Wet-Lab Data -&gt; Parametric Refinery -&gt; Harbor/Docker RL Sandbox -&gt; Pure-Python
          Verifier -&gt; Frontier Evaluation
        </p>
      </div>

      <div id="pipeline" className="mt-8 scroll-mt-32">
        <PipelineShowcase />
      </div>
    </section>
  );
}
