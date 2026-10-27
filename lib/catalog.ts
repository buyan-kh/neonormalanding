export type BenchmarkModel = {
  id: string;
  name: string;
  color: string;
  /** Index into each task's frontier rewards. Absent means this model is not measured yet. */
  rewardIndex?: 0 | 1;
};

export const benchmarkModels: BenchmarkModel[] = [
  { id: "sol", name: "GPT-6.1 Sol", color: "#10A37F", rewardIndex: 0 },
  { id: "astra", name: "GPT-6 Astra", color: "#10A37F", rewardIndex: 1 },
  { id: "kimi", name: "Kimi K3.1", color: "#7C3AED" },
  { id: "opus", name: "Claude Opus 5.5", color: "#D97757" },
  { id: "wonder", name: "Muse Wonder", color: "#0064E0" },
  { id: "argon", name: "Gemini 4 Argon", color: "#1A73E8" },
  { id: "grok", name: "Grok 4.7", color: "#1A1A1A" },
  { id: "deepseek", name: "DeepSeek V4.1", color: "#4D6BFE" },
];

export const referenceColor = "#0A0A0A";

export function isMeasured(
  model: BenchmarkModel,
): model is BenchmarkModel & { rewardIndex: 0 | 1 } {
  return model.rewardIndex !== undefined;
}

export type BenchmarkTask = {
  id: string;
  name: string;
  short: string;
  records: string;
  tokens: string;
  tokenCount: number;
  frontier: [string, string];
  reference: string;
  failure: string;
};

export const benchmarkTasks: BenchmarkTask[] = [
  {
    id: "longitudinal-ehr",
    name: "Longitudinal EHR + Wet-Lab + Radiology (10-Year Holdout)",
    short: "10-year EHR + radiology",
    records:
      "5 linked clinical, flow cytometry, ctDNA, and RECIST tables (Years 1 to 3 exposed, Years 4 to 10 held out in Grader)",
    tokens: "38,400+",
    tokenCount: 38400,
    frontier: ["0.2449", "0.2449"],
    reference: "1.0000",
    failure:
      "Fails to subtract CHIP hematopoietic background and ignores immortal-time bias before scoring 10-year relapse",
  },
  {
    id: "mrd-duplex",
    name: "Molecular Residual Disease (MRD) Duplex Sequencing",
    short: "MRD duplex sequencing",
    records: "Raw UMI family reads, oxidative damage panels, and longitudinal plasma draws",
    tokens: "41,200+",
    tokenCount: 41200,
    frontier: ["0.1810", "0.0000"],
    reference: "1.0000",
    failure: "Treats 8-oxoG strand artifacts and clonal hematopoiesis variants as true tumor recurrence",
  },
  {
    id: "perturb-seq",
    name: "CRISPR Perturb-Seq + Drug Combination Synergy",
    short: "Perturb-seq synergy",
    records: "Single-cell guide assignments, dose-response matrices, and batch viability controls",
    tokens: "45,800+",
    tokenCount: 45800,
    frontier: ["0.2150", "0.1940"],
    reference: "1.0000",
    failure:
      "Uses unadjusted Loewe/Bliss averages without correcting for guide knockdown efficiency or plate-edge drift",
  },
  {
    id: "oncology-trial",
    name: "Oncology Trial Biostatistics (Competing Risks & RMST)",
    short: "Competing risks & RMST",
    records: "Multi-center censoring logs, crossover events, and biomarker-stratified survival cohorts",
    tokens: "52,600+",
    tokenCount: 52600,
    frontier: ["0.2890", "0.3120"],
    reference: "1.0000",
    failure:
      "Applies standard Cox PH under non-proportional delayed separation instead of covariate-adjusted RMST",
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
