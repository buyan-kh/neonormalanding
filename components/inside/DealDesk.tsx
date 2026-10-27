"use client";

import { useState, type FormEvent } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";
import { copyText } from "@/components/inside/clipboard";
import {
  BEN_EMAIL,
  CALENDLY_URL,
  CONTACT_EMAIL,
  DESK_EMAILS,
  dealTypes,
  expectedTiers,
  type DeskMode,
} from "@/components/inside/content";

const field =
  "mt-1 w-full border border-[#0A0A0A]/40 bg-white px-2 py-1.5 text-[13px] text-[#0A0A0A] outline-none placeholder:text-[#5A5852] hover:border-[#0A0A0A]/70 focus:border-[#0A0A0A] focus:bg-[#fafafa]";

const linkClass = "underline decoration-[#0A0A0A]/30 underline-offset-4 hover:decoration-[#0A0A0A]";

function leadCard(input: {
  rep: string;
  dealType: string;
  prospect: string;
  company: string;
  tier: string;
  notes: string;
}) {
  return [
    "NEO NORMA // DEAL REGISTRATION",
    `Rep: ${input.rep}`,
    `Deal type: ${input.dealType}`,
    `Prospect: ${input.prospect}`,
    `Company: ${input.company}`,
    `Expected tier: ${input.tier}`,
    `Notes: ${input.notes.trim() || "(none)"}`,
    "",
    "Please lock this lead to the rep for 90 days.",
  ].join("\n");
}

