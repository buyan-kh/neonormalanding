import type { ServiceMotif } from "@/components/newui/DitherTile";

export const marketDomains = ["Clinical", "Genomics", "Lab science", "Quantitative"] as const;
export const marketTypes = ["RL Environment", "RL Eval", "SFT Data", "Agent Trajectories"] as const;

export type MarketDomain = (typeof marketDomains)[number];
export type MarketType = (typeof marketTypes)[number];

export type MarketEntry = {
  ref?: string;
  name: string;
  line: string;
  domain: MarketDomain;
  type: MarketType;
  motif: ServiceMotif;
  soon?: boolean;
};

export const marketEntries: MarketEntry[] = [
  {
    ref: "NN-ENV-01",
    name: "Plasma liquid biopsy",
    line: "A clinical plasma record, kept where it was made.",
    domain: "Clinical",
    type: "RL Environment",
    motif: "target",
  },
  {
    ref: "NN-ENV-02",
    name: "Residual disease sequencing",
    line: "A genomic record across time, still at home.",
    domain: "Genomics",
    type: "RL Environment",
    motif: "trail",
  },
  {
    ref: "NN-ENV-03",
    name: "Perturbation and combination",
    line: "A bench record of cells under treatment.",
    domain: "Lab science",
    type: "RL Environment",
    motif: "lattice",
  },
  {
    ref: "NN-ENV-04",
    name: "Oncology trial reading",
    line: "A quantitative record of a trial that already happened.",
    domain: "Quantitative",
    type: "RL Environment",
    motif: "checks",
  },
  {
    name: "Ward follow-up",
    line: "A clinical question the chart already answered.",
    domain: "Clinical",
    type: "RL Eval",
    motif: "pages",
    soon: true,
  },
  {
    name: "Cohort traces",
    line: "Expert reasoning on a genomic record.",
    domain: "Genomics",
    type: "SFT Data",
    motif: "vault",
    soon: true,
  },
  {
    name: "Bench session",
    line: "Long work through a living lab.",
    domain: "Lab science",
    type: "Agent Trajectories",
    motif: "trail",
    soon: true,
  },
  {
    name: "Endpoint reading",
    line: "A quantitative question the follow-up already settled.",
    domain: "Quantitative",
    type: "RL Eval",
    motif: "target",
    soon: true,
  },
];
