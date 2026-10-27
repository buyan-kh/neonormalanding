import { PixelIcon } from "@/components/PixelIcon";
import { TerminalWindow } from "@/components/TerminalWindow";
import { whyWeGetPaid } from "@/components/inside/content";

export function WhatWeDo() {
  return (
    <section id="what-we-sell" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">01 // WHAT WE DO (IN PLAIN ENGLISH)</p>
        <h2 className="mt-3 max-w-[20em] text-[24px] leading-snug md:text-[26px]">
          We turn real hospital and lab records into tests that AI labs buy to train and test their models.
        </h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Hospitals and labs already did the work. We turn those records into a test with one known right answer.
          AI labs pay for the test. Two kinds of deals pay you.
        </p>

        <h3 className="mt-8 text-[13px] tracking-[0.14em] text-[#5A5852]">WHY AI LABS PAY US</h3>
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

        <h3 className="mt-10 text-[13px] tracking-[0.14em] text-[#5A5852]">TWO TYPES OF DEALS YOU CAN BRING IN</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TerminalWindow title="Deal Track A // AI Lab Buyers (Direct Cash Sales)" wrapTitle className="h-full" bodyClassName="p-3">
            <p className="text-[12px] leading-relaxed text-[#5A5852]">
              AI labs and model teams buy our ready-to-run science and medical test packs. Pilots start at $5,000.
              Full packs run to $380,000 and up. The buyer pays Neo Norma. You earn a commission on that payment.
            </p>
            <div className="mt-4 border border-dashed border-[#0A0A0A] px-2 py-2 font-mono text-[13px] tabular-nums">
              $5,000 pilots up to $380,000+ full packs
            </div>
          </TerminalWindow>
          <TerminalWindow title="Deal Track B // Data Partners (50/50 Revenue Share)" wrapTitle className="h-full" bodyClassName="p-3">
            <p className="text-[12px] leading-relaxed text-[#5A5852]">
              Hospitals, biotechs, diagnostic labs, CROs, and companies with private archives. They pay $0. Their raw
              records stay private. We turn their data into AI tests, sell those tests to AI labs, and split net revenue
              50% / 50%. Their half is paid within 5 business days.
            </p>
            <div className="mt-4 border border-dashed border-[#0A0A0A] px-2 py-2 font-mono text-[13px]">
              Partner pays $0. Split is 50% / 50%.
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
