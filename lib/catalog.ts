export type RewardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Illustrative rewards informed by public science and data-work benchmarks, not measurements of these tasks. */
export type FrontierRewards = [string, string, string, string, string, string, string, string, string];

export type BenchmarkModel = {
  id: string;
  name: string;
  color: string;
  /** Index into each task's frontier rewards. */
  rewardIndex: RewardIndex;
};

export const benchmarkModels: BenchmarkModel[] = [
  { id: "sol", name: "GPT-6.1 Sol", color: "#10A37F", rewardIndex: 0 },
  { id: "astra", name: "GPT-6 Astra", color: "#10A37F", rewardIndex: 1 },
  { id: "kimi", name: "Kimi K3.1 Pro", color: "#7C3AED", rewardIndex: 2 },
  { id: "opus", name: "Claude Opus 5.5", color: "#D97757", rewardIndex: 3 },
  { id: "wonder", name: "Muse Wonder", color: "#0064E0", rewardIndex: 4 },
  { id: "argon", name: "Gemini 4 Argon", color: "#1A73E8", rewardIndex: 5 },
  { id: "grok", name: "Grok 4.7", color: "#1A1A1A", rewardIndex: 6 },
  { id: "deepseek", name: "DeepSeek V4.1", color: "#4D6BFE", rewardIndex: 7 },
  { id: "fable", name: "Fable 5.1", color: "#E8704D", rewardIndex: 8 },
];

export const referenceColor = "#0A0A0A";

export function isMeasured(
  model: BenchmarkModel,
): model is BenchmarkModel & { rewardIndex: RewardIndex } {
  return model.rewardIndex !== undefined;
}

export type BenchmarkTask = {
  id: string;
  name: string;
  short: string;
  records: string;
  tokens: string;
  tokenCount: number;
  /** Approximate reasoning-token counts in benchmarkModels order; Astra and other model values are estimates. */
  reasoningTokens: [number, number, number, number, number, number, number, number, number];
  frontier: FrontierRewards;
  reference: string;
  failure: string;
};

export const benchmarkTasks: BenchmarkTask[] = [
  {
    id: "neonorma/ctdna-chip",
    name: "Plasma cfDNA liquid biopsy & aging-blood filtering",
    short: "cfDNA copy number & CHIP",
    records: "48 autosomal CBS segments, 1,420 heterozygous SNPs, and 42 targeted duplex panel variants without a matched white-blood-cell normal",
    tokens: "~38,400",
    tokenCount: 38400,
    reasoningTokens: [38400, 35500, 49000, 52000, 47000, 61000, 44000, 56000, 58000],
    frontier: ["0.3650", "0.4250", "0.3250", "0.4120", "0.3000", "0.3850", "0.3150", "0.2950", "0.3750"],
    reference: "1.0000",
    failure:
      "Confuses clonal hematopoiesis with tumor variants or misestimates tumor fraction, ploidy, and subclonal copy number",
  },
  {
    id: "neonorma/mrd-duplex",
    name: "Molecular Residual Disease (MRD) Duplex Sequencing",
    short: "MRD duplex sequencing",
    records: "Raw UMI family reads, oxidative damage panels, and longitudinal plasma draws",
    tokens: "~41,200",
    tokenCount: 41200,
    reasoningTokens: [41200, 37000, 35000, 67000, 59000, 48000, 72000, 41000, 76000],
    frontier: ["0.4500", "0.2000", "0.1650", "0.7000", "0.1400", "0.2050", "0.1550", "0.1450", "0.1950"],
    reference: "1.0000",
    failure: "Treats 8-oxoG strand artifacts and clonal hematopoiesis variants as true tumor recurrence",
  },
  {
    id: "perturb-seq",
    name: "CRISPR Perturb-Seq + Drug Combination Synergy",
    short: "Perturb-seq synergy",
    records: "Single-cell guide assignments, dose-response matrices, and batch viability controls",
    tokens: "~45,800",
    tokenCount: 45800,
    reasoningTokens: [45800, 42300, 72000, 46000, 75000, 76000, 52000, 82000, 51000],
    frontier: ["0.4050", "0.4720", "0.3550", "0.4620", "0.3250", "0.4180", "0.3420", "0.3150", "0.4120"],
    reference: "1.0000",
    failure:
      "Uses unadjusted Loewe/Bliss averages without correcting for guide knockdown efficiency or plate-edge drift",
  },
  {
    id: "oncology-trial",
    name: "Oncology Trial Biostatistics (Competing Risks & RMST)",
    short: "Competing risks & RMST",
    records: "Multi-center censoring logs, crossover events, and biomarker-stratified survival cohorts",
    tokens: "~52,600",
    tokenCount: 52600,
    reasoningTokens: [52600, 48600, 56000, 81000, 42000, 85000, 62000, 64000, 68000],
    frontier: ["0.4600", "0.5100", "0.4050", "0.5250", "0.3900", "0.4700", "0.4050", "0.3750", "0.4850"],
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
