import { PixelIcon } from "@/components/PixelIcon";
import { TerminalWindow } from "@/components/TerminalWindow";
import { priceCards, whyWeGetPaid } from "@/components/inside/content";

export function WhatWeDo() {
  return (
    <section id="product" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">02 // WHAT WE SELL & PRICING (PLAIN ENGLISH)</p>
        <h2 className="mt-3 max-w-[20em] text-[24px] leading-snug md:text-[26px]">
          We turn real hospital and lab records into tests that AI labs buy.
        </h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Hospitals and labs already did the work. We turn those records into a test with one known right answer. 241
          hospital and biology tasks are ready to run. AI labs pay Neo Norma for the pack. The Grader runs in &lt;50ms.
          Preflight verification caps shortcuts at &lt;= 0.42.
        </p>

        <h3 className="mt-8 text-[13px] tracking-[0.14em] text-[#5A5852]">WHY AI LABS BUY FROM US</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {whyWeGetPaid.map((item) => (
            <TerminalWindow key={item.title} title={item.title} wrapTitle className="h-full" bodyClassName="flex flex-1 flex-col p-3">
              <PixelIcon type={item.icon} pixel={3} />
              <p className="mt-3 flex-1 text-[12px] leading-relaxed text-[#5A5852]">{item.body}</p>
              <div className="mt-4 border border-dashed border-[#0A0A0A] px-2 py-2">
                <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">{item.metricLabel}</p>
                <p className="mt-1 font-mono text-[14px] tabular-nums">{item.metric}</p>
              </div>
            </TerminalWindow>
          ))}
        </div>

        <h3 className="mt-10 text-[13px] tracking-[0.14em] text-[#5A5852]">WHAT IT COSTS</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {priceCards.map((card) => (
            <TerminalWindow key={card.kicker} title={card.kicker} wrapTitle className="h-full" bodyClassName="flex flex-1 flex-col p-3">
              <p className="font-mono text-[22px] leading-none">{card.price}</p>
              <p className="mt-2 text-[12px] text-[#5A5852]">{card.scope}</p>
              <p className="mt-3 flex-1 text-[12px] leading-relaxed text-[#5A5852]">{card.body}</p>
            </TerminalWindow>
          ))}
        </div>
      </div>
    </section>
  );
}
