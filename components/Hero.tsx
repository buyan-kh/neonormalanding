// import { FlowLine } from "@/components/FlowLine";
// import { PipelineShowcase } from "@/components/PipelineShowcase";

// const stages = [
//   "Raw Clinical & Wet-Lab Data",
//   "Parametric Refinery",
//   "Harbor/Docker RL Sandbox",
//   "Pure-Python Verifier",
//   "Frontier Evaluation",
// ];

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 pb-16 pt-10 md:px-6 md:pt-14">
      <p className="text-[11px] tracking-[0.16em] text-[#5A5852]">
        RL EVALUATION TASKS & VERIFIABLE ENVIRONMENTS
      </p>
      <h1 className="mt-4 max-w-[16em] text-[26px] leading-[1.2] text-[#0A0A0A] md:text-[34px]">
        We build RL evaluation tasks and verifiable environments for science.
      </h1>
      <p className="mt-4 max-w-[62ch] text-[13px] leading-relaxed text-[#5A5852] md:text-sm">
        Deterministic Harbor and Docker environments with &lt;50ms Python verifiers built from real clinical and
        wet-lab records.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href="#labs"
          className="inline-flex items-center justify-center bg-[#0A0A0A] px-3 py-2 text-[12px] text-white hover:bg-[#262626]"
        >
          [Buy Eval Tasks]
        </a>
        <a
          href="#data"
          className="inline-flex items-center justify-center border border-[#0A0A0A] px-3 py-2 text-[12px] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white"
        >
          [Sell or Partner Data]
        </a>
        <a
          href="#investors"
          className="inline-flex items-center justify-center border border-[#0A0A0A]/40 px-3 py-2 text-[12px] text-[#0A0A0A] hover:border-[#0A0A0A]"
        >
          [Investors]
        </a>
      </div>
      {/* <div className="mt-10 overflow-x-auto pb-2">
        <ol className="flex w-max items-center gap-3">
          {stages.map((stage, index) => (
            <li key={stage} className="flex shrink-0 items-center gap-3">
              <span className="border border-[#0A0A0A]/40 px-2 py-1 text-[11px] whitespace-nowrap text-[#0A0A0A]">
                {stage}
              </span>
              {index < stages.length - 1 ? <FlowLine length={52} /> : null}
            </li>
          ))}
        </ol>
      </div> */}
      <div id="pipeline" className="mt-8 scroll-mt-32">
        {/* <PipelineShowcase /> */}
      </div>
    </section>
  );
}
