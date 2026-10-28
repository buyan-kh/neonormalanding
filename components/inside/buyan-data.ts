export type ModuleId = "all" | "hq" | "prototypes" | "catalog" | "buyers" | "radar" | "seed";

export const modules: Array<{ id: ModuleId; label: string }> = [
  { id: "all", label: "All Modules" },
  { id: "hq", label: "01. HQ & Repo" },
  { id: "prototypes", label: "02. 7 Stateful Prototypes" },
  { id: "catalog", label: "03. Product Catalog" },
  { id: "buyers", label: "04. Buyer Rooms" },
  { id: "radar", label: "05. Market Radar" },
  { id: "seed", label: "06. $2.5M Seed & Ops" },
];

function blob(parts: Array<string | number | null | undefined | string[]>) {
  return parts
    .flat()
    .filter((part): part is string | number => part != null && part !== "")
    .join(" ")
    .toLowerCase();
}

export type Metric = {
  value: string;
  label: string;
  detail: string;
  invert?: boolean;
  search: string;
};

export const metrics: Metric[] = [
  {
    value: "82",
    label: "RL Environment Families",
    detail: "256 packaged Harbor v1.2 tasks. 1,919 tranche tasks. 76,000+ uncontaminated seeds.",
    search: "",
  },
  {
    value: "7",
    label: "Stateful Lab-in-the-Loop Worlds",
    detail: "Oct 27 Frontier Run. Proto 1 through Proto 7, each with a Grader and Preflight verification.",
    search: "",
  },
  {
    value: "6",
    label: "Active Buyer & Partner Rooms",
    detail: "Google, Diffuse Labs, Dominik Scherm, State Machines, the 15-year hospital partnership, and DataVendor.",
    search: "",
  },
  {
    value: "$2.5M",
    label: "Seed Round Tracker",
    detail: "Lean seed now. $5.0M Core and $10.0M Platform are the wet-lab expansion cases.",
    invert: true,
    search: "",
  },
].map((item) => ({ ...item, search: blob([item.value, item.label, item.detail, "portfolio headline"]) }));

export type HqFolder = { path: string; title: string; body: string; search: string };

export const hqFolders: HqFolder[] = [
  {
    path: "01-product-catalog/",
    title: "Product catalog",
    body: "82 environment families, the machine-readable inventory, benchmark lots, and the seven Oct 27 stateful prototypes.",
    search: "",
  },
  {
    path: "02-buyer-rooms/",
    title: "Buyer rooms",
    body: "Frontier lab, partner, and marketplace rooms. Each room keeps its own scorecard, terms, and next action.",
    search: "",
  },
  {
    path: "03-research-and-radar/",
    title: "Research and radar",
    body: "Oct 27 seven-wave master report, competitor dossier, frontier-lab buyer playbook, and the 42-lead index.",
    search: "",
  },
  {
    path: "04-fundraising-and-ops/",
    title: "Fundraising and ops",
    body: "Seed CRM, the three-horizon brief, unit economics, the $445/mo burn ledger, entity memo, and BD commissions.",
    search: "",
  },
].map((item) => ({ ...item, search: blob([item.path, item.title, item.body, "hq architecture repository"]) }));

export type HqLink = { href: string; label: string; note: string; search: string };

export const hqLinks: HqLink[] = [
  {
    href: "https://github.com/buyan-kh/neo-norma-hq",
    label: "neo-norma-hq",
    note: "Private HQ. Four folders, catalogue, rooms, radar, and the seed desk.",
    search: "",
  },
  {
    href: "https://www.neonorma.si",
    label: "neonorma.si",
    note: "Public site. Plain-English pitch only.",
    search: "",
  },
  {
    href: "https://github.com/buyan-kh/neonormalanding",
    label: "neonormalanding",
    note: "This site. The inside desk and this command center live here.",
    search: "",
  },
  {
    href: "https://github.com/buyan-kh/neo-norma-keys",
    label: "neo-norma-keys",
    note: "Private answer-key vault. 258 verified task keys and hidden prototype generators. Not a buyer deliverable.",
    search: "",
  },
].map((item) => ({ ...item, search: blob([item.href, item.label, item.note, "quick link github"]) }));

export type ProtoFilter = "all" | "breaks-luna" | "breaks-sol" | "sol-clears" | "infra";

export const protoFilters: Array<{ id: ProtoFilter; label: string }> = [
  { id: "all", label: "All 7" },
  { id: "breaks-luna", label: "Breaks Luna" },
  { id: "breaks-sol", label: "Breaks Sol" },
  { id: "sol-clears", label: "Sol clears" },
  { id: "infra", label: "Infra proof" },
];

export type Prototype = {
  id: string;
  n: string;
  folder: string;
  title: string;
  preflight: string;
  shortcuts: string;
  luna: string;
  sol: string;
  lunaPct: number | null;
  solPct: number | null;
  blindLabel: string;
  blindPct: number | null;
  verdict: string;
  mechanism: string;
  tags: ProtoFilter[];
  search: string;
};

