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

export default function InvestorDemo() {
  return (
    <div className="investor-demo">
      <header className="topbar"><div className="wrap topbar-inner"><div className="brand"><Logo size={30} /><span>Neo Norma</span></div><span className="label">Investor brief / 2026</span></div></header>
      <main id="content" className="wrap">
        <section className="hero"><p className="label">Scientific intelligence infrastructure</p><h1>Training AI to do<br />real science.</h1><p className="hero-copy">We build verifiable science environments for AI labs to train and evaluate their models.</p><div className="hero-meta"><span>01 / SCIENTIFIC DATA</span><span>02 / AGENT WORKSPACE</span><span>03 / VERIFIED REWARD</span></div></section>

        <Evaluation />

        <section className="section"><div className="section-heading"><span className="label">02 / The product</span><h2>Real scientific work.<br />Machine-checkable answers.</h2></div><div className="product-grid"><div><span className="label">INPUT</span><h3>Scientific data</h3><p>Clinical, genomics, wet-lab and statistical workflows.</p></div><div><span className="label">ENVIRONMENT</span><h3>Agent workspace</h3><p>Models investigate data and complete a scientific task.</p></div><div><span className="label">OUTPUT</span><h3>Verified reward</h3><p>Deterministic code grades the result against a known answer.</p></div></div><div className="technical-note"><span>DELIVERY</span><strong>Harbor + Docker</strong><span>GRADING</span><strong>Python verifier</strong><span>USE CASE</span><strong>RL training + evaluation</strong></div></section>

        <section className="section"><div className="section-heading"><span className="label">03 / Business model</span><h2>AI labs pay for<br />environments.</h2></div><div className="pricing-grid"><div><span className="label">PAID PILOT / PROPOSED</span><strong>$5k–$15k</strong><p>5–15 tasks; pilot fees can credit toward a full pack.</p></div><div><span className="label">ANNUAL LICENSE / PROPOSED</span><strong>$130k</strong><p>Non-exclusive license for a 200-task pack.</p></div><div><span className="label">EXCLUSIVE / PROPOSED</span><strong>$380k+</strong><p>Custom or exclusive 200-task pack.</p></div></div><p className="footnote">Distribution: direct to frontier AI labs and science-focused model builders. Data partnerships can include revenue sharing.</p></section>

        <section className="section"><div className="section-heading"><span className="label">04 / Market</span><h2>A growing AI market.<br />A focused entry point.</h2></div><div className="market-grid"><div><span className="label">BROADER MARKET / 2025</span><strong>$37B</strong><p>Estimated enterprise generative AI spend, across applications and infrastructure. <a href="https://menlovc.com/perspective/2025-the-state-of-generative-AI-in-the-enterprise/">Menlo Ventures ↗</a></p></div><div><span className="label">ILLUSTRATIVE ANNUAL SCENARIO</span><strong>$52M</strong><p>100 buyers × 4 packs per year × $130k. This is a hypothetical scenario, not a measured market size or forecast.</p></div></div><p className="footnote">Initial buyers: frontier labs and AI-for-science teams. Expansion: more scientific domains, long-horizon environments and data partners. The size of the specific scientific-environment market remains unverified.</p></section>

        <section className="section"><div className="section-heading"><span className="label">05 / Example environments</span><h2>Built for decisions,<br />not trivia.</h2></div><div className="task-list">{benchmarkTasks.map((task, i) => <div key={task.id}><span className="label">0{i + 1}</span><strong>{task.short}</strong><p>{task.failure}</p></div>)}</div></section>

        <section className="section roadmap"><div className="section-heading"><span className="label">07 / Direction</span><h2>From individual tasks<br />to scientific worlds.</h2></div><div className="roadmap-grid"><div><span className="label">NOW</span><p>Science and biostatistics tasks with deterministic graders.</p></div><div><span className="label">NEXT</span><p>Longer, multi-step environments and more data partnerships.</p></div><div><span className="label">LONG TERM</span><p>A library of verifiable environments across scientific disciplines.</p></div></div></section>
      </main>
      <footer className="footer"><div className="wrap footer-inner"><div className="brand"><Logo size={24} /><span>Neo Norma</span></div><span className="label">Scientific intelligence infrastructure</span></div></footer>
    </div>
  );
}
