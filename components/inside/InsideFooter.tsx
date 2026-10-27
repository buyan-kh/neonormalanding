import { BUYAN_X, CALENDLY_URL, CONTACT_EMAIL, LABS_X, PUBLIC_SITE } from "@/components/inside/content";

const linkClass = "underline decoration-[#0A0A0A]/30 underline-offset-4 hover:decoration-[#0A0A0A]";

export function InsideFooter() {
  return (
    <footer className="border-t border-[#0A0A0A]/20">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-4 px-4 py-8 text-[12px] md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="text-[14px] tracking-[0.16em]">Neo Norma // INSIDE</p>
          <p className="mt-2 text-[#5A5852]">Internal desk // San Francisco, CA</p>
        </div>
        <nav className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4" aria-label="Desk links">
          <a href={PUBLIC_SITE} className={linkClass}>
            neonorma.si
          </a>
          <a href={CALENDLY_URL} className={linkClass} target="_blank" rel="noreferrer">
            calendly.com/buyan-neonorma/30min
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>
          <a href={LABS_X} className={linkClass} target="_blank" rel="noreferrer">
            X @neonorma_labs
          </a>
          <a href={BUYAN_X} className={linkClass} target="_blank" rel="noreferrer">
            X @buyan_kh
          </a>
        </nav>
      </div>
    </footer>
  );
}
