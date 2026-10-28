import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/contact";

export const HI_EMAIL = "hi@neonorma.si";
export const PUBLIC_SITE = "https://neonorma.si";
export const LABS_X = "https://x.com/neonorma_labs";
export const BUYAN_X = "https://x.com/buyan_kh";

export const navLinks = [
  { id: "pipeline", label: "[01. LEAD PIPELINE]" },
  { id: "product", label: "[02. WHAT WE SELL]" },
  { id: "outreach", label: "[03. OUTREACH SCRIPTS]" },
  { id: "log-lead", label: "[04. LOG A LEAD]" },
];

export const fieldClass =
  "mt-1 w-full border border-[#0A0A0A]/40 bg-white px-2 py-1.5 text-[13px] text-[#0A0A0A] outline-none placeholder:text-[#5A5852] hover:border-[#0A0A0A]/70 focus:border-[#0A0A0A] focus:bg-[#fafafa]";

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
    price: "$5k-$15k",
    scope: "5 to 15 tasks, delivered in 48 hours",
    body: "A small pack of real tests the buyer can run before a full set. The price is $5,000 to $15,000. If they upgrade to a full pack within 30 days, the pilot fee counts toward that pack.",
  },
  {
    kicker: "02 // 200-TASK PACK",
    price: "$130k / $240k",
    scope: "200 tasks",
    body: "$130,000 is a non-exclusive annual license ($650/task). $240,000 is semi-exclusive, capped at 3 AI labs ($1,200/task).",
  },
  {
    kicker: "03 // FULL EXCLUSIVE BUYOUT",
    price: "$380k+",
    scope: "One buyer, custom tasks",
    body: "Single-buyer rights. Custom tasks in that lab's own science, built for them alone. $1,900/task on a 200-task pack, $380,000 and up.",
  },
  {
    kicker: "04 // 50/50 DATA PARTNER CO-LICENSING",
    price: "50/50",
    scope: "Partner pays $0",
    body: "Hospitals, labs, and biotechs keep their raw records. We turn the records into tests, sell the tests to AI labs, and split that sale 50/50. Their half is paid within 5 business days.",
  },
];

const calendarLine = CALENDLY_URL.replace("https://", "");

export const scripts = [
  {
    id: "dm",
    title: "Cold DM (X / LinkedIn)",
    text: `Hi [Name] - textbook science questions are tapped out. Models score 100% on short problems, then fail 67% to 100% of the time on real hospital charts, drug assays, and DNA records. The best score we see is 72.5% (0.7250 vs a known-correct 1.0000).

Neo Norma sells ready-to-run science and medical test packs from real records. Our Python Grader checks each answer in under 50ms. Preflight verification caps easy shortcuts at <= 0.42.

A 48-hour pilot is $5,000 to $15,000. Full packs are $130,000, $240,000, or $380,000+.

Open to 30 minutes with Buyan Khurelbaatar? ${calendarLine}`,
  },
  {
    id: "email",
    title: "Cold Email to AI Lab Eval / Post-Training Leads",
    text: `Subject: 48-hour pilot for tests your models are failing

Hi [Name],

Textbook science questions are tapped out. Top models score 100% on short problems, then fail 67% to 100% of the time on real medical charts, drug assays, and DNA sequencing records. The best score we have seen is 72.5% (0.7250 vs a known-correct answer of 1.0000).

Neo Norma turns real hospital and lab records into tests AI labs buy to train and test models. Every test has a known right answer. Our Python Grader checks it in under 50 milliseconds. Preflight verification shows easy shortcuts score <= 0.42.

Two ways to start:
- A 5-task evaluation preview
- A 48-hour paid pilot, $5,000 to $15,000, for 5 to 15 tasks. The pilot fee counts toward a full 200-task contract if you upgrade within 30 days.

Full packs are $130,000 (non-exclusive annual license), $240,000 (semi-exclusive, capped at 3 AI labs), or $380,000+ (exclusive to one buyer).

Book 30 minutes with Buyan Khurelbaatar (${CONTACT_EMAIL}): ${calendarLine}

[Your name]
Neo Norma`,
  },
  {
    id: "data",
    title: "Cold Email to 50/50 Data Partners",
    text: `Subject: Revenue from your records, without handing over the raw data

Hi [Name],

If your hospital, lab, or biotech is sitting on real records, we can turn them into tests that AI labs buy. You pay $0. Your raw records stay in your control and are never shown to the buyer.

We sell the finished tests and split the sale 50/50. Your half is paid within 5 business days of the buyer's payment. The only thing that ships is a de-identified problem and our code Grader. Preflight verification caps shortcut answers at <= 0.42, so a buyer cannot fake a high score.

If this is worth a look, book 30 minutes with Buyan Khurelbaatar (${CONTACT_EMAIL}): ${calendarLine}

[Your name]
Neo Norma`,
  },
  {
    id: "intro",
    title: "Forwardable Intro Blurb for Buyan",
    text: `Subject: Intro to Buyan Khurelbaatar at Neo Norma

Hi [Name] - introducing Buyan Khurelbaatar, founder of Neo Norma (${CONTACT_EMAIL}).
He turns real hospital and lab records into tests AI labs buy, each one checked by a code Grader against a known right answer.
Worth 30 minutes if you buy tests for your models, or if you hold private records you want to license without exposing them: ${calendarLine}`,
  },
];

export const objections = [
  {
    q: "Can we see a sample before paying?",
    a: "Yes. We have a ready-to-run 5-task evaluation preview, and we can spin up a custom 48-hour paid pilot ($5k) where the fee counts toward the full pack.",
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

export const readyAssets = [
  { name: "5-Task Sample", file: "neo-norma-5task-sample.zip" },
  { name: "200-Task Pack", file: "neo-norma-200task-lot.tar.gz" },
  { name: "1-Page Pilot Order Form", file: "FAST_PILOT_TRANCHE_TERMS.pdf" },
  { name: "50/50 Data Partner MOU", file: "QUARRY / ANTHROLY 50/50 MOU template" },
];

export { CALENDLY_URL, CONTACT_EMAIL };
