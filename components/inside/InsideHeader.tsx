import { Logo } from "@/components/Logo";
import { navLinks } from "@/components/inside/content";

export function InsideHeader({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#0A0A0A]/20 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full min-w-0 max-w-[1080px] flex-col gap-3 px-4 py-3 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("top");
          }}
          className="flex min-w-0 items-center gap-2"
        >
          <Logo size={30} />
          <span className="flex flex-col gap-1">
            <span className="text-[16px] tracking-[0.18em]">Neo Norma // INSIDE</span>
            <span className="text-[10px] leading-relaxed text-[#5A5852]">[SAN FRANCISCO, CA]</span>
          </span>
        </a>
        <div className="flex max-w-full flex-wrap items-center justify-end gap-x-2 gap-y-2">
          <nav className="flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-[11px]" aria-label="Inside sections">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(link.id);
                }}
                className="px-1.5 py-1 text-[#0A0A0A] hover:bg-[#EAEAEA] hover:text-[#303030]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <form method="post" action="/api/inside-auth">
            <input type="hidden" name="intent" value="lock" />
            <button
              type="submit"
              className="bg-[#D9D9D9] px-2 py-1 text-[11px] text-[#303030] hover:bg-[#C9C9C9]"
            >
              [Lock / Sign out]
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
