import type { Metadata } from "next";
import "./investordemo.css";

export const metadata: Metadata = {
  title: "Neo Norma | Investor Demo",
  description: "Training and evaluating AI on the work of real science.",
  robots: { index: false, follow: false },
};

const steps = [
  { number: "01", title: "Start with real work", text: "Scientific records, experimental data, and the messy decisions that come with them." },
  { number: "02", title: "Build the environment", text: "We turn that work into a realistic task an AI agent can investigate with tools and data." },
  { number: "03", title: "Grade against reality", text: "A deterministic verifier checks the result against a known answer and returns a usable score." },
];

export default function InvestorDemo() {
  return (
    <main id="content" className="investor-demo">
      <div className="id-wrap">
        <header className="id-header">
          <div className="id-brand"><span className="id-mark" aria-hidden="true"><i /><i /><i /><i /></span><span>NEO NORMA</span></div>
          <span className="id-header-label">SCIENCE IS THE TEST <span> / </span> 2026</span>
        </header>

        <section className="id-hero">
          <div className="id-hero-copy">
            <p className="id-eyebrow"><span className="id-dot" /> THE INTELLIGENCE INFRASTRUCTURE FOR SCIENCE</p>
            <h1>AI that can do<br /><em>real science.</em></h1>
            <p className="id-lede">Neo Norma builds the environments that teach and test AI on the messy, consequential work of science.</p>
            <div className="id-hero-note"><span>THE IDEA</span><p>Give models the work.<br />Measure them against reality.</p></div>
          </div>
          <div className="id-visual" aria-label="Illustration of scientific data being transformed into a verified result">
            <div className="id-visual-top"><span>NEO NORMA / ENVIRONMENT 001</span><span>● &nbsp; ACTIVE</span></div>
            <div className="id-orbit id-orbit-one" /><div className="id-orbit id-orbit-two" />
            <div className="id-cross id-cross-one">+</div><div className="id-cross id-cross-two">+</div>
            <div className="id-core"><span className="id-core-icon">✳</span><small>REAL-WORLD<br />SCIENCE</small></div>
            <div className="id-node id-node-one"><span>01 / INPUT</span><strong>Scientific data</strong><div className="id-lines"><i /><i /><i /></div></div>
            <div className="id-node id-node-two"><span>02 / AGENT</span><strong>Reason + act</strong><div className="id-code">&gt; investigate_<br />&gt; analyze_</div></div>
            <div className="id-node id-node-three"><span>03 / OUTPUT</span><strong>Verified result</strong><div className="id-check">✓ <small>GRADED</small></div></div>
            <div className="id-visual-bottom"><span>FROM RAW DATA</span><span>TO GROUND TRUTH ↗</span></div>
          </div>
        </section>

        <section className="id-problem id-section">
          <div className="id-section-label"><span>01 / THE PROBLEM</span><span>THE GAP</span></div>
          <div className="id-problem-grid"><h2>Knowing science<br />isn’t the same as<br /><em>doing science.</em></h2><div><p>AI can answer questions from a textbook. But real scientific work is full of incomplete records, noisy data, failed experiments, and decisions where the details matter.</p><p>To make AI useful in science, we need a way to practice that work—and know when it gets the answer right.</p></div></div>
        </section>

        <section className="id-how id-section">
          <div className="id-section-label"><span>02 / WHAT WE DO</span><span>THE SYSTEM</span></div>
          <div className="id-section-heading"><h2>From scientific work<br /><em>to a signal for AI.</em></h2><p>We turn hard-to-evaluate scientific problems into environments AI labs can use to train and evaluate their models.</p></div>
          <div className="id-steps">{steps.map((step) => <article className="id-step" key={step.number}><div className="id-step-top"><span>{step.number}</span><span>↗</span></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
        </section>

        <section className="id-example id-section">
          <div className="id-section-label"><span>03 / A CONCRETE EXAMPLE</span><span>INSIDE AN ENVIRONMENT</span></div>
          <div className="id-example-grid"><div><h2>Can the model catch<br /><em>the mistake?</em></h2><p>Imagine an agent reviewing a biological study. It has the data, the analysis, and a job to do: determine whether the reported finding holds up.</p></div><div className="id-terminal"><div className="id-terminal-head"><span>SCIENTIFIC WORKSPACE</span><span>● ● ●</span></div><div className="id-terminal-body"><p><span>THE TASK</span> Inspect the analysis and identify the error.</p><p><span>THE TRAP</span> Hundreds of features were tested, but the reported result was not corrected for multiple comparisons.</p><p className="id-terminal-result"><span>THE SIGNAL</span> The verifier checks whether the agent identified and handled the error.</p></div></div></div>
        </section>

        <section className="id-future id-section">
          <div className="id-section-label"><span>04 / WHERE WE’RE GOING</span><span>THE AMBITION</span></div>
          <div className="id-future-grid"><div><p className="id-eyebrow">THE LONG VIEW</p><h2>A proving ground<br />for <em>scientific intelligence.</em></h2></div><div><p>We’re starting with science and biostatistics: environments grounded in real workflows, with answers that can be checked.</p><p>Over time, we want to build a growing library of scientific environments across disciplines—connecting the people who hold real-world data with the teams building the next generation of AI.</p><p className="id-future-last">Better feedback for models.<br />Better tools for discovery.</p></div></div>
        </section>
        <footer className="id-footer"><div className="id-brand"><span className="id-mark" aria-hidden="true"><i /><i /><i /><i /></span><span>NEO NORMA</span></div><span>BUILDING THE STANDARD FOR SCIENTIFIC AI.</span><span>NEONORMA.SI &nbsp; / &nbsp; 2026</span></footer>
      </div>
    </main>
  );
}
