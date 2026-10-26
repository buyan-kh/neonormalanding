import { FlowLine } from "@/components/FlowLine";

const tracks = [
  {
    kicker: "01 // FOR AI LABS",
    title: "Buy RL Tasks & Environments",
    body: "We sell verifiable RL evaluation tasks and containerized Harbor/Docker post-training environments with <50ms Python graders. Start with a 5-task evaluation sample or license full environment tranches.",
    href: "#labs",
    cta: "[Buy Eval Tasks ->]",
  },
  {
    kicker: "02 // FOR DATA HOLDERS",
    title: "Sell or Partner Your Data",
    body: "Have proprietary clinical, biotech, or scientific records? Sell datasets directly to us or partner with us to turn dormant archives into recurring revenue while raw data stays private.",
    href: "#data",
    cta: "[Monetize Your Data ->]",
  },
  {
    kicker: "03 // FOR INVESTORS",
    title: "Invest in Neo Norma",
    body: "Frontier labs have exhausted the public internet. We are building the verifiable post-training environment refinery for empirical science.",
    href: "#investors",
    cta: "[Investor Inquiry ->]",
  },
];

export function DataPartners() {
  return (
    <section id="work" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">03 // WORK WITH US</p>
        <h2 className="mt-3 max-w-[16em] text-[24px] leading-snug md:text-[30px]">Three ways to work with Neo Norma.</h2>
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {tracks.map((track, index) => (
            <div key={track.kicker} className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
              <article className="flex h-full flex-1 flex-col border border-[#0A0A0A] bg-white p-4">
                <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">{track.kicker}</p>
                <h3 className="mt-3 text-[15px] leading-snug">{track.title}</h3>
                <p className="mt-3 flex-1 text-[12px] leading-relaxed text-[#5A5852]">{track.body}</p>
                <a
                  href={track.href}
                  className="mt-5 inline-flex w-fit items-center bg-[#0A0A0A] px-3 py-2 text-[12px] text-white hover:bg-[#262626]"
                >
                  {track.cta}
                </a>
              </article>
              {index < tracks.length - 1 ? (
                <>
                  <FlowLine className="hidden lg:block" length={40} />
                  <FlowLine className="lg:hidden" direction="vertical" length={28} />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
