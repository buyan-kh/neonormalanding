"use client";

import { useState, type FormEvent } from "react";
import { postRequest, REQUEST_ERROR, REQUEST_THANKS, requestContext } from "@/lib/submit-request";

const roles = [
  { id: "labs", as: "lab", label: "building intelligence" },
  { id: "data", as: "holder", label: "holding a record" },
  { id: "investors", as: "fund", label: "funding" },
] as const;

type Role = (typeof roles)[number]["id"];

export function AccessForm({ preset }: { preset?: string }) {
  const initial = roles.find((role) => role.as === preset)?.id ?? "labs";
  const [role, setRole] = useState<Role>(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [note, setNote] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const context = requestContext();
    const ok = await postRequest({
      name,
      email,
      organization,
      role,
      message: note,
      source: context.source,
      as: context.as,
      nn_leave_blank: honey,
    });
    setStatus(ok ? "done" : "error");
  }

  if (status === "done") {
    return <p className="mt-10 text-[28px] leading-snug">{REQUEST_THANKS}</p>;
  }

  const field = "nu-field";

  return (
    <form onSubmit={onSubmit} className="mt-10 max-w-[36rem] space-y-6">
      <label className="block text-[18px]">
        Name
        <input className={field} name="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} />
      </label>
      <label className="block text-[18px]">
        Email
        <input className={field} type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={180} />
      </label>
      <label className="block text-[18px]">
        Organization
        <input className={field} name="organization" value={organization} onChange={(event) => setOrganization(event.target.value)} required maxLength={160} />
      </label>
      <fieldset>
        <legend className="text-[18px]">I am</legend>
        <div className="mt-3 flex flex-col gap-2">
          {roles.map((item) => (
            <label key={item.id} className="nu-tap gap-3 text-[18px]">
              <input
                type="radio"
                name="as"
                value={item.id}
                checked={role === item.id}
                onChange={() => setRole(item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-[18px]">
        Note
        <textarea className={`${field} min-h-32 py-3`} name="note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={2000} />
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
      <button type="submit" disabled={status === "sending"} className="nu-btn nu-btn-wide disabled:opacity-50">
        {status === "sending" ? "Sending" : "Send"} <span className="nu-arr" aria-hidden="true">→</span>
      </button>
      {status === "error" ? <p className="text-[16px]">{REQUEST_ERROR}</p> : null}
    </form>
  );
}
