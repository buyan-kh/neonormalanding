import type { KeyboardEvent } from "react";
import { deskModes, type DeskMode } from "@/components/inside/content";

const copy: Record<DeskMode, { title: string; body: string }> = {
  sales: {
    title: "What we sell, who buys it, what to say, and what you earn.",
    body: "Read this before you write to a lab or a data partner. One page. Plain English.",
  },
  hq: {
    title: "Company numbers, the files we send, and who closes the deal.",
    body: "The operating snapshot for founders and ops. The lead form is at the bottom.",
  },
};

export function WelcomeBanner({
  mode,
  onMode,
  signedInName,
}: {
  mode: DeskMode;
  onMode: (mode: DeskMode) => void;
  signedInName: string;
}) {
  const active = copy[mode];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = mode === "sales" ? "hq" : "sales";
    onMode(next);
    document.getElementById(`desk-tab-${next}`)?.focus();
  }

  return (
    <section id="top" className="mx-auto w-full max-w-[1080px] scroll-mt-32 px-4 pb-8 pt-8 md:px-6 md:pt-9">
      <p className="text-[11px] tracking-[0.16em] text-[#5A5852]">INSIDE // NEO NORMA WORKSPACE & PARTNER DESK</p>
      <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-[#0A0A0A]">{`[SIGNED IN: ${signedInName.toUpperCase()}]`}</p>
      <h1 className="mt-4 max-w-[22em] text-[26px] leading-[1.2] text-[#0A0A0A] md:text-[32px]">{active.title}</h1>
      <p className="mt-4 max-w-[62ch] text-[13px] leading-relaxed text-[#5A5852] md:text-sm">{active.body}</p>
      <div
        role="tablist"
        aria-label="Desk"
        className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
        onKeyDown={onKeyDown}
      >
        {deskModes.map((item) => {
          const on = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`desk-tab-${item.id}`}
              aria-selected={on}
              aria-controls="workspace"
              tabIndex={on ? 0 : -1}
              onClick={() => onMode(item.id)}
              className={
                on
                  ? "min-w-0 max-w-full whitespace-normal border border-[#D9D9D9] bg-[#D9D9D9] px-3 py-2 text-left text-[12px] text-[#303030]"
                  : "min-w-0 max-w-full whitespace-normal border border-[#0A0A0A] px-3 py-2 text-left text-[12px] text-[#0A0A0A] hover:bg-[#EAEAEA] hover:text-[#303030]"
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
