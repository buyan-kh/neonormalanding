import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/contact";

export const BEN_EMAIL = "benosaromero@gmail.com";
export const DESK_EMAILS = `${CONTACT_EMAIL},${BEN_EMAIL}`;
export const PUBLIC_SITE = "https://neonorma.si";
export const LABS_X = "https://x.com/neonorma_labs";
export const BUYAN_X = "https://x.com/buyan_kh";

export type DeskMode = "sales" | "hq";

export const deskModes: Array<{ id: DeskMode; label: string }> = [
  { id: "sales", label: "[BD & Sales Playbook (Tugi & Sales Team)]" },
  { id: "hq", label: "[Company HQ & Deal Desk (Founders & Ops)]" },
];

export const navLinks = [
  { id: "what-we-sell", label: "[01. WHAT WE SELL]" },
  { id: "pricing", label: "[02. PRICING & COMMISSIONS]" },
  { id: "outreach", label: "[03. OUTREACH PLAYBOOK]" },
  { id: "deal-hub", label: "[04. DEAL & COMPANY HUB]" },
];

export const whyWeGetPaid = [
  {
    icon: "chart" as const,
    title: "Textbook questions are tapped out",
    body: "AI models already score 100% on short textbook science questions. AI labs have run out of hard tests.",
    metricLabel: "Short textbook score",
    metric: "100%",
  },
  {
    icon: "ehr" as const,
    title: "Real hospital and lab work breaks today's best AI",
    body: "When tested on real medical charts, drug assays, and DNA sequencing records, top AI models fail 67% to 100% of the time. Even the best score reaches only 72.5% (0.7250 vs 1.0000 known-correct answer).",
    metricLabel: "Best score vs known answer",
    metric: "0.7250 vs 1.0000",
  },
  {
    icon: "check" as const,
    title: "Graded by code in <50ms, not another AI",
    body: "Every test comes from real records, has a known right answer (1.0000), and is checked automatically by our Python Grader and Preflight verification (which caps easy shortcuts at <= 0.42).",
    metricLabel: "Grader speed / shortcut cap",
    metric: "<50ms  /  <= 0.42",
  },
];

export const priceCards = [
  {
    kicker: "01 // 48-HOUR PILOT",
    price: "$5,000 to $15,000",
    scope: "5 to 15 tasks",
    body: "Delivered in 48 hours. A small pack of real tests the buyer can run before they commit to a full set.",
    hookLabel: "Easy close hook",
    hook: "100% of the pilot fee rolls into a full 200-task contract if they upgrade within 30 days.",
  },
  {
    kicker: "02 // 200-TASK PACK (STANDARD OR CAPPED)",
    price: "$130,000 / $240,000",
    scope: "200 tasks",
    body: "$130,000 is a non-exclusive annual license ($650/task). $240,000 is semi-exclusive, capped at 3 AI labs ($1,200/task).",
    hookLabel: "What changes with price",
    hook: "Same size pack. The higher price means fewer labs are allowed to hold it.",
  },
  {
    kicker: "03 // 200-TASK EXCLUSIVE BUYOUT",
    price: "$380,000+",
    scope: "200 tasks, $1,900/task",
    body: "Single-buyer exclusive rights. Custom tasks in that lab's own science, built for them alone.",
    hookLabel: "When to offer this",
    hook: "They want a pack no other lab can train or test on.",
  },
];

export type RoleId = "warm" | "full" | "outbound";

export const roles: Array<{ id: RoleId; percent: number; label: string; detail: string }> = [
  {
    id: "warm",
    percent: 10,
    label: "Warm Intro & Handoff (10% Commission)",
    detail: "Rep books the intro call; Buyan & Ben run the demo and close.",
  },
  {
    id: "full",
    percent: 15,
    label: "Full-Cycle BD Close (15% Commission)",
    detail: "Rep sources, qualifies, drives follow-up, and helps close the contract.",
  },
  {
    id: "outbound",
    percent: 20,
    label: "Outbound Accelerator / Exclusive Deal (20% Commission)",
    detail: "High-velocity outbound close or full $380k exclusive buyout.",
  },
];

export type DealKind = "cash" | "share";

