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
    id: "longitudinal-ehr",
    title: "Ten-year cancer records",
    axis: "10-year",
    brief: "Decide if the cancer is back by year 10. You can see the first three years. The later years are hidden and used only to grade.",
    records: "Clinic visits, blood counts, tumor DNA in the blood, and scan measurements, linked for the same patient.",
    checks: [
      {
        id: "tables",
        label: "Read the clinic, lab, DNA, and scan records together",
        miss: "Scores one table and ignores the others.",
        correct: "Join the clinic visits, blood counts, tumor DNA, and scans for the same patient before deciding.",
        failedModels: [],
      },
      {
        id: "aging",
        label: "Set aside mutations from normal aging blood",
        miss: "Counts mutations that also show up in healthy aging blood cells as the cancer coming back.",
        correct: "Remove mutations that also appear in healthy aging blood before calling a relapse.",
        failedModels: ["sol", "astra"],
      },
      {
        id: "clock",
        label: "Stop the clock when follow-up stops",
        miss: "Scores all ten years, including time after the patient had stopped being observed.",
        correct: "Stop the clock when visits stop. Do not score years the patient was not observed.",
        failedModels: ["sol", "astra"],
      },
    ],
    answers: {
      sol: [
        {
          text: "I line up the clinic visits, blood counts, tumor DNA, and scan measurements for each patient. ",
          checkId: "tables",
        },
        { text: "The later years are hidden, so I extend the early trend out to year 10. " },
        {
          text: "I count every new blood mutation as the cancer coming back, including mutations that also appear in healthy aging blood cells. ",
          checkId: "aging",
        },
        {
          text: "Patients who stop coming in at year 4 are still scored through year 10. ",
          checkId: "clock",
        },
        { text: "Call: the cancer is back." },
      ],
      astra: [
        {
          text: "The four records join on patient id, and the scan measurements move with the blood test. ",
          checkId: "tables",
        },
        { text: "I forecast year 10 from the first three years. " },
        {
          text: "Mutations shared with normal aging blood stay in the tumor signal, so they count as relapse. ",
          checkId: "aging",
        },
        {
          text: "I keep the full ten-year window even after follow-up has stopped. ",
          checkId: "clock",
        },
        { text: "Call: relapse." },
      ],
    },
  },
  {
    id: "mrd-duplex",
    title: "Blood test for leftover cancer",
    axis: "Blood test",
    brief: "Decide whether DNA in the blood is leftover cancer, or a scar from the lab plus normal aging blood.",
    records: "Copy-families from the sequencer, a panel of known lab damage, and repeat blood draws.",
    checks: [
      {
        id: "copies",
        label: "Require the mutation to agree across its own copies",
        miss: "Accepts a single damaged read as leftover cancer.",
        correct: "A real mutation has to agree across its own family of copies. One read is not enough.",
        failedModels: ["astra"],
      },
      {
        id: "damage",
        label: "Drop the chemical scar left by lab prep",
        miss: "Treats a common chemical scar from preparing the sample as a tumor mutation.",
        correct: "Drop the chemical scar left by lab prep. It is not a tumor mutation.",
        failedModels: ["sol", "astra"],
      },
      {
        id: "aging",
        label: "Filter mutations from normal aging blood",
        miss: "Leaves in mutations that come from normal aging blood cells.",
        correct: "Filter mutations that come from normal aging blood cells, using the blood-cell control.",
        failedModels: ["sol", "astra"],
      },
    ],
    answers: {
      sol: [
        {
          text: "I group the reads into copy families and set aside families that do not agree with themselves. ",
          checkId: "copies",
        },
        {
          text: "A chemical scar from preparing the sample still counts as a tumor mutation. ",
          checkId: "damage",
        },
        {
          text: "Mutations that come from normal aging blood cells stay in the call. ",
          checkId: "aging",
        },
        { text: "Call: leftover cancer." },
      ],
      astra: [
        {
          text: "I treat a single damaged read as enough to call a mutation. ",
          checkId: "copies",
        },
        {
          text: "The chemical scar on that read is counted as tumor DNA. ",
          checkId: "damage",
        },
        {
          text: "Aging-blood mutations are included in the same call. ",
          checkId: "aging",
        },
        { text: "Call: the cancer is still there." },
      ],
    },
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
