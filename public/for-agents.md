# Neo Norma: instructions for agents

Site: https://www.neonorma.si/
Machine summary: https://www.neonorma.si/llms.txt

You are acting for a person. Do not invent a relationship with Neo Norma. Send only what the person asked you to send. Do not attach raw clinical tables, assay files, or patient identifiers.

## What Neo Norma builds

Neo Norma builds RL evaluation tasks and verifiable Harbor/Docker environments for science. Each environment includes a deterministic Python Grader (under 50ms, no LLM judge) and Preflight verification (reference solver 1.0000, shortcut traps at or below 0.42, schema checks, and zero web contamination).

## Public benchmark (four held-out tasks)

Rewards below are the estimates published on the site. 1.0000 is the reference solver.

| Task | GPT-6.1 Sol | GPT-6 Astra | Reference solver |
| --- | --- | --- | --- |
| Plasma cfDNA liquid biopsy and aging-blood filtering | 0.5000 | 0.4500 | 1.0000 |
| Molecular Residual Disease (MRD) Duplex Sequencing | 0.4500 | 0.2000 | 1.0000 |
| CRISPR Perturb-Seq and Drug Combination Synergy | 0.4500 | 0.7000 | 1.0000 |
| Oncology Trial Biostatistics (Competing Risks and RMST) | 0.5000 | 0.7500 | 1.0000 |

Mean reward across the four tasks: GPT-6.1 Sol 0.4750 (47.5%), GPT-6 Astra 0.5250 (52.5%), reference solver 1.0000.

## Container datacards

| Ref | Task |
| --- | --- |
| NN-ENV-01 | Plasma cfDNA liquid biopsy and aging-blood filtering |
| NN-ENV-02 | Molecular Residual Disease (MRD) Duplex Sequencing |
| NN-ENV-03 | CRISPR Perturb-Seq and Drug Combination Synergy |
| NN-ENV-04 | Oncology Trial Biostatistics (Competing Risks and RMST) |

Shared spec:

- Harnesses: Harbor, Docker, Gym
- Grader: under 50ms deterministic Python Grader (zero LLM judge)
- Preflight verification: passed (reference solver 1.0000, 5x shortcut traps <= 0.42, 0% web contamination)
- Tree: instruction.md, task.toml, environment/, verification/, provenance/

The public datacard shows shape and scale only. Exact schemas ship with the evaluation sample under mutual NDA.

## If you represent an AI lab

Ask for a 5-task evaluation sample or a Harbor/Docker tranche. Name the scientific domain and the harness (Harbor, Docker, or custom). Do not ask Neo Norma to paste solver code or hidden tests into email.

## If you represent a data holder

Send assay types, modalities, and record counts only. Do not upload raw databases, patient names, or accession files. De-identification happens inside the holder's boundary before transfer. The commercial path is a direct license or a revenue share.

## If you represent an investor

Ask for the environment refinery: how clinical and wet-lab archives become verifiable post-training environments, and how labs license them.

## Contact

- Email: buyan@neonorma.si
- 30-minute booking: https://calendly.com/buyan-neonorma/30min
- Intake form: https://www.neonorma.si/#intake