export const commissionDeals: Array<{ id: string; label: string; amount: number; kind: DealKind }> = [
  { id: "pilot5", label: "5-Task Pilot ($5,000)", amount: 5000, kind: "cash" },
  { id: "pilot15", label: "15-Task Pilot ($15,000)", amount: 15000, kind: "cash" },
  { id: "standard", label: "200-Task Non-Exclusive ($130,000)", amount: 130000, kind: "cash" },
  { id: "semi", label: "200-Task Semi-Exclusive ($240,000)", amount: 240000, kind: "cash" },
  { id: "exclusive", label: "200-Task Exclusive Buyout ($380,000)", amount: 380000, kind: "cash" },
  { id: "partner", label: "50/50 Data Partner Sourced", amount: 0, kind: "share" },
];

export function cashCommission(amount: number, percent: number, count: number) {
  return (amount * percent * count) / 100;
}

export function formatDollars(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const payoutRules = [
  {
    title: "Pilot-to-Full-Pack Protection",
    body: "If your $5k or $15k pilot buyer upgrades to a $130k to $380k pack within 90 days, you earn your full commission rate on the entire upgrade too.",
  },
  {
    title: "5-Business-Day Payout SLA",
    body: "Commissions are paid via wire, ACH, or USDC within 5 business days after the buyer's payment clears Neo Norma's account.",
  },
];

export const audienceTabs = [
  {
    id: "buyers",
    label: "Who to Reach Out To (AI Lab Buyers)",
    intro: "Write to the person who buys tests for a model team. Skip general inboxes.",
    people: [
      "Post-training leads: they improve a model after the first training run.",
      "RL researchers: they train models by trial, score, and retry.",
      "Evaluation leads: they decide which tests a model must pass.",
      "Applied science directors: they pick the science the model has to get right.",
      "Technical product managers at AI labs, biotech AI startups, and enterprise AI teams.",
    ],
  },
  {
    id: "partners",
    label: "Who to Reach Out To (Data Partners)",
    intro: "Write to the person who controls a private archive and can say yes to a revenue split. They pay nothing. Their raw records stay private.",
    people: [
      "Founders of companies sitting on lab or clinical archives.",
      "CMOs and CSOs.",
      "Clinical registry directors.",
      "Diagnostic lab operators.",
      "CROs.",
      "Wet-lab leaders who want to earn from real records without exposing patient data or raw files.",
    ],
  },
] as const;

export const houseLists = [
  {
    title: "AI labs and buyers in active motion",
    items: [
      "Meta Superintelligence Labs (Mike Andersland)",
      "Palantir (Federico Bollano)",
      "Baseten Environment Network (Andrew Ho)",
      "MiniMax (Ryan Lee)",
      "Tacit Labs",
      "Kinetic Systems",
    ],
  },
  {
    title: "Data partners in active motion",
    items: [
      "Quarry (Shailesh - MOU sent)",
      "Anthroly (Sarath Kavuru - 20+ US companies, MOU prepared)",
    ],
  },
  {
    title: "Investors and strategic partners in active motion",
    items: ["Virtue VC", "Zetta Venture Partners", "Diffuse Labs"],
  },
];

const calendarLine = CALENDLY_URL.replace("https://", "");

export const scripts = [
  {
    id: "dm",
    title: "Short Cold DM / X / LinkedIn (AI Lab Buyer)",
    text: `Hi [Name] - textbook science questions are tapped out. Models score 100% on short problems, then fail 67% to 100% of the time on real hospital charts, drug assays, and DNA records. The best score we see is 72.5% (0.7250 vs a known-correct 1.0000).

Neo Norma sells ready-to-run science and medical test packs from real records. Our Python Grader checks each answer in under 50ms. Preflight verification caps easy shortcuts at <= 0.42.

We can send a 5-task sample, or run a 48-hour pilot from $5,000. 100% of that pilot fee rolls into a full pack if they upgrade within 30 days.

Open to 30 minutes? ${calendarLine}`,
  },
  {
    id: "email",
    title: "Cold Email (AI Lab Post-Training / Eval Lead - offering the 5-task sample or 48h pilot)",
    text: `Subject: 48-hour pilot for tests your models are failing

Hi [Name],

Textbook science questions are tapped out. Top models score 100% on short problems, then fail 67% to 100% of the time on real medical charts, drug assays, and DNA sequencing records. The best score we have seen is 72.5% (0.7250 vs a known-correct answer of 1.0000).

Neo Norma turns real hospital and lab records into tests AI labs buy to train and test models. Every test has a known right answer. Our Python Grader checks it in under 50 milliseconds. Preflight verification shows easy shortcuts score <= 0.42.

Two ways to start:
- A 5-task evaluation preview
- A 48-hour paid pilot, $5,000 to $15,000, for 5 to 15 tasks. 100% of the pilot fee rolls into a full 200-task contract if you upgrade within 30 days.

Full packs are $130,000 (non-exclusive annual license), $240,000 (semi-exclusive, capped at 3 AI labs), or $380,000+ (exclusive to one buyer).

I can book 30 minutes with Buyan and Ben: ${calendarLine}

[Your name]
Neo Norma partner desk`,
  },
  {
    id: "data",
    title: "Data Partner Outreach (Hospitals, Biotechs, Labs - pitching the 50/50 revenue split with zero raw data exposure)",
    text: `Subject: Revenue from your records, without handing over the raw data

Hi [Name],

If your hospital, lab, or biotech is sitting on real records, we can turn them into tests that AI labs buy. You pay $0. Your raw records stay in your control and are never shown to the buyer.

We sell the finished tests and split net revenue 50/50. Your half is paid within 5 business days of the buyer's payment. The only thing that ships is a de-identified problem and our code Grader. Preflight verification caps shortcut answers at <= 0.42, so a buyer cannot fake a high score.

If this is worth a look, I will introduce Buyan and Ben for 30 minutes: ${calendarLine}

[Your name]
Neo Norma partner desk`,
  },
  {
    id: "intro",
    title: "Warm Intro Blurb (Forwardable 3-sentence email to introduce Buyan & Ben)",
    text: `Subject: Intro to Buyan and Ben at Neo Norma

Hi [Name] - introducing Buyan Khurelbaatar and Ben Romero, founders of Neo Norma.
They turn real hospital and lab records into tests AI labs buy to train and test models, each one checked by a code Grader against a known right answer.
Worth 30 minutes if you buy tests for your models, or if you hold private records you want to monetize without exposing them: ${calendarLine}`,
  },
];

export const objections = [
  {
    q: "Can we see a sample before paying?",
    a: "Yes. We have a ready-to-run 5-task evaluation preview, and we can spin up a custom 48-hour paid pilot ($5k) where 100% of the fee rolls into the full pack.",
  },
  {
    q: "Does a Data Partner have to hand over private patient data?",
    a: "No. Raw records never leave their control or get exposed to buyers. Only de-identified problem inputs and our automated code Grader ship inside the test pack.",
  },
  {
    q: "Why not use PhD contractors or another AI to grade?",
    a: "AI models game AI judges quickly, and human grading is slow and inconsistent. Our code Grader checks the exact math and science in under 50 milliseconds (<50ms), and Preflight verification proves shortcuts score <= 0.42.",
  },
];

export const dealTypes = ["AI Lab Buyer", "50/50 Data Partner", "Investor Intro"] as const;

export const expectedTiers = [
  "$5k Pilot",
  "$15k Pilot",
  "$130k Non-Excl",
  "$240k Semi-Excl",
  "$380k Exclusive",
  "50/50 Data MOU",
] as const;

export const companyStats = [
  { value: "241", label: "Verified tasks built" },
  { value: "<$500/mo", label: "Current burn" },
  { value: "~98.5%", label: "Gross margin on direct packs" },
  { value: "$2.5M", label: "Seed round target" },
];

export const domains = [
  "Liquid Biopsy & Cancer DNA",
  "Drug Synergy & Assays",
  "Patient Survival & Scans",
  "Drug Binding Physics",
  "Metabolism & Systems Biology",
  "Phage & Microbial Lab Tests",
];

export const documents = [
  { name: "5-Task Lab Evaluation Sample", file: "neo-norma-5task-sample.zip" },
  { name: "200-Task Commercial Pack", file: "neo-norma-200task-lot.tar.gz" },
  { name: "Fast Pilot & Tranche Order Terms", file: "FAST_PILOT_TRANCHE_TERMS.pdf" },
  { name: "50/50 Data Partner MOU", file: "QUARRY / ANTHROLY 50/50 MOU template" },
  { name: "Invoice, Payment Sheet & W-9 Closing Kit", file: "NEO_NORMA_INVOICE_AND_PAYMENT_SHEET.pdf" },
];

export const leaders = [
  {
    name: "Buyan Khurelbaatar",
    role: "Founder & Technical Architect",
    lines: [
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      { label: "@buyan_kh", href: BUYAN_X },
    ],
  },
  {
    name: "Benjamin (Ben) Romero",
    role: "Co-Founder, Commercial & Capital",
    lines: [{ label: BEN_EMAIL, href: `mailto:${BEN_EMAIL}` }],
  },
];

export { CALENDLY_URL, CONTACT_EMAIL };
