import { DitherTile } from "@/components/newui/DitherTile";
import { FrayLines } from "@/components/newui/FrayLines";
import { DitherHelix } from "@/components/newui/DitherHelix";
import { ResolveMark } from "@/components/newui/ResolveMark";

const tiles = [
  { motif: "record" as const, title: "We find the record.", line: "The quiet work, gathered." },
  { motif: "home" as const, title: "It never leaves home.", line: "The archive stays where it was made." },
  { motif: "grade" as const, title: "Reality does the grading.", line: "The world says yes or no." },
  { motif: "standard" as const, title: "A standard, not a score.", line: "A measure the field can share." },
];

const doors = [
  { kicker: "For those building intelligence.", action: "request access", href: "/newui/access?as=lab" },
  { kicker: "For those who hold the record.", action: "begin a conversation", href: "/newui/access?as=holder" },
  { kicker: "For those who fund what comes next.", action: "read the thesis", href: "/newui/thesis" },
];

export default function NewuiHome() {
  return (
    <div className="mx-auto w-full max-w-[920px] px-5">
      <section className="nu-reveal grid items-end gap-10 py-16 md:grid-cols-[minmax(0,1fr)_280px] md:py-24">
        <div>
          <p className="nu-label">Neo Norma</p>
          <h1 className="mt-6 text-[40px] leading-[1.05] md:text-[68px]">
            Machines have read everything.
            <br />
            Nature was never asked.
          </h1>
          <p className="mt-6 text-[22px] italic md:text-[28px]">A new standard for intelligence.</p>
        </div>
        <div className="mx-auto h-64 w-64 md:h-72 md:w-72">
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
        <div className="grid grid-cols-2 gap-x-6 gap-y-12">
          {tiles.map((tile) => (
            <article key={tile.title}>
              <DitherTile motif={tile.motif} />
              <h2 className="mt-4 text-[22px] leading-snug md:text-[28px]">{tile.title}</h2>
              <p className="nu-ink-60 mt-2 max-w-[28ch] text-[16px] leading-relaxed md:text-[18px]">{tile.line}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="nu-reveal border-t nu-rule py-16 md:py-24">
        <h2 className="max-w-[16em] text-[34px] leading-[1.15] md:text-[52px]">
          What does a model know that was never written down? What happens when the answer comes from the world instead of a page?
        </h2>
      </section>

      <section className="border-t nu-rule">
        {doors.map((door) => (
          <a key={door.href} href={door.href} className="nu-tap block border-b nu-rule py-8 text-[26px] leading-snug md:text-[34px]">
            {door.kicker}{" "}
            <span className="italic">{door.action}</span>
          </a>
        ))}
      </section>

      <section className="nu-reveal flex flex-col items-start gap-6 py-20">
        <div className="h-24 w-24">
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
