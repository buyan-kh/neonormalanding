import { CALENDLY_URL } from "@/lib/contact";
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
    <section className="mx-auto w-full max-w-[1080px] px-4 pb-8 pt-8 md:px-6 md:pt-9">
      <p className="text-[11px] tracking-[0.16em] text-[#5A5852]">
        RL EVALUATION TASKS & VERIFIABLE ENVIRONMENTS
      </p>
      <h1 className="mt-4 max-w-[25em] text-[26px] leading-[1.2] text-[#0A0A0A] md:text-[32px]">
        We build RL evaluation tasks and verifiable environments for science.
      </h1>
      <p className="mt-4 max-w-[62ch] text-[13px] leading-relaxed text-[#5A5852] md:text-sm">
        Deterministic Harbor and Docker environments with &lt;50ms Python verifiers built from real clinical and
        wet-lab records.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 sm:flex-row sm:flex-wrap">
        <a
          href={CALENDLY_URL}
          className="inline-flex min-h-11 items-center justify-center bg-[#D9D9D9] px-3 py-2 text-[12px] text-[#303030] hover:bg-[#C9C9C9] lg:min-h-0"
          target="_blank"
          rel="noreferrer"
        >
          Book a partner call
        </a>
        <a
          href="/oldui#request"
          className="inline-flex min-h-11 items-center justify-center border border-[#0A0A0A] px-3 py-2 text-[12px] text-[#0A0A0A] hover:bg-[#EAEAEA] hover:text-[#303030] lg:min-h-0"
        >
          Direct desk
        </a>
        <a
          href="/oldui#investors"
          className="inline-flex min-h-11 items-center justify-center border border-[#0A0A0A]/40 px-3 py-2 text-[12px] text-[#0A0A0A] hover:border-[#0A0A0A] lg:min-h-0"
        >
          Investors
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
      <div id="pipeline" className="mt-0 scroll-mt-32">
        {/* <PipelineShowcase /> */}
      </div>
    </section>
  );
}
