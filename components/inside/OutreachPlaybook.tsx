"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";
import { copyText } from "@/components/inside/clipboard";
import { audienceTabs, houseLists, objections, scripts } from "@/components/inside/content";

export function OutreachPlaybook() {
  const [tab, setTab] = useState<(typeof audienceTabs)[number]["id"] | "house">("buyers");
  const [open, setOpen] = useState<string | null>(objections[0]?.q ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyNote, setCopyNote] = useState("");

  useEffect(() => {
    if (!copiedId) return;
    const timer = window.setTimeout(() => setCopiedId(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedId]);

  async function copyScript(id: string, text: string) {
    const copied = await copyText(text);
    if (copied) {
      setCopiedId(id);
      setCopyNote("Script copied.");
      return;
    }
    setCopiedId(null);
    setCopyNote("Copy failed. Select the script and copy it by hand.");
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const order = ["buyers", "partners", "house"] as const;
    const index = order.indexOf(tab);
    const next = event.key === "ArrowRight" ? (index + 1) % order.length : (index - 1 + order.length) % order.length;
    const id = order[next];
    setTab(id);
    document.getElementById(`outreach-tab-${id}`)?.focus();
  }

  const buyer = audienceTabs[0];
  const partner = audienceTabs[1];

  return (
    <section id="outreach" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">03 // OUTREACH PLAYBOOK & COPY-PASTE SCRIPTS</p>
        <h2 className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[26px]">Who to write, and the exact words.</h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Copy a script, put their name in, and send it. If the name is on the house list, check with Buyan and Ben first.
        </p>

        <div className="mt-6">
          <TerminalWindow title="Who to target vs. active house list" wrapTitle bodyClassName="p-3 md:p-4">
            <div role="tablist" aria-label="Outreach lists" className="flex flex-col gap-2" onKeyDown={onTabKey}>
              {[
                { id: "buyers" as const, label: buyer.label },
                { id: "partners" as const, label: partner.label },
                { id: "house" as const, label: "Active House Deals (Check with Buyan & Ben before messaging)" },
              ].map((item) => {
                const on = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`outreach-tab-${item.id}`}
                    aria-selected={on}
                    aria-controls="outreach-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setTab(item.id)}
                    className={`px-2 py-2 text-left text-[12px] ${
                      on ? "bg-[#D9D9D9] text-[#303030]" : "border border-[#0A0A0A]/40 text-[#0A0A0A] hover:bg-[#EAEAEA]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div id="outreach-panel" role="tabpanel" aria-labelledby={`outreach-tab-${tab}`} className="mt-4">
              {tab === "house" ? (
                <div className="space-y-4">
                  <p className="border border-dashed border-[#0A0A0A] px-2 py-2 text-[12px] leading-relaxed">
                    Check with Buyan & Ben before messaging. These conversations are already moving.
                  </p>
                  {houseLists.map((group) => (
                    <div key={group.title}>
                      <h3 className="text-[12px]">{group.title}</h3>
                      <ul className="mt-2 space-y-1">
                        {group.items.map((item) => (
                          <li key={item} className="border border-dashed border-[#0A0A0A]/40 px-2 py-1 text-[12px] text-[#5A5852]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <AudienceList tabId={tab} buyer={buyer} partner={partner} />
              )}
            </div>
          </TerminalWindow>
        </div>

        <h3 className="mt-8 text-[13px] tracking-[0.14em] text-[#5A5852]">COPY-PASTE SCRIPTS</h3>
        <div className="mt-4 grid gap-4">
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

        <h3 className="mt-8 text-[13px] tracking-[0.14em] text-[#5A5852]">QUICK OBJECTION ANSWERS</h3>
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

function AudienceList({
  tabId,
  buyer,
  partner,
}: {
  tabId: "buyers" | "partners";
  buyer: (typeof audienceTabs)[number];
  partner: (typeof audienceTabs)[number];
}) {
  const active = tabId === "buyers" ? buyer : partner;
  return (
    <div>
      <p className="text-[12px] leading-relaxed text-[#5A5852]">{active.intro}</p>
      <ul className="mt-3 space-y-2">
        {active.people.map((person) => (
          <li key={person} className="border border-dashed border-[#0A0A0A]/40 px-2 py-2 text-[12px] leading-relaxed">
            {person}
          </li>
        ))}
      </ul>
    </div>
  );
}
