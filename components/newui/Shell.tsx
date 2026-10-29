import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b nu-rule bg-[#F6F4EF]/90 backdrop-blur-sm">
        <div className="nu-page flex w-full flex-wrap items-center justify-between gap-3 py-3">
          <a href="/newui" className="nu-tap gap-2 text-[22px] leading-none">
            <Logo size={22} />
            Neo Norma
          </a>
          <nav className="nu-label flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="New">
            <a className="nu-tap" href="/newui/thesis">thesis</a>
            <a className="nu-tap" href="/newui/contact">contact</a>
            <a className="nu-pill" href="/newui/access">access</a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t nu-rule">
        <p className="nu-label nu-page flex w-full flex-wrap gap-x-3 gap-y-2 py-8 text-[#0A0A0A]/70">
          <a className="nu-tap gap-2" href="/newui">
            <Logo size={20} />
            Neo Norma
          </a>
          <span aria-hidden="true">·</span>
          <a className="nu-tap" href="/newui/thesis">thesis</a>
          <span aria-hidden="true">·</span>
          <a className="nu-tap" href="/newui/contact">contact</a>
          <span aria-hidden="true">·</span>
          <a className="nu-tap" href="/newui/access">access</a>
          <span aria-hidden="true">·</span>
          <a className="nu-tap" href="/llms.txt">llms.txt</a>
          <span aria-hidden="true">·</span>
          <span className="nu-tap">© 2026</span>
        </p>
      </footer>
    </>
  );
}
