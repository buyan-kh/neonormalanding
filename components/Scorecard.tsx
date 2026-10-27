import { TerminalWindow } from "@/components/TerminalWindow";
import { benchmarkTasks } from "@/lib/catalog";

export function Scorecard() {
  return (
    <section id="calibration" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">02 // FRONTIER BENCHMARKS</p>
        <h2 className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[30px]">
          Frontier models pass textbook biology. They fail real workflows.
        </h2>
        <p className="mt-3 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Rewards on held-out scientific tasks. The reference solver scores 1.0000.
        </p>
        <div className="mt-6">
          <TerminalWindow title="Frontier Calibration" bodyClassName="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-[12px]">
              <caption className="sr-only">Frontier rewards, reference score, and token counts for public scientific tasks</caption>
              <thead>
                <tr className="border-b border-[#0A0A0A]/30 text-[#5A5852]">
                  <th className="px-3 py-2 font-normal" scope="col">
                    Task
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    Frontier 1
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    Frontier 2
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    Reference
                  </th>
                  <th className="px-3 py-2 font-normal" scope="col">
                    Tokens
                  </th>
                </tr>
              </thead>
              <tbody>
                {benchmarkTasks.map((task) => (
                  <tr key={task.id} className="border-b border-[#0A0A0A]/15 align-top hover:bg-[#0A0A0A]/4">
                    <th className="px-3 py-3 text-left font-normal" scope="row">
                      <a
                        href="#failure-trace"
                        className="underline decoration-[#0A0A0A]/40 underline-offset-4 hover:decoration-[#0A0A0A]"
                      >
                        {task.name}
                      </a>
                      <span className="mt-1 block text-[11px] font-normal text-[#5A5852]">{task.failure}</span>
                    </th>
                    <td className="px-3 py-3 whitespace-nowrap tabular-nums">{task.frontier[0]} (FAIL)</td>
                    <td className="px-3 py-3 whitespace-nowrap tabular-nums">{task.frontier[1]} (FAIL)</td>
                    <td className="px-3 py-3 whitespace-nowrap tabular-nums">{task.reference} (PASS)</td>
                    <td className="px-3 py-3 whitespace-nowrap tabular-nums">{task.tokens}</td>
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