const prototypeSeed: Omit<Prototype, "search">[] = [
  {
    id: "proto1",
    n: "Proto 1",
    folder: "proto1_lab_in_the_loop_game",
    title: "PDO-KRAS-2026 lab-in-the-loop game",
    preflight: "24/24 reference at 1.0000. 4 traps at 0.0.",
    shortcuts: "4 shortcuts falsified",
    luna: "1.0 blind solve after hardening",
    sol: "not run",
    lunaPct: 100,
    solPct: null,
    blindLabel: "not a 24-seed blind rate",
    blindPct: null,
    verdict: "Infra proof. Sidecar isolation holds.",
    mechanism:
      "Trajectory failure: sed oracle snooping. The agent tried to read the hidden oracle from inside the workspace. The fix is an out-of-workspace IPC sidecar, so the world is not a file the agent can open. After that hardening, blind gpt-6-luna solved the six-cycle, $25k KRAS-G12C organoid campaign at 1.0, spending $22k in 2 cycles. Unfiltered QC still fails at reward 0.6389. Suite id sl01_organoid_kras_lab_in_the_loop.",
    tags: ["infra"],
  },
  {
    id: "proto2",
    n: "Proto 2",
    folder: "proto2_optimus_dose_game",
    title: "FDA Project Optimus dose game",
    preflight: "24/24 reference. Blind strategy 11/24. Shortcuts 0 to 7/24.",
    shortcuts: "5 shortcuts falsified on the suite screen",
    luna: "2/3. Fails seed 8108 at reward 0.714",
    sol: "2/3. Fails seed 8108 at reward 0.591",
    lunaPct: (2 / 3) * 100,
    solPct: (2 / 3) * 100,
    blindLabel: "11/24",
    blindPct: (11 / 24) * 100,
    verdict: "Seed 8108 fairly breaks Sol. Noisy. Needs more patients or a looser band before it ships.",
    mechanism:
      "Seed 8108 is the fair break. Both models pick a dose from raw cohort averages. The reference optimal biological dose comes from a 2-parameter logistic curve fit. gpt-6-luna reward 0.714. gpt-6-sol reward 0.591. Suite id sl02_project_optimus_dose_trial. Delayed cycle-2 and cycle-3 toxicity is in the world.",
    tags: ["breaks-sol"],
  },
  {
    id: "proto3",
    n: "Proto 3",
    folder: "proto3_premeasured_sar_world",
    title: "Minos-style 1,728-molecule SAR world",
    preflight: "24/24 reference. Blind strategy 16/24. Shortcuts 0 to 2/24.",
    shortcuts: "5 shortcuts falsified on the suite screen",
    luna: "2/3. Fails seed 9133",
    sol: "2/3. Fails seed 9131",
    lunaPct: (2 / 3) * 100,
    solPct: (2 / 3) * 100,
    blindLabel: "16/24",
    blindPct: (16 / 24) * 100,
    verdict: "Traps are too legible. Misses are narrow. Does not carry the product.",
    mechanism:
      "Counterfactual hit-to-lead world with colloidal aggregator blocks, an orthogonal biophysical counter-screen, and a cache lookup trap. gpt-6-sol finds the legible cliff. Suite id sl03_counterfactual_sar_world_v1.",
    tags: ["breaks-sol"],
  },
  {
    id: "proto4",
    n: "Proto 4",
    folder: "proto4_sar_world_v2",
    title: "3-body donor-acceptor-linker SAR v2",
    preflight: "24/24 reference. Blind strategy 10/24. Shortcuts at most 4/24.",
    shortcuts: "8 shortcuts falsified on the suite screen",
    luna: "2/3. Fails seed 9431 at reward 0.546",
    sol: "3/3. Reward 0.78 to 0.89. Regret 0",
    lunaPct: (2 / 3) * 100,
    solPct: 100,
    blindLabel: "10/24",
    blindPct: (10 / 24) * 100,
    verdict: "Does not break Sol.",
    mechanism:
      "Hardened three-body donor, acceptor, and short-linker cliffs, orthogonal bleed-through, and a Triton X-100 detergent shift retest. Discovery AUC is part of the reward. gpt-6-sol clears it. Suite id sl04_counterfactual_sar_world_v2.",
    tags: ["sol-clears"],
  },
  {
    id: "proto5",
    n: "Proto 5",
    folder: "proto5_verify_or_trust",
    title: "240-gene CRISPR sensitizer audit",
    preflight: "24/24 reference. Blind strategy 23/24. Shortcuts 0/24.",
    shortcuts: "7 shortcuts falsified",
    luna: "2/3. Fails seed 9532 at reward 0.688",
    sol: "3/3 at 1.000",
    lunaPct: (2 / 3) * 100,
    solPct: 100,
    blindLabel: "23/24",
    blindPct: (23 / 24) * 100,
    verdict: "Does not break Sol. The traps are real and still legible.",
    mechanism:
      "Trust or verify a virtual-cell foundation model on a CRISPR sensitizer screen. Paralog buffering and drug-induced dependency are the blind spots. Arrayed versus pooled budget is the planning choice. gpt-6-sol scores 3/3 at 1.000, so this world is not the Sol-breaking tier. Suite id sl05_verify_or_trust_crispr_audit.",
    tags: ["sol-clears"],
  },
  {
    id: "proto6",
    n: "Proto 6",
    folder: "proto6_latent_trust_revision",
    title: "Latent Verify-or-Trust hit-list revision",
    preflight: "24/24 reference. Blind strategy 18 to 21/24. Shortcuts 0/24. A v1 strategy still scores 15/24 on v2.",
    shortcuts: "10 shortcuts falsified",
    luna: "0/6. Reward 0.625 to 0.739",
    sol: "6/6. Reward 0.931 to 0.987",
    lunaPct: 0,
    solPct: 100,
    blindLabel: "18 to 21/24",
    blindPct: (18 / 24) * 100,
    verdict: "Fairly breaks Luna. Does not break Sol. Trainability tier.",
    mechanism:
      "Foundation model paralog and amplicon blind spots. Latent paralog and induction covariates, a hidden copy-number amplicon, and a cited-evidence hit-list revision. gpt-6-luna is 0/6. gpt-6-sol is 6/6. That split matches the pass@1 fail, pass@16 occasional success profile buyers say they pay for. Suite id sl06_latent_verify_or_trust_hitlist_revision.",
    tags: ["breaks-luna", "sol-clears"],
  },
  {
    id: "proto7",
    n: "Proto 7",
    folder: "proto7_dated_resistance_combo",
    title: "Day 14 cut, Week 6 resistance combo",
    preflight: "24/24 reference. Blind strategy 14 to 16/24. Shortcuts 0 to 1/24, with one shortcut at 9/24.",
    shortcuts: "Shortcuts mostly falsified. One shortcut still passes 9/24.",
    luna: "0/6 on v1 and v2",
    sol: "v1 0/3 (unfair). v2 2/3 after the fairness fix",
    lunaPct: 0,
    solPct: (2 / 3) * 100,
    blindLabel: "14 to 16/24",
    blindPct: (14 / 24) * 100,
    verdict: "Fairly breaks Luna. Sol is near the ceiling once the rule is learnable.",
    mechanism:
      "Day 14 timestamped cut vs. Week 6 rebound. Evidence is locked at day 14 and the Grader scores the hidden week-6 outcome. The world also fails an assay on purpose: drifted Day 14 plate controls, a failed Day 7 plate read, and a liquid-handler tip failure that must be rerun before the MEK combination. v1 was not learnable from visible evidence, so the Sol 0/3 was unfair. After the fairness fix Sol is 2/3. Luna stays 0/6.",
    tags: ["breaks-luna", "breaks-sol"],
  },
];

export const prototypes: Prototype[] = prototypeSeed.map((item) => ({
  ...item,
  search: blob([
    item.n,
    item.folder,
    item.title,
    item.preflight,
    item.shortcuts,
    item.luna,
    item.sol,
    item.verdict,
    item.mechanism,
    "gpt-6-luna",
    "gpt-6-sol",
    "preflight verification",
    "grader",
    "oct 27 frontier run",
  ]),
}));

export type CatalogTier = "stage3" | "stateful" | "ehr" | "curriculum";

export const catalogTiers: Array<{ id: "all" | "flagship" | CatalogTier; label: string }> = [
  { id: "all", label: "All tiers" },
  { id: "flagship", label: "Flagship lots" },
  { id: "stage3", label: "Stage 3 Chained Bio" },
  { id: "stateful", label: "Stateful Lab-in-the-Loop Worlds" },
  { id: "ehr", label: "Exclusive 15-Year Hospital EHR" },
  { id: "curriculum", label: "Stage 1 & 2 Curriculum" },
];

export type CatalogRow = {
  id: string;
  tier: CatalogTier;
  name: string;
  packaged: string;
  tranche: string;
  band: string;
  passes: string;
  shortcuts: string;
  flagship: boolean;
  covers?: string;
  search: string;
};

const tierLabel: Record<CatalogTier, string> = {
  stage3: "Stage 3 Chained Bio",
  stateful: "Stateful Lab-in-the-Loop Worlds",
  ehr: "Exclusive 15-Year Hospital EHR",
  curriculum: "Stage 1 & 2 Curriculum",
};

