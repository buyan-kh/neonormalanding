"use client";

import { useEffect, useState, type FormEvent } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";
import { CONTACT_EMAIL } from "@/lib/contact";

type Intent = "labs" | "data" | "investors";
type Status = "idle" | "sending" | "delivered" | "mailed" | "error";

const linkClass = "underline decoration-[#0A0A0A]/30 underline-offset-4 hover:decoration-[#0A0A0A]";

const intents: Array<{ id: Intent; label: string; subject: string; cta: string }> = [
  {
    id: "labs",
    label: "Buy RL tasks (AI Labs)",
    subject: "Evaluation sample",
    cta: "[Request 5-Task Sample]",
  },
  {
    id: "data",
    label: "Sell / partner data (Data Holders)",
    subject: "Data partnership",
    cta: "[Monetize Data]",
  },
  {
    id: "investors",
    label: "Invest (VCs & Angels)",
    subject: "Investor inquiry",
    cta: "[Connect with Founders]",
  },
];

function intentFromHash(hash: string): Intent | null {
  if (hash === "#labs" || hash === "#sample") return "labs";
  if (hash === "#data" || hash === "#partner") return "data";
  if (hash === "#investors") return "investors";
  return null;
}

function intakeMailto(intent: Intent, brief: string) {
  const subject = intents.find((item) => item.id === intent)?.subject ?? "Neo Norma intake";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;
}

export function RequestForm() {
  const [intent, setIntent] = useState<Intent>("labs");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [mailtoHref, setMailtoHref] = useState(`mailto:${CONTACT_EMAIL}`);

  useEffect(() => {
    const sync = () => {
      const next = intentFromHash(window.location.hash);
      if (next) setIntent(next);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const intentLabel = intents.find((item) => item.id === intent)?.label ?? intent;
  const brief = [
    "Neo Norma intake",
    `Intent: ${intentLabel}`,
    `Name: ${name}`,
    `Organization: ${organization}`,
    `Email: ${email}`,
    `Note: ${note || "(none)"}`,
  ].join("\n");

  function openMailto() {
    const href = intakeMailto(intent, brief);
    setMailtoHref(href);
    setStatus("mailed");
    setMessage("");
    window.location.href = href;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, organization, email, intent, note }),
      });
      const data = (await response.json()) as { ok?: boolean; delivered?: boolean; error?: string };
      if (data.ok === false) {
        setStatus("error");
        setMessage(data.error ?? "Intake rejected the request.");
        return;
      }
      if (data.delivered) {
        setStatus("delivered");
        setMessage("Request delivered to the Neo Norma intake.");
        return;
      }
      openMailto();
    } catch {
      openMailto();
    }
  }

  const field =
    "w-full border border-[#0A0A0A]/40 bg-white px-2 py-1.5 text-[13px] text-[#0A0A0A] outline-none placeholder:text-[#5A5852] focus:border-[#0A0A0A]";
  const cta = intents.find((item) => item.id === intent)?.cta ?? "[Send]";

  return (
    <section className="border-t border-[#0A0A0A]/20">
      <div id="request" className="mx-auto w-full max-w-[1080px] scroll-mt-32 px-4 py-10 md:px-6">
        <div id="labs" className="scroll-mt-32" />
        <div id="sample" className="scroll-mt-32" />
        <div id="data" className="scroll-mt-32" />
        <div id="partner" className="scroll-mt-32" />
        <div id="investors" className="scroll-mt-32" />
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">INTAKE</p>
        <h2 className="mt-3 text-[24px] leading-snug md:text-[26px]">Send an inquiry.</h2>
        {/* <p className="mt-3 flex flex-col gap-2 text-[13px]">
          <a href={CALENDLY_URL} className={linkClass} target="_blank" rel="noreferrer">
            Book 30-Min Pilot / Partner Call
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            Direct Desk {CONTACT_EMAIL}
          </a>
        </p> */}
        <div className="mt-6 max-w-[760px]">
          <TerminalWindow title="Intake" bodyClassName="p-3 md:p-4">
            <form
              action={`mailto:${CONTACT_EMAIL}`}
              method="POST"
              encType="text/plain"
              onSubmit={onSubmit}
              className="space-y-3"
            >
              <fieldset>
                <legend className="text-[11px] text-[#5A5852]">Intent</legend>
                <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Intent">
                  {intents.map((item) => {
                    const on = intent === item.id;
                    return (
                      <label
                        key={item.id}
                        className={`cursor-pointer border px-2 py-1 text-[12px] ${
                          on ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#0A0A0A]/40 text-[#0A0A0A]"
                        }`}
                      >
                        <input
                          className="sr-only"
                          type="radio"
                          name="intent"
                          value={item.id}
                          checked={on}
                          onChange={() => setIntent(item.id)}
                        />
                        {item.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <label className="block text-[11px] text-[#5A5852]">
                Name
                <input
                  className={`mt-1 ${field}`}
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={120}
                />
              </label>
              <label className="block text-[11px] text-[#5A5852]">
                Organization
                <input
                  className={`mt-1 ${field}`}
                  name="organization"
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                  required
                  maxLength={160}
                />
              </label>
              <label className="block text-[11px] text-[#5A5852]">
                Email
                <input
                  className={`mt-1 ${field}`}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  maxLength={180}
                />
              </label>
              <label className="block text-[11px] text-[#5A5852]">
                Note
                <textarea
                  className={`mt-1 min-h-24 ${field}`}
                  name="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={2000}
                />
              </label>
              <p className="text-[11px] text-[#5A5852]">Raw records stay off this form.</p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-[#0A0A0A] px-3 py-2 text-[12px] text-white hover:bg-[#262626] disabled:opacity-60"
              >
                {status === "sending" ? "[Sending...]" : cta}
              </button>
              <p className="min-h-5 text-[12px]" role="status">
                {status === "mailed" ? (
                  <>
                    Draft opened for{" "}
                    <a href={mailtoHref} className={linkClass}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </>
                ) : (
                  message
                )}
              </p>
              {status === "mailed" || status === "delivered" ? (
                <pre className="overflow-x-auto border border-[#0A0A0A]/30 p-2 text-[11px] leading-relaxed text-[#5A5852]">
                  {brief}
                </pre>
              ) : null}
            </form>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
