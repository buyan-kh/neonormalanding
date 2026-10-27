import type { DemoModelId } from "./harbor-demo";

type Check = { id: string; label: string; weight: number; field: string; expected: string; miss: string; passValue: string | number | boolean; failValue: string | number | boolean };
type Scenario = { title: string; prompt: string; files: { name: string; sample: string }[]; checks: Check[]; outcomes: Record<DemoModelId, boolean[]> };

/** Illustrative examples, not real task files, runs, or validated clinical results. */
export const scenarios: Record<string, Scenario> = {
  "neonorma/ctdna-chip": {
    title: "Plasma cfDNA liquid biopsy & aging-blood filtering",
    prompt: "Estimate tumor fraction, ploidy and subclonal copy number, and identify likely tumor versus CHIP variants without a matched WBC sample. Report uncertainty where evidence is insufficient.",
    files: [
      { name: "data/segments.csv", sample: "segment,chromosome,log2_ratio\nS01,1,0.18\nS02,2,-0.11" },
      { name: "data/snps.csv", sample: "snp_id,segment,b_allele_fraction\nSNP01,S01,0.44\nSNP02,S02,0.38" },
      { name: "data/variants.csv", sample: "variant_id,gene,plasma_vaf\nV01,TP53,0.06\nV02,DNMT3A,0.04" },
    ],
    checks: [
      { id: "check_inputs", label: "Use segments, SNPs and variants", weight: 0.20, field: "input_tables", expected: "Account for all three input tables.", miss: "One or more input tables were omitted.", passValue: "segments, snps, variants", failValue: "segments only" },
      { id: "check_purity_ploidy", label: "Fit tumor fraction and ploidy together", weight: 0.30, field: "purity_ploidy", expected: "Consider alternative purity and ploidy solutions and their uncertainty.", miss: "A single ploidy solution was assumed without assessing alternatives.", passValue: "joint fit with uncertainty", failValue: "fixed ploidy assumed" },
      { id: "check_copy_number", label: "Assess subclonal copy number", weight: 0.25, field: "copy_number", expected: "Consider subclonal copy-number solutions alongside allelic evidence.", miss: "Subclonal possibilities were not assessed.", passValue: "subclonal models considered", failValue: "clonal-only interpretation" },
      { id: "check_chip_uncertainty", label: "Distinguish tumor and CHIP with uncertainty", weight: 0.25, field: "chip_interpretation", expected: "Avoid definitive CHIP calls from gene identity alone without a matched WBC control.", miss: "A definitive tumor or CHIP classification was made without sufficient matched-normal evidence.", passValue: "uncertain without matched WBC", failValue: "definitive calls from gene alone" },
    ],
    outcomes: { sol: [true,true,false,false], astra: [true,false,true,false], opus: [true,true,true,false], oracle: [true,true,true,true] },
  },
  "perturb-seq": {
    title: "Do two drugs work better together",
    prompt: "Assess a drug pair across the dose matrix, taking guide knockdown efficiency and plate-position effects into account. Explain the chosen synergy model.",
    files: [
      { name: "data/dose_response.csv", sample: "dose_a,dose_b,viability,plate_position\n0,0,1.00,center\n1,1,0.49,edge\n2,1,0.38,center" },
      { name: "data/guide_efficiency.csv", sample: "guide_id,knockdown_fraction\nG01,0.65\nG02,0.90" },
      { name: "data/plate_controls.csv", sample: "position,control_viability\nedge,0.86\ncenter,1.00" },
    ],
    checks: [
      { id: "check_dose_matrix", label: "Use the full dose matrix", weight: 0.20, field: "dose_matrix", expected: "Use the full dose-response matrix.", miss: "The analysis relies on a single dose pair.", passValue: "full matrix", failValue: "single dose pair" },
      { id: "check_guide_efficiency", label: "Account for guide efficiency", weight: 0.25, field: "guide_efficiency", expected: "Account for differences in guide knockdown efficiency.", miss: "Partial knockdown was treated as complete.", passValue: "accounted for", failValue: "not accounted for" },
      { id: "check_plate_effect", label: "Check plate-position effects", weight: 0.30, field: "plate_effect", expected: "Investigate and address plate-position effects using controls.", miss: "Edge effects were ignored.", passValue: "assessed with controls", failValue: "ignored" },
      { id: "check_synergy_model", label: "Specify the synergy model", weight: 0.25, field: "synergy_model", expected: "Specify and justify the chosen synergy reference model.", miss: "Different reference models were averaged without justification.", passValue: "justified reference model", failValue: "unjustified average" },
    ],
    outcomes: { sol: [true,false,false,true], astra: [true,true,false,true], opus: [true,true,true,false], oracle: [true,true,true,true] },
  },
  "oncology-trial": {
    title: "When the benefit shows up late",
    prompt: "Compare treatment arms with delayed effects, treatment switching, censoring, and competing events. Report a clinically interpretable fixed-window analysis.",
    files: [
      { name: "data/patients.csv", sample: "patient_id,assigned_arm,follow_up_months,event\nP01,control,18,censored\nP02,treatment,24,progression\nP03,treatment,20,other_death" },
      { name: "data/treatment_switches.csv", sample: "patient_id,switch_month\nP01,12" },
    ],
    checks: [
      { id: "check_assigned_arms", label: "Retain assigned treatment arms", weight: 0.20, field: "analysis_population", expected: "Keep the assigned treatment arms and document switching.", miss: "Switching patients were dropped or reassigned without explanation.", passValue: "assigned arms; switches documented", failValue: "switchers excluded" },
      { id: "check_censoring", label: "Account for censoring and competing events", weight: 0.25, field: "follow_up", expected: "Account for censoring and distinguish competing events.", miss: "Censoring or competing events were not handled explicitly.", passValue: "censoring and competing events addressed", failValue: "events treated alike" },
      { id: "check_delayed_effect", label: "Assess delayed effects", weight: 0.25, field: "treatment_effect", expected: "Assess whether proportional hazards is appropriate when effects are delayed.", miss: "Proportional hazards was assumed without assessment.", passValue: "proportionality assessed", failValue: "proportionality assumed" },
      { id: "check_rmst", label: "Report a fixed-window comparison", weight: 0.30, field: "comparison", expected: "Report an appropriately specified restricted mean survival time comparison.", miss: "A fixed-window RMST comparison was not reported.", passValue: "fixed-window RMST", failValue: "hazard ratio only" },
    ],
    outcomes: { sol: [true,false,false,true], astra: [true,true,false,true], opus: [true,true,true,false], oracle: [true,true,true,true] },
  },
};

export function scenarioReward(taskId: string, modelId: DemoModelId, through = Infinity) {
  const scenario = scenarios[taskId];
  return scenario.checks.reduce((sum, check, index) => sum + (index <= through && scenario.outcomes[modelId][index] ? check.weight : 0), 0);
}
