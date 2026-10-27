import { benchmarkModels, benchmarkTasks, referenceColor } from "@/lib/catalog";

const reference = Number(benchmarkTasks[0]?.reference ?? 1);

function meanReward(rewardIndex: 0 | 1) {
  const total = benchmarkTasks.reduce((sum, task) => sum + Number(task.frontier[rewardIndex]), 0);
  return total / benchmarkTasks.length;
}

function formatReward(value: number) {
  return value.toFixed(4);
}

function formatShare(value: number) {
  return `${((value / reference) * 100).toFixed(1)}%`;
}

function ModelSwatch({ color }: { color: string }) {
  return (
    <span aria-hidden="true" className="mr-2 inline-block size-[9px] shrink-0 align-baseline" style={{ backgroundColor: color }} />
  );
}

function ScoreTrack({ value, color }: { value: number; color: string }) {
  const width = `${Math.max(0, Math.min(1, value / reference)) * 100}%`;
  return (
    <div className="relative h-[9px] bg-[#0A0A0A]/[0.06]" aria-hidden="true">
      <div className="absolute inset-y-0 left-0" style={{ width, backgroundColor: color }} />
    </div>
  );
}

export function Scorecard() {
  const measured = benchmarkModels
    .flatMap((model) => {
      if (model.rewardIndex === undefined) return [];
      const mean = meanReward(model.rewardIndex);
      return [{ ...model, rewardIndex: model.rewardIndex, mean, gap: reference - mean }];
    })
    .sort((a, b) => b.mean - a.mean);
  const unmeasured = benchmarkModels.filter((model) => model.rewardIndex === undefined);
  const best = measured[0];

  const stats = [
    {
      label: "Best frontier mean",
      value: formatShare(best.mean),
      note: `${best.name} · ${formatReward(best.mean)} reward`,
      color: best.color,
    },
    {
      label: "Reference solver",
      value: formatReward(reference),
      note: "Baseline on every task",
    },
    {
      label: "Gap to baseline",
      value: formatReward(best.gap),
      note: "Reward the best frontier leaves behind",
    },
  ];

  return (
    <section id="calibration" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">02 // FRONTIER BENCHMARKS</p>
        <h2 className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[30px]">
          Frontier models pass textbook biology. They fail real workflows.
        </h2>
        <p className="mt-3 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Grader reward on four held-out tasks. Higher is better. The reference solver is the baseline at 1.0000.
        </p>

        <dl className="mt-6 grid border border-[#0A0A0A] sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-3 py-3 ${index < stats.length - 1 ? "border-b border-[#0A0A0A]/20 sm:border-r sm:border-b-0" : ""}`}
            >
              <dt className="text-[10px] tracking-[0.14em] text-[#5A5852]">{stat.label}</dt>
              <dd className="mt-2 text-[28px] leading-none tabular-nums">{stat.value}</dd>
              <dd className="mt-2 text-[11px] text-[#5A5852]">
                {stat.color ? <ModelSwatch color={stat.color} /> : null}
                {stat.note}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 border border-[#0A0A0A]">
          <div className="flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-3 py-2">
            <p className="text-[11px]">Mean grader reward · 4 tasks</p>
            <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">HIGHER IS BETTER</p>
          </div>
          <ol>
            <li className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-[#0A0A0A]/15 px-3 py-3">
              <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">BASELINE</p>
              <div>
                <p className="text-[13px]">
                  <ModelSwatch color={referenceColor} />
                  Reference solver
                </p>
                <div className="mt-2">
                  <ScoreTrack value={reference} color={referenceColor} />
                </div>
              </div>
              <div className="text-right">
                <p className="tabular-nums">{formatReward(reference)}</p>
                <p className="mt-1 text-[10px] text-[#5A5852]">baseline</p>
              </div>
            </li>
            {measured.map((model, rank) => (
              <li
                key={model.id}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-[#0A0A0A]/15 px-3 py-3 last:border-b-0"
              >
                <p className="text-[13px] tabular-nums">{rank + 1}</p>
                <div>
                  <p className="text-[13px]">
                    <ModelSwatch color={model.color} />
                    {model.name}
                  </p>
                  <div className="mt-2">
                    <ScoreTrack value={model.mean} color={model.color} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="tabular-nums">{formatReward(model.mean)}</p>
                  <p className="mt-1 text-[10px] text-[#5A5852] tabular-nums">{formatShare(model.mean)} of baseline</p>
                </div>
              </li>
            ))}
            {unmeasured.length > 0 ? (
              <li className="border-b border-[#0A0A0A]/15 px-3 py-2">
                <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">NOT MEASURED YET</p>
              </li>
            ) : null}
            {unmeasured.map((model) => (
              <li
                key={model.id}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-[#0A0A0A]/15 px-3 py-3 last:border-b-0"
              >
                <p className="text-[13px] text-[#5A5852]">—</p>
                <p className="text-[13px]">
                  <ModelSwatch color={model.color} />
                  {model.name}
                </p>
                <p className="text-right text-[11px] text-[#5A5852]">Not measured yet</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 border border-[#0A0A0A]">
          <div className="border-b border-[#0A0A0A] px-3 py-2">
            <p className="text-[11px]">By task</p>
          </div>
          <div className="hidden grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_5.5rem] gap-3 border-b border-[#0A0A0A]/20 px-3 py-2 text-[10px] tracking-[0.12em] text-[#5A5852] md:grid">
            <p>TASK</p>
            {measured.map((model) => (
              <p key={model.id}>
                <ModelSwatch color={model.color} />
                {model.name.toUpperCase()}
              </p>
            ))}
            <p>
              <ModelSwatch color={referenceColor} />
              REFERENCE
            </p>
            <p>TOKENS</p>
          </div>
          <ul>
            {benchmarkTasks.map((task) => {
              return (
                <li
                  key={task.id}
                  className="grid gap-3 border-b border-[#0A0A0A]/15 px-3 py-3 last:border-b-0 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_5.5rem] md:items-center"
                >
                  <p className="text-[13px]">
                    <a href="#failure-trace" className="underline decoration-[#0A0A0A]/40 underline-offset-4 hover:decoration-[#0A0A0A]">
                      {task.short}
                    </a>
                  </p>
                  {measured.map((model) => {
                    const score = Number(task.frontier[model.rewardIndex]);
                    return (
                      <div key={model.id}>
                        <p className="text-[10px] tracking-[0.12em] text-[#5A5852] md:hidden">
                          <ModelSwatch color={model.color} />
                          {model.name}
                        </p>
                        <p className="mt-1 tabular-nums md:mt-0">{formatReward(score)}</p>
                        <div className="mt-1">
                          <ScoreTrack value={score} color={model.color} />
                        </div>
                      </div>
                    );
                  })}
                  <div>
                    <p className="text-[10px] tracking-[0.12em] text-[#5A5852] md:hidden">
                      <ModelSwatch color={referenceColor} />
                      Reference
                    </p>
                    <p className="mt-1 tabular-nums md:mt-0">{formatReward(reference)}</p>
                    <div className="mt-1">
                      <ScoreTrack value={reference} color={referenceColor} />
                    </div>
                  </div>
                  <p className="text-[12px] text-[#5A5852] tabular-nums md:text-right">
                    <span className="mr-2 text-[10px] tracking-[0.12em] md:hidden">TOKENS</span>
                    {task.tokens}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-3 max-w-[72ch] text-[11px] leading-relaxed text-[#5A5852]">
          Means use the measured runs only. Reward is the deterministic grader, not an LLM judge.
        </p>
      </div>
    </section>
  );
}
