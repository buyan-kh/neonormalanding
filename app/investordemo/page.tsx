import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { Logo } from "@/components/Logo";
import { benchmarkModels, benchmarkTasks } from "@/lib/catalog";
import { DitherTile, type ServiceMotif } from "@/components/newui/DitherTile";
import { FrayLines } from "@/components/newui/FrayLines";
import "./investordemo.css";

const news = Newsreader({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-news", display: "swap" });

export const metadata: Metadata = {
  title: "Neo Norma | Investor Demo",
  description: "Training and evaluating AI on the work of real science.",
  robots: { index: false, follow: false },
};

const steps: { number: string; motif: ServiceMotif; title: string; text: string }[] = [
  { number: "01", motif: "pages", title: "Start with real work", text: "Scientific records, experimental data, and the messy decisions that come with them." },
  { number: "02", motif: "lattice", title: "Build the environment", text: "We turn that work into a realistic task an AI agent can investigate with tools and data." },
  { number: "03", motif: "checks", title: "Grade against reality", text: "A deterministic verifier checks the result against a known answer and returns a usable score." },
];

export default function InvestorDemo() {
  return (
    <div className={`investor-demo ${news.variable}`}>
      <header className="id-header"><div className="id-wrap id-header-inner"><div className="id-brand"><Logo size={22} /> Neo Norma</div><span className="id-label">Investor demo / 2026</span></div></header>
      <main id="content" className="id-wrap">
        <section className="id-hero">
          <div><p className="id-label">Neo Norma / Scientific intelligence</p><h1>AI that can do<br /><em>real science.</em></h1><p className="id-hero-lede">We build the environments that teach and test AI on the messy, consequential work of science.</p><p className="id-hero-note">Give models the work.<br />Measure them against reality.</p></div>
          <div className="id-instrument" aria-label="Neo Norma logo"><div className="id-instrument-head"><span>NEO NORMA / SYSTEM 001</span><span>SCIENCE → SIGNAL</span></div><div className="id-instrument-logo"><Logo size={210} /></div><div className="id-instrument-foot"><span>VERIFIABLE ENVIRONMENTS</span><span>01 / 04</span></div></div>
        </section>

        <section className="id-section id-problem"><FrayLines /><p className="id-label id-section-label">01 / The problem</p><div className="id-split"><h2>Knowing science isn’t the same as <em>doing science.</em></h2><div className="id-copy"><p>AI can answer questions from a textbook. But real scientific work is full of incomplete records, noisy data, failed experiments, and decisions where the details matter.</p><p>To make AI useful in science, we need a way to practice that work—and know when it gets the answer right.</p></div></div></section>

        <section className="id-section"><p className="id-label">02 / What we do</p><div className="id-intro"><h2>From scientific work to <em>a signal for AI.</em></h2><p>We turn hard-to-evaluate scientific problems into environments AI labs can use to train and evaluate their models.</p></div><div className="id-steps">{steps.map((step) => <article key={step.number}><DitherTile motif={step.motif} /><p className="id-label">{step.number} / The process</p><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>

        <section className="id-section id-benchmarks" aria-labelledby="benchmark-heading">
          <p className="id-label">03 / Benchmark examples</p>
          <div className="id-intro"><h2 id="benchmark-heading">The work is hard.<br /><em>The signal is precise.</em></h2><p>Four example environments, each scored against a known-correct reference answer.</p></div>
          <div className="id-benchmark-frame">
            <div className="id-benchmark-header"><span>NEO NORMA / EVALUATION MATRIX</span><span>REFERENCE REWARD: 1.0000</span></div>
            <p className="id-benchmark-disclosure"><strong>Illustrative estimates.</strong> These scores are informed by public science and data-work benchmarks; they are not measured results on these tasks.</p>
            <div className="id-table-scroll"><table><thead><tr><th scope="col">MODEL / TASK</th>{benchmarkTasks.map((task, index) => <th scope="col" key={task.id}><span>ENV 0{index + 1}</span>{task.short}</th>)}</tr></thead><tbody>{benchmarkModels.map((model) => <tr key={model.id}><th scope="row">{model.name}</th>{benchmarkTasks.map((task) => <td key={task.id}><span className="id-score">{task.frontier[model.rewardIndex]}</span><span className="id-score-bar" aria-hidden="true"><i style={{ width: `${Number(task.frontier[model.rewardIndex]) * 100}%` }} /></span></td>)}</tr>)}</tbody></table></div>
            <div className="id-benchmark-footer"><span>01 CFDNA / CHIP</span><span>02 MRD DUPLEX</span><span>03 PERTURB-SEQ</span><span>04 ONCOLOGY TRIAL</span></div>
          </div>
        </section>

        <section className="id-section"><p className="id-label">04 / A concrete example</p><div className="id-split id-example"><div><h2>Can the model catch <em>the mistake?</em></h2><p>Imagine an agent reviewing a biological study. It has the data, the analysis, and a job to do: determine whether the reported finding holds up.</p></div><div className="id-example-list"><div><span className="id-label">The task</span><p>Inspect the analysis and identify the error.</p></div><div><span className="id-label">The trap</span><p>Hundreds of features were tested, but the reported result was not corrected for multiple comparisons.</p></div><div><span className="id-label">The signal</span><p>The verifier checks whether the agent identified and handled the error.</p></div></div></div></section>

        <section className="id-section id-future"><p className="id-label">05 / Where we’re going</p><div className="id-split"><h2>A proving ground for <em>scientific intelligence.</em></h2><div className="id-copy"><p>We’re starting with science and biostatistics: environments grounded in real workflows, with answers that can be checked.</p><p>Over time, we want to build a growing library of scientific environments across disciplines—connecting the people who hold real-world data with the teams building the next generation of AI.</p><p className="id-ending">Better feedback for models.<br />Better tools for discovery.</p></div></div></section>
      </main>
      <footer className="id-footer"><div className="id-wrap id-footer-inner"><div className="id-brand"><Logo size={20} /> Neo Norma</div><span className="id-label">A new standard for intelligence.</span><span className="id-label">© 2026</span></div></footer>
    </div>
  );
}
