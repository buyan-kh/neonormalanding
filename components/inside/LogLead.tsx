"use client";

import { useState, type FormEvent } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";
import { copyText } from "@/components/inside/clipboard";
import { CALENDLY_URL, CONTACT_EMAIL, HI_EMAIL, fieldClass, readyAssets } from "@/components/inside/content";
import { isLeadCategory, isLeadStage, useLeadBoard } from "@/components/inside/lead-store";
import { categoryFilters, categoryLabel, stageLabel, stages, type LeadCategory, type LeadStage } from "@/components/inside/leads";

export function LogLead({ signedInName }: { signedInName: string }) {
  const { addLead } = useLeadBoard();
  const [company, setCompany] = useState("");
  const [contacts, setContacts] = useState("");
  const [category, setCategory] = useState<LeadCategory>("frontier");
  const [stage, setStage] = useState<LeadStage>("contact");
  const [packageName, setPackageName] = useState("");
  const [notes, setNotes] = useState("");
  const [hook, setHook] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = company.trim();
    if (!name) {
      setStatus("Add a company name before you log the lead.");
      return;
    }
    const nextNotes = notes.trim() || "Logged from the desk.";
    const nextHook = hook.trim() || nextNotes;
    const nextPackage = packageName.trim() || "$15k 48h Pilot / $130k 200-Task Pack";
    const nextContacts = contacts.trim() || "Not listed yet";
    const lead = {
      id: `custom-${crypto.randomUUID()}`,
      company: name,
      category,
      stage,
      contacts: nextContacts,
      package: nextPackage,
      notes: nextNotes,
      hook: nextHook,
    };
    addLead(lead);
    const body = [
      "NEO NORMA // NEW LEAD",
      `Logged by: ${signedInName}`,
      `Company: ${name}`,
      `Contacts: ${nextContacts}`,
      `Category: ${categoryLabel(category)}`,
      `Stage: ${stageLabel(stage)}`,
      `Package: ${nextPackage}`,
      `Notes: ${nextNotes}`,
      `Hook: ${nextHook}`,
    ].join("\n");
    await copyText(body);
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`New lead: ${name}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus(`${name} is on the board. The lead summary is copied, and the email to ${CONTACT_EMAIL} is open.`);
    setCompany("");
    setContacts("");
    setPackageName("");
    setNotes("");
    setHook("");
  }

  return (
    <section id="log-lead" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">04 // LOG A NEW LEAD / READY-TO-SEND ASSETS</p>
        <h2 className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[26px]">Put the lead on the board and send it to Buyan.</h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          One click logs the account onto the pipeline and opens an email to {CONTACT_EMAIL}. {HI_EMAIL} reaches the same
          desk. Book Buyan at {CALENDLY_URL.replace("https://", "")}.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <TerminalWindow title="Log a lead" wrapTitle bodyClassName="p-3 md:p-4">
            <form onSubmit={onSubmit} className="grid gap-3">
              <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
                COMPANY
                <input value={company} onChange={(event) => setCompany(event.target.value)} className={fieldClass} required />
              </label>
              <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
                PERSON / CONTACTS
                <input value={contacts} onChange={(event) => setContacts(event.target.value)} className={fieldClass} placeholder="Name, email, or handle" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
                  CATEGORY
                  <select
                    value={category}
                    onChange={(event) => {
                      if (isLeadCategory(event.target.value)) setCategory(event.target.value);
                    }}
                    className={fieldClass}
                  >
                    {categoryFilters
                      .filter((item) => item.id !== "all")
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
                  STAGE
                  <select
                    value={stage}
                    onChange={(event) => {
                      if (isLeadStage(event.target.value)) setStage(event.target.value);
                    }}
                    className={fieldClass}
                  >
                    {stages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
                PACKAGE
                <input value={packageName} onChange={(event) => setPackageName(event.target.value)} className={fieldClass} placeholder="$5k-$15k pilot, $130k pack, 50/50 MOU" />
              </label>
              <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
                NOTES
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className={fieldClass} />
              </label>
              <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
                OUTREACH HOOK
                <textarea value={hook} onChange={(event) => setHook(event.target.value)} rows={3} className={fieldClass} />
              </label>
              <button type="submit" className="bg-[#D9D9D9] px-3 py-2 text-left text-[12px] text-[#303030] hover:bg-[#C9C9C9]">
                [Log Lead & Email Buyan]
              </button>
              <p className="min-h-5 text-[12px] text-[#5A5852]" role="status">
                {status}
              </p>
            </form>
          </TerminalWindow>

          <TerminalWindow title="Ready-to-send assets" wrapTitle className="h-full" bodyClassName="p-3 md:p-4">
            <p className="text-[12px] leading-relaxed text-[#5A5852]">
              Ask Buyan for the file if it is not already on your machine. These are the four packs we send.
            </p>
            <ul className="mt-4 space-y-3">
              {readyAssets.map((asset) => (
                <li key={asset.name} className="border border-dashed border-[#0A0A0A] px-2 py-2">
                  <p className="text-[13px]">{asset.name}</p>
                  <p className="mt-1 font-mono text-[11px] text-[#5A5852]">{asset.file}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-[#5A5852]">
              Handoff: {CONTACT_EMAIL}, {HI_EMAIL}, @buyan_kh, {CALENDLY_URL.replace("https://", "")}.
            </p>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
