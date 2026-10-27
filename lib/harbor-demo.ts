/** Hand-authored demonstration data, not a recorded Harbor run. */
export const mrdTaskId = "neonorma/mrd-duplex";

export const harborChecks = [
  { id: "check_schema_and_join", weight: 0.20, label: "Schema and input joins", expected: "Join duplex families, WBC control, and the oxidative damage panel by variant_id.", diagnostic: "The input tables were not joined correctly." },
  { id: "check_duplex_strand_consensus", weight: 0.25, label: "Duplex strand consensus", expected: "Require at least one alternate read on both duplex strands; V04 has ab=6 and ba=0.", diagnostic: "V04 has no reverse-strand support and should not be retained as a duplex call." },
  { id: "check_oxog_damage_filter", weight: 0.25, label: "Oxidative damage filter", expected: "Use context-specific rates from oxog_panel.csv to filter G>T / C>A oxidative damage.", diagnostic: "V04 is a single-strand G>T oxidative artifact. Apply the panel's context-specific error rates." },
  { id: "check_wbc_chip_subtraction", weight: 0.30, label: "WBC / CHIP subtraction", expected: "Use the matched WBC control to identify hematopoietic variants; V09 has 18/4100 WBC alternate reads.", diagnostic: "V09 is present in the WBC control and should not be retained as tumor-derived DNA." },
] as const;

export type HarborCheckId = (typeof harborChecks)[number]["id"];
export type DemoModelId = "sol" | "astra" | "opus" | "oracle";
type Variant = { call: "tumor_mrd" | "oxog_artifact" | "chip_hematopoietic"; duplex_support: number };
type Demo = {
  checks: Record<HarborCheckId, 0 | 1>;
  submission: { patient_status: { mrd_positive: boolean; estimated_ctdna_vaf: number; retained_tumor_variants: string[] }; variants: Record<string, Variant> };
  trajectory: Record<HarborCheckId, string>;
};

export const harborDemos: Record<DemoModelId, Demo> = {
  sol: {
    checks: { check_schema_and_join: 1, check_duplex_strand_consensus: 1, check_oxog_damage_filter: 0, check_wbc_chip_subtraction: 0 },
    submission: { patient_status: { mrd_positive: true, estimated_ctdna_vaf: 0.00280, retained_tumor_variants: ["V09", "V14"] }, variants: { "V04_TP53_G>T": { call: "oxog_artifact", duplex_support: 6 }, "V09_DNMT3A_C>T": { call: "tumor_mrd", duplex_support: 21 }, "V14_KRAS_G>A": { call: "tumor_mrd", duplex_support: 8 } } },
    trajectory: { check_schema_and_join: "Joined the family, WBC and oxidative panel inputs on variant_id.", check_duplex_strand_consensus: "Required alternate reads on both strands; V04 has no BA support.", check_oxog_damage_filter: "Applied one unadjusted Poisson threshold across base changes instead of context-specific oxidative error rates.", check_wbc_chip_subtraction: "Used a gene-list filter instead of the paired WBC depth ratio; retained V09 and V14 as tumor variants." },
  },
  astra: {
    checks: { check_schema_and_join: 1, check_duplex_strand_consensus: 0, check_oxog_damage_filter: 0, check_wbc_chip_subtraction: 0 },
    submission: { patient_status: { mrd_positive: true, estimated_ctdna_vaf: 0.00284, retained_tumor_variants: ["V04", "V09", "V14"] }, variants: { "V04_TP53_G>T": { call: "tumor_mrd", duplex_support: 6 }, "V09_DNMT3A_C>T": { call: "tumor_mrd", duplex_support: 21 }, "V14_KRAS_G>A": { call: "tumor_mrd", duplex_support: 8 } } },
    trajectory: { check_schema_and_join: "Joined the family, WBC and oxidative panel inputs on variant_id.", check_duplex_strand_consensus: "Summed AB and BA alternate reads and retained variants with at least three reads, without requiring both strands.", check_oxog_damage_filter: "Ignored context-specific error rates from the oxidative damage panel and retained V04.", check_wbc_chip_subtraction: "Kept V09 in retained_tumor_variants despite alternate reads in the WBC control." },
  },
  opus: {
    checks: { check_schema_and_join: 1, check_duplex_strand_consensus: 1, check_oxog_damage_filter: 1, check_wbc_chip_subtraction: 0 },
    submission: { patient_status: { mrd_positive: true, estimated_ctdna_vaf: 0.00280, retained_tumor_variants: ["V09", "V14"] }, variants: { "V04_TP53_G>T": { call: "oxog_artifact", duplex_support: 6 }, "V09_DNMT3A_C>T": { call: "tumor_mrd", duplex_support: 21 }, "V14_KRAS_G>A": { call: "tumor_mrd", duplex_support: 8 } } },
    trajectory: { check_schema_and_join: "Joined all three input tables using variant_id.", check_duplex_strand_consensus: "Required alternate reads on both duplex strands.", check_oxog_damage_filter: "Used the oxidative panel's context rates to exclude V04.", check_wbc_chip_subtraction: "Retained V09 despite its WBC control signal." },
  },
  oracle: {
    checks: { check_schema_and_join: 1, check_duplex_strand_consensus: 1, check_oxog_damage_filter: 1, check_wbc_chip_subtraction: 1 },
    submission: { patient_status: { mrd_positive: true, estimated_ctdna_vaf: 0.00065, retained_tumor_variants: ["V14"] }, variants: { "V04_TP53_G>T": { call: "oxog_artifact", duplex_support: 6 }, "V09_DNMT3A_C>T": { call: "chip_hematopoietic", duplex_support: 21 }, "V14_KRAS_G>A": { call: "tumor_mrd", duplex_support: 8 } } },
    trajectory: { check_schema_and_join: "Joined all three input tables using variant_id.", check_duplex_strand_consensus: "Required both strands and excluded the single-strand V04 call.", check_oxog_damage_filter: "Used context-specific oxidative error rates to classify V04 as an artifact.", check_wbc_chip_subtraction: "Used the WBC control to classify V09 as CHIP; retained only V14 as tumor MRD." },
  },
};

export function isDemoModel(id: string): id is DemoModelId {
  return id === "sol" || id === "astra" || id === "opus" || id === "oracle";
}

export function demoReward(modelId: DemoModelId, through = harborChecks.length - 1) {
  return harborChecks.reduce((sum, check, index) => sum + (index <= through ? check.weight * harborDemos[modelId].checks[check.id] : 0), 0);
}

export function demoResult(modelId: DemoModelId) {
  const checks = harborDemos[modelId].checks;
  return { reward: Number(demoReward(modelId).toFixed(4)), passed: harborChecks.slice(1).every((check) => checks[check.id] === 1) ? 1 : 0, ...checks };
}
