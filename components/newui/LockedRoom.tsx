import { PaperCube } from "@/components/newui/PaperCube";

export function LockedRoom() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-[920px] flex-col items-start justify-center px-5 py-24">
      <div className="h-40 w-40 opacity-40">
        <PaperCube still />
      </div>
      <h1 className="mt-10 text-[40px] leading-[1.1] md:text-[56px]">This room is closed.</h1>
      <a href="/newui/access" className="nu-tap nu-label mt-8 border-b nu-rule">
        request access
      </a>
    </section>
  );
}