function registerMailto(subject: string, body: string) {
  return `mailto:${DESK_EMAILS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function DealDesk({ mode, onShowHq }: { mode: DeskMode; onShowHq: () => void }) {
  const [rep, setRep] = useState("");
  const [dealType, setDealType] = useState<(typeof dealTypes)[number]>("AI Lab Buyer");
  const [prospect, setProspect] = useState("");
  const [company, setCompany] = useState("");
  const [tier, setTier] = useState<(typeof expectedTiers)[number]>("$5k Pilot");
  const [notes, setNotes] = useState("");
  const [card, setCard] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextCard = leadCard({ rep, dealType, prospect, company, tier, notes });
    const subject = `Deal registration: ${company} - ${prospect}`;
    const href = registerMailto(subject, nextCard);
    setCard(nextCard);
    const copied = await copyText(nextCard);
    setStatus(
      copied
        ? "Lead card copied. Your email draft to Buyan and Ben is open."
        : "Email draft opened. Copy the lead card below if it did not land on your clipboard.",
    );
    window.location.href = href;
  }

  return (
    <section className="scroll-mt-32 border-t border-[#0A0A0A]/20" aria-labelledby="deal-heading">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        {mode === "sales" ? (
          <>
            <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">04 // DEAL REGISTRATION & COMPANY OPERATING HUB</p>
            <h2 id="deal-heading" className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[26px]">
              How you lock a lead and get paid.
            </h2>
          </>
        ) : (
          <h2 id="deal-heading" className="text-[24px] leading-snug md:text-[26px]">
            Register a lead from the desk.
          </h2>
        )}
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Four steps. You register the name. Buyan and Ben run the demo, send the order form, and pay you after the
          buyer pays.
        </p>

        <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <li className="border border-[#0A0A0A] bg-white p-3">
            <p className="font-mono text-[11px] text-[#5A5852]">01 // Register the Lead</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5A5852]">
              Send the prospect&apos;s name and company to{" "}
              <a className={linkClass} href={`mailto:${CONTACT_EMAIL}`}>
                Buyan ({CONTACT_EMAIL})
              </a>{" "}
              and{" "}
              <a className={linkClass} href={`mailto:${BEN_EMAIL}`}>
                Ben ({BEN_EMAIL})
              </a>
              , or log it in the window below. That locks the lead to you for 90 days.
            </p>
          </li>
          <li className="border border-[#0A0A0A] bg-white p-3">
            <p className="font-mono text-[11px] text-[#5A5852]">02 // Book the 30-Min Intro or Send a Sample</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5A5852]">
              Use{" "}
              <a className={linkClass} href={CALENDLY_URL} target="_blank" rel="noreferrer">
                calendly.com/buyan-neonorma/30min
              </a>{" "}
              or request the 5-task preview pack from the desk.
            </p>
          </li>
          <li className="border border-[#0A0A0A] bg-white p-3">
            <p className="font-mono text-[11px] text-[#5A5852]">03 // Demo & 1-Page Order Form</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5A5852]">
              Buyan (Technical Founder) and Ben (Commercial Co-Founder) run the live walkthrough and send the 1-page
              Order Form and Invoice.
            </p>
          </li>
          <li className="border border-[#0A0A0A] bg-white p-3">
            <p className="font-mono text-[11px] text-[#5A5852]">04 // Fast Payout</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5A5852]">
              The buyer wires or pays. You are paid within 5 business days after that payment clears.
            </p>
          </li>
        </ol>

        <div className="mt-6 max-w-[760px]">
          <TerminalWindow title="Register a Deal / Lead" bodyClassName="p-3 md:p-4">
            <form onSubmit={onSubmit} className="space-y-3">
              <label className="block text-[11px] text-[#5A5852]">
                Rep name
                <input
                  className={field}
                  name="rep"
                  value={rep}
                  onChange={(event) => setRep(event.target.value)}
                  placeholder="Tugi"
                  required
                  maxLength={120}
                  autoComplete="name"
                />
              </label>
              <fieldset>
                <legend className="text-[11px] text-[#5A5852]">Deal type</legend>
                <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Deal type">
                  {dealTypes.map((item) => {
                    const on = dealType === item;
                    return (
                      <label
                        key={item}
                        className={`cursor-pointer border px-2 py-1 text-[12px] focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-[#0A0A0A] ${
                          on ? "border-[#C5C5C5] bg-[#E4E4E4] text-[#303030]" : "border-[#0A0A0A]/40 text-[#0A0A0A]"
                        }`}
                      >
                        <input
                          className="sr-only"
                          type="radio"
                          name="deal-type"
                          value={item}
                          checked={on}
                          onChange={() => setDealType(item)}
                        />
                        {item}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <label className="block text-[11px] text-[#5A5852]">
                Prospect name and role
                <input
                  className={field}
                  name="prospect"
                  value={prospect}
                  onChange={(event) => setProspect(event.target.value)}
                  placeholder="Ada Lovelace, Evaluation Lead"
                  required
                  maxLength={180}
                  autoComplete="off"
                />
              </label>
              <label className="block text-[11px] text-[#5A5852]">
                Company / lab
                <input
                  className={field}
                  name="company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  required
                  maxLength={180}
                  autoComplete="organization"
                />
              </label>
              <fieldset>
                <legend className="text-[11px] text-[#5A5852]">Expected tier</legend>
                <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Expected tier">
                  {expectedTiers.map((item) => {
                    const on = tier === item;
                    return (
                      <label
                        key={item}
                        className={`cursor-pointer border px-2 py-1 text-[12px] focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-[#0A0A0A] ${
                          on ? "border-[#C5C5C5] bg-[#E4E4E4] text-[#303030]" : "border-[#0A0A0A]/40 text-[#0A0A0A]"
                        }`}
                      >
                        <input
                          className="sr-only"
                          type="radio"
                          name="tier"
                          value={item}
                          checked={on}
                          onChange={() => setTier(item)}
                        />
                        {item}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <label className="block text-[11px] text-[#5A5852]">
                Notes
                <textarea
                  className={`min-h-24 ${field}`}
                  name="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  maxLength={2000}
                />
              </label>
              <button
                type="submit"
                className="bg-[#D9D9D9] px-3 py-2 text-[12px] text-[#303030] hover:bg-[#C9C9C9]"
              >
                [Register Lead via Direct Desk]
              </button>
              <p className="min-h-5 text-[12px] text-[#5A5852]" role="status">
                {status}
              </p>
              {card ? (
                <pre className="overflow-x-auto border border-[#0A0A0A]/30 p-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-[#5A5852]">
                  {card}
                </pre>
              ) : null}
            </form>
          </TerminalWindow>
        </div>

        {mode === "sales" ? (
          <button
            type="button"
            onClick={onShowHq}
            className="mt-6 border border-[#0A0A0A] px-3 py-2 text-[12px] text-[#0A0A0A] hover:bg-[#EAEAEA] hover:text-[#303030]"
          >
            [Open Company HQ & Deal Desk]
          </button>
        ) : null}
      </div>
    </section>
  );
}
