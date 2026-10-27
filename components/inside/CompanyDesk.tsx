import { TerminalWindow } from "@/components/TerminalWindow";
import {
  BEN_EMAIL,
  CALENDLY_URL,
  CONTACT_EMAIL,
  LABS_X,
  PUBLIC_SITE,
  companyStats,
  documents,
  domains,
  leaders,
} from "@/components/inside/content";

const linkClass = "underline decoration-[#0A0A0A]/30 underline-offset-4 hover:decoration-[#0A0A0A]";

export function CompanyDesk({ onShowSales }: { onShowSales: () => void }) {
  return (
    <section className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">04 // DEAL REGISTRATION & COMPANY OPERATING HUB</p>
        <h2 className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[26px]">Company operating snapshot.</h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          241 verified tasks across 6 science and clinical domains. Direct packs are the cash business. Data partners
          are the 50/50 business.
        </p>

        <dl className="mt-6 grid border border-[#0A0A0A] sm:grid-cols-2 lg:grid-cols-4">
          {companyStats.map((stat, index) => (
            <div
              key={stat.label}
              className={[
                "px-3 py-3",
                index < companyStats.length - 1 ? "border-b border-[#0A0A0A]" : "",
                index % 2 === 0 ? "sm:border-r" : "",
                index < 2 ? "" : "sm:border-b-0",
                index < 3 ? "lg:border-r" : "lg:border-r-0",
                "lg:border-b-0",
              ].join(" ")}
            >
              <dt className="text-[12px] text-[#5A5852]">{stat.label}</dt>
              <dd className="mt-2 font-mono text-[22px] leading-none tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 border border-dashed border-[#0A0A0A] px-3 py-3">
          <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">6 SCIENCE AND CLINICAL DOMAINS</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {domains.map((domain, index) => (
              <li key={domain} className="text-[12px]">
                <span className="font-mono text-[11px] text-[#5A5852]">{String(index + 1).padStart(2, "0")}</span>{" "}
                {domain}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <TerminalWindow title="Ready-to-send deal documents" wrapTitle className="h-full" bodyClassName="p-3">
            <p className="text-[12px] leading-relaxed text-[#5A5852]">
              Ask Buyan for the latest file before you send it. These are the names to request.
            </p>
            <ul className="mt-3">
              {documents.map((doc) => (
                <li key={doc.file} className="border-b border-dashed border-[#0A0A0A]/30 py-2 last:border-b-0">
                  <p className="text-[12px]">{doc.name}</p>
                  <p className="mt-1 font-mono text-[11px] text-[#5A5852]">{doc.file}</p>
                </li>
              ))}
            </ul>
          </TerminalWindow>

          <TerminalWindow title="Leadership and direct desk" wrapTitle className="h-full" bodyClassName="p-3">
            <ul className="space-y-4">
              {leaders.map((leader) => (
                <li key={leader.name}>
                  <p className="text-[14px]">{leader.name}</p>
                  <p className="mt-1 text-[12px] text-[#5A5852]">{leader.role}</p>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
                    {leader.lines.map((line) => (
                      <a key={line.label} href={line.href} className={linkClass} target={line.href.startsWith("http") ? "_blank" : undefined} rel={line.href.startsWith("http") ? "noreferrer" : undefined}>
                        {line.label}
                      </a>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 border border-dashed border-[#0A0A0A] px-2 py-2 text-[12px] leading-relaxed">
              <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">OFFICIAL LINKS</p>
              <p className="mt-2 flex flex-col gap-1">
                <a href={PUBLIC_SITE} className={linkClass}>
                  neonorma.si
                </a>
                <a href={CALENDLY_URL} className={linkClass} target="_blank" rel="noreferrer">
                  calendly.com/buyan-neonorma/30min
                </a>
                <a href={LABS_X} className={linkClass} target="_blank" rel="noreferrer">
                  X @neonorma_labs
                </a>
              </p>
              <p className="mt-2 text-[#5A5852]">
                Desk: {CONTACT_EMAIL} and {BEN_EMAIL}
              </p>
            </div>
          </TerminalWindow>
        </div>

        <button
          type="button"
          onClick={onShowSales}
          className="mt-6 border border-[#0A0A0A] px-3 py-2 text-[12px] text-[#0A0A0A] hover:bg-[#EAEAEA] hover:text-[#303030]"
        >
          [Open BD & Sales Playbook]
        </button>
      </div>
    </section>
  );
}
