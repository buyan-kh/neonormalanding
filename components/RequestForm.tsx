"use client";

import { useEffect, useState, type FormEvent } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";
import { CONTACT_EMAIL } from "@/lib/contact";

type Intent = "sample" | "partner";
type Status = "idle" | "sending" | "delivered" | "mailed" | "error";

const linkClass = "underline decoration-[#EFECE6]/40 underline-offset-4 hover:decoration-[#EFECE6]";

function intakeMailto(intent: Intent, brief: string) {
  const subject = intent === "sample" ? "5-task sample" : "Data partnership (50/50)";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;
}

export function RequestForm() {
  const [intent, setIntent] = useState<Intent>("sample");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [mailtoHref, setMailtoHref] = useState(`mailto:${CONTACT_EMAIL}`);

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#partner") setIntent("partner");
      if (window.location.hash === "#sample") setIntent("sample");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const brief = [
    "Neo Norma intake",
    `Intent: ${intent === "sample" ? "5-task sample" : "Data partner (50/50)"}`,
    `Name: ${name}`,
    `Institution: ${institution}`,
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
        body: JSON.stringify({ name, institution, email, intent, note }),
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
    "w-full border border-[#EFECE6]/70 bg-transparent px-2 py-1.5 text-[13px] text-[#EFECE6] outline-none placeholder:text-[#9E9A90] focus:border-[#EFECE6]";

  return (
    <section className="border-t border-[#EFECE6]/30">
      <div id="request" className="mx-auto w-full max-w-[1240px] scroll-mt-32 px-4 py-16 md:px-6">
        <div id="sample" className="scroll-mt-32" />
        <div id="partner" className="scroll-mt-32" />
        <p className="text-[11px] tracking-[0.18em] text-[#9E9A90]">INTAKE</p>
        <h2 className="mt-3 text-[24px] leading-snug md:text-[30px]">Request a sample, or open a data partnership.</h2>
        <p className="mt-3 text-[13px]">
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>
        </p>
        <div className="mt-6 max-w-[760px]">
          <TerminalWindow title="Intake // Sample or Partner" bodyClassName="p-3 md:p-4">
            <form
              action={`mailto:${CONTACT_EMAIL}`}
              method="POST"
              encType="text/plain"
              onSubmit={onSubmit}
              className="space-y-3"
            >
              <fieldset className="space-y-2">
                <legend className="text-[11px] text-[#9E9A90]">Intent</legend>
                <label className="flex items-center gap-2 text-[13px]">
                  <input
                    className="accent-[#EFECE6]"
                    type="radio"
                    name="intent"
                    value="sample"
                    checked={intent === "sample"}
                    onChange={() => setIntent("sample")}
                  />
                  5-task sample
                </label>
                <label className="flex items-center gap-2 text-[13px]">
                  <input
                    className="accent-[#EFECE6]"
                    type="radio"
                    name="intent"
                    value="partner"
                    checked={intent === "partner"}
                    onChange={() => setIntent("partner")}
                  />
                  Data partner (50/50)
                </label>
              </fieldset>
              <label className="block text-[11px] text-[#9E9A90]">
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
              <label className="block text-[11px] text-[#9E9A90]">
                Lab / hospital
                <input
                  className={`mt-1 ${field}`}
                  name="institution"
                  value={institution}
                  onChange={(event) => setInstitution(event.target.value)}
                  required
                  maxLength={160}
                />
              </label>
              <label className="block text-[11px] text-[#9E9A90]">
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
              <label className="block text-[11px] text-[#9E9A90]">
                Note
                <textarea
                  className={`mt-1 min-h-24 ${field}`}
                  name="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={2000}
                />
              </label>
              <p className="text-[11px] text-[#9E9A90]">Raw patient tables stay off this form.</p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-[#EFECE6] px-3 py-2 text-[12px] text-[#070707] hover:bg-white disabled:opacity-60"
              >
                {status === "sending" ? "[Sending...]" : "[Send intake ->]"}
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
                <pre className="overflow-x-auto border border-dashed border-[#EFECE6]/50 p-2 text-[11px] leading-relaxed text-[#9E9A90]">
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
