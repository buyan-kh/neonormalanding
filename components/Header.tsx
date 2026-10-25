const links = [
  { href: "#pipeline", label: "[01. PIPELINE]" },
  { href: "#failure-trace", label: "[02. FAILURE TRACE]" },
  { href: "#calibration", label: "[03. BENCHMARKS]" },
  { href: "#data-partners", label: "[04. DATA PARTNERS]" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#EFECE6]/70 bg-[#070707]/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full min-w-0 max-w-[1240px] flex-col gap-3 px-4 py-3 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <a href="#pipeline" className="flex min-w-0 flex-col gap-1">
          <span className="text-[16px] tracking-[0.18em]">Neo Norma</span>
          <span className="text-[10px] leading-relaxed text-[#9E9A90]">[SAN FRANCISCO, CA]</span>
        </a>
        <nav className="flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-[11px]" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-1.5 py-1 text-[#EFECE6] hover:bg-[#EFECE6] hover:text-[#070707]"
            >
              {link.label}
            </a>
          ))}
          <a href="#sample" className="bg-[#EFECE6] px-2 py-1 text-[#070707] hover:bg-white">
            [GET SAMPLE -&gt;]
          </a>
        </nav>
      </div>
    </header>
  );
}
