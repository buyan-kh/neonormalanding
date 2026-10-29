"use client";

import { useEffect, useState } from "react";

type Mode = "raw" | "clean";

const fields = [
  { label: "Patient", raw: "Mara Ellison", clean: "[PATIENT_ID_884]" },
  { label: "MRN", raw: "MRN-448219", clean: "[PATIENT_ID_884]" },
  { label: "Site", raw: "Northline Assay Lab", clean: "[SITE_02]" },
  { label: "Physician", raw: "Dr. A. Chen", clean: "[INVESTIGATOR_04]" },
  { label: "Collected", raw: "2024-03-11 08:14", clean: "[DATE_SHIFT_+14D]" },
  { label: "Accession", raw: "ACC-229184", clean: "[ACCESSION_91B]" },
];

const rows = [
  ["D01", "Duplex UMI ratio", "0.18%", "batch in range"],
  ["D02", "Instrument drift", "+1.4%", "control held"],
  ["D03", "Survival interval", "214 d", "right-censored"],
];

const ships = [
  ["01", "Harbor/Docker Containers"],
  ["02", "<50ms Python Grader"],
  ["03", "Preflight Verification Report"],
  ["04", "De-Identification & Provenance Manifest"],
];

const manifest = `{
  "environment_ref": "NN-ENV-01..04",
  "harness_targets": ["harbor", "docker", "gym"],
  "grader": "deterministic_python (<50ms, zero_llm_judge)",
  "preflight_verification": [
    "reference_solver_1.0000",
    "shortcut_heuristics_capped_0.42",
    "schema_determinism",
    "zero_web_contamination"
  ],
  "deidentification": "scrubbed_at_source_hipaa_safe_harbor",
  "chain_of_title": "direct_data_holder_license_or_rev_share"
}`;

export function DeidSpecimen() {
  const [mode, setMode] = useState<Mode>("raw");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setMode((current) => (current === "raw" ? "clean" : "raw"));
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused]);

  function choose(next: Mode) {
    setPaused(true);
    setMode(next);
  }

  return (
    <section id="deid" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">DE-IDENTIFICATION & PROVENANCE</p>
        <h2 className="mt-3 max-w-[22em] text-[24px] leading-snug md:text-[26px]">
          Identifiers leave at the source. The Grader keeps the signal.
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="border border-[#0A0A0A] bg-white p-4">
            <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">CLINICAL & WET-LAB SPECIMEN</p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="De-identification view">
              {(
                [
                  ["raw", "[Raw Clinical / Assay Record]"],
                  ["clean", "[De-Identified at Source]"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={mode === id}
                  onClick={() => choose(id)}
                  className={`border px-2 py-1 text-[12px] ${mode === id ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#0A0A0A]/40 text-[#0A0A0A]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.label} className="border border-[#0A0A0A]/20 px-2 py-2">
                  <dt className="text-[10px] tracking-[0.12em] text-[#5A5852]">{field.label}</dt>
                  <dd className={`mt-1 font-mono text-[12px] transition-opacity duration-300 ${mode === "clean" ? "bg-[#0A0A0A] px-1 text-white" : "text-[#0A0A0A]"}`}>
                    {mode === "clean" ? field.clean : field.raw}
                  </dd>
                </div>
              ))}
            </dl>
            <table className="mt-4 w-full border-collapse text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-[#0A0A0A] text-[#5A5852]">
                  <th className="py-1 pr-2 font-normal">Draw</th>
                  <th className="py-1 pr-2 font-normal">Assay</th>
                  <th className="py-1 pr-2 font-normal">Value</th>
                  <th className="py-1 font-normal">Control</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]} className="border-b border-[#0A0A0A]/15">
                    {row.map((cell) => (
                      <td key={cell} className="py-1 pr-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {mode === "clean" ? (
              <dl className="mt-4 grid gap-2 border border-[#0A0A0A] p-2 text-[11px] sm:grid-cols-3">
                <div>
                  <dt className="tracking-[0.12em] text-[#5A5852]">STANDARD</dt>
                  <dd className="mt-1">HIPAA Safe Harbor and Expert Determination at source</dd>
                </div>
                <div>
                  <dt className="tracking-[0.12em] text-[#5A5852]">SCRUBBED</dt>
                  <dd className="mt-1">Patient identifiers, site names, dates, free-text notes</dd>
                </div>
                <div>
                  <dt className="tracking-[0.12em] text-[#5A5852]">KEPT FOR GRADER</dt>
                  <dd className="mt-1">Instrument drift curves, duplex UMI ratios, batch controls, longitudinal survival intervals</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-[11px] text-[#5A5852]">Auto-cycles until you pick a view.</p>
            )}
          </article>

          <article className="border border-[#0A0A0A] bg-white p-4">
            <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">PREFLIGHT VERIFICATION & PROVENANCE</p>
            <p className="mt-2 font-mono text-[12px]">provenance_and_preflight.json</p>
            <pre className="mt-3 overflow-x-auto border border-[#0A0A0A] p-3 font-mono text-[11px] leading-relaxed">{manifest}</pre>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {ships.map(([index, label]) => (
                <li key={index} className="border border-[#0A0A0A]/30 px-2 py-2 text-[12px]">
                  <span className="font-mono text-[10px] text-[#5A5852]">{index}</span>
                  <span className="mt-1 block">{label}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
