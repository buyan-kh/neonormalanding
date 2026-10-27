export type BenchmarkTask = {
  id: string;
  name: string;
  records: string;
  tokens: string;
  frontier: [string, string];
  reference: string;
  failure: string;
};

export const benchmarkTasks: BenchmarkTask[] = [
  {
    id: "longitudinal-ehr",
    name: "Longitudinal EHR + Wet-Lab + Radiology (10-Year Holdout)",
    records:
      "5 linked clinical, flow cytometry, ctDNA, and RECIST tables (Years 1 to 3 exposed, Years 4 to 10 held out in Grader)",
    tokens: "38,400+",
    frontier: ["0.2449", "0.2449"],
    reference: "1.0000",
    failure:
      "Fails to subtract CHIP hematopoietic background and ignores immortal-time bias before scoring 10-year relapse",
  },
  {
    id: "mrd-duplex",
    name: "Molecular Residual Disease (MRD) Duplex Sequencing",
    records: "Raw UMI family reads, oxidative damage panels, and longitudinal plasma draws",
    tokens: "41,200+",
    frontier: ["0.1810", "0.0000"],
    reference: "1.0000",
    failure: "Treats 8-oxoG strand artifacts and clonal hematopoiesis variants as true tumor recurrence",
  },
  {
    id: "perturb-seq",
    name: "CRISPR Perturb-Seq + Drug Combination Synergy",
    records: "Single-cell guide assignments, dose-response matrices, and batch viability controls",
    tokens: "45,800+",
    frontier: ["0.2150", "0.1940"],
    reference: "1.0000",
    failure:
      "Uses unadjusted Loewe/Bliss averages without correcting for guide knockdown efficiency or plate-edge drift",
  },
  {
    id: "oncology-trial",
    name: "Oncology Trial Biostatistics (Competing Risks & RMST)",
    records: "Multi-center censoring logs, crossover events, and biomarker-stratified survival cohorts",
    tokens: "52,600+",
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
