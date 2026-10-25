export type TraceOption = {
  n: string;
  text: string;
  result: string;
  chosen?: boolean;
};

export type Shortcut = {
  name: string;
  score: number;
};

export type TraceTask = {
  id: string;
  name: string;
  step: string;
  tokenLine: string;
  contradiction: string;
  options: TraceOption[];
  logLabel: string;
  removed: string;
  reality: string;
  capLabel: string;
  landAtCap: boolean;
  cap: number;
  shortcuts: Shortcut[];
};

export type ScoreRow = {
  id: string;
  name: string;
  luna: string;
  sol: string;
  astra: string;
  tokens: string;
  shortcuts: string;
  linked: boolean;
};

export const traceTasks: TraceTask[] = [
  {
    id: "r47_mrd_panel",
    name: "Liquid Biopsy MRD + Clonal Phylogeny",
    step: "Step 28341/42000",
    tokenLine: "42,000 tokens of reasoning...",
    contradiction: "Copy-number solution violates clonal inheritance constraints.",
    logLabel: "mutations",
    removed: "# removed: chr7:55249021 (outlier)",
    reality: "Violates clonal inheritance rules (negative copy state).",
    capLabel: "5x Shortcut heuristics: <= 0.42",
    landAtCap: true,
    cap: 0.42,
    options: [
      { n: "1", text: "Adjust tumor purity", result: "inconsistent" },
      { n: "2", text: "Recompute subclone tree", result: "fails" },
      { n: "3", text: "Mark mutation as outlier", result: "chosen", chosen: true },
    ],
    shortcuts: [
      { name: "drop_outlier_mutation", score: 0.42 },
      { name: "skip_clonal_inheritance", score: 0.42 },
      { name: "naive_purity", score: 0.42 },
      { name: "ignore_parent_clone", score: 0.42 },
      { name: "chip_as_somatic", score: 0.42 },
    ],
  },
  {
    id: "r40_ctdna_chip",
    name: "ctDNA Variant Calling + WBC CHIP",
    step: "Trace // r40_ctdna_chip",
    tokenLine: "Avg tokens: 22.5k",
    contradiction:
      "Variant allele fractions sit in the WBC normal. The call still treats CHIP as tumor.",
    logLabel: "variants",
    removed: "# removed: wbc_chip_filter (bypassed)",
    reality: "The somatic call is clonal hematopoiesis. Purity and MRD are inflated.",
    capLabel: "5x Shortcut heuristics: <= 0.41",
    landAtCap: true,
    cap: 0.41,
    options: [
      { n: "1", text: "Subtract the WBC CHIP panel", result: "call collapses" },
      { n: "2", text: "Require duplex consensus", result: "depth fails" },
      { n: "3", text: "Keep the site and skip the normal", result: "chosen", chosen: true },
    ],
    shortcuts: [
      { name: "treat_chip_as_somatic", score: 0.41 },
      { name: "skip_wbc_normal", score: 0.41 },
      { name: "single_strand_consensus", score: 0.41 },
      { name: "flat_vaf_threshold", score: 0.41 },
      { name: "ignore_germline_site", score: 0.41 },
    ],
  },
  {
    id: "r52_isotopomer_mfa",
    name: "13C Metabolic Flux + Inhibitor Gating",
    step: "Trace // r52_isotopomer_mfa",
    tokenLine: "Avg tokens: 16.8k",
    contradiction: "13C isotopomer balance breaks while the inhibitor gate stays open.",
    logLabel: "fluxes",
    removed: "# removed: inhibitor_gate (forced open)",
    reality: "Mass balance fails. A gated reaction carries flux with no substrate.",
    capLabel: "5x Shortcut heuristics: <= 0.44",
    landAtCap: true,
    cap: 0.44,
    options: [
      { n: "1", text: "Close the inhibitor gate and refit", result: "fluxes move" },
      { n: "2", text: "Add an exchange sink", result: "unidentified" },
      { n: "3", text: "Fit an unconstrained open gate", result: "chosen", chosen: true },
    ],
    shortcuts: [
      { name: "unconstrained_pool", score: 0.44 },
      { name: "drop_inhibitor_gate", score: 0.44 },
      { name: "ignore_co2_release", score: 0.44 },
      { name: "steady_state_shortcut", score: 0.44 },
      { name: "single_label_fit", score: 0.44 },
    ],
  },
  {
    id: "ehr01_longitudinal",
    name: "10-Yr Hospital EHR + Wet-Lab Drift + RECIST",
    step: "Trace // ehr01_longitudinal",
    tokenLine: "Longitudinal window: 10 years",
    contradiction:
      "Immunotherapy CT flare is called as progression without a confirmatory nadir scan.",
    logLabel: "visits",
    removed: "# removed: confirmatory_nadir_scan (skipped)",
    reality: "The flare is pseudoprogression. The greedy RECIST call is early.",
    capLabel: "5 Greedy Shortcuts: 0.24 to 0.41",
    landAtCap: false,
    cap: 0.41,
    options: [
      { n: "1", text: "Wait for the confirmatory nadir scan", result: "flare recants" },
      { n: "2", text: "Correct lot drift on the labs", result: "no PD" },
      { n: "3", text: "Call RECIST PD on the flare", result: "chosen", chosen: true },
    ],
    shortcuts: [
      { name: "flare_as_progression", score: 0.41 },
      { name: "skip_nadir_confirm", score: 0.36 },
      { name: "ignore_lot_drift", score: 0.32 },
      { name: "first_visit_baseline", score: 0.28 },
      { name: "drop_amended_labs", score: 0.24 },
    ],
  },
];

