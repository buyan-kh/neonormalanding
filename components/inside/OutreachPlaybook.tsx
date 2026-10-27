"use client";

import { useState } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";
import { copyText } from "@/components/inside/clipboard";
import { CONTACT_EMAIL, objections, scripts } from "@/components/inside/content";

export function OutreachPlaybook() {
  const [open, setOpen] = useState<string | null>(objections[0]?.q ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyNote, setCopyNote] = useState("");

  async function copyScript(id: string, text: string) {
    const copied = await copyText(text);
    if (copied) {
      setCopiedId(id);
      setCopyNote("Script copied.");
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1600);
      return;
    }
    setCopiedId(null);
    setCopyNote("Copy failed. Select the script and copy it by hand.");
  }

  return (
    <section id="outreach" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">03 // OUTREACH SCRIPTS & OBJECTION CHEAT SHEET</p>
        <h2 className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[26px]">The words, ready to send.</h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Copy a script, put their name in, and send it. If the account is already in stage 03 or 04, check with Buyan
          before you write again. Every handoff goes to Buyan Khurelbaatar at {CONTACT_EMAIL}.
        </p>

        <div className="mt-6 grid gap-4">
          {scripts.map((script) => (
            <TerminalWindow key={script.id} title={script.title} wrapTitle bodyClassName="p-3 md:p-4">
              <pre className="overflow-x-auto border border-dashed border-[#0A0A0A] p-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-[#0A0A0A]">
                {script.text}
              </pre>
              <button
                type="button"
                onClick={() => copyScript(script.id, script.text)}
                className="mt-3 bg-[#D9D9D9] px-3 py-2 text-[12px] text-[#303030] hover:bg-[#C9C9C9]"
              >
                {copiedId === script.id ? "[Copied]" : "[Copy Script]"}
              </button>
            </TerminalWindow>
          ))}
        </div>
        <p className="mt-3 min-h-5 text-[12px] text-[#5A5852]" role="status">
          {copyNote}
        </p>

        <h3 className="mt-8 text-[13px] tracking-[0.14em] text-[#5A5852]">OBJECTION CHEAT SHEET</h3>
        <div className="mt-4 grid gap-3">
          {objections.map((item) => {
            const expanded = open === item.q;
            return (
              <div key={item.q} className="border border-[#0A0A0A] bg-white">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : item.q)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px] hover:bg-[#F5F5F4]"
                >
                  <span>{item.q}</span>
                  <span className="shrink-0 font-mono text-[11px]">{expanded ? "[-]" : "[+]"}</span>
                </button>
                {expanded ? <p className="border-t border-[#0A0A0A] px-3 py-3 text-[13px] leading-relaxed text-[#5A5852]">{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
