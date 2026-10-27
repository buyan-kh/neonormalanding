"use client";

import { useEffect, useRef, useState } from "react";
import { benchmarkModels, benchmarkTasks, isMeasured } from "@/lib/catalog";
import { firstMiss, traceFor } from "@/lib/traces";

const VB_W = 1000;
const VB_H = 480;
const PAD = { l: 58, r: 125, t: 28, b: 54 };
const Y_MAX = Math.max(10, Math.ceil(Math.max(...benchmarkTasks.flatMap((task) => task.frontier.map((value) => Number(value) * 100))) / 10) * 10);
const Y_TICKS = Array.from({ length: Y_MAX / 10 + 1 }, (_, index) => index * 10);
const TOKEN_MIN = 30000;
const TOKEN_MAX = 90000;

type Scale = "log" | "linear";
type Shape = "square" | "diamond";

type Point = {
  key: string;
  taskId: string;
  modelId: string;
  name: string;
  short: string;
  color: string;
  shape: Shape;
  reward: number;
  score: number;
  tokens: number;
  x: number;
  y: number;
  title: string;
  axis: string;
  miss: string;
  seriesIndex: number;
};

const measured = benchmarkModels.filter(isMeasured);
const shapes: Shape[] = ["square", "diamond"];
const seriesColors = ["#10A37F", "#14532D"];

function seriesColor(index: number, fallback: string) {
  return seriesColors[index] ?? fallback;
}

function yOf(score: number) {
  const plotH = VB_H - PAD.t - PAD.b;
  const t = Math.min(1, Math.max(0, score / Y_MAX));
  return PAD.t + (1 - t) * plotH;
}

function tokenT(tokens: number, linearWeight: number) {
  const log = (Math.log10(tokens) - Math.log10(TOKEN_MIN)) / (Math.log10(TOKEN_MAX) - Math.log10(TOKEN_MIN));
  const linear = (tokens - TOKEN_MIN) / (TOKEN_MAX - TOKEN_MIN);
  return log + (linear - log) * linearWeight;
}

function layout(linearWeight: number): Point[] {
  const plotW = VB_W - PAD.l - PAD.r;
  return benchmarkTasks.flatMap((task) => {
    const trace = traceFor(task.id);
    return measured.map((model, seriesIndex) => {
      const reward = Number(task.frontier[model.rewardIndex]);
      const score = reward * 100;
      const tokens = task.reasoningTokens[model.rewardIndex];
      const center = PAD.l + tokenT(tokens, linearWeight) * plotW;
      const miss = firstMiss(task.id, model.id);
      return {
        key: `${task.id}:${model.id}`,
        taskId: task.id,
        modelId: model.id,
        name: model.name,
        short: model.name,
        color: seriesColor(seriesIndex, model.color),
        shape: shapes[seriesIndex % shapes.length],
        reward,
        score,
        tokens,
        x: center,
        y: yOf(score),
        title: trace.title,
        axis: trace.axis,
        miss: miss ? miss.label : "Passed the named checks",
        seriesIndex,
      };
    });
  });
}

function formatTokens(tokens: number) {
  return `${Math.round(tokens / 1000)}k`;
}

function formatApproxTokens(tokens: number) {
  return `~${tokens.toLocaleString("en-US")}`;
}

function Marker({ x, y, shape, color }: { x: number; y: number; shape: Shape; color: string }) {
  if (shape === "diamond") {
    return <polygon points={`${x},${y - 4.5} ${x + 4.5},${y} ${x},${y + 4.5} ${x - 4.5},${y}`} fill={color} />;
  }
  return <rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill={color} />;
}

function Ring({ x, y, shape }: { x: number; y: number; shape: Shape }) {
  if (shape === "diamond") {
    return (
      <polygon points={`${x},${y - 8} ${x + 8},${y} ${x},${y + 8} ${x - 8},${y}`} fill="none" stroke="#0A0A0A" strokeWidth="1" />
    );
  }
  return <rect x={x - 6.5} y={y - 6.5} width={13} height={13} fill="none" stroke="#0A0A0A" strokeWidth="1" />;
}

function LegendMarker({ shape, color }: { shape: Shape; color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="mr-2 inline-block align-[-1px]">
      {shape === "diamond" ? <polygon points="6,1 11,6 6,11 1,6" fill={color} /> : <rect x="1.5" y="1.5" width="9" height="9" fill={color} />}
    </svg>
  );
}

