"use client";

import { useState } from "react";
import { FlowLine } from "@/components/FlowLine";
import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/contact";

const tracks = [
  {
    kicker: "01 // FOR AI LABS",
    title: "Buy RL Tasks & Environments",
    body: "We sell verifiable RL evaluation tasks and containerized Harbor/Docker post-training environments with <50ms Python graders. Start with a 5-task evaluation sample or license full environment tranches.",
    href: CALENDLY_URL,
    external: true,
    cta: "[Book 30-Min Pilot]",
  },
  {
    kicker: "02 // FOR DATA HOLDERS",
    title: "Sell or Partner Your Data",
    body: "Have proprietary clinical, biotech, or scientific records? Sell datasets directly to us or partner with us to turn dormant archives into recurring revenue while raw data stays private.",
    href: CALENDLY_URL,
    external: true,
    cta: "[Book a Partner Call]",
  },
  {
    kicker: "03 // FOR INVESTORS",
    title: "Invest in Neo Norma",
    body: "Frontier labs have exhausted the public internet. We are building the verifiable post-training environment refinery for empirical science.",
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Investor inquiry")}`,
    external: false,
    cta: "[Direct Desk]",
  },
];

const deals = {
  labs: {
    label: "[If You Are an AI Lab (Buying Environments)]",
    steps: [
      ["01 Scope", "Pick target scientific domains, failure modes, and harness format (Harbor, Docker, or custom)."],
      ["02 5-Task Pilot", "Evaluate a gated 5-task sample tranche on your frontier checkpoints under mutual NDA."],
      ["03 Grader & Preflight Audit", "Verify <50ms deterministic Python Grader runtime and anti-shortcut trap resistance (<= 0.42)."],
      ["04 Tranche Delivery", "Pull containerized RL environments and reference solvers directly into your post-training pipeline."],
      ["05 Holdout Refresh", "Receive fresh held-out clinical and wet-lab splits with zero public web exposure."],
    ],
  },
  holders: {
    label: "[If You Are a Data Holder (Selling or Partnering Data)]",
    steps: [
      ["01 Inventory Counts (No Files Sent)", "Tell us assay types, modalities, and record counts. Nothing leaves your systems."],
      ["02 At-Source De-Identification", "Patient and institutional identifiers are scrubbed inside your boundary before any transfer."],
      ["03 License or Rev-Share", "Sign a direct purchase agreement or recurring revenue-share license with full audit rights."],
      ["04 Environment Refinery", "We compile your noisy longitudinal records into containerized RL tasks and deterministic Graders."],
      ["05 Recurring Payouts", "Earn upfront payment or ongoing royalties every time an AI lab licenses environments built on your archive."],
    ],
  },
} as const;

export function DataPartners() {
  const [side, setSide] = useState<keyof typeof deals>("labs");
  const active = deals[side];
  return (
    <section id="work" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">03 // WORK WITH US</p>
        <h2 className="mt-3 max-w-[16em] text-[24px] leading-snug md:text-[26px]">Three ways to work with Neo Norma.</h2>
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {tracks.map((track, index) => (
            <div key={track.kicker} className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
              <article className="flex h-full flex-1 flex-col border border-[#0A0A0A] bg-white p-4">
                <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">{track.kicker}</p>
                <h3 className="mt-3 text-[15px] leading-snug">{track.title}</h3>
                <p className="mt-3 flex-1 text-[12px] leading-relaxed text-[#5A5852]">{track.body}</p>
                <a
                  href={track.href}
                  className="mt-5 inline-flex w-fit items-center bg-[#D9D9D9] px-3 py-2 text-[12px] text-[#303030] hover:bg-[#C9C9C9]"
                  {...(track.external ? { target: "_blank", rel: "noreferrer" } : {})}
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
        <div className="mt-8 border border-[#0A0A0A] bg-white p-4">
          <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">5-STEP DEAL PROCESS</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row" role="tablist" aria-label="Deal process">
            {(Object.keys(deals) as Array<keyof typeof deals>).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={side === key}
                onClick={() => setSide(key)}
                className={`border px-2 py-2 text-left text-[12px] ${side === key ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#0A0A0A]/40"}`}
              >
                {deals[key].label}
              </button>
            ))}
          </div>
          <ol className="mt-4 grid gap-3 md:grid-cols-5">
            {active.steps.map(([title, body]) => (
              <li key={title} className="border border-[#0A0A0A]/30 p-2">
                <p className="text-[12px]">{title}</p>
                <p className="mt-2 text-[11px] leading-relaxed text-[#5A5852]">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
