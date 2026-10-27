import { Logo } from "@/components/Logo";
import { CALENDLY_URL } from "@/lib/contact";

const links = [
  { href: "#pipeline", label: "[01. PIPELINE]" },
  { href: "#calibration", label: "[02. BENCHMARKS]" },
  { href: "#work", label: "[03. WORK WITH US]" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#0A0A0A]/20 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full min-w-0 max-w-[1080px] flex-col gap-3 px-4 py-3 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <a href="#pipeline" className="flex min-w-0 items-center gap-2">
          <Logo size={30} />
          <span className="flex flex-col gap-1">
            <span className="text-[16px] tracking-[0.18em]">Neo Norma</span>
            <span className="text-[10px] leading-relaxed text-[#5A5852]">[SAN FRANCISCO, CA]</span>
          </span>
        </a>
        <nav className="flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-[11px]" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-1.5 py-1 text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href={CALENDLY_URL}
            className="bg-[#0A0A0A] px-2 py-1 text-white hover:bg-[#262626]"
            target="_blank"
            rel="noreferrer"
          >
            [Book a Call]
          </a>
        </nav>
      </div>
    </header>
  );
}
