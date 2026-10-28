"use client";

import { useRef, useState, type DragEvent, type FormEvent, type RefObject } from "react";
import { WindowControls } from "@/components/TerminalWindow";
import { copyText } from "@/components/inside/clipboard";
import { fieldClass } from "@/components/inside/content";
import { isLeadCategory, isLeadStage, useLeadBoard } from "@/components/inside/lead-store";
import {
  categoryFilters,
  categoryLabel,
  defaultLeads,
  neighborStage,
  stages,
  type Lead,
  type LeadCategory,
  type LeadStage,
} from "@/components/inside/leads";

const chipOn = "border border-[#D9D9D9] bg-[#D9D9D9] px-2 py-1 text-left text-[11px] text-[#303030]";
const chipOff = "border border-[#0A0A0A] px-2 py-1 text-left text-[11px] text-[#0A0A0A] hover:bg-[#EAEAEA]";

export function LeadBoard() {
  const { leads, moveLead, addLead, resetLeads } = useLeadBoard();
  const [category, setCategory] = useState<(typeof categoryFilters)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [over, setOver] = useState<LeadStage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [armReset, setArmReset] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const needle = query.trim().toLowerCase();
  const visible = leads.filter((lead) => {
    if (category !== "all" && lead.category !== category) return false;
    if (!needle) return true;
    const haystack = [lead.company, lead.site, lead.contacts, lead.package, lead.notes, lead.hook, categoryLabel(lead.category)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });

  async function copyHook(lead: Lead) {
    const copied = await copyText(lead.hook);
    setCopiedId(copied ? lead.id : null);
    setNote(copied ? `Hook copied for ${lead.company}.` : "Copy failed. Select the hook and copy it by hand.");
    if (copied) window.setTimeout(() => setCopiedId((current) => (current === lead.id ? null : current)), 1600);
  }

  function onDrop(event: DragEvent<HTMLElement>, stage: LeadStage) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) moveLead(id, stage);
    setOver(null);
  }

  function resetBoard() {
    if (!armReset) {
      setArmReset(true);
      setNote("Press [Reset Default Board] again to restore the 36 default accounts.");
      return;
    }
    resetLeads();
    setArmReset(false);
    setNote("Board reset to the 36 default accounts.");
  }

  return (
    <section id="pipeline" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">01 // KANBAN & LEAD PIPELINE ({leads.length} Accounts)</p>
        <h2 className="mt-3 max-w-[20em] text-[24px] leading-snug md:text-[26px]">
          Every target lab and data partner, in one board.
        </h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Work the list from the left. Accounts in stage 03 or 04 are already in motion. Check with Buyan before you
          message them again. Click a hook to copy it. Moves stay in this browser.
        </p>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categoryFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
              className={category === item.id ? chipOn : chipOff}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <label className="block min-w-0 flex-1 text-[11px] tracking-[0.12em] text-[#5A5852]">
            SEARCH
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by company, person, or handle..."
              className={fieldClass}
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Board view">
            <button type="button" aria-pressed={view === "kanban"} onClick={() => setView("kanban")} className={view === "kanban" ? chipOn : chipOff}>
              [KANBAN VIEW]
            </button>
            <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")} className={view === "table" ? chipOn : chipOff}>
              [TABLE / LIST VIEW]
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => dialogRef.current?.showModal()} className="bg-[#D9D9D9] px-3 py-2 text-[12px] text-[#303030] hover:bg-[#C9C9C9]">
            [+ Add Lead]
          </button>
          <button type="button" onClick={resetBoard} className="border border-[#0A0A0A] px-3 py-2 text-[12px] hover:bg-[#EAEAEA]">
            [Reset Default Board]
          </button>
          <p className="text-[12px] text-[#5A5852]">
            Showing {visible.length} of {leads.length}. Default set is {defaultLeads.length}.
          </p>
        </div>
        <p className="mt-3 min-h-5 text-[12px] text-[#5A5852]" role="status">
          {note}
        </p>

        {visible.length === 0 ? (
          <p className="border border-dashed border-[#0A0A0A] px-3 py-3 text-[13px]">No leads match this filter.</p>
        ) : view === "kanban" ? (
          <div className="mt-2 overflow-x-auto pb-2">
            <div className="flex w-max gap-3">
              {stages.map((stage) => {
                const column = visible.filter((lead) => lead.stage === stage.id);
                return (
                  <section
                    key={stage.id}
                    aria-label={stage.label}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setOver(stage.id);
                    }}
                    onDrop={(event) => onDrop(event, stage.id)}
                    className={`flex h-[min(70vh,760px)] w-[270px] shrink-0 flex-col border border-[#0A0A0A] ${over === stage.id ? "bg-[#F5F5F4]" : "bg-white"}`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#0A0A0A] bg-[#F5F5F4] px-2 py-1">
                      <h3 className="min-w-0 text-[10px] leading-snug tracking-wide">
                        {stage.label}
                        <span className="mt-1 block font-mono text-[11px]">{column.length}</span>
                      </h3>
                      <WindowControls />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
                      {column.length === 0 ? (
                        <p className="border border-dashed border-[#0A0A0A]/40 px-2 py-2 text-[11px] text-[#5A5852]">No leads in this stage.</p>
                      ) : (
                        column.map((lead) => (
                          <LeadCard
                            key={lead.id}
                            lead={lead}
                            copied={copiedId === lead.id}
                            onCopy={() => copyHook(lead)}
                            onMove={moveLead}
                            onDragEnd={() => setOver(null)}
                          />
                        ))
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-2 overflow-x-auto border border-[#0A0A0A]">
            <table className="w-full min-w-[920px] border-collapse text-left text-[12px]">
              <thead className="bg-[#F5F5F4] text-[10px] tracking-[0.12em]">
                <tr>
                  {["Company", "Category", "Stage", "Contacts", "Package", "Hook"].map((heading) => (
                    <th key={heading} className="border-b border-[#0A0A0A] px-2 py-2 font-normal">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((lead) => (
                  <tr key={lead.id} className="align-top">
                    <td className="border-b border-[#0A0A0A]/20 px-2 py-2">
                      <p>{lead.company}</p>
                      {lead.site ? <p className="mt-1 font-mono text-[10px] text-[#5A5852]">{lead.site}</p> : null}
                    </td>
                    <td className="border-b border-[#0A0A0A]/20 px-2 py-2 text-[#5A5852]">{categoryLabel(lead.category)}</td>
                    <td className="border-b border-[#0A0A0A]/20 px-2 py-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={!neighborStage(lead.stage, -1)}
                          aria-label={`Move ${lead.company} to the previous stage`}
                          onClick={() => {
                            const previous = neighborStage(lead.stage, -1);
                            if (previous) moveLead(lead.id, previous);
                          }}
                          className="bg-[#D9D9D9] px-2 py-1 text-[11px] text-[#303030] hover:bg-[#C9C9C9] disabled:opacity-40"
                        >
                          {"[<-]"}
                        </button>
                        <StageSelect lead={lead} onMove={moveLead} />
                        <button
                          type="button"
                          disabled={!neighborStage(lead.stage, 1)}
                          aria-label={`Move ${lead.company} to the next stage`}
                          onClick={() => {
                            const next = neighborStage(lead.stage, 1);
                            if (next) moveLead(lead.id, next);
                          }}
                          className="bg-[#D9D9D9] px-2 py-1 text-[11px] text-[#303030] hover:bg-[#C9C9C9] disabled:opacity-40"
                        >
                          {"[->]"}
                        </button>
                      </div>
                    </td>
                    <td className="border-b border-[#0A0A0A]/20 px-2 py-2 text-[#5A5852]">{lead.contacts}</td>
                    <td className="border-b border-[#0A0A0A]/20 px-2 py-2">{lead.package}</td>
                    <td className="border-b border-[#0A0A0A]/20 px-2 py-2">
                      <p className="text-[#5A5852]">{lead.hook}</p>
                      <button type="button" onClick={() => copyHook(lead)} className="mt-2 bg-[#D9D9D9] px-2 py-1 text-[11px] text-[#303030] hover:bg-[#C9C9C9]">
                        {copiedId === lead.id ? "[Copied]" : "[Copy Hook]"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddLeadDialog
          dialogRef={dialogRef}
          onCreate={(lead) => {
            addLead(lead);
            setNote(`${lead.company} is on the board in ${stages.find((stage) => stage.id === lead.stage)?.label}.`);
          }}
        />
      </div>
    </section>
  );
}

function LeadCard({
  lead,
  copied,
  onCopy,
  onMove,
  onDragEnd,
}: {
  lead: Lead;
  copied: boolean;
  onCopy: () => void;
  onMove: (id: string, stage: LeadStage) => void;
  onDragEnd: () => void;
}) {
  const previous = neighborStage(lead.stage, -1);
  const next = neighborStage(lead.stage, 1);
  const inMotion = lead.stage === "talk" || lead.stage === "sample";

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", lead.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={onDragEnd}
      className="cursor-grab border border-[#0A0A0A] bg-white p-2 active:cursor-grabbing"
    >
      <h4 className="text-[13px] leading-snug">{lead.company}</h4>
      {lead.site ? <p className="mt-1 font-mono text-[10px] text-[#5A5852]">{lead.site}</p> : null}
      <p className="mt-2 text-[10px] tracking-[0.08em] text-[#5A5852]">{categoryLabel(lead.category)}</p>
      <p className="mt-2 text-[11px] leading-relaxed">
        <span className="text-[#5A5852]">Contacts: </span>
        {lead.contacts}
      </p>
      <p className="mt-1 text-[11px] leading-relaxed">
        <span className="text-[#5A5852]">Package: </span>
        {lead.package}
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-[#5A5852]">{lead.notes}</p>
      {inMotion ? (
        <p className="mt-2 border border-dashed border-[#0A0A0A] px-2 py-1 text-[10px] leading-relaxed">
          Check with Buyan before messaging again.
        </p>
      ) : null}
      <button type="button" onClick={onCopy} className="mt-2 w-full border border-dashed border-[#0A0A0A] px-2 py-2 text-left hover:bg-[#F5F5F4]">
        <span className="block text-[10px] tracking-[0.12em] text-[#5A5852]">HOOK</span>
        <span className="mt-1 block text-[11px] leading-relaxed">{lead.hook}</span>
        <span className="mt-2 block text-[11px] text-[#303030]">{copied ? "[Copied]" : "[Copy Hook]"}</span>
      </button>
      <div className="mt-2 flex items-center gap-1" onMouseDown={(event) => event.stopPropagation()}>
        <button
          type="button"
          disabled={!previous}
          aria-label={`Move ${lead.company} to the previous stage`}
          onClick={() => previous && onMove(lead.id, previous)}
          className="bg-[#D9D9D9] px-2 py-1 text-[11px] text-[#303030] hover:bg-[#C9C9C9] disabled:opacity-40"
        >
          {"[<-]"}
        </button>
        <StageSelect lead={lead} onMove={onMove} />
        <button
          type="button"
          disabled={!next}
          aria-label={`Move ${lead.company} to the next stage`}
          onClick={() => next && onMove(lead.id, next)}
          className="bg-[#D9D9D9] px-2 py-1 text-[11px] text-[#303030] hover:bg-[#C9C9C9] disabled:opacity-40"
        >
          {"[->]"}
        </button>
      </div>
    </article>
  );
}

function StageSelect({ lead, onMove }: { lead: Lead; onMove: (id: string, stage: LeadStage) => void }) {
  return (
    <select
      aria-label={`Stage for ${lead.company}`}
      value={lead.stage}
      onChange={(event) => {
        if (isLeadStage(event.target.value)) onMove(lead.id, event.target.value);
      }}
      className="min-w-0 flex-1 border border-[#0A0A0A]/40 bg-white px-1 py-1 text-[10px]"
    >
      {stages.map((stage) => (
        <option key={stage.id} value={stage.id}>
          {stage.label}
        </option>
      ))}
    </select>
  );
}

function AddLeadDialog({
  dialogRef,
  onCreate,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onCreate: (lead: Lead) => void;
}) {
  const [company, setCompany] = useState("");
  const [site, setSite] = useState("");
  const [contacts, setContacts] = useState("");
  const [category, setCategory] = useState<LeadCategory>("frontier");
  const [stage, setStage] = useState<LeadStage>("contact");
  const [packageName, setPackageName] = useState("");
  const [notes, setNotes] = useState("");
  const [hook, setHook] = useState("");
  const [error, setError] = useState("");

  function close() {
    dialogRef.current?.close();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = company.trim();
    if (!name) {
      setError("Add a company name.");
      return;
    }
    const nextNotes = notes.trim() || "Added from the board.";
    onCreate({
      id: `custom-${crypto.randomUUID()}`,
      company: name,
      site: site.trim() || undefined,
      category,
      stage,
      contacts: contacts.trim() || "Not listed yet",
      package: packageName.trim() || "$15k 48h Pilot / $130k 200-Task Pack",
      notes: nextNotes,
      hook: hook.trim() || nextNotes,
    });
    setCompany("");
    setSite("");
    setContacts("");
    setPackageName("");
    setNotes("");
    setHook("");
    setError("");
    close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="w-[min(640px,calc(100vw-2rem))] border border-[#0A0A0A] bg-white p-0 text-[#0A0A0A] backdrop:bg-[#0A0A0A]/40"
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <form onSubmit={onSubmit}>
        <div className="flex items-center justify-between gap-3 border-b border-[#0A0A0A] bg-[#F5F5F4] px-2 py-1">
          <p className="text-[11px] tracking-wide">ADD A LEAD</p>
          <button type="button" onClick={close} className="border border-[#0A0A0A] px-1 text-[11px]" aria-label="Close add lead">
            [x]
          </button>
        </div>
        <div className="grid gap-3 p-3">
          <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
            COMPANY
            <input value={company} onChange={(event) => setCompany(event.target.value)} className={fieldClass} required />
          </label>
          <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
            SITE
            <input value={site} onChange={(event) => setSite(event.target.value)} className={fieldClass} placeholder="example.com" />
          </label>
          <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
            CONTACTS
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
            <input value={packageName} onChange={(event) => setPackageName(event.target.value)} className={fieldClass} placeholder="$15k 48h Pilot / $130k 200-Task Pack" />
          </label>
          <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
            NOTES
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className={fieldClass} />
          </label>
          <label className="text-[11px] tracking-[0.12em] text-[#5A5852]">
            OUTREACH HOOK
            <textarea value={hook} onChange={(event) => setHook(event.target.value)} rows={3} className={fieldClass} />
          </label>
          {error ? <p className="text-[12px] text-[#5A5852]">{error}</p> : null}
          <button type="submit" className="bg-[#D9D9D9] px-3 py-2 text-[12px] text-[#303030] hover:bg-[#C9C9C9]">
            [Add to Board]
          </button>
        </div>
      </form>
    </dialog>
  );
}
