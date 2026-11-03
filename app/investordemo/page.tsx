import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { benchmarkTasks } from "@/lib/catalog";
import { Evaluation } from "@/components/Evaluation";
import "./investordemo.css";

export const metadata: Metadata = {
  title: "Neo Norma | Investor Demo",
  description: "Verifiable scientific environments for AI training and evaluation.",
  robots: { index: false, follow: false },
};

const taskExplanations = [
  "Tell cancer DNA apart from changes that come from blood cells.",
  "Find signs of cancer returning in a blood sample.",
  "Work out how genes and drug combinations affect cells.",
  "Analyze patient outcomes in a cancer trial.",
];

export default function InvestorDemo() {
  return (
    <div className="investor-demo">
      <header className="topbar"><div className="wrap topbar-inner"><div className="brand"><Logo size={30} /><span>Neo Norma</span></div><span className="label">Investor brief / 2026</span></div></header>
      <main id="content" className="wrap">
        <section className="hero"><p className="label">Training AI for science</p><h1>Training AI to do<br />real science.</h1><p className="hero-copy">We make science tests that help AI labs train their models and see what they get wrong.</p><div className="hero-meta"><span>01 / REAL DATA</span><span>02 / AI DOES THE WORK</span><span>03 / WE CHECK THE ANSWER</span></div></section>

        <Evaluation />

        <section className="section"><div className="section-heading"><span className="label">02 / The product</span><h2>Real science.<br />Answers we can check.</h2></div><div className="product-grid"><div><span className="label">01 / THE DATA</span><h3>Real records</h3><p>Data from medicine, biology, and experiments.</p></div><div><span className="label">02 / THE TEST</span><h3>A task for AI</h3><p>The AI works through the data and solves a problem.</p></div><div><span className="label">03 / THE ANSWER</span><h3>An automatic score</h3><p>Our software checks the answer against the correct result.</p></div></div><div className="technical-note"><span>RUNS ON</span><strong>Harbor + Docker</strong><span>CHECKED BY</span><strong>Python code</strong><span>USED FOR</span><strong>Training + testing</strong></div></section>

        <section className="section"><div className="section-heading"><span className="label">03 / Business model</span><h2>AI labs pay for<br />our tests.</h2></div><div className="pricing-grid"><div><span className="label">PAID PILOT / PROPOSED</span><strong>$5k–$15k</strong><p>5–15 tests. The pilot fee can count toward a larger pack.</p></div><div><span className="label">ANNUAL LICENSE / PROPOSED</span><strong>$130k</strong><p>A one-year license for 200 tests.</p></div><div><span className="label">EXCLUSIVE / PROPOSED</span><strong>$380k+</strong><p>200 tests made for or reserved for one buyer.</p></div></div><p className="footnote">We sell directly to AI labs. We can share revenue with the partners who provide data.</p></section>

        <section className="section"><div className="section-heading"><span className="label">04 / Market</span><h2>A big market.<br />A focused start.</h2></div><div className="market-grid"><div><span className="label">BROADER MARKET / 2025</span><strong>$37B</strong><p>Estimated spending by businesses on generative AI in 2025. <a href="https://menlovc.com/perspective/2025-the-state-of-generative-AI-in-the-enterprise/">Menlo Ventures ↗</a></p></div><div><span className="label">ILLUSTRATIVE ANNUAL SCENARIO</span><strong>$52M</strong><p>If 100 buyers each bought four $130k packs per year. This is an example, not a forecast.</p></div></div><p className="footnote">We start with AI labs building models for science, then expand to more fields and data partners. The size of our specific market is not yet verified.</p></section>

        <section className="section"><div className="section-heading"><span className="label">05 / Example tests</span><h2>What do we test?</h2></div><div className="task-list">{benchmarkTasks.map((task, i) => <div key={task.id}><span className="label">0{i + 1}</span><strong>{task.short}</strong><p>{taskExplanations[i]}</p></div>)}</div></section>

        <section className="section roadmap"><div className="section-heading"><span className="label">06 / What comes next</span><h2>More science.<br />Harder problems.</h2></div><div className="roadmap-grid"><div><span className="label">NOW</span><p>Science tests that software can score automatically.</p></div><div><span className="label">NEXT</span><p>Longer problems and more partners with real data.</p></div><div><span className="label">LONG TERM</span><p>A library of tests covering many areas of science.</p></div></div></section>
      </main>
      <footer className="footer"><div className="wrap footer-inner"><div className="brand"><Logo size={24} /><span>Neo Norma</span></div><span className="label">Training AI for science</span></div></footer>
    </div>
  );
}