function catalogRow(row: Omit<CatalogRow, "search">): CatalogRow {
  return {
    ...row,
    search: blob([
      row.id,
      tierLabel[row.tier],
      row.name,
      row.packaged,
      row.tranche,
      row.band,
      row.passes,
      row.shortcuts,
      row.flagship ? "flagship" : "",
      row.covers,
    ]),
  };
}

export const catalogRows: CatalogRow[] = [
  catalogRow({ id: "r35_subclonal_ccf", tier: "stage3", name: "Tumour-only WGS subclonal copy-number and allele-paired CCF", packaged: "20", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 67%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({ id: "r36_ccf_ties", tier: "stage3", name: "Subclonal copy-number and binomial likelihood ties", packaged: "0", tranche: "25", band: "0% to 20% frontier", passes: "gpt-6-luna 0%. gpt-6.1-sol 25%.", shortcuts: "4/4 FAIL", flagship: false }),
  catalogRow({ id: "r37_ic50_panel", tier: "stage3", name: "384-well 4PL IC50 panel, row evaporation and acoustic swap", packaged: "15", tranche: "30", band: "50% to 70% curriculum", passes: "gpt-6-luna 67%. gpt-6.1-sol 100%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({ id: "r38_ccf_ties_dense", tier: "stage3", name: "Dense tumour-only WGS clonal CCF and chromosomal inheritance", packaged: "32", tranche: "50", band: "20% to 40%", passes: "gpt-6-luna 0%. gpt-6.1-sol 25%. gpt-6-astra 0% on trap seeds.", shortcuts: "4/4 FAIL", flagship: true }),
  catalogRow({ id: "r39_wgd_timing", tier: "stage3", name: "Whole-genome doubling timing and punctuated aneuploidy clock", packaged: "0", tranche: "25", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 50%.", shortcuts: "4/4 FAIL", flagship: false }),
  catalogRow({ id: "r40_ctdna_chip", tier: "stage3", name: "Plasma cfDNA tumour fraction, CHIP, and subclonal copy inheritance", packaged: "35", tranche: "50", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 33%. gpt-6-astra 0% on sample seeds.", shortcuts: "6/6 FAIL", flagship: true }),
  catalogRow({ id: "r41_multiregion", tier: "stage3", name: "Two-region colorectal shared vs. private branching", packaged: "0", tranche: "25", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 67%.", shortcuts: "4/4 FAIL", flagship: false }),
  catalogRow({ id: "r42_hla_neoag", tier: "stage3", name: "Neoantigen vaccine design under chromosome 6 HLA class I LOH", packaged: "21", tranche: "40", band: "20% to 40%", passes: "gpt-6-luna 0%. gpt-6.1-sol 100%.", shortcuts: "6/6 FAIL", flagship: false }),
  catalogRow({ id: "r43_ffpe_parp", tier: "stage3", name: "FFPE mCRPC PARP eligibility and cytosine deamination filter", packaged: "25", tranche: "40", band: "20% to 40%", passes: "gpt-6-luna 0%. gpt-6.1-sol 100%.", shortcuts: "7/7 FAIL", flagship: false }),
  catalogRow({ id: "r44_ctdna_dense", tier: "stage3", name: "High-density PDAC cfDNA duplex panel and subclonal CHIP", packaged: "0", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 33% (93k tokens). gpt-6.1-sol 67%.", shortcuts: "6/6 FAIL", flagship: false }),
  catalogRow({ id: "r45_phylo_sum", tier: "stage3", name: "TRACERx lung clone tree, pigeonhole sum rule", packaged: "30", tranche: "40", band: "50% to 70% curriculum", passes: "gpt-6-luna 67%. gpt-6.1-sol 100%.", shortcuts: "5/5 FAIL", flagship: false }),
  catalogRow({ id: "r46_phylo_cna", tier: "stage3", name: "Clone tree with subclonal homologue gain and LOH multiplicity", packaged: "30", tranche: "40", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 67%.", shortcuts: "4/4 FAIL", flagship: false }),
  catalogRow({ id: "r47_mrd_panel", tier: "stage3", name: "3-stage resected lung WGS, clonal CCF, adjuvant therapy, 12-variant ctDNA MRD panel", packaged: "3", tranche: "40", band: "0% to 20% frontier", passes: "gpt-6-astra 0% (reward 0.70 to 0.76). gpt-6.1-sol 0% (reward 0.68).", shortcuts: "4/4 FAIL", flagship: true }),
  catalogRow({ id: "r48_spr_triage", tier: "stage3", name: "SPR sensorgram unmixing and de novo miniprotein triage v1", packaged: "0", tranche: "25", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 67%.", shortcuts: "5/5 FAIL", flagship: false }),
  catalogRow({ id: "r49_spr_triage", tier: "stage3", name: "3-stage SPR mass-transport correction, biphasic dissociation, epitope-binning triage v2", packaged: "0", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 0%. gpt-6.1-sol 33%.", shortcuts: "6/6 FAIL", flagship: true }),
  catalogRow({ id: "r50_multiregion_phylogeny", tier: "stage3", name: "3-biopsy primary, margin, and brain metastasis seeding", packaged: "0", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 67%.", shortcuts: "6/6 FAIL", flagship: false }),
  catalogRow({ id: "r51_phylo_hidden", tier: "stage3", name: "Formula-stripped phylogeny with an unobserved ancestral clone", packaged: "0", tranche: "30", band: "0% to 20% frontier", passes: "gpt-6-luna 0%. gpt-6.1-sol 33%.", shortcuts: "6/6 FAIL", flagship: false }),
  catalogRow({ id: "r52_isotopomer_mfa", tier: "stage3", name: "Parallel glucose and glutamine positional mass isotopomer flux", packaged: "0", tranche: "25", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 67%.", shortcuts: "6/6 FAIL", flagship: false }),
  catalogRow({ id: "r53_compartment_mfa", tier: "stage3", name: "Two-compartment cytosol vs. mitochondrion 13C flux and citrate shuttle", packaged: "0", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 0%. gpt-6.1-sol 33%.", shortcuts: "8/8 FAIL", flagship: false }),
  catalogRow({ id: "r54_spr_binder", tier: "stage3", name: "Two-channel reference-subtracted SPR kinetics and matrix filter", packaged: "0", tranche: "25", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 67%.", shortcuts: "6/6 FAIL", flagship: false }),
  catalogRow({ id: "r55_spr_capture", tier: "stage3", name: "Capture-format SPR with antigen decay and double-referencing", packaged: "0", tranche: "25", band: "20% to 40%", passes: "gpt-6-luna 33%. gpt-6.1-sol 50%.", shortcuts: "7/7 FAIL", flagship: false }),
  catalogRow({ id: "r56_spr_strip", tier: "stage3", name: "Regeneration-stripped capture SPR and candidate selection", packaged: "0", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 0%. gpt-6.1-sol 33%.", shortcuts: "8/8 FAIL", flagship: false }),
  catalogRow({ id: "r57e_phage_cocktail", tier: "stage3", name: "26x26 plate optical cross-talk, lysogenic dip kinetics, receptor union, cocktail design", packaged: "7", tranche: "40", band: "0% to 40%", passes: "gpt-6-astra 0% on seed 7409 (reward 0.9905). gpt-6-luna 67% (2/3).", shortcuts: "13/13 FAIL", flagship: true }),
  catalogRow({ id: "c58 / r58_13c_mfa_knockout", tier: "stage3", name: "GC-MS TBDMS stripping, compartmental 13C-MFA, synthetic-lethal knockout. Seeds 7501 to 7506.", packaged: "6", tranche: "40", band: "20% to 67%", passes: "gpt-6-luna 67% (2/3, 26k to 58k tokens). gpt-6-astra 100%.", shortcuts: "12/12 FAIL", flagship: true }),
  catalogRow({ id: "PDO-KRAS-2026", tier: "stateful", name: "sl01 organoid KRAS lab-in-the-loop. 6 cycles, $25k budget, zero-knowledge IPC sidecar, SHA-256 ledger.", packaged: "1", tranche: "24", band: "40% to 70%", passes: "gpt-6-luna blind IPC pass at $22k / 2 cycles. Unfiltered QC fail, reward 0.6389.", shortcuts: "4/4 FAIL", flagship: true }),
  catalogRow({ id: "sl02_project_optimus_dose_trial", tier: "stateful", name: "Project Optimus Phase I/II dose trial. Seed 8108 breaks raw cohort averages.", packaged: "3", tranche: "24", band: "20% to 40% task, 67% seed", passes: "gpt-6-luna 2/3 (fail 8108, reward 0.714). gpt-6.1-sol 2/3 (fail 8108, reward 0.591).", shortcuts: "5/5 FAIL", flagship: true }),
  catalogRow({ id: "sl03_counterfactual_sar_world_v1", tier: "stateful", name: "1,728-molecule counterfactual SAR v1 with aggregator blocks.", packaged: "3", tranche: "24", band: "20% to 40% task, 67% seed", passes: "gpt-6-luna 2/3 (fail 9133). gpt-6.1-sol 2/3 (fail 9131).", shortcuts: "5/5 FAIL", flagship: false }),
  catalogRow({ id: "sl04_counterfactual_sar_world_v2", tier: "stateful", name: "3-body linker SAR v2 and Triton X-100 detergent shift.", packaged: "3", tranche: "24", band: "20% to 40% Luna, 100% Sol", passes: "gpt-6-luna 2/3 (fail 9431, reward 0.546). gpt-6.1-sol 3/3 (reward 0.78 to 0.89).", shortcuts: "8/8 FAIL", flagship: false }),
  catalogRow({ id: "sl05_verify_or_trust_crispr_audit", tier: "stateful", name: "240-gene CRISPR audit. Paralog buffering and drug-induced dependency.", packaged: "3", tranche: "24", band: "20% to 40% Luna, 100% Sol", passes: "gpt-6-luna 2/3 (fail 9532, reward 0.688). gpt-6.1-sol 3/3 at 1.000.", shortcuts: "7/7 FAIL", flagship: false }),
  catalogRow({ id: "sl06_latent_verify_or_trust_hitlist_revision", tier: "stateful", name: "Latent Verify-or-Trust. Paralog, amplicon artifact, cited hit-list revision.", packaged: "6", tranche: "24", band: "0% Luna to 100% Sol", passes: "gpt-6-luna 0/6 (reward 0.625 to 0.739). gpt-6.1-sol 6/6 (reward 0.931 to 0.987).", shortcuts: "10/10 FAIL", flagship: true }),
  catalogRow({ id: "proto7_dated_resistance_combo", tier: "stateful", name: "Dated CRISPR resistance. Day 14 cut, hidden week 6, assay rerun, MEK combo.", packaged: "Oct 27 run", tranche: "24-seed preflight", band: "Luna 0/6, Sol v2 2/3", passes: "gpt-6-luna 0/6. gpt-6-sol v1 0/3 unfair, v2 2/3.", shortcuts: "0 to 1/24, one at 9/24", flagship: true }),
  catalogRow({ id: "ehr01_longitudinal_wetlab_radiology", tier: "ehr", name: "Longitudinal EHR, ELISA to ECLIA migration, hemolysis rejection, RECIST vs. iRECIST, right-censored KM PFS.", packaged: "1", tranche: "30", band: "0% to 20% frontier", passes: "gpt-6-luna 0%. gpt-6.1-sol 0% to 33%. gpt-6-astra 0% on multi-confounder seeds.", shortcuts: "5/5 FAIL", flagship: true }),
  catalogRow({ id: "ehr02_oncology_lot_adjudication", tier: "ehr", name: "Multi-line regimen reconstruction, steroid pre-medication masking, CTCAE grade >=3 dose-hold.", packaged: "0", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 0%. gpt-6.1-sol 33%.", shortcuts: "5/5 FAIL", flagship: true }),
  catalogRow({ id: "ehr03_icu_sepsis_hemodynamic_titration", tier: "ehr", name: "ABG, lactate clearance, vasopressor titration, vancomycin AUC/MIC nephrotoxicity.", packaged: "0", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 25%. gpt-6.1-sol 50%.", shortcuts: "5/5 FAIL", flagship: true }),
  catalogRow({ id: "ehr04_autoimmune_steroid_flare_deconv", tier: "ehr", name: "CRP, ESR, and calprotectin lot drift vs. corticosteroid burst masking.", packaged: "0", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 25%. gpt-6.1-sol 50%.", shortcuts: "5/5 FAIL", flagship: true }),
  catalogRow({ id: "ehr05_transplant_tacrolimus_pk_rejection", tier: "ehr", name: "Tacrolimus trough, CYP3A5 dosing, donor-derived cfDNA, Banff rejection vs. CNI toxicity.", packaged: "0", tranche: "30", band: "20% to 40%", passes: "gpt-6-luna 0%. gpt-6.1-sol 33%.", shortcuts: "5/5 FAIL", flagship: true }),
  catalogRow({ id: "ehr06_timestamped_clinical_board_cutoff", tier: "ehr", name: "Molecular tumour board cutoff. Evidence locked at date T. No literature memorization.", packaged: "0", tranche: "30", band: "0% to 20% frontier", passes: "gpt-6-luna 0%. gpt-6.1-sol 25%.", shortcuts: "6/6 FAIL", flagship: true }),
  catalogRow({ id: "r27_hts_edge_evap", tier: "curriculum", name: "Stage 2. 384-well luminescence screen, edge evaporation, control drift.", packaged: "0", tranche: "20", band: "50% to 70%", passes: "gpt-6-luna 67%. gpt-6.1-sol 100%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({ id: "r28_qpcr_ddct", tier: "curriculum", name: "Stage 2. RT-qPCR efficiency, melt-curve QC, Pfaffl expression.", packaged: "0", tranche: "20", band: "50% to 70%", passes: "gpt-6-luna 67%. gpt-6.1-sol 100%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({ id: "r29_paired_biopsy_swap", tier: "curriculum", name: "Stage 2. Paired biopsy SNP barcode and sample-swap recovery.", packaged: "0", tranche: "20", band: "50% to 70%", passes: "gpt-6-luna 67%. gpt-6.1-sol 100%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({ id: "r30_covalent_hts_kinetics", tier: "curriculum", name: "Stage 2. Covalent fragment k_inact/K_I and warhead filter.", packaged: "0", tranche: "20", band: "50% to 70%", passes: "gpt-6-luna 67%. gpt-6.1-sol 100%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({ id: "r31_biomarker_identifiability", tier: "curriculum", name: "Stage 2. Pharmacodynamic target engagement under batch and purity confounding.", packaged: "0", tranche: "20", band: "50% to 70%", passes: "gpt-6-luna 67%. gpt-6.1-sol 100%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({ id: "r32_elisa_hook_lloq", tier: "curriculum", name: "Stage 2. Soluble PD-L1 4PL ELISA, high-dose hook, serial dilution.", packaged: "0", tranche: "20", band: "50% to 70%", passes: "gpt-6-luna 67%. gpt-6.1-sol 100%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({ id: "r33_wgs_purity_ploidy", tier: "curriculum", name: "Stage 2. Tumour-only WGS purity and ploidy grid with genotyping outliers.", packaged: "0", tranche: "20", band: "50% to 70%", passes: "gpt-6-luna 67%. gpt-6.1-sol 100%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({ id: "r34_subclonal_cna_mix", tier: "curriculum", name: "Stage 2. Two-population subclonal copy-number mixture.", packaged: "0", tranche: "20", band: "40% to 60%", passes: "gpt-6-luna 50%. gpt-6.1-sol 100%.", shortcuts: "3/3 FAIL", flagship: false }),
  catalogRow({
    id: "r01_to_r26_clinical_biostats_suite",
    tier: "curriculum",
    name: "Stage 1. 26-family regulatory SAP suite. Packaged on demand.",
    packaged: "0",
    tranche: "520",
    band: "80% to 100% warm-up",
    passes: "gpt-6-luna 78% to 100%. gpt-6.1-sol 100% (25/25).",
    shortcuts: "3/3 FAIL per family",
    flagship: false,
    covers:
      "c_km Kaplan-Meier, c2_surv, c3_surv stratified log-rank, c4_surv, c5_pfs, c11_rmst, c12_pfs_strat, c13_pfs_cox, c14_os_tvcox, c15_ttp_fg Fine-Gray, c26_turnbull, c3_cmh, c3_graph, c9_orr, c10_orr_mn, c16_multi, c21_gate, c23_ssr, c24_exact, c25_recist, c2_pk, c3_dose, c4_rdi, c8_rdi, c2_ae, c4_eair, c8_eair, c7_alt Hy's Law, c7_mace, c2_amend, c2_batch, c2_bridge, c2_leak, c5_base, c5_pop, c17_integ through c20_sparse, c22_recon.",
  }),
  catalogRow({
    id: "pg01_to_pg12_proving_ground_hygiene",
    tier: "curriculum",
    name: "Stage 1. 12-family proving-ground bioanalytical hygiene.",
    packaged: "12",
    tranche: "120",
    band: "70% to 90% warm-up",
    passes: "gpt-6-luna 75% to 92%. gpt-6.1-sol 100%.",
    shortcuts: "3/3 FAIL per family",
    flagship: false,
    covers:
      "allele_normalizer, assay_label_provenance, batch_confound, checkpoint_lineage, contam_sentinel, coord_drift_detector, endpoint_validity, power_gate, pvalue_police, replicate_unit, survivor_gate, LIMS trailer and unit reconciliation.",
  }),
];

export type ArchiveLot = {
  name: string;
  tasks: string;
  covers: string;
  purpose: string;
  tiers: CatalogTier[];
  flagship: boolean;
  search: string;
};

function archiveLot(item: Omit<ArchiveLot, "search">): ArchiveLot {
  return {
    ...item,
    search: blob([item.name, item.tasks, item.covers, item.purpose, "archive packaged lot", item.flagship ? "flagship" : ""]),
  };
}

export const archiveLots: ArchiveLot[] = [
  archiveLot({
    name: "neo-norma-200task-lot.tar.gz",
    tasks: "200 tasks",
    covers: "r38 (30), r40 (30), r42 (20), r43 (25), r45 (30), r46 (30), r35 (20), r37 (15). Seeds 93501 to 94699.",
    purpose: "Production Stage 3 post-training tranche.",
    tiers: ["stage3"],
    flagship: true,
  }),
  archiveLot({
    name: "neo-norma-phage-cocktail-lot.tar.gz",
    tasks: "6 tasks",
    covers: "r57e_phage_cocktail, seeds 7401 to 7406.",
    purpose: "Microplate cross-talk, lysogenic kinetics, and cocktail design.",
    tiers: ["stage3"],
    flagship: true,
  }),
  archiveLot({
    name: "neo-norma-13c-mfa-knockout-lot.tar.gz",
    tasks: "6 tasks",
    covers: "c58 / r58_13c_mfa_knockout, seeds 7501 to 7506.",
    purpose: "Natural-abundance stripping, two-compartment 13C-MFA, synthetic-lethal knockout.",
    tiers: ["stage3"],
    flagship: true,
  }),
  archiveLot({
    name: "neo-norma-healthcare-ehr-preview.zip",
    tasks: "3 tasks",
    covers: "ehr01 (1), r40_ctdna_chip (1), r47_mrd_panel (1).",
    purpose: "Longitudinal hospital EHR, wet-lab, and serial radiology preview.",
    tiers: ["ehr", "stage3"],
    flagship: true,
  }),
];

export type BuyerRoom = {
  id: string;
  room: string;
  who: string;
  contact: string;
  status: string;
  next: string;
  details: string[];
  search: string;
};

const buyerSeed: Omit<BuyerRoom, "search">[] = [
  {
    id: "google",
    room: "Google Gemini RSI & TPU XLA",
    who: "Patrick C. Toulme",
    contact: "ptoulme@google.com",
    status: "Active buyer room",
    next: "Walk the Oct 27 catalogue and the 10-task gemini-4-argon set aimed at a 20% to 40% pass band.",
    details: [
      "The full environment catalogue was prepared for this room on Oct 27, 2026. Delivery shape is Harbor v1.2, Antigravity (agy), Prime Intellect verifiers.v1, and UK AISI inspect_ai.",
      "The room pack includes a 6-task sample (MRD, ctDNA CHIP, phage cocktail, and the organoid lab-in-the-loop game) plus 10 Antigravity rollouts for gemini-4-argon.",
      "Google Research VERID, published Oct 16, 2026, is a PyLabRobot liquid-handling twin. It complements this calibration pack. It does not replace the hospital worlds.",
      "Room files: 02-buyer-rooms/google-patrick-toulme/.",
    ],
  },
  {
    id: "diffuse",
    room: "Diffuse Labs",
    who: "Tejpal Singh, Co-Founder",
    contact: "diffuselabs.ai",
    status: "Active strategic partner and seed co-investor",
    next: "Review the 5-task sample scorecard with his engineering team and close co-investment plus wet-lab researcher terms.",
    details: [
      "Call completed Tue Oct 27, 2026 at 10:30 AM PT. Tejpal offered to fund wet-lab access, hire bio researchers, and place a strategic co-investment.",
      "5-task evaluation sample sent Oct 27 at 2:24 PM PT: neo-norma-diffuse-buyer-sample.zip.",
      "Diffuse Labs is a $20M Series A San Francisco RL neolab. The team is IOI and IMO medalists selling coding, chip design, and Kubernetes environments to frontier labs. Tejpal was previously Co-CEO of OpenBlock.",
      "Same relationship is on the seed CRM. Do not run it as two unrelated threads.",
    ],
  },
  {
    id: "dominik",
    room: "Dominik Scherm, stealth lab-in-the-loop",
    who: "Dominik Scherm",
    contact: "@dominik_scherm",
    status: "Active stealth partner room",
    next: "Keep the room on proto1 through proto7, with the budgeted lab-in-the-loop game in front.",
    details: [
      "Ex-Prime Intellect (prime env eval). Building a stealth lab-in-the-loop drug discovery company.",
      "The product to show is dated, stateful scientific campaigns on Harbor plus Docker Sandboxes, with the hidden world as a Compose sidecar.",
      "Room files: 02-buyer-rooms/dominik-scherm-lab-in-the-loop/.",
    ],
  },
  {
    id: "state-machines",
    room: "State Machines",
    who: "Idan Bier, Co-Founder",
    contact: "@statemachineshq",
    status: "Active referral room",
    next: "Hold the territory split. Refer life-science buyers here.",
    details: [
      "State Machines builds stateful enterprise software replicas. The play is a territory split and referrals, not a biology competition.",
      "On Eon Era, frontier accuracy drops from 92.6% on single-table queries to 3.7% on multi-hop cross-system queries. That is their market. Clinical and wet-lab campaigns stay with Neo Norma.",
      "Room files: 02-buyer-rooms/state-machines-idan-bier/.",
    ],
  },
  {
    id: "ehr-partner",
    room: "15-Year Hospital EHR + Quarry / Anthroly",
    who: "Shailesh (Quarry) and Sarath Kavuru (Anthroly)",
    contact: "quarrydata.ai / anthroly.com",
    status: "Partnership live",
    next: "Keep the MOUs current and use the longitudinal preview (ehr01, r40, r47) as the sample that ships.",
    details: [
      "50/50 revenue share on 15 years of longitudinal hospital clinical records. Partners pay $0 upfront. Their half of net commercial receipts is paid within 5 business days of the buyer payment.",
      "Quarry (quarrydata.ai, Shailesh) and Anthroly (anthroly.com, Sarath Kavuru, 20+ US operating companies) are active 50/50 data-supply MOUs.",
      "Records go through HIPAA Safe Harbor de-identification before transfer. Held-out outcomes stay inside the isolated Grader and sidecar. Raw charts are not what the buyer receives.",
      "Suites on the menu: ehr01 through ehr06. Room files: 02-buyer-rooms/shailesh-ehr-partner/.",
    ],
  },
  {
    id: "datavendor",
    room: "DataVendor / SF Traces",
    who: "HUD DataVendor, SF Traces, AIData.Broker",
    contact: "Marketplace listing kit",
    status: "Listing kit in the room",
    next: "Publish with Preflight verification results and a reward-hacking note. Buyers now ask for both.",
    details: [
      "Listing copy, pricing, and terms live in 02-buyer-rooms/datavendor-marketplace/LISTING_KIT.md.",
      "Price anchors on the listing: $15k pilot, $130k non-exclusive, $240k cap-3, $380k buyout. The stateful-world comp sits near $500k.",
      "Volume context from Mercor: about $2,000 per custom atomic task, and top labs buy up to 50,000 tasks a month. Long-horizon chained biology is priced at the top of that range, not at the atomic floor.",
    ],
  },
];

export const buyerRooms: BuyerRoom[] = buyerSeed.map((item) => ({
  ...item,
  search: blob([item.room, item.who, item.contact, item.status, item.next, item.details, "buyer partner room"]),
}));

export type RadarRow = {
  name: string;
  stage: string;
  offering: string;
  meaning: string;
  search: string;
};

function radarRow(row: Omit<RadarRow, "search">): RadarRow {
  return { ...row, search: blob([row.name, row.stage, row.offering, row.meaning, "competitor radar"]) };
}

export const directCompetitors: RadarRow[] = [
  radarRow({
    name: "BioStack Platforms",
    stage: "YC Spring 2026. $9.5M seed, Oct 2026, led by Peak XV, with DCVC, Emerson Collective, and Afore. Sanat Mishra and Parth Patwa (ex-AWS GenAI).",
    offering: "Longitudinal patient records from hospitals in the US, Brazil, India, and Argentina turned into clinical RL tasks. Scored with outcomes, guidelines, and clinician review. Claims 17 customers and prospects.",
    meaning: "Closest direct competitor. Neo Norma answers with a deterministic Grader and no clinician judge, Preflight verification that falsifies 4 to 13 shortcuts per seed, the exclusive 15-year US hospital partnership, 82 families across wet lab, genomics, and 13C-MFA, and timestamped cutoffs in proto7 and ehr06.",
  }),
  radarRow({
    name: "Gamow Labs LabRobotBench v0.1",
    stage: "Launched Oct 19, 2026.",
    offering: "Agent-operated genomics wet lab. Held-out means: gpt-6.1 Sol 46.7%, Claude Opus 5.5 23.0%, Gemini 4 Argon 20.9%.",
    meaning: "Proves Sol drops below 50% on physical failure recovery. Neo Norma put that layer into proto7: drifted Day 14 plate controls, a failed Day 7 read, and a liquid-handler tip failure that must be rerun before the combination stage.",
  }),
  radarRow({
    name: "Tacit Labs",
    stage: "Seed / early. Active founder thread.",
    offering: "Long-horizon drug-development chains that use biological foundation models and lab readouts as verifiers.",
    meaning: "proto5 and proto6 show those foundation models carry paralog, drug-induced dependency, and amplicon blind spots. They cannot be an unverified answer key.",
  }),
  radarRow({
    name: "Apodex TRACES",
    stage: "Launched Aug 12, 2026.",
    offering: "17 executable environments, 218 episodes, hidden verifiers, and a process metric.",
    meaning: "Small episode count next to 82 families, 256 packaged Harbor tasks, 1,919 tranche tasks, and 76,000+ seeds, with SHA-256 and HMAC ledgers.",
  }),
  radarRow({
    name: "Leash Bio Minos",
    stage: "Latent Space, Oct 14 and Oct 26, 2026. Ian Quigley.",
    offering: "Premeasured DNA-encoded library screens, about 6.3M molecules, replayed as 100-molecule budget worlds. About 100,000 rollouts.",
    meaning: "Validates counterfactual campaign grading. proto3 and proto4 add 3-body linker cliffs, aggregator bleed-through, and a Triton X-100 retest, then the dated worlds where a static lookup table cannot exist.",
  }),
  radarRow({
    name: "LatchBio OmicsBench v1",
    stage: "Launched Oct 19, 2026.",
    offering: "784 Docker omics tasks from 8 public benchmarks. Short-horizon about 49% (Grok 4.7 49.4%, GPT-6 Astra 49.3%). Long-horizon stuck at 32.8% (GPT-5.6 Sol).",
    meaning: "Their agents recalled the source study from sanitized public data and tried to reverse-engineer the grader. Private hospital records, seeded generators, and out-of-workspace sidecar Graders are the counter.",
  }),
];

export const marketSignals: RadarRow[] = [
  radarRow({
    name: "Anthropic wet lab and Coefficient Bio",
    stage: "Coefficient Bio acquired for $400M, April 2026. Bay Area BSL-1/2 lab opened Sept 2026.",
    offering: "About 950 Claude agents plus bench scientists found a CRISPR-like enzyme system in 21 hours (210M tokens).",
    meaning: "A single bench cannot manufacture 15-year multi-visit histories, ELISA to ECLIA migrations, hemolysis artifacts, or timestamped clinical cutoffs. That is the external product.",
  }),
  radarRow({
    name: "Google Research VERID",
    stage: "Published Oct 16, 2026.",
    offering: "Stateful liquid-handling twin on PyLabRobot. Agents dry-run protocols before physical execution and found single-digit nanomolar cancer binders.",
    meaning: "Fits the Patrick Toulme calibration pack. It is not a substitute for the hospital lot.",
  }),
  radarRow({
    name: "Petrichor Bio",
    stage: "YC Fall 2026. Three 19-year-old founders.",
    offering: "Fabless wet labs for AI under GMP, GLP, and 21 CFR Part 11.",
    meaning: "Possible physical execution partner alongside Diffuse Labs.",
  }),
  radarRow({
    name: "Polyphron, Rivercell, Drylab",
    stage: "Oct 2026 seeds: Polyphron $20M, Rivercell $25M, Drylab $3M. Quiet Capital, HV, Vertex SEA.",
    offering: "Automated cardiac and liver tissue, virtual-cell world models, and computational method checks.",
    meaning: "Confirms venture demand for biological verification. It does not ship dated clinical campaigns.",
  }),
  radarRow({
    name: "Periodic Labs",
    stage: "$300M seed. Liam Fedus and Ekin Dogus Cubuk. Latent Space, Oct 8, 2026.",
    offering: "Periodic Neon post-trained on FrontierXRD, 2.7% to 55.3%.",
    meaning: "Their stated design rule matches proto7 and ehr06: reward sub-steps, and cut the evidence at a timestamp so pretraining cannot memorize the answer.",
  }),
  radarRow({
    name: "Mercor / Brendan Foody / Sequoia",
    stage: "Sequoia talk, Aug 12, 2026.",
    offering: "About $2,000 per custom task, range $50 to $10,000. Top labs buy up to 50,000 tasks a month. An 1,800-task run lifted corporate law pass@1 from 4.7% to 26.6%.",
    meaning: "Trainability test: pass@1 fails, and pass@16 succeeds once or twice. proto6 and proto7 sit in that band. The next frontier they named is 100 to 1,000 hour tasks.",
  }),
  radarRow({
    name: "Sean Cai stateful replica",
    stage: "Frontier RL environment sales interview, Oct 2026.",
    offering: "A full SAP-style stateful replica sold near $500,000. Biology and cybersecurity are bought by the most sophisticated labs, named as Anthropic and OpenAI.",
    meaning: "This is the $500k stateful world comp on the pricing bars. Long-horizon biology is one step digital, one step physical.",
  }),
  radarRow({
    name: "Mechanize",
    stage: "$9.1M seed at a $500M valuation.",
    offering: "Google DeepMind license-and-hire, Sept 2026. Tamay Besiroglu and 12+ staff moved to DeepMind.",
    meaning: "Distribution can disappear into a lab. Neo Norma keeps the hospital partnership and the keys vault outside any single license.",
  }),
  radarRow({
    name: "Baseten and OpenEnv Arena",
    stage: "Oct 2026.",
    offering: "Baseten refers Harvey, Lovable, and Gamma to audited environment vendors (Eigent AI named). OpenEnv Arena scores Docker environments by GRPO lift on Qwen3.8-27B, up to 4 hours on one H200.",
    meaning: "Ship Preflight verification and a reward-hacking note with every lot. Measured training lift is becoming a buyer filter.",
  }),
];

export type PriceBar = {
  name: string;
  amount: number;
  note: string;
  search: string;
};

export const priceBars: PriceBar[] = [
  {
    name: "$15k Pilot",
    amount: 15000,
    note: "48-hour pilot, 5 to 15 tasks. The pilot fee counts toward a full pack inside 30 days. The band starts at $5k.",
    search: "",
  },
  {
    name: "$130k Non-Exclusive",
    amount: 130000,
    note: "200-task annual license. $650 per task.",
    search: "",
  },
  {
    name: "$240k Cap-3",
    amount: 240000,
    note: "Semi-exclusive, capped at 3 AI labs. $1,200 per task.",
    search: "",
  },
  {
    name: "$380k Buyout",
    amount: 380000,
    note: "One buyer. $1,900 per task on a 200-task pack, and up for custom science.",
    search: "",
  },
  {
    name: "$500k Stateful World Comp",
    amount: 500000,
    note: "Sean Cai comp for a complex stateful enterprise replica. Chained bio campaigns and proto worlds price against this, not against a $2k atomic task.",
    search: "",
  },
].map((item) => ({ ...item, search: blob([item.name, item.note, item.amount, "pricing bar"]) }));

export const priceCeiling = 500000;

export type FundLine = { label: string; amount: number; note: string };

export type SeedScenario = {
  id: "lean" | "core" | "platform";
  label: string;
  total: number;
  summary: string;
  lines: FundLine[];
  search: string;
};

function scenario(item: Omit<SeedScenario, "search">): SeedScenario {
  return {
    ...item,
    search: blob([item.label, item.summary, item.total, item.lines.map((line) => `${line.label} ${line.amount} ${line.note}`)]),
  };
}

export const seedScenarios: SeedScenario[] = [
  scenario({
    id: "lean",
    label: "$2.5M Lean Seed",
    total: 2500000,
    summary: "Open this round now. Scale the hospital partnership and the seven worlds. Wet-lab access stays mostly partner-funded through Diffuse Labs. Current operating burn on the ledger is $445/mo.",
    lines: [
      { label: "Verified environments and the 15-year hospital partnership", amount: 1100000, note: "82 families, packaged Harbor tasks, and the 50/50 data partnership." },
      { label: "Stateful world simulators", amount: 900000, note: "proto1 through proto7, sidecar isolation, and Preflight verification on every lot." },
      { label: "Wet-lab loop closure", amount: 300000, note: "Start the loop. Do not try to own a bench on this check." },
      { label: "GTM, entity, and reserve", amount: 200000, note: "Ben Romero JTBD, 10% / 15% / 20% BD bands, and the Delaware C-Corp conversion." },
    ],
  }),
  scenario({
    id: "core",
    label: "$5.0M Core Seed",
    total: 5000000,
    summary: "Same three pillars. The extra capital accelerates wet-lab loop closure instead of widening the catalog for its own sake.",
    lines: [
      { label: "Verified environments and the 15-year hospital partnership", amount: 1500000, note: "More packaged tranche tasks and a staffed hospital-data lane." },
      { label: "Stateful world simulators", amount: 1400000, note: "Harden proto2 noise and the proto7 multi-stage campaign before they ship as lots." },
      { label: "Wet-lab loop closure", amount: 1700000, note: "Researcher hires and paid bench time with Diffuse Labs and a physical lab partner." },
      { label: "GTM, entity, and reserve", amount: 400000, note: "Outbound, BD representatives, and a longer operating reserve." },
    ],
  }),
  scenario({
    id: "platform",
    label: "$10.0M Platform Seed",
    total: 10000000,
    summary: "Platform case. Wet-lab loop closure becomes the largest line so digital campaigns can close on physical ground truth.",
    lines: [
      { label: "Verified environments and the 15-year hospital partnership", amount: 2200000, note: "Exclusive clinical depth across ehr01 through ehr06, not a thinner public-omics catalog." },
      { label: "Stateful world simulators", amount: 2400000, note: "A full trainability tier: Luna-breaking worlds with dense stage rewards." },
      { label: "Wet-lab loop closure", amount: 4500000, note: "The expansion the $5.0M and $10.0M cases exist to buy." },
      { label: "GTM, hiring, entity, and reserve", amount: 900000, note: "Commercial team around Ben Romero, entity cleanup, and reserve." },
    ],
  }),
];

export type OperatingRule = {
  n: string;
  title: string;
  body: string[];
  search: string;
};

const ruleSeed: Omit<OperatingRule, "search">[] = [
  {
    n: "01",
    title: "2-Minute Upfront Raise Rule",
    body: [
      "Within the first 2 minutes of every VC call, say: we are opening a $2.5M seed round right now to scale the 15-year hospital data partnership, stateful biological world simulators, and wet-lab loop closure, and we are speaking with funds who can lead or co-invest.",
      "Confirm on that same opening that the person has check-writing authority and an active allocation. The Oct 27 Virtue call with Emre Karatas spent 30 minutes on market questions and never reached the raise. That is the failure this rule prevents.",
    ],
  },
  {
    n: "02",
    title: "IP Protection Rule",
    body: [
      "Do not explain seed-generator internals, shortcut-construction recipes, or task-compilation pipelines on an exploratory call. Associates fishing for a market map do not get the factory.",
      "Answer keys and hidden prototype generators stay in the private vault at github.com/buyan-kh/neo-norma-keys (258 verified task keys). Held-out outcomes stay inside the isolated Grader and the sidecar. The buyer receives a de-identified problem and a score.",
    ],
  },
  {
    n: "03",
    title: "Verification Terminology Rule",
    body: [
      "Always say Grader and Preflight verification. Do not use internal filenames in public posts, buyer decks, or top-level overviews.",
      "What the buyer hears: a deterministic Grader returns passed in {0, 1} and a stage reward in [0.0, 1.0]. Preflight verification shows the mathematical reference at 1.0000 while 3 to 13 domain shortcuts fail.",
    ],
  },
  {
    n: "04",
    title: "Plain-English External Pitch",
    body: [
      "External copy, including neonorma.si, stays in plain English: AI aces textbook science exams, then breaks 67% to 100% of the time on messy real hospital and wet-lab work. Neo Norma turns real 15-year hospital and wet-lab records into verifiable RL environments for science.",
      "Do not lead a public page with coding-benchmark jargon or grader latency. The inside desk can be specific. The public site stays in the buyer's language.",
    ],
  },
  {
    n: "05",
    title: "Dash and Attribution Hygiene",
    body: [
      "No em dashes and no en dashes in documents, mail, or this desk. Use hyphens, colons, or a new sentence.",
      "Michael (Mike) Andersland and Federico Bollano spoke with Buyan on October 26 from a personal angle. They were not representing Meta Superintelligence Labs or Palantir. Do not list them as a corporate pilot.",
    ],
  },
];

export const operatingRules: OperatingRule[] = ruleSeed.map((item) => ({
  ...item,
  search: blob([item.n, item.title, item.body, "operating rule"]),
}));

export type InvestorRow = {
  name: string;
  who: string;
  profile: string;
  status: string;
  next: string;
  search: string;
};

const investorSeed: Omit<InvestorRow, "search">[] = [
  {
    name: "Zetta Venture Partners",
    who: "Apoorva Pandhi, General Partner. apoorva@zettavp.com",
    profile: "$365M+ AUM AI-first seed fund. Early in Kaggle, Domino Data Lab, MotherDuck, Boltz, Noetik, Nabla, and Periodic Labs.",
    status: "Primary $2.5M lead and mentor target. Intro call Tue Oct 27 at 10:00 AM PT. Follow-up sent Oct 27 at 2:23 PM PT announcing the round. He validated near-term RLVR demand and told us to frame horizon-2 worlds with living organisms.",
    next: "Host the 30-minute deep dive. Demo proto1 through proto7, especially proto6 and proto7.",
  },
  {
    name: "Diffuse Labs",
    who: "Tejpal Singh, Co-Founder",
    profile: "$20M Series A. Coding, chip, and Kubernetes environments. Strategic bio partner, not only a financial check.",
    status: "Active partner and seed co-investor. Call Tue Oct 27 at 10:30 AM PT. Sample zip sent at 2:24 PM PT.",
    next: "Scorecard review, then co-investment and wet-lab researcher terms.",
  },
  {
    name: "Virtue VC",
    who: "Emre Karatas (ek@virtuevc.com) and Sean Doolan, Managing Partner (sd@virtuevc.com)",
    profile: "Healthcare and life sciences seed. Checks from $500k to $4M. Portfolio includes Standard Model Bio, Ryght AI, and Hermes Health.",
    status: "Intro call Tue Oct 27 with Emre. Thirty minutes of market questions, no raise discussed. That call is why the 2-minute rule exists.",
    next: "Follow up only with the high-level $2.5M brief. Open with the raise.",
  },
  {
    name: "Ben Romero, co-founder ops",
    who: "benosaromero@gmail.com. Commercial and GTM co-founder.",
    profile: "Investor network, enterprise sales, BD representative management, and Jobs To Be Done positioning. Buyan Khurelbaatar (buyan@neonorma.si) keeps the compiler, the seven worlds, packaging, and frontier calibration.",
    status: "The buyer's job: move a model's scientific and clinical score from about 25% to above 60% with on-policy RL (GRPO, RLOO, RSI) without reward hacking, contamination, or a leaky verifier.",
    next: "Every deliverable ships with a 20% to 40% Pass@1 band and Preflight verification that falsifies 4 to 13 shortcuts. BD commission bands are 10%, 15%, and 20%.",
  },
];

export const investors: InvestorRow[] = investorSeed.map((item) => ({
  ...item,
  search: blob([item.name, item.who, item.profile, item.status, item.next, "crm seed investor jtbd"]),
}));
