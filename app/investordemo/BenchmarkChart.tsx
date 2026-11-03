"use client";

import { useState } from "react";
import { benchmarkModels, benchmarkTasks } from "@/lib/catalog";

const featured = ["sol", "astra", "opus", "fable"];
const chartColors: Record<string, string> = { sol: "#10a37f", astra: "#5b75b5", opus: "#c97756", fable: "#a676a7", kimi: "#7c3aed", wonder: "#0064e0", argon: "#c29239", grok: "#292929", deepseek: "#4d6bfe" };
const positions = [92, 298, 504, 710];
const scoreY = (score: number) => 282 - score * 230;

export function BenchmarkChart() {
  const [visible, setVisible] = useState<string[]>(featured);
  const [active, setActive] = useState<{ model: string; task: number } | null>(null);
  function toggle(id: string) {
    setVisible((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  return (
    <div className="bench-console">
      <div className="bench-top"><div><span className="bench-kicker"><i /> FRONTIER EVALUATION / 04 ENVIRONMENTS</span><h3>Model reward by task</h3></div><div className="bench-reference"><span>KNOWN-CORRECT REFERENCE</span><strong>1.0000</strong></div></div>
      <div className="bench-legend" aria-label="Toggle models on the chart">{benchmarkModels.map((model) => <button type="button" key={model.id} onClick={() => toggle(model.id)} aria-pressed={visible.includes(model.id)} style={{ "--series-color": chartColors[model.id] } as React.CSSProperties}><span />{model.name}</button>)}</div>
      <div className="bench-chart-scroll"><svg className="bench-chart" viewBox="0 0 760 345" role="img" aria-label="Illustrative estimated reward by model across four scientific environments, with a reference reward of 1.0">
        {[0, .25, .5, .75, 1].map((value) => <g key={value}><line x1="75" x2="725" y1={scoreY(value)} y2={scoreY(value)} className={value === 1 ? "bench-reference-line" : "bench-gridline"} /><text x="60" y={scoreY(value) + 4} textAnchor="end" className="bench-axis">{value.toFixed(2)}</text></g>)}
        {positions.map((x, i) => <g key={x}><line x1={x} x2={x} y1="52" y2="282" className="bench-vertical" /><text x={x} y="309" textAnchor="middle" className="bench-axis">0{i + 1} / {benchmarkTasks[i].short.toUpperCase()}</text></g>)}
        {benchmarkModels.filter((model) => visible.includes(model.id)).map((model) => { const color = chartColors[model.id]; const points = benchmarkTasks.map((task, i) => `${positions[i]},${scoreY(Number(task.frontier[model.rewardIndex]))}`).join(" "); return <g key={model.id} className="bench-series"><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />{benchmarkTasks.map((task, i) => { const selected = active?.model === model.id && active.task === i; return <g key={task.id} onMouseEnter={() => setActive({model: model.id, task: i})} onMouseLeave={() => setActive(null)} onFocus={() => setActive({model: model.id, task: i})} onBlur={() => setActive(null)} tabIndex={0} role="img" aria-label={`${model.name}, ${task.short}, illustrative reward ${task.frontier[model.rewardIndex]}`}><circle cx={positions[i]} cy={scoreY(Number(task.frontier[model.rewardIndex]))} r="12" fill="transparent" /><circle cx={positions[i]} cy={scoreY(Number(task.frontier[model.rewardIndex]))} r={selected ? 6 : 4} fill={color} stroke="#f6f4ef" strokeWidth="2" />{selected && <g><rect x={Math.min(positions[i] + 9, 606)} y={scoreY(Number(task.frontier[model.rewardIndex])) - 38} width="112" height="28" fill="#111" /><text x={Math.min(positions[i] + 17, 614)} y={scoreY(Number(task.frontier[model.rewardIndex])) - 20} fill="#fff" className="bench-tooltip">{model.name}: {task.frontier[model.rewardIndex]}</text></g>}</g>})}</g>})}
      </svg></div>
      <div className="bench-bottom"><span>REWARD ↑ &nbsp; / &nbsp; SELECT MODELS TO COMPARE</span><span>ILLUSTRATIVE ESTIMATES</span></div>
    </div>
  );
}
