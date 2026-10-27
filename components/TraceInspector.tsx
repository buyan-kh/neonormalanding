import { TerminalWindow } from "@/components/TerminalWindow";
import { benchmarkModels, benchmarkTasks } from "@/lib/catalog";

export function TraceInspector() {
  return (
    <section id="failure-trace" className="scroll-mt-32 border-t border-[#0A0A0A]/20" aria-labelledby="trace-heading">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#525252]">FAILURE TRACE</p>
        <h2 id="trace-heading" className="mt-3 max-w-[20em] text-[24px] leading-snug md:text-[30px]">
          Models print success. The biology fails.
        </h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#525252]">
          Frontier rewards on held-out records. The reference solver is the pass line at 1.0000.
        </p>
        <div id="trace" className="mt-6 scroll-mt-32">
          <TerminalWindow title="Held-out scientific tasks" bodyClassName="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-[12px]">
              <caption className="sr-only">
                Public scientific tasks, held-out records, token counts, frontier rewards, and the reference solver
              </caption>
              <thead>
                <tr className="border-b border-[#0A0A0A]/30 text-[#5A5852]">
                  <th className="px-3 py-2 font-normal" scope="col">
                    Task
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    Records
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    Tokens
                  </th>
                  {benchmarkModels.map((model) => (
                    <th key={model.id} className="px-3 py-2 font-normal" scope="col">
                      {model.name}
                    </th>
                  ))}
                  <th className="px-3 py-2 font-normal" scope="col">
                    Reference
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    Where it breaks
                  </th>
                </tr>
              </thead>
              <tbody>
                {benchmarkTasks.map((task) => (
                  <tr key={task.id} className="border-b border-[#0A0A0A]/15 align-top">
                    <th className="px-3 py-3 text-left font-normal" scope="row">
                      {task.name}
                    </th>
                    <td className="px-3 py-3 text-[#525252]">{task.records}</td>
                    <td className="px-3 py-3 whitespace-nowrap tabular-nums">{task.tokens}</td>
                    <td className="px-3 py-3 whitespace-nowrap tabular-nums">{task.frontier[0]} (FAIL)</td>
                    <td className="px-3 py-3 whitespace-nowrap tabular-nums">{task.frontier[1]} (FAIL)</td>
                    <td className="px-3 py-3 whitespace-nowrap tabular-nums">{task.reference} (PASS)</td>
                    <td className="px-3 py-3 text-[#525252]">{task.failure}</td>
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
