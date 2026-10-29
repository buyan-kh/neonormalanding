import { DitherHelix } from "@/components/newui/DitherHelix";
import { DitherTile } from "@/components/newui/DitherTile";
import { FrayLines } from "@/components/newui/FrayLines";
import { ResolveMark } from "@/components/newui/ResolveMark";

const services = [
  { motif: "lattice" as const, title: "RL Environments", line: "Proving grounds scored by what actually happened." },
  { motif: "target" as const, title: "RL Evals", line: "Hard scientific tasks with answers nature already gave." },
  { motif: "pages" as const, title: "SFT Data", line: "Expert reasoning traces from working scientists." },
  { motif: "checks" as const, title: "Rubrics + Graders", line: "Every answer checked, not guessed." },
  { motif: "trail" as const, title: "Agent Trajectories", line: "Long horizon work across real tools and records." },
  { motif: "vault" as const, title: "Private Data Partnerships", line: "Records that never leave home, put to work." },
];

const doors = [
  { kicker: "For those building intelligence.", action: "Request access", href: "/newui/access?as=lab" },
  { kicker: "For those who hold the record.", action: "Begin a conversation", href: "/newui/access?as=holder" },
  { kicker: "For those who fund what comes next.", action: "Read the thesis", href: "/newui/thesis" },
];

export default function NewuiHome() {
  return (
    <div className="nu-page">
      <section className="nu-reveal grid items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <div>
          <p className="nu-label">Neo Norma</p>
          <h1 className="mt-6 text-[40px] leading-[1.05] md:text-[64px]">
            Machines have read everything.
            <br />
            Nature was never asked.
          </h1>
          <p className="mt-6 text-[22px] italic md:text-[28px]">A new standard for intelligence.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a className="nu-btn" href="/newui/access?as=lab">
              Request access <span className="nu-arr" aria-hidden="true">→</span>
            </a>
            <a className="nu-link" href="/newui/thesis">Read the thesis</a>
          </div>
        </div>
        <div className="mx-auto h-[60vw] w-[60vw] max-w-[520px] lg:mx-0 lg:h-[75vh] lg:w-full lg:max-w-none">
          <DitherHelix />
        </div>
      </section>

      <section className="nu-reveal border-t nu-rule py-16 md:py-24" style={{ animationDelay: "80ms" }}>
        <FrayLines />
        <p className="mt-8 max-w-[18em] text-[32px] leading-[1.15] md:text-[44px]">
          Every textbook, memorized.
          <br />
          Every exam, passed.
          <br />
          Then the instrument drifts, the cell divides, the patient does not read the literature.
        </p>
      </section>

      <section className="nu-reveal grid items-center gap-8 border-t nu-rule py-16 md:grid-cols-[140px_minmax(0,1fr)] md:py-24" style={{ animationDelay: "120ms" }}>
        <ResolveMark />
        <p className="max-w-[22em] text-[28px] leading-[1.25] md:text-[36px]">
          Most of what science knows was never published. It lives in notebooks, freezers, and archives no model has seen.
        </p>
      </section>

      <section className="nu-reveal border-t nu-rule py-16 md:py-20">
        <p className="nu-label">What we make</p>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
          {services.map((tile) => (
            <article key={tile.title} className="min-w-0">
              <DitherTile motif={tile.motif} />
              <h2 className="mt-4 text-[26px] leading-snug md:text-[32px]">{tile.title}</h2>
              <p className="nu-ink-60 mt-2 text-[16px] leading-relaxed md:text-[18px]">{tile.line}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="nu-reveal border-t nu-rule py-16 md:py-24">
        <h2 className="max-w-[16em] text-[34px] leading-[1.15] md:text-[52px]">
          What does a model know that was never written down? What happens when the answer comes from the world instead of a page?
        </h2>
        <p className="nu-ink-60 mt-8 max-w-[28em] text-[20px] italic leading-relaxed md:text-[22px]">
          We find the record. It never leaves home. Reality does the grading.
        </p>
      </section>

      <section className="nu-door">
        {doors.map((door) => (
          <a key={door.href} className="nu-door-link" href={door.href}>
            <span>{door.kicker}</span>
            <span className="nu-door-tag">
              {door.action}
              <span className="nu-arr" aria-hidden="true">→</span>
            </span>
          </a>
        ))}
      </section>

      <section className="nu-reveal flex flex-col items-start gap-6 py-20">
        <div className="h-36 w-36">
          <DitherHelix still />
        </div>
        <p className="text-[28px] leading-snug">Neo Norma. The new standard.</p>
        <a className="nu-tap nu-label border-b nu-rule" href="mailto:hi@neonorma.si">
          hi@neonorma.si
        </a>
      </section>
    </div>
  );
}
