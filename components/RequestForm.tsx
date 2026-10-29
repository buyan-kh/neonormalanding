"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";
import { postRequest, REQUEST_ERROR, REQUEST_THANKS, requestContext } from "@/lib/submit-request";

type Intent = "labs" | "data" | "investors";
type Status = "idle" | "sending" | "delivered" | "error";

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

export function RequestForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [intent, setIntent] = useState<Intent>("labs");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("intake-active");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    section.querySelectorAll("[data-intake-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sync = () => {
      const next = intentFromHash(window.location.hash);
      if (next) setIntent(next);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const context = requestContext();
    const ok = await postRequest({
      name,
      email,
      organization,
      role: intent,
      message: note,
      source: context.source,
      as: context.as,
      nn_leave_blank: honey,
    });
    if (ok) {
      setStatus("delivered");
      setMessage(REQUEST_THANKS);
      return;
    }
    setStatus("error");
    setMessage(REQUEST_ERROR);
  }

  const field =
    "w-full border border-[#0A0A0A]/40 bg-white px-2 py-1.5 text-[13px] text-[#0A0A0A] outline-none transition-colors duration-200 placeholder:text-[#5A5852] hover:border-[#0A0A0A]/70 focus:border-[#0A0A0A] focus:bg-[#fafafa]";
  const cta = intents.find((item) => item.id === intent)?.cta ?? "[Send]";

  return (
    <section ref={sectionRef} className="border-t border-[#0A0A0A]/20">
      <div id="request" className="mx-auto w-full max-w-[1080px] scroll-mt-32 px-4 py-10 md:px-6">
        <div id="labs" className="scroll-mt-32" />
        <div id="sample" className="scroll-mt-32" />
        <div id="data" className="scroll-mt-32" />
        <div id="partner" className="scroll-mt-32" />
        <div id="investors" className="scroll-mt-32" />
        <div id="intake" className="scroll-mt-32" />
        <div data-intake-reveal>
          <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">INTAKE</p>
          <h2 className="mt-3 text-[24px] leading-snug md:text-[26px]">Send an inquiry.</h2>
        </div>
        <div data-intake-reveal className="mt-6 max-w-[760px]">
          <TerminalWindow title="Intake" bodyClassName="p-3 md:p-4">
            <form onSubmit={onSubmit} className="space-y-3">
              <fieldset className="intake-item">
                <legend className="text-[11px] text-[#5A5852]">Intent</legend>
                <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Intent">
                  {intents.map((item) => {
                    const on = intent === item.id;
                    return (
                      <label
                        key={item.id}
                        className={`inline-flex min-h-11 max-w-full cursor-pointer items-center whitespace-normal border px-3 py-2 text-left text-[12px] leading-snug transition-colors duration-200 focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-[#0A0A0A] lg:min-h-0 lg:px-2 lg:py-1 ${
                          on ? "border-[#C5C5C5] bg-[#E4E4E4] text-[#303030]" : "border-[#0A0A0A]/40 text-[#0A0A0A]"
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
              <label className="intake-item block text-[11px] text-[#5A5852]">
                Name
                <input
                  className={`mt-1 min-h-11 lg:min-h-0 ${field}`}
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={120}
                />
              </label>
              <label className="intake-item block text-[11px] text-[#5A5852]">
                Organization
                <input
                  className={`mt-1 min-h-11 lg:min-h-0 ${field}`}
                  name="organization"
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                  required
                  maxLength={160}
                />
              </label>
              <label className="intake-item block text-[11px] text-[#5A5852]">
                Email
                <input
                  className={`mt-1 min-h-11 lg:min-h-0 ${field}`}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  maxLength={180}
                />
              </label>
              <label className="intake-item block text-[11px] text-[#5A5852]">
                Note
                <textarea
                  className={`mt-1 min-h-24 ${field}`}
                  name="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={2000}
                />
              </label>
              <p className="sr-only" aria-hidden="true">
                <label>
                  Leave blank
                  <input
                    name="nn_leave_blank"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honey}
                    onChange={(event) => setHoney(event.target.value)}
                  />
                </label>
              </p>
              <p className="intake-item text-[11px] text-[#5A5852]">Raw records stay off this form.</p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="intake-item inline-flex min-h-11 items-center bg-[#D9D9D9] px-3 py-2 text-[12px] text-[#303030] transition-colors duration-200 hover:bg-[#C9C9C9] disabled:opacity-60 lg:min-h-0"
              >
                {status === "sending" ? "[Sending...]" : cta}
              </button>
              <p className="min-h-5 text-[12px]" role="status">
                {message}
              </p>
            </form>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
