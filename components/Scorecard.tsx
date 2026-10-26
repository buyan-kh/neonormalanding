import { TerminalWindow } from "@/components/TerminalWindow";
import { scoreRows } from "@/lib/catalog";

function Meter({ value }: { value: string }) {
  const match = value.match(/(\d+)%/);
  if (!match) return <span>{value}</span>;
  const filled = Math.round(Number(match[1]) / 20);
  return (
    <span className="inline-flex items-center justify-end gap-2">
      <span className="tabular-nums">{value}</span>
      <span aria-hidden="true" className="inline-flex gap-px">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={`h-2 w-1.5 ${index < filled ? "bg-[#0A0A0A]" : "bg-[#0A0A0A]/20"}`} />
        ))}
      </span>
    </span>
  );
}

export function Scorecard() {
  return (
    <section id="calibration" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">02 // FRONTIER BENCHMARKS</p>
        <h2 className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[30px]">
          Frontier models pass textbook biology. They fail real workflows.
        </h2>
        <p className="mt-3 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Verified fail rates across frontier models using our deterministic &lt;50ms Python graders (grade.py).
        </p>
        <div className="mt-6">
          <TerminalWindow title="Frontier Calibration" bodyClassName="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-[12px]">
              <caption className="sr-only">
                Frontier model fail rates, average tokens, and shortcut caps
              </caption>
              <thead>
                <tr className="border-b border-[#0A0A0A]/30 text-[#5A5852]">
                  <th className="px-3 py-2 font-normal" scope="col">
                    Task
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    gpt-6-luna
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    gpt-6.1-sol
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    gpt-6-astra
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    avg tokens
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    shortcuts
                  </th>
                </tr>
              </thead>
              <tbody>
                {scoreRows.map((row) => (
                  <tr key={row.id} className="border-b border-[#0A0A0A]/15 hover:bg-[#0A0A0A]/4">
                    <th className="px-3 py-3 text-left align-top font-normal" scope="row">
                      {row.id}
                      <span className="mt-1 block text-[11px] font-normal text-[#5A5852]">{row.name}</span>
                    </th>
                    <td className="px-3 py-3 align-top">
                      <Meter value={row.luna} />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <Meter value={row.sol} />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <Meter value={row.astra} />
                    </td>
                    <td className="px-3 py-3 align-top tabular-nums">{row.tokens}</td>
                    <td className="px-3 py-3 align-top">{row.shortcuts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
