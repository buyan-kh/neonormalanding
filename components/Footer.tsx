import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/contact";

const linkClass = "underline decoration-[#0A0A0A]/30 underline-offset-4 hover:decoration-[#0A0A0A]";

export function Footer() {
  return (
    <footer className="border-t border-[#0A0A0A]/20">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-4 px-4 py-8 text-[12px] md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="text-[14px] tracking-[0.16em]">Neo Norma</p>
          <p className="mt-2 text-[#5A5852]">Neo Norma // San Francisco, CA</p>
        </div>
        <nav className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4" aria-label="Contact">
          <a href={CALENDLY_URL} className={linkClass} target="_blank" rel="noreferrer">
            Book 30-Min Pilot / Partner Call
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            Direct Desk {CONTACT_EMAIL}
          </a>
          <a href="https://x.com/buyan_kh" className={linkClass} target="_blank" rel="noreferrer">
            X @buyan_kh
          </a>
          <a href="https://www.linkedin.com/in/buyankh" className={linkClass} target="_blank" rel="noreferrer">
            linkedin.com/in/buyankh
          </a>
          <a href="/llms.txt" className={linkClass}>
            [llms.txt]
          </a>
          <a href="/for-agents.md" className={linkClass}>
            [for-agents.md]
          </a>
        </nav>
      </div>
    </footer>
  );
}
