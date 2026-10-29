import { DitherHelix } from "@/components/newui/DitherHelix";

export function LockedRoom() {
  return (
    <section className="nu-page flex min-h-[70vh] w-full flex-col items-start justify-center py-24">
      <div className="h-40 w-40 opacity-40">
        <DitherHelix still />
      </div>
      <h1 className="mt-10 text-[40px] leading-[1.1] md:text-[56px]">This room is closed.</h1>
      <a href="/newui/access" className="nu-btn mt-8">
        Request access <span className="nu-arr" aria-hidden="true">→</span>
      </a>
    </section>
  );
}
