import { isDemoModel } from "@/lib/harbor-demo";
import { scenarios } from "@/lib/harbor-scenarios";

export type TraceSpan = {
  text: string;
  checkId?: string;
};

export type TraceCheck = {
  id: string;
  label: string;
  miss: string;
  correct: string;
  failedModels: string[];
};

export type TaskTrace = {
  id: string;
  title: string;
  axis: string;
  brief: string;
  records: string;
  checks: TraceCheck[];
  answers: Record<string, TraceSpan[]>;
};

export const taskTraces: TaskTrace[] = [
  {
    id: "neonorma/ctdna-chip",
    title: "Plasma cfDNA liquid biopsy & aging-blood filtering",
    axis: "cfDNA & CHIP",
    brief: "Infer tumor fraction, ploidy, and subclonal copy number from cell-free DNA without a matched white-blood-cell normal, and separate true truncal tumor mutations from aging-blood clonal hematopoiesis (CHIP).",
    records: "48 autosomal CBS segments, 1,420 heterozygous SNPs, and 42 targeted duplex panel variants.",
    checks: [],
    answers: {},
  },
  {
    id: "neonorma/mrd-duplex",
    title: "Blood test for leftover cancer",
    axis: "Blood test",
    brief: "Classify duplex-sequencing variants from post-surgery plasma, using a matched WBC control and an oxidative damage panel.",
    records: "Duplex UMI families, paired buffy-coat white blood cells, and an oxidative damage calibration panel.",
    checks: [
      { id: "check_schema_and_join", label: "Schema and input joins", miss: "Does not correctly join the required inputs.", correct: "Join inputs on variant_id.", failedModels: [] },
      { id: "check_duplex_strand_consensus", label: "Duplex strand consensus", miss: "Counts a single-strand artifact as a duplex variant.", correct: "Require alternate reads on both strands.", failedModels: ["astra"] },
      { id: "check_oxog_damage_filter", label: "Oxidative damage filter", miss: "Fails to use context-specific oxidative damage rates.", correct: "Use the oxidative calibration panel.", failedModels: ["sol", "astra"] },
      { id: "check_wbc_chip_subtraction", label: "WBC / CHIP subtraction", miss: "Retains a variant present in matched WBCs.", correct: "Use WBC evidence to filter CHIP.", failedModels: ["sol", "astra", "opus"] },
    ],
    answers: {},
  },
  {
    id: "perturb-seq",
    title: "Do two drugs work better together",
    axis: "Drug pair",
    brief: "Decide if two drugs help each other, after accounting for how fully each gene was switched off and for weak wells at the edge of the plate.",
    records: "Which cell received which gene switch, the full dose table, and controls for wells that fail.",
    checks: [
      {
        id: "doses",
        label: "Use the full dose table",
        miss: "Judges the pair from a single dose.",
        correct: "Use every dose in the table, not one concentration.",
        failedModels: [],
      },
      {
        id: "off",
        label: "Adjust for how fully the gene was switched off",
        miss: "Treats a partial switch-off as if the gene were fully off.",
        correct: "Down-weight the effect when the gene was only partly switched off.",
        failedModels: ["sol", "astra"],
      },
      {
        id: "edge",
        label: "Correct for wells at the edge of the plate",
        miss: "Treats edge wells, which dry out and look weaker, like wells in the middle.",
        correct: "Correct for edge wells. They dry out and look weaker than the middle of the plate.",
        failedModels: ["sol", "astra"],
      },
      {
        id: "formula",
        label: "Do not average the two textbook formulas",
        miss: "Averages two textbook combination formulas and reports the average.",
        correct: "Do not average the two textbook formulas. Judge the pair after the corrections above.",
        failedModels: ["sol", "astra"],
      },
    ],
    answers: {
      sol: [
        {
          text: "I read the full dose table and which cell received which gene switch. ",
          checkId: "doses",
        },
        {
          text: "I do not adjust for how completely each gene was switched off. ",
          checkId: "off",
        },
        {
          text: "Wells at the edge of the plate are treated like the wells in the middle. ",
          checkId: "edge",
        },
        {
          text: "I average the two textbook combination formulas and report that average. ",
          checkId: "formula",
        },
        { text: "Call: the drugs help each other." },
      ],
      astra: [
        {
          text: "The dose matrix and the gene assignments are both in the input, and I use them. ",
          checkId: "doses",
        },
        {
          text: "A gene that was only partly switched off is scored as fully off. ",
          checkId: "off",
        },
        {
          text: "I leave the dried-out edge wells in the average. ",
          checkId: "edge",
        },
        {
          text: "The two textbook formulas disagree, so I report their mean. ",
          checkId: "formula",
        },
        { text: "Call: synergy." },
      ],
    },
  },
  {
    id: "oncology-trial",
    title: "When the benefit shows up late",
    axis: "Late split",
    brief: "Compare two treatments when the benefit appears late, some patients die of other causes, and some switch arms.",
    records: "When each patient was observed, who switched treatment, who died of something else, and which arm they were assigned to.",
    checks: [
      {
        id: "arms",
        label: "Compare the arms patients were assigned to",
        miss: "Drops an arm or scores patients only after they switch.",
        correct: "Compare the arms patients were assigned to, and keep a record of who switched.",
        failedModels: [],
      },
      {
        id: "late",
        label: "Do not assume the benefit stays proportional",
        miss: "Uses a model that assumes the benefit stays in proportion, even though the curves split late.",
        correct: "When the curves split late, do not use a model that assumes the benefit stays proportional the whole time.",
        failedModels: ["sol", "astra"],
      },
      {
        id: "area",
        label: "Compare the area between the curves over a fixed window",
        miss: "Never compares the area between the curves, and does not adjust for measured differences between patients.",
        correct: "Compare the area between the curves over a fixed window, and adjust for the measured differences between patients.",
        failedModels: ["sol", "astra"],
      },
    ],
    answers: {
      sol: [
        {
          text: "I compare the two assigned arms and keep the patients who later switched. ",
          checkId: "arms",
        },
        {
          text: "I fit a standard survival model that assumes the treatment benefit stays proportional. ",
          checkId: "late",
        },
        {
          text: "The curves separate late, and I do not switch to a fixed-window area comparison adjusted for the measured patient differences. ",
          checkId: "area",
        },
        { text: "Call: the experimental arm wins." },
      ],
      astra: [
        {
          text: "The analysis stays on the assigned arms, with switchers flagged. ",
          checkId: "arms",
        },
        {
          text: "I keep the proportional-benefit model even after the curves pull apart late. ",
          checkId: "late",
        },
        {
          text: "I do not report the area between the curves over a set window, and I do not adjust for the recorded patient differences. ",
          checkId: "area",
        },
        { text: "Call: benefit." },
      ],
    },
  },
];

export function traceFor(taskId: string) {
  return taskTraces.find((trace) => trace.id === taskId) ?? taskTraces[0];
}

export function modelFailed(check: TraceCheck, modelId: string) {
  return check.failedModels.includes(modelId);
}

export function failedChecks(taskId: string, modelId: string) {
  return traceFor(taskId).checks.filter((check) => modelFailed(check, modelId));
}

export function firstMiss(taskId: string, modelId: string) {
  const scenario = scenarios[taskId];
  if (scenario && isDemoModel(modelId)) {
    const index = scenario.outcomes[modelId].findIndex((passed) => !passed);
    if (index < 0) return null;
    const check = scenario.checks[index];
    return { id: check.id, label: check.label, miss: check.miss, correct: check.expected, failedModels: [modelId] };
  }
  return failedChecks(taskId, modelId)[0] ?? null;
}

export function totalChecks() {
  return taskTraces.reduce((sum, trace) => sum + trace.checks.length, 0);
}

export function failedCheckCount(modelId: string) {
  return taskTraces.reduce(
    (sum, trace) => sum + trace.checks.filter((check) => modelFailed(check, modelId)).length,
    0,
  );
}

