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
          <span key={index} className={`h-2 w-1.5 ${index < filled ? "bg-[#EFECE6]" : "bg-[#EFECE6]/20"}`} />
        ))}
      </span>
    </span>
  );
}

export function Scorecard() {
  return (
    <section id="calibration" className="scroll-mt-32 border-t border-[#EFECE6]/30">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#9E9A90]">03 // LIVE FRONTIER MODEL CALIBRATION</p>
        <h2 className="mt-3 max-w-[20em] text-[24px] leading-snug md:text-[30px]">
          Verified runs across gpt-6-luna, gpt-6.1-sol, and gpt-6-astra.
        </h2>
        <p className="mt-3 text-[12px] text-[#9E9A90]">Reasoning effort: xhigh. Linked rows open the trace inspector.</p>
        <div className="mt-6">
          <TerminalWindow title="Frontier Calibration // xhigh" bodyClassName="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-[12px]">
              <caption className="sr-only">
                Frontier model fail rates, average tokens, and shortcut caps
              </caption>
              <thead>
                <tr className="border-b border-[#EFECE6]/50 text-[#9E9A90]">
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
                  <tr key={row.id} className="border-b border-dashed border-[#EFECE6]/30 hover:bg-[#EFECE6]/5">
                    <th className="px-3 py-3 text-left align-top font-normal" scope="row">
                      {row.linked ? (
                        <a href={`#${row.id}`} className="underline decoration-[#EFECE6]/40 underline-offset-4 hover:decoration-[#EFECE6]">
                          {row.id}
                        </a>
                      ) : (
                        row.id
                      )}
                      <span className="mt-1 block text-[11px] font-normal text-[#9E9A90]">{row.name}</span>
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
        <p className="mt-3 text-[11px] text-[#9E9A90]">
          ehr01_longitudinal reports the reference solver at 1.0000 against 5 greedy shortcuts from 0.24 to 0.41.
          Cells marked ... were not part of that reported run.
        </p>
      </div>
    </section>
  );
}
