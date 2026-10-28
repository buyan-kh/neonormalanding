"use client";

import { Fragment, useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { InsideFooter } from "@/components/inside/InsideFooter";
import {
  archiveLots,
  buyerRooms,
  catalogRows,
  catalogTiers,
  directCompetitors,
  hqFolders,
  hqLinks,
  investors,
  marketSignals,
  metrics,
  modules,
  operatingRules,
  priceBars,
  priceCeiling,
  protoFilters,
  prototypes,
  seedScenarios,
  type CatalogTier,
  type ModuleId,
  type ProtoFilter,
  type SeedScenario,
} from "@/components/inside/buyan-data";

const chipOn = "border border-[#D9D9D9] bg-[#D9D9D9] px-2 py-1 text-left text-[11px] text-[#303030]";
const chipOff = "border border-[#0A0A0A] px-2 py-1 text-left text-[11px] text-[#0A0A0A] hover:bg-[#EAEAEA]";
const th = "border-b border-[#0A0A0A] bg-[#F5F5F4] px-2 py-2 text-[10px] font-medium tracking-[0.12em] text-[#5A5852]";
const td = "border-t border-[#0A0A0A]/15 px-2 py-2 align-top text-[12px] leading-relaxed";

function hit(search: string, needle: string) {
  return needle.length === 0 || search.includes(needle);
}

function formatMillions(amount: number) {
  return `$${(amount / 1_000_000).toFixed(2)}M`;
}

function formatDollars(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function RateBar({ label, pct, display }: { label: string; pct: number | null; display: string }) {
  const width = pct == null ? 0 : Math.max(0, Math.min(100, pct));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[10px]">
        <span className="text-[#5A5852]">{label}</span>
        <span className="font-mono tabular-nums text-[#0A0A0A]">{display}</span>
      </div>
      <div className="mt-1 h-1.5 bg-[#EAEAEA]">
        <div className="h-full bg-[#0A0A0A]" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function Section({ id, kicker, title, lede, children }: { id: string; kicker: string; title: string; lede: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-56 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">{kicker}</p>
        <h2 className="mt-3 max-w-[24em] text-[24px] leading-snug md:text-[26px]">{title}</h2>
        <p className="mt-4 max-w-[74ch] text-[13px] leading-relaxed text-[#5A5852]">{lede}</p>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {children}
    </div>
  );
}

function TableWrap({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="overflow-x-auto border border-[#0A0A0A]">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function BuyanCommand({ signedInName }: { signedInName: string }) {
  const [module, setModule] = useState<ModuleId>("all");
  const [query, setQuery] = useState("");
  const [protoFilter, setProtoFilter] = useState<ProtoFilter>("all");
  const [catalogTier, setCatalogTier] = useState<(typeof catalogTiers)[number]["id"]>("all");
  const [scenarioChoice, setScenarioChoice] = useState<{ id: SeedScenario["id"]; query: string }>({ id: "lean", query: "" });
  const [openBuyers, setOpenBuyers] = useState<Record<string, boolean>>({});

  const needle = query.trim().toLowerCase();
  const moduleOn = (id: ModuleId) => module === "all" || module === id;

  const metricCards = metrics.filter((item) => hit(item.search, needle));
  const folders = hqFolders.filter((item) => hit(item.search, needle));
  const links = hqLinks.filter((item) => hit(item.search, needle));
  const protoRows = prototypes.filter((item) => (protoFilter === "all" || item.tags.includes(protoFilter)) && hit(item.search, needle));
  const rows = catalogRows.filter((item) => {
    if (!hit(item.search, needle)) return false;
    if (catalogTier === "all") return true;
    if (catalogTier === "flagship") return item.flagship;
    return item.tier === catalogTier;
  });
  const lots = archiveLots.filter((item) => {
    if (!hit(item.search, needle)) return false;
    if (catalogTier === "all") return true;
    if (catalogTier === "flagship") return item.flagship;
    return item.tiers.includes(catalogTier as CatalogTier);
  });
  const rooms = buyerRooms.filter((item) => hit(item.search, needle));
  const prices = priceBars.filter((item) => hit(item.search, needle));
  const competitors = directCompetitors.filter((item) => hit(item.search, needle));
  const signals = marketSignals.filter((item) => hit(item.search, needle));
  const rules = operatingRules.filter((item) => hit(item.search, needle));
  const people = investors.filter((item) => hit(item.search, needle));
  const allocationHit = seedScenarios.some((item) => hit(item.search, needle));
  const selectedScenario = seedScenarios.find((item) => item.id === scenarioChoice.id) ?? seedScenarios[0];
  const uniqueScenario = seedScenarios.filter((item) => hit(item.search, needle));
  const pinned = scenarioChoice.query === needle;
  const shownScenario = pinned || needle.length === 0 ? selectedScenario : uniqueScenario.length === 1 ? uniqueScenario[0] : selectedScenario;

  const showHq = moduleOn("hq") && (needle.length === 0 || folders.length + links.length > 0);
  const showProto = moduleOn("prototypes") && (needle.length === 0 || protoRows.length > 0);
  const showCatalog = moduleOn("catalog") && (needle.length === 0 || rows.length + lots.length > 0);
  const showBuyers = moduleOn("buyers") && (needle.length === 0 || rooms.length > 0);
  const showRadar = moduleOn("radar") && (needle.length === 0 || prices.length + competitors.length + signals.length > 0);
  const showSeed = moduleOn("seed") && (needle.length === 0 || rules.length + people.length > 0 || allocationHit);
  const matchCount =
    metricCards.length +
    (showHq ? folders.length + links.length : 0) +
    (showProto ? protoRows.length : 0) +
    (showCatalog ? rows.length + lots.length : 0) +
    (showBuyers ? rooms.length : 0) +
    (showRadar ? prices.length + competitors.length + signals.length : 0) +
    (showSeed ? rules.length + people.length + (allocationHit || needle.length === 0 ? 1 : 0) : 0);
  const any = metricCards.length > 0 || showHq || showProto || showCatalog || showBuyers || showRadar || showSeed;

  function pickModule(id: ModuleId) {
    setModule(id);
    setQuery("");
    const anchor = id === "all" ? "top" : id;
    window.setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(anchor)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 0);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#0A0A0A]/20 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full min-w-0 max-w-[1080px] flex-col gap-3 px-4 py-3 md:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <a href="#top" className="flex min-w-0 items-center gap-2">
              <Logo size={30} />
              <span className="flex flex-col gap-1">
                <span className="text-[16px] tracking-[0.18em]">Neo Norma // COMMAND</span>
                <span className="text-[10px] leading-relaxed text-[#5A5852]">[SAN FRANCISCO, CA]</span>
              </span>
            </a>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="font-mono text-[11px] tracking-[0.12em]">{`[SIGNED IN: ${signedInName.toUpperCase()}]`}</span>
              <a href="/inside" className="px-1.5 py-1 hover:bg-[#EAEAEA]">
                [GTM DESK]
              </a>
              <form method="post" action="/api/inside-auth">
                <input type="hidden" name="intent" value="lock" />
                <button type="submit" className="bg-[#D9D9D9] px-2 py-1 text-[#303030] hover:bg-[#C9C9C9]">
                  [Lock / Sign out]
                </button>
              </form>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Command modules">
            {modules.map((item) => (
              <button key={item.id} type="button" aria-pressed={module === item.id} onClick={() => pickModule(item.id)} className={module === item.id ? chipOn : chipOff}>
                {item.label}
              </button>
            ))}
          </nav>
          <form role="search" className="flex flex-col gap-2 sm:flex-row sm:items-center" onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="command-search">
              Search the command center
            </label>
            <input
              id="command-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lots, rooms, prototypes, investors"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full border border-[#0A0A0A]/40 bg-white px-2 py-1.5 text-[13px] text-[#0A0A0A] outline-none placeholder:text-[#5A5852] hover:border-[#0A0A0A]/70 focus:border-[#0A0A0A] focus:bg-[#fafafa]"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} className={chipOff}>
                Clear
              </button>
            ) : null}
            <p className="shrink-0 font-mono text-[11px] text-[#5A5852]" aria-live="polite">
              {needle ? `${matchCount} match${matchCount === 1 ? "" : "es"}` : "Live filter"}
            </p>
          </form>
        </div>
      </header>
      <main id="content">
        <div id="top" className="mx-auto w-full max-w-[1080px] scroll-mt-56 px-4 pb-8 pt-8 md:px-6 md:pt-9">
          <p className="text-[11px] tracking-[0.16em] text-[#5A5852]">INSIDE // NEO NORMA COMMAND CENTER</p>
          <h1 className="mt-4 max-w-[20em] text-[26px] leading-[1.2] md:text-[32px]">The Buyan desk for HQ, worlds, buyers, and the seed.</h1>
          <p className="mt-4 max-w-[74ch] text-[13px] leading-relaxed text-[#5A5852] md:text-sm">
            Updated Oct 28, 2026. Buyan Khurelbaatar and Ben Romero. Harbor v1.2, no network, Docker Sandbox sidecars, and a deterministic Grader.
            Preflight verification keeps the reference at 1.0000 and falsifies the shortcuts. This page is the same desk at neonorma.si/inside/buyan and inside.neonorma.si/buyan.
          </p>
          {metricCards.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((item) => (
                <article key={item.label} className={item.invert ? "border border-[#0A0A0A] bg-[#0A0A0A] p-3 text-white" : "border border-[#0A0A0A] p-3"}>
                  <p className="font-mono text-[28px] leading-none tabular-nums">{item.value}</p>
                  <h2 className="mt-3 text-[13px] leading-snug">{item.label}</h2>
                  <p className={item.invert ? "mt-2 text-[12px] leading-relaxed text-white/75" : "mt-2 text-[12px] leading-relaxed text-[#5A5852]"}>{item.detail}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        {showHq ? (
          <Section
            id="hq"
            kicker="01 // HQ ARCHITECTURE AND PRIVATE REPOSITORIES"
            title="Four folders, one private HQ."
            lede="neo-norma-hq is the operating repo. The public site and this landing repo stay separate from the answer-key vault. Co-founders: Buyan Khurelbaatar (buyan@neonorma.si) and Ben Romero (benosaromero@gmail.com)."
          >
            {folders.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {folders.map((folder) => (
                  <article key={folder.path} className="border border-[#0A0A0A] p-3">
                    <p className="font-mono text-[12px]">{folder.path}</p>
                    <h3 className="mt-2 text-[14px]">{folder.title}</h3>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#5A5852]">{folder.body}</p>
                  </article>
                ))}
              </div>
            ) : null}
            {links.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="border border-[#0A0A0A] p-3 hover:bg-[#F5F5F4]">
                    <p className="font-mono text-[12px] underline decoration-[#0A0A0A]/30 underline-offset-4">{link.label}</p>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#5A5852]">{link.note}</p>
                  </a>
                ))}
              </div>
            ) : null}
          </Section>
        ) : null}

        {showProto ? (
          <Section
            id="prototypes"
            kicker="02 // 7 STATEFUL RL PROTOTYPES, OCT 27 FRONTIER RUN"
            title="Pass rates, falsified shortcuts, and the exact miss."
            lede="Every prototype carries a Grader and Preflight verification on 24 seeds. Live rollouts are gpt-6-luna and gpt-6-sol. Bar length is the pass rate. A full bar is a clear. An empty Sol bar means that model was not run."
          >
            <ChipRow label="Prototype filters">
              {protoFilters.map((item) => (
                <button key={item.id} type="button" aria-pressed={protoFilter === item.id} onClick={() => setProtoFilter(item.id)} className={protoFilter === item.id ? chipOn : chipOff}>
                  {item.label}
                </button>
              ))}
            </ChipRow>
            {protoRows.length === 0 ? <p className="mt-4 text-[13px] text-[#5A5852]">No prototypes in this filter.</p> : null}
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {protoRows.map((item) => (
                <article key={item.id} className="border border-[#0A0A0A] p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[14px]">{item.n}</h3>
                    <p className="font-mono text-[10px] text-[#5A5852]">{item.folder}</p>
                  </div>
                  <p className="mt-1 text-[12px]">{item.title}</p>
                  <div className="mt-3 grid gap-2">
                    <RateBar label="Preflight reference" pct={100} display="24/24" />
                    <RateBar label="Blind strategy" pct={item.blindPct} display={item.blindLabel} />
                    <RateBar label="gpt-6-luna" pct={item.lunaPct} display={item.luna} />
                    <RateBar label="gpt-6-sol" pct={item.solPct} display={item.sol} />
                  </div>
                  <p className="mt-3 text-[12px] text-[#5A5852]">{item.shortcuts}</p>
                  <p className="mt-2 text-[12px] leading-relaxed">{item.mechanism}</p>
                  <p className="mt-2 font-mono text-[11px] text-[#5A5852]">{item.verdict}</p>
                </article>
              ))}
            </div>
            {protoRows.length > 0 ? (
              <div className="mt-4">
                <TableWrap caption="Oct 27 stateful prototype scorecard">
                  <thead>
                    <tr>
                      <th className={th} scope="col">Proto</th>
                      <th className={th} scope="col">Preflight verification</th>
                      <th className={th} scope="col">Shortcuts falsified</th>
                      <th className={th} scope="col">gpt-6-luna</th>
                      <th className={th} scope="col">gpt-6-sol</th>
                      <th className={th} scope="col">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {protoRows.map((item) => (
                      <tr key={item.id}>
                        <th className={`${td} font-mono font-medium`} scope="row">
                          {item.n}
                          <span className="mt-1 block font-sans text-[11px] font-normal text-[#5A5852]">{item.folder}</span>
                        </th>
                        <td className={td}>{item.preflight}</td>
                        <td className={td}>{item.shortcuts}</td>
                        <td className={`${td} font-mono`}>{item.luna}</td>
                        <td className={`${td} font-mono`}>{item.sol}</td>
                        <td className={td}>{item.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              </div>
            ) : null}
          </Section>
        ) : null}

        {showCatalog ? (
          <Section
            id="catalog"
            kicker="03 // PRODUCT CATALOG AND BENCHMARK LOTS"
            title="82 families, filtered by the tier a buyer actually buys."
            lede="Stage 3 is the chained biology lot. Stateful worlds are the Oct 27 campaigns. The hospital tier is the 15-year exclusive. Stage 1 and Stage 2 are the curriculum. Flagship marks the lots we lead with: r47 MRD, r40 ctDNA CHIP, r49 SPR, c58 13C-MFA, r57e phage, r38 CCF, PDO-KRAS-2026, and ehr01 through ehr06. Static scorecards keep the recorded model tags, including gpt-6.1-sol."
          >
            <ChipRow label="Catalog tier">
              {catalogTiers.map((item) => (
                <button key={item.id} type="button" aria-pressed={catalogTier === item.id} onClick={() => setCatalogTier(item.id)} className={catalogTier === item.id ? chipOn : chipOff}>
                  {item.label}
                </button>
              ))}
            </ChipRow>
            {rows.length === 0 ? <p className="mt-4 text-[13px] text-[#5A5852]">No catalog rows in this filter.</p> : null}
            {rows.length > 0 ? (
              <div className="mt-4">
                <TableWrap caption="Environment families and benchmark lots">
                  <thead>
                    <tr>
                      <th className={th} scope="col">Lot</th>
                      <th className={th} scope="col">Tier</th>
                      <th className={th} scope="col">Packaged</th>
                      <th className={th} scope="col">Tranche</th>
                      <th className={th} scope="col">Band</th>
                      <th className={th} scope="col">Frontier pass</th>
                      <th className={th} scope="col">Shortcuts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item) => (
                      <tr key={item.id}>
                        <th className={`${td} font-mono font-medium`} scope="row">
                          {item.id}
                          {item.flagship ? <span className="mt-1 block font-sans text-[10px] tracking-[0.12em] text-[#5A5852]">FLAGSHIP</span> : null}
                          <span className="mt-1 block font-sans text-[11px] font-normal text-[#0A0A0A]">{item.name}</span>
                          {item.covers ? (
                            <details className="mt-2">
                              <summary className="cursor-pointer font-sans text-[11px] font-normal text-[#5A5852]">Family list</summary>
                              <p className="mt-1 font-sans text-[11px] font-normal leading-relaxed text-[#5A5852]">{item.covers}</p>
                            </details>
                          ) : null}
                        </th>
                        <td className={td}>{catalogTiers.find((tier) => tier.id === item.tier)?.label}</td>
                        <td className={`${td} font-mono tabular-nums`}>{item.packaged}</td>
                        <td className={`${td} font-mono tabular-nums`}>{item.tranche}</td>
                        <td className={td}>{item.band}</td>
                        <td className={td}>{item.passes}</td>
                        <td className={`${td} font-mono`}>{item.shortcuts}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              </div>
            ) : null}
            {lots.length > 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {lots.map((lot) => (
                  <article key={lot.name} className="border border-[#0A0A0A] p-3">
                    <p className="font-mono text-[12px]">{lot.name}</p>
                    <p className="mt-2 text-[13px]">{lot.tasks}</p>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#5A5852]">{lot.covers}</p>
                    <p className="mt-2 text-[12px]">{lot.purpose}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </Section>
        ) : null}

        {showBuyers ? (
          <Section
            id="buyers"
            kicker="04 // ACTIVE BUYER AND PARTNER ROOMS"
            title="Six open rooms. Status, owner, and the next move."
            lede="Google, Diffuse Labs, Dominik Scherm's stealth lab-in-the-loop company, State Machines, the 15-year hospital partnership with Quarry and Anthroly, and the DataVendor / SF Traces listing."
          >
            <TableWrap caption="Buyer and partner rooms">
              <thead>
                <tr>
                  <th className={th} scope="col">Room</th>
                  <th className={th} scope="col">Who</th>
                  <th className={th} scope="col">Status</th>
                  <th className={th} scope="col">Next action</th>
                  <th className={th} scope="col">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const open = openBuyers[room.id] === true;
                  return (
                    <Fragment key={room.id}>
                      <tr>
                        <th className={`${td} font-medium`} scope="row">
                          {room.room}
                        </th>
                        <td className={td}>
                          {room.who}
                          <span className="mt-1 block font-mono text-[11px] text-[#5A5852]">{room.contact}</span>
                        </td>
                        <td className={td}>{room.status}</td>
                        <td className={td}>{room.next}</td>
                        <td className={td}>
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={`buyer-${room.id}`}
                            onClick={() => setOpenBuyers((current) => ({ ...current, [room.id]: !current[room.id] }))}
                            className={chipOff}
                          >
                            {open ? "Hide" : "Details"}
                          </button>
                        </td>
                      </tr>
                      {open ? (
                        <tr>
                          <td id={`buyer-${room.id}`} colSpan={5} className={td}>
                            <ul className="grid gap-2">
                              {room.details.map((detail) => (
                                <li key={detail}>{detail}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </TableWrap>
          </Section>
        ) : null}

        {showRadar ? (
          <Section
            id="radar"
            kicker="05 // COMPETITIVE RADAR AND PRICING BENCHMARKS"
            title="What the market pays, and who is already in the category."
            lede="Bars are linear against the $500k stateful-world comp. Mercor's atomic custom task sits near $2,000, with top labs buying up to 50,000 tasks a month. That volume number is context. It is not our price list."
          >
            {prices.length > 0 ? (
              <div className="grid gap-3">
                {prices.map((item) => (
                  <article key={item.name}>
                    <div className="flex items-baseline justify-between gap-3 text-[12px]">
                      <h3>{item.name}</h3>
                      <p className="font-mono tabular-nums">{formatDollars(item.amount)}</p>
                    </div>
                    <div className="mt-1 h-2 bg-[#EAEAEA]">
                      <div className="h-full bg-[#0A0A0A]" style={{ width: `${(item.amount / priceCeiling) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#5A5852]">{item.note}</p>
                  </article>
                ))}
              </div>
            ) : null}
            {competitors.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-[13px] tracking-[0.14em] text-[#5A5852]">DIRECT AND ADJACENT BIO ENVIRONMENTS</h3>
                <div className="mt-3">
                  <RadarTable caption="Direct biological RL competitors" rows={competitors} />
                </div>
              </div>
            ) : null}
            {signals.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-[13px] tracking-[0.14em] text-[#5A5852]">WET LAB, FUNDING, AND BUYER COMPS</h3>
                <div className="mt-3">
                  <RadarTable caption="Wet lab funding and pricing comps" rows={signals} />
                </div>
              </div>
            ) : null}
          </Section>
        ) : null}

        {showSeed ? (
          <Section
            id="seed"
            kicker="06 // $2.5M SEED, CRM, AND OPERATING PLAYBOOK"
            title="Three check sizes. Five rules. The people on the round."
            lede="The round is a $2.5M lean seed, with $5.0M and $10.0M cases for faster wet-lab loop closure. The playbook names the three pillars and does not publish a line-item budget. These bars are the desk allocation of each check across those pillars: the hospital partnership and verified environments, stateful worlds, and wet-lab closure, plus a thin GTM and entity line. Wet-lab is the line that grows. The $445/mo figure is current ledger burn, not the raise."
          >
            {allocationHit || needle.length === 0 ? (
              <div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Seed scenario">
                  {seedScenarios.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={shownScenario.id === item.id}
                      onClick={() => setScenarioChoice({ id: item.id, query: needle })}
                      className={shownScenario.id === item.id ? chipOn : chipOff}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="mt-4 max-w-[74ch] text-[13px] leading-relaxed text-[#5A5852]">{shownScenario.summary}</p>
                <div className="mt-4 grid gap-3">
                  {shownScenario.lines.map((line) => (
                    <article key={line.label}>
                      <div className="flex items-baseline justify-between gap-3 text-[12px]">
                        <h3>{line.label}</h3>
                        <p className="font-mono tabular-nums">
                          {formatMillions(line.amount)}
                          <span className="ml-2 text-[#5A5852]">{Math.round((line.amount / shownScenario.total) * 100)}%</span>
                        </p>
                      </div>
                      <div className="mt-1 h-2 bg-[#EAEAEA]">
                        <div className="h-full bg-[#0A0A0A]" style={{ width: `${(line.amount / shownScenario.total) * 100}%` }} />
                      </div>
                      <p className="mt-1 text-[12px] text-[#5A5852]">{line.note}</p>
                    </article>
                  ))}
                </div>
                <p className="mt-3 font-mono text-[12px]">Total {formatMillions(shownScenario.total)}</p>
              </div>
            ) : null}
            {rules.length > 0 ? (
              <div className="mt-8 grid gap-3">
                <h3 className="text-[13px] tracking-[0.14em] text-[#5A5852]">FIVE OPERATING RULES</h3>
                {rules.map((rule) => (
                  <article key={rule.n} className="border border-[#0A0A0A] p-3">
                    <h4 className="text-[14px]">
                      <span className="font-mono text-[12px] text-[#5A5852]">{rule.n}. </span>
                      {rule.title}
                    </h4>
                    <div className="mt-2 grid gap-2">
                      {rule.body.map((paragraph) => (
                        <p key={paragraph} className="text-[12px] leading-relaxed text-[#5A5852]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
            {people.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-[13px] tracking-[0.14em] text-[#5A5852]">INVESTOR CRM AND JTBD OPS</h3>
                <div className="mt-3">
                  <TableWrap caption="Seed investor CRM">
                    <thead>
                      <tr>
                        <th className={th} scope="col">Name</th>
                        <th className={th} scope="col">Contact</th>
                        <th className={th} scope="col">Status</th>
                        <th className={th} scope="col">Next action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {people.map((person) => (
                        <tr key={person.name}>
                          <th className={`${td} font-medium`} scope="row">
                            {person.name}
                            <span className="mt-1 block font-sans text-[11px] font-normal text-[#5A5852]">{person.profile}</span>
                          </th>
                          <td className={`${td} font-mono text-[11px]`}>{person.who}</td>
                          <td className={td}>{person.status}</td>
                          <td className={td}>{person.next}</td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                </div>
              </div>
            ) : null}
          </Section>
        ) : null}

        {!any ? (
          <p className="mx-auto w-full max-w-[1080px] px-4 pb-16 text-[13px] text-[#5A5852] md:px-6">Nothing on this desk matches that search.</p>
        ) : null}
      </main>
      <InsideFooter />
    </>
  );
}

function RadarTable({ caption, rows }: { caption: string; rows: Array<{ name: string; stage: string; offering: string; meaning: string }> }) {
  return (
    <TableWrap caption={caption}>
      <thead>
        <tr>
          <th className={th} scope="col">Name</th>
          <th className={th} scope="col">Stage and backing</th>
          <th className={th} scope="col">What they ship</th>
          <th className={th} scope="col">What it means here</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <th className={`${td} font-medium`} scope="row">
              {row.name}
            </th>
            <td className={td}>{row.stage}</td>
            <td className={td}>{row.offering}</td>
            <td className={td}>{row.meaning}</td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
