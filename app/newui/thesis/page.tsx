import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "The library is finished. The public record has been exhausted.",
};

const sections = [
  {
    title: "The library is finished",
    body: [
      "The public record has been exhausted. Every textbook, journal, and archive in the open has been copied, indexed, and learned until the machine answers in a single breath.",
      "Language, once scarce, is now abundant.",
      "Yet a library, however complete, is only a record of what was written. It does not hold the morning a preparation failed, the notebook left in a drawer, or the freezer no catalog ever opened.",
      "The field has mistaken the end of reading for the end of knowing.",
    ],
  },
  {
    title: "Eloquence is not truth",
    body: [
      "A fluent answer is a form of manners. It arrives on time, uses the right words, and does not stumble. We were trained to hear that smoothness as understanding. On the page, it often is. In the physical world, it is only a voice.",
      "Nature does not grade a sentence. A cell does not care that an explanation was beautiful. An instrument drifts, the number moves, and no amount of poise puts the number back. The patient does not read the literature. The reaction does not consult the review. What is said and what is so can part without a sound.",
      "Eloquence is how we report what we saw. It is not the seeing.",
    ],
  },
  {
    title: "The unwritten world",
    body: [
      "The hardest truths of any discipline are never published. They live in the hands of people who repeat a gesture until it becomes exact. They sit in margins, in lot numbers, in the memory of a room, and in private archives kept for care rather than fame.",
      "A model trained on the public internet has never entered that room. It has not watched a synthesis fail for a reason no abstract records, nor sat with a decade of charts to learn which ones were amended, which were trusted, and which were quietly set aside. The unwritten world is not a metaphor. It is a physical place with doors, and those doors have keepers.",
      "That world cannot be scraped. It must be met on its own terms.",
    ],
  },
  {
    title: "A test nature sets",
    body: [
      "The only questions that matter now are the ones whose answers are already in the room, waiting, whether or not anyone writes them down. The culture grows or it does not. The binding holds or it slips. The scan, read again after the flare, tells a different story than the first frightened look. These are not puzzles invented to be clever. They are the ordinary severity of things.",
      "The true measure of intelligence is not another page of text. It is a piece of the world, held still long enough to be interrogated, and settled by what reality itself confirms. No performance of expertise can outrun that confirmation. Whether a claim holds or breaks, the physical record decides. The rest is noise.",
      "The era of the demonstration is over. What comes next is the trial.",
    ],
  },
  {
    title: "Kept where it lives",
    body: [
      "Ground truth does not need to be surrendered to be measured against. The keeper of an archive holds back the names, the places, the dates, and the private words that belong to a life. What crosses the threshold is only the structure of the problem: enough to enforce a strict question, never enough to carry a person out the door. The original stays home.",
      "This is a matter of custody and of rigor. The people inside a clinical or scientific record did not volunteer to become public training text. And a benchmark that leaks into the open ceases to be a standard. Custody is part of the instrument. Without it, the measurement is spoiled before it begins.",
      "The rule is absolute. The archive remains with the people who made it. The question travels. The life does not.",
    ],
  },
  {
    title: "The new standard",
    body: [
      "Neo Norma was built to establish this boundary and this test. A finished library is not a finished mind. We are constructing the standard the field will answer to: questions drawn from work never written for a crowd, evaluated in the open, and settled by physical reality rather than style.",
      "The public shelf is closed, and the unwritten rooms are vast. We are not building a louder voice. We are building the proving ground where intelligence meets the world, and stays silent while the world answers.",
      "If you build models, bring the claims you cannot settle with a paragraph. If you hold an archive, let it judge without giving it away.",
    ],
  },
];

export default function ThesisPage() {
  return (
    <article className="nu-page w-full py-16 md:py-24">
      <div className="mx-auto max-w-[680px]">
        <h1 className="text-[44px] leading-[1.05] md:text-[64px]">The Thesis</h1>
        <p className="nu-ink-60 mt-4 text-[18px]">Buyan Khurelbaatar · October 2026</p>
        {sections.map((section) => (
          <section key={section.title} className="mt-14">
            <h2 className="text-[28px] leading-snug md:text-[34px]">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-5 text-[18px] leading-[1.55] md:text-[20px]">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        <p className="mt-32 text-[26px] italic leading-snug md:mt-40 md:text-[32px]">
          The world grades, and the record stays home.
        </p>
        <p className="mt-8 text-[20px]">
          <a className="nu-tap border-b nu-rule" href="mailto:hi@neonorma.si">
            hi@neonorma.si
          </a>
        </p>
      </div>
    </article>
  );
}
