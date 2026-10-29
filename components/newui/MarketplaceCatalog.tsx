"use client";

import { useMemo, useState } from "react";
import { DitherTile } from "@/components/newui/DitherTile";
import { marketDomains, marketEntries, marketTypes, type MarketDomain, type MarketType } from "@/lib/marketplace";

const ALL = "All";

export function MarketplaceCatalog() {
  const [domain, setDomain] = useState<typeof ALL | MarketDomain>(ALL);
  const [kind, setKind] = useState<typeof ALL | MarketType>(ALL);

  const shown = useMemo(
    () => marketEntries.filter((entry) => (domain === ALL || entry.domain === domain) && (kind === ALL || entry.type === kind)),
    [domain, kind],
  );

  return (
    <>
      <div className="mt-12 border-t nu-rule">
        <FilterRow label="Domain" value={domain} options={marketDomains} onChange={setDomain} />
        <FilterRow label="Type" value={kind} options={marketTypes} onChange={setKind} />
      </div>

      {shown.length === 0 ? (
        <p className="border-b nu-rule py-16 text-[28px] leading-snug">Nothing in this room yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((entry) => (
            <article key={entry.name} className="flex min-w-0 flex-col border-t nu-rule pt-6">
              <div className="w-32">
                <DitherTile motif={entry.motif} />
              </div>
              {entry.ref ? <p className="nu-label mt-5">{entry.ref}</p> : null}
              <h2 className={`text-[28px] leading-snug ${entry.ref ? "mt-2" : "mt-5"}`}>{entry.name}</h2>
              <p className="nu-ink-60 mt-2 text-[18px] leading-relaxed">{entry.line}</p>
              <p className="nu-label mt-4">
                <span>{entry.domain}</span>
                <span aria-hidden="true"> · </span>
                <span className="text-[#0A0A0A]/55">{entry.type}</span>
              </p>
              {entry.soon ? <p className="nu-label mt-3 text-[#0A0A0A]/55">Coming soon</p> : null}
              <a className="nu-btn mt-6 self-start" href="/newui/access?as=lab">
                Request sample <span className="nu-arr" aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function FilterRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: typeof ALL | T;
  options: readonly T[];
  onChange: (next: typeof ALL | T) => void;
}) {
  const choices: Array<typeof ALL | T> = [ALL, ...options];
  return (
    <div className="border-b nu-rule py-4">
      <p className="nu-label" id={`market-${label}`}>{label}</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-labelledby={`market-${label}`}>
        {choices.map((choice) => (
          <button
            key={choice}
            type="button"
            className="nu-chip"
            aria-pressed={value === choice}
            onClick={() => onChange(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