function Toggle({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`px-2 py-1 text-[13px] ${pressed ? "bg-[#0A0A0A] text-white" : "text-[#0A0A0A] hover:bg-[#0A0A0A]/5"}`}
    >
      {label}
    </button>
  );
}

export function RewardChart({
  taskId,
  modelId,
  onPick,
}: {
  taskId: string;
  modelId: string;
  onPick: (taskId: string, modelId: string) => void;
}) {
  const [scale, setScale] = useState<Scale>("log");
  const [linearWeight, setLinearWeight] = useState(0);
  const weightRef = useRef(0);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [visibleModels, setVisibleModels] = useState(() => new Set(measured.map((model) => model.id)));
  useEffect(() => {
    const target = scale === "linear" ? 1 : 0;
    const start = weightRef.current;
    if (start === target) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let startTime: number | null = null;
    function animate(time: number) {
      if (startTime === null) startTime = time;
      const progress = reduceMotion ? 1 : Math.min((time - startTime) / 450, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (target - start) * eased;
      weightRef.current = value;
      setLinearWeight(value);
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    }
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [scale]);

  const points = layout(linearWeight).filter((point) => visibleModels.has(point.modelId));
  const lastPointByModel = new Map<string, Point>();
  for (const point of points) {
    const last = lastPointByModel.get(point.modelId);
    if (!last || point.x > last.x) lastPointByModel.set(point.modelId, point);
  }
  const hover = points.find((point) => point.key === hoverKey) ?? null;
  const plotW = VB_W - PAD.l - PAD.r;
  const plotRight = VB_W - PAD.r;
  const axisY = yOf(0);
  const xTicks = [30000, 40000, 50000, 60000, 70000, 80000, 90000];

  return (
    <div className="border border-[#0A0A0A]/10">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-2 text-[13px] font-medium">Frontier evaluation · estimated scores</p>
          <p className="bg-[#0A0A0A]/[0.04] px-2 py-1 text-[13px]">Score (%)</p>
          <p className="text-[13px] text-[#5A5852]">vs</p>
          <p className="bg-[#0A0A0A]/[0.04] px-2 py-1 text-[13px]">Reasoning tokens</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[13px] tracking-[0.14em] text-[#5A5852]">SCALE</p>
          <div className="flex bg-[#0A0A0A]/[0.04]" role="group" aria-label="Reasoning token scale">
            <Toggle label="Log" pressed={scale === "log"} onClick={() => setScale("log")} />
            <Toggle label="Linear" pressed={scale === "linear"} onClick={() => setScale("linear")} />
          </div>
        </div>
      </div>

      <div className="px-2 pt-3">
        <div className="relative" onMouseLeave={() => setHoverKey(null)}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="block h-auto w-full" aria-hidden="true">
            {Y_TICKS.map((tick) => (
              <g key={tick}>
                <line x1={PAD.l} x2={plotRight} y1={yOf(tick)} y2={yOf(tick)} stroke="#0A0A0A" strokeOpacity="0.05" />
                <text x={PAD.l - 10} y={yOf(tick) + 4} textAnchor="end" fill="#5A5852" fontSize="11" fontFamily="inherit">
                  {tick}
                </text>
              </g>
            ))}
            {xTicks.map((tick) => {
              const x = PAD.l + tokenT(tick, linearWeight) * plotW;
              return <line key={tick} x1={x} x2={x} y1={PAD.t} y2={axisY} stroke="#0A0A0A" strokeOpacity="0.06" />;
            })}
            <line x1={PAD.l} x2={plotRight} y1={axisY} y2={axisY} stroke="#0A0A0A" strokeOpacity="0.12" />
            <text
              x="34"
              y={(PAD.t + axisY) / 2}
              textAnchor="middle"
              fill="#5A5852"
              fontSize="11"
              fontFamily="inherit"
              transform={`rotate(-90 34 ${(PAD.t + axisY) / 2})`}
            >
              Score (%)
            </text>
            {measured.filter((model) => visibleModels.has(model.id)).map((model) => {
              const series = points.filter((point) => point.modelId === model.id).sort((a, b) => a.x - b.x);
              const d = series.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
              return <path key={model.id} d={d} fill="none" stroke={series[0]?.color ?? model.color} strokeWidth="1.2" />;
            })}
            {points.map((point) => (
              <g key={point.key}>
                {point.taskId === taskId && point.modelId === modelId ? <Ring x={point.x} y={point.y} shape={point.shape} /> : null}
                <Marker x={point.x} y={point.y} shape={point.shape} color={point.color} />
                {lastPointByModel.get(point.modelId)?.key === point.key ? <text
                  x={point.x + 9}
                  y={point.y - 8}
                  textAnchor="start"
                  fill={point.color}
                  fontSize="10"
                  fontFamily="inherit"
                >
                  {point.short}
                </text> : null}
              </g>
            ))}
            {xTicks.map((tick) => (
              <text
                key={tick}
                x={PAD.l + tokenT(tick, linearWeight) * plotW}
                y={axisY + 22}
                textAnchor="middle"
                fill="#5A5852"
                fontSize="11"
                fontFamily="inherit"
              >
                {formatTokens(tick)}
              </text>
            ))}
            <text x={(PAD.l + plotRight) / 2} y={VB_H - 14} textAnchor="middle" fill="#5A5852" fontSize="11" fontFamily="inherit">
              Reasoning tokens
            </text>
          </svg>

          {points.map((point) => {
            const selected = point.taskId === taskId && point.modelId === modelId;
            return (
              <button
                key={point.key}
                type="button"
                aria-label={`${point.name}, ${point.title}, estimated score ${point.score.toFixed(1)} percent, ${formatApproxTokens(point.tokens)} reasoning tokens. ${point.miss}`}
                aria-pressed={selected}
                onClick={() => {
                  setHoverKey(null);
                  onPick(point.taskId, point.modelId);
                }}
                onMouseEnter={() => setHoverKey(point.key)}
                onFocus={() => setHoverKey(point.key)}
                onBlur={() => setHoverKey((current) => (current === point.key ? null : current))}
                className="absolute z-10 size-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${(point.x / VB_W) * 100}%`, top: `${(point.y / VB_H) * 100}%` }}
              />
            );
          })}

          {hover ? (
            <div
              className="pointer-events-none absolute z-20 w-max max-w-[190px] rounded-[5px] bg-white px-2 py-1.5 text-[10px] leading-[1.4] shadow-[0_2px_10px_rgba(0,0,0,0.14)]"
              style={{
                left: `${(hover.x / VB_W) * 100}%`,
                top: `${(hover.y / VB_H) * 100}%`,
                transform: `translate(${hover.x > VB_W * 0.75 ? "calc(-100% - 10px)" : "10px"}, ${hover.y > VB_H * 0.75 ? "calc(-100% - 8px)" : "8px"})`,
              }}
            >
              <p className="mb-0.5 font-medium" style={{ color: hover.color }}>{hover.title}</p>
              <p className="tabular-nums"><span className="text-[#999]">Score: </span><span className="font-medium text-[#111]">{hover.score.toFixed(1)}%</span></p>
              <p className="tabular-nums"><span className="text-[#999]">Reasoning tokens: </span><span className="font-medium text-[#111]">{formatApproxTokens(hover.tokens)}</span></p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#0A0A0A]/[0.06] px-5 py-3 text-[13px]">
        {measured.map((model, index) => (
          <label key={model.id} className="inline-flex cursor-pointer items-center gap-1.5">
            <span className="relative inline-flex size-3.5 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              checked={visibleModels.has(model.id)}
              onChange={(event) => {
                const checked = event.target.checked;
                setVisibleModels((current) => {
                  const next = new Set(current);
                  if (checked) next.add(model.id);
                  else next.delete(model.id);
                  return next;
                });
              }}
              className="peer size-3.5 cursor-pointer appearance-none rounded-[2px] border border-[#8C8982] bg-transparent checked:border-[#0A0A0A] checked:bg-[#0A0A0A]"
            />
            <svg aria-hidden="true" viewBox="0 0 12 12" className="pointer-events-none absolute size-2.5 text-white opacity-0 peer-checked:opacity-100">
              <path d="M2.5 6 5 8.5 9.5 3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            </span>
            <LegendMarker shape={shapes[index % shapes.length]} color={seriesColor(index, model.color)} />
            {model.name}
          </label>
        ))}
        <p className="text-[#5A5852]">Each line connects one model across four tasks.</p>
      </div>
    </div>
  );
}