export const scoreRows: ScoreRow[] = [
  {
    id: "r47_mrd_panel",
    name: "Liquid Biopsy MRD + Clonal Phylogeny",
    luna: "100% fail",
    sol: "67% fail",
    astra: "67% fail",
    tokens: "29.7k",
    shortcuts: "5 shortcuts <= 0.42",
    linked: true,
  },
  {
    id: "r40_ctdna_chip",
    name: "ctDNA Variant Calling + WBC CHIP",
    luna: "100% fail",
    sol: "67% fail",
    astra: "33% fail",
    tokens: "22.5k",
    shortcuts: "5 shortcuts <= 0.41",
    linked: true,
  },
  {
    id: "r38_ccf_ties_dense",
    name: "Subclonal Copy-Number & Purity",
    luna: "100% fail",
    sol: "100% fail",
    astra: "...",
    tokens: "89.4k",
    shortcuts: "5 shortcuts <= 0.38",
    linked: false,
  },
  {
    id: "r52_isotopomer_mfa",
    name: "13C Metabolic Flux + Inhibitor Gating",
    luna: "67% fail",
    sol: "...",
    astra: "...",
    tokens: "16.8k",
    shortcuts: "5 shortcuts <= 0.44",
    linked: true,
  },
  {
    id: "ehr01_longitudinal",
    name: "10-Yr Hospital EHR + Wet-Lab Drift + RECIST",
    luna: "ref 1.0000",
    sol: "...",
    astra: "...",
    tokens: "...",
    shortcuts: "0.24 to 0.41",
    linked: true,
  },
];

export const sandboxTasks = [
  {
    id: "liquid",
    title: "Task 1: Liquid Biopsy",
    icon: "dna" as const,
    armed: "ctDNA purity, clonal inheritance, WBC CHIP filter",
    rules: ["domain", "clinical", "anti"],
  },
  {
    id: "phylo",
    title: "Task 2: Tumor Phylogeny",
    icon: "phylogeny" as const,
    armed: "subclone tree, copy-number conservation, no silent outlier drop",
    rules: ["domain", "physics", "anti"],
  },
  {
    id: "spr",
    title: "Task 3: SPR Binding Kinetics",
    icon: "antibody" as const,
    armed: "mass-transport correction and regeneration decay, not a naive 1:1 Langmuir fit",
    rules: ["physics", "domain", "anti"],
  },
  {
    id: "trial",
    title: "Task 4: Clinical Trial Stats",
    icon: "chart" as const,
    armed: "interval censoring, competing risks, confirmatory nadir scan",
    rules: ["clinical", "domain", "anti"],
  },
];

export const verifierRules = [
  { id: "domain", label: "Domain rules" },
  { id: "physics", label: "Physical constraints" },
  { id: "clinical", label: "Clinical validity" },
  { id: "anti", label: "Anti-shortcut checks" },
];
