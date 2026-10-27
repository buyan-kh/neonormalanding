"use client";

import { useEffect, useRef } from "react";
import { DitheredIsometricCube } from "@/components/DitheredIsometricCube";
import { FlowLine } from "@/components/FlowLine";
import { PixelIcon } from "@/components/PixelIcon";
import { TerminalWindow } from "@/components/TerminalWindow";
import type { PixelIconType } from "@/lib/icons";

const checks = [
  "Write the field's rules into the test",
  "Add the mess of a real experiment",
  "Make many versions of each case",
  "Grade with code, not another AI",
];

const inputs: Array<{ label: string; icon: PixelIconType }> = [
  // { label: "Hospital records", icon: "ehr" },
  { label: "Lab tests", icon: "assay" },
  { label: "Scans", icon: "ct-scan" },
  { label: "DNA", icon: "dna" },
];

const breaks: Array<{ icon: PixelIconType; title: string; body: string; rate: string; note: string }> = [
  {
    icon: "antibody",
    title: "How tightly a drug binds",
    body: "Uses a simple textbook formula and ignores how the sample reaches the sensor and how the signal fades.",
    rate: "67% to 100%",
    note: "Fail rate",
  },
  {
    icon: "ct-scan",
    title: "Cancer charts and scans over time",
    body: "Reads a temporary flare on a scan as the cancer growing, and skips the follow-up scan that would check.",
    rate: "78%",
    note: "Fail rate",
  },
  {
    icon: "dna",
    title: "Blood test for leftover cancer",
    body: "Calls leftover cancer from DNA in the blood without checking that it fits the tumor, or filtering mutations from normal aging blood cells.",
    rate: "72%",
    note: "Fail rate",
  },
];

export function Refinery() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("refinery-active");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    section.querySelectorAll("[data-refinery-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="why-models-fail" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <div data-refinery-reveal>
        <p className="text-[11px] tracking-[0.18em] text-[#525252]">HOW WE TEST</p>
        <h2 className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[26px]">
          Real lab and hospital work breaks today&apos;s best AI models.
        </h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#525252]">
          Each test comes from real records and has a known right answer. Models that ace textbook questions fail these.
        </p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div data-refinery-reveal className="min-w-0">
          <TerminalWindow title="How a test is built" className="lg:h-full" bodyClassName="p-3 lg:flex lg:flex-col">
            <div className="flex flex-wrap items-center gap-3">
              {inputs.map((input, index) => (
                <div key={input.label} className="refinery-input flex items-center gap-2">
                  <div className="flex items-center gap-2 border border-dashed border-[#0A0A0A]/40 px-1.5 py-1">
                    <PixelIcon type={input.icon} pixel={2} />
                    <span className="text-[10px] text-[#525252]">{input.label}</span>
                  </div>
                  {index < inputs.length - 1 ? <FlowLine length={28} /> : null}
                </div>
              ))}
            </div>
            <div className="relative mt-3 h-[240px] overflow-hidden border border-dashed border-[#0A0A0A]/20 lg:h-auto lg:min-h-[240px] lg:flex-1">
              <DitheredIsometricCube />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2 font-mono text-[10px] text-[#999]" aria-hidden="true"><span>INPUT / STRUCTURE</span><span>ENVIRONMENT / 01</span></div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 font-mono text-[10px] text-[#999]" aria-hidden="true"><span>RAW DATA</span><span>VERIFIABLE TASK</span></div>
            </div>
            <svg viewBox="0 0 400 44" className="mt-2 block h-auto w-full shrink-0" aria-hidden="true">
              <path d="M18 13 H382" fill="none" stroke="#dedede" />
              <path d="M18 13 H382" fill="none" stroke="#777" strokeDasharray="3 8" className="refinery-signal" />
              {[18, 200, 382].map((x, index) => <g key={x} className="refinery-node" style={{ animationDelay: `${index * 140}ms` }}><circle cx={x} cy="13" r="4" fill="#f6f6f6" stroke="#777" /><text x={x} y="36" textAnchor={index === 0 ? "start" : index === 2 ? "end" : "middle"} fontFamily="inherit" fontSize="9" letterSpacing=".8" fill="#888">{["DATA", "ENVIRONMENT", "VERIFIER"][index]}</text></g>)}
            </svg>
            <ul className="mt-2 space-y-1 text-[12px]">
              {checks.map((check, index) => (
                <li key={check} className="refinery-step flex items-start gap-2 py-1">
                  <span className="font-mono text-[10px] tabular-nums text-[#999]">{String(index + 1).padStart(2, "0")}</span>
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </TerminalWindow>
          </div>

          <div className="flex flex-col gap-4">
            <div data-refinery-reveal>
            <TerminalWindow title="Textbook questions, already solved" bodyClassName="p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <PixelIcon type="chart" pixel={3} />
                <p className="flex-1 text-[12px] leading-relaxed text-[#525252]">
                  Survival curves, gaps in follow-up, more than one cause of death, dose versus effect
                </p>
                <div className="refinery-metric border border-[#0A0A0A] px-2 py-1 text-right text-[12px]">
                  <p>First try: 100%</p>
                  <p className="text-[#525252]">(short problems)</p>
                </div>
              </div>
            </TerminalWindow>
            </div>

            <div data-refinery-reveal>
            <TerminalWindow title="Real work, where models break" bodyClassName="px-3">
              <ol>
                {breaks.map((item, index) => (
                  <li
                    key={item.title}
                    className="refinery-case flex flex-col gap-3 border-b border-dashed border-[#0A0A0A]/20 py-3 last:border-b-0 sm:flex-row sm:items-start"
                  >
                    <PixelIcon type={item.icon} pixel={3} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px]">
                        {index + 1}. {item.title}
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#525252]">{item.body}</p>
                    </div>
                    <div className="refinery-metric shrink-0 border border-[#0A0A0A] px-2 py-1 text-right text-[12px]">
                      <p className="text-[10px] text-[#525252]">{item.note}</p>
                      <p className="tabular-nums">{item.rate}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </TerminalWindow>
            </div>

            <div data-refinery-reveal>
            <TerminalWindow title="Graded by code" bodyClassName="p-3">
              <ul className="space-y-2 text-[12px]">
                <li className="flex items-center justify-between gap-3">
                  <span>Known-correct answer</span>
                  <span className="tabular-nums">1.0000</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Five easy shortcuts</span>
                  <span className="tabular-nums">&lt;= 0.42</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Today&apos;s best models</span>
                  <span>67% to 100% fail</span>
                </li>
              </ul>
            </TerminalWindow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
