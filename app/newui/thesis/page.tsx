const sections = [
  {
    title: "The library is finished",
    body: [
      "There was a time when a careful reader could hope to finish the shelf. That hope is gone. The pages have been copied, indexed, and learned until the public record answers in a single breath. Ask for the history of a stain, the shape of a bone, the name of a fever, and a paragraph arrives that sounds like a teacher who never slept.",
      "This is a triumph and a limit. The triumph is real. Language, once scarce, is now abundant. The limit is quieter. A library, however complete, is still a library. It holds what someone chose to write. It cannot hold the morning a preparation failed, the notebook that stayed in a drawer, the freezer no catalog ever opened.",
      "We have mistaken the end of reading for the end of knowing.",
    ],
  },
  {
    title: "Eloquence is not truth",
    body: [
      "A fluent answer is a kind of manners. It arrives on time. It uses the right words. It does not stumble. We were trained to hear that smoothness as a sign of understanding. In school it often was. On the page it often is. In the world it is only a voice.",
      "Nature does not grade a sentence. A cell does not care that the explanation was beautiful. An instrument drifts, and the number moves, and no amount of poise puts the number back. The patient does not read the literature. The reaction does not consult the review. What is said and what is so can part without a sound.",
      "Eloquence will keep its place. It is how we tell each other what we saw. It is not the seeing.",
    ],
  },
  {
    title: "The unwritten world",
    body: [
      "Most of what a field knows was never published. It lives in the hands of people who repeat a gesture until it becomes exact. It lives in the margin, in lot numbers, in the memory of a room. It lives in archives that were kept for care, not for fame.",
      "A machine that has read everything public has still not been invited into that room. It has not watched a preparation fail for a reason no abstract records. It has not sat with a decade of charts and learned which ones were amended, which ones were trusted, which ones were quietly set aside. The unwritten world is not a metaphor. It is a place, with doors, and those doors have keepers.",
      "To ask that world to teach, we do not take it. We ask.",
    ],
  },
  {
    title: "A test nature sets",
    body: [
      "There is a kind of question whose answer is already in the room, waiting, whether or not anyone writes it down. The culture grows or it does not. The binding holds or it slips. The scan, read again after the flare, tells a different story than the first frightened look. These are not puzzles invented to be hard. They are the ordinary severity of things.",
      "A fair test of intelligence, then, is not another page. It is a small piece of the world, held still long enough to be asked, and settled by what the world itself will confirm. No performance of expertise should outrun that confirmation. If the claim is wrong, the record says so. If the claim is right, the record says so. The rest is noise we have learned to admire.",
      "We do not need a louder performance. We need a quieter trial, one the instrument can fail, and one a person can watch fail.",
    ],
  },
  {
    title: "Kept where it lives",
    body: [
      "The record does not have to travel to be useful. A holder can keep the names, the places, the dates, the free words that belong to a person. What leaves, if anything leaves, is a shape: enough for a question, not enough to carry a life out the door. The original stays home. The question can still be strict.",
      "This is a courtesy and a discipline. Courtesy, because the people inside the record did not volunteer to become a public pile of text. Discipline, because a standard that leaks is not a standard. Trust is part of the instrument. Without it, the measurement is already spoiled.",
      "So the work begins with a promise. The archive remains with the people who made it. The question may travel. The life does not.",
    ],
  },
  {
    title: "The new standard",
    body: [
      "Neo Norma is a name for that refusal and that hope. We refuse to treat a finished library as a finished mind. We hope for a standard the field can share: questions drawn from work that was never written for a crowd, answered in the open, and settled by reality rather than by style.",
      "We are early. The shelf is still vast, and the unwritten rooms are vaster. What we are building is not a louder voice. It is a quieter test. A place where intelligence is asked to meet the world, and to be still when the world answers.",
      "If you build, bring the questions you cannot settle with a paragraph. If you keep an archive, you do not have to give it away to let it teach. If you fund, fund the standard, not the performance. The new standard is simple to say and strict to keep: the world grades, and the record stays home.",
      "If this is the work you want, write to us.",
    ],
  },
];

export default function ThesisPage() {
  return (
    <article className="mx-auto w-full max-w-[680px] px-5 py-16 md:py-24">
      <p className="nu-label">The Standard</p>
      <h1 className="mt-4 text-[44px] leading-[1.05] md:text-[64px]">The Standard</h1>
      <p className="nu-ink-60 mt-4 text-[18px]">Buyan Khurelbaatar · October 2026</p>
      {sections.map((section) => (
        <section key={section.title} className="mt-14">
          <h2 className="text-[28px] leading-snug md:text-[34px]">{section.title}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-5 text-[18px] leading-[1.55] md:text-[20px]">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
      <p className="mt-16 text-[20px]">
        <a className="nu-tap border-b nu-rule" href="mailto:hi@neonorma.si">
          hi@neonorma.si
        </a>
      </p>
    </article>
  );
}
