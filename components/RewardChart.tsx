"use client";

import { useState } from "react";
import { benchmarkModels, benchmarkTasks, isMeasured } from "@/lib/catalog";
import { firstMiss, traceFor } from "@/lib/traces";

const VB_W = 760;
const VB_H = 440;
const PAD = { l: 104, r: 36, t: 28, b: 58 };
const Y_MAX = 40;
const Y_TICKS = [0, 10, 20, 30, 40];
const TOKEN_MIN = 36000;
const TOKEN_MAX = 56000;

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

function tokenT(tokens: number, scale: Scale) {
  if (scale === "log") {
    return (Math.log10(tokens) - Math.log10(TOKEN_MIN)) / (Math.log10(TOKEN_MAX) - Math.log10(TOKEN_MIN));
  }
  return (tokens - TOKEN_MIN) / (TOKEN_MAX - TOKEN_MIN);
}

function shortName(name: string) {
  const parts = name.split(" ");
  return parts[parts.length - 1] ?? name;
}

function layout(scale: Scale): Point[] {
  const plotW = VB_W - PAD.l - PAD.r;
  return benchmarkTasks.flatMap((task) => {
    const trace = traceFor(task.id);
    return measured.map((model, seriesIndex) => {
      const reward = Number(task.frontier[model.rewardIndex]);
      const score = reward * 100;
      const center = PAD.l + tokenT(task.tokenCount, scale) * plotW;
      const offset = (seriesIndex - (measured.length - 1) / 2) * 12;
      const miss = firstMiss(task.id, model.id);
      return {
        key: `${task.id}:${model.id}`,
        taskId: task.id,
        modelId: model.id,
        name: model.name,
        short: shortName(model.name),
        color: seriesColor(seriesIndex, model.color),
        shape: shapes[seriesIndex % shapes.length],
        reward,
        score,
        tokens: task.tokenCount,
        x: center + offset,
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
      className={`px-2 py-1 text-[11px] ${pressed ? "bg-[#0A0A0A] text-white" : "text-[#0A0A0A] hover:bg-[#0A0A0A]/5"}`}
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
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const points = layout(scale);
  const hover = points.find((point) => point.key === hoverKey) ?? null;
  const plotW = VB_W - PAD.l - PAD.r;
  const plotRight = VB_W - PAD.r;
  const axisY = yOf(0);
  const xTicks = scale === "log" ? [36000, 46000, 56000] : [36000, 44000, 52000];

  return (
    <div className="border border-[#0A0A0A]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0A0A0A] px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px]">Score (%)</p>
          <p className="text-[11px] text-[#5A5852]">vs</p>
          <p className="text-[13px]">Reasoning tokens</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">SCALE</p>
          <div className="flex border border-[#0A0A0A]" role="group" aria-label="Reasoning token scale">
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
                <line x1={PAD.l} x2={plotRight} y1={yOf(tick)} y2={yOf(tick)} stroke="#0A0A0A" strokeOpacity="0.12" />
                <text x={PAD.l - 10} y={yOf(tick) + 4} textAnchor="end" fill="#5A5852" fontSize="11" fontFamily="inherit">
                  {tick}
                </text>
              </g>
            ))}
            {xTicks.map((tick) => {
              const x = PAD.l + tokenT(tick, scale) * plotW;
              return <line key={tick} x1={x} x2={x} y1={PAD.t} y2={axisY} stroke="#0A0A0A" strokeOpacity="0.06" />;
            })}
            <line x1={PAD.l} x2={plotRight} y1={axisY} y2={axisY} stroke="#0A0A0A" strokeOpacity="0.45" />
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
            {measured.map((model) => {
              const series = points.filter((point) => point.modelId === model.id).sort((a, b) => a.x - b.x);
              const d = series.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
              return <path key={model.id} d={d} fill="none" stroke={series[0]?.color ?? model.color} strokeWidth="1.5" />;
            })}
            {points.map((point) => (
              <g key={point.key}>
                {point.taskId === taskId && point.modelId === modelId ? <Ring x={point.x} y={point.y} shape={point.shape} /> : null}
                <Marker x={point.x} y={point.y} shape={point.shape} color={point.color} />
                <text
                  x={point.seriesIndex === 0 ? point.x - 9 : point.x + 9}
                  y={point.y - 8}
                  textAnchor={point.seriesIndex === 0 ? "end" : "start"}
                  fill={point.color}
                  fontSize="11"
                  fontFamily="inherit"
                >
                  {point.short}
                </text>
              </g>
            ))}
            {xTicks.map((tick) => (
              <text
                key={tick}
                x={PAD.l + tokenT(tick, scale) * plotW}
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
                aria-label={`${point.name}, ${point.title}, score ${point.score.toFixed(1)} percent, ${formatTokens(point.tokens)} reasoning tokens. ${point.miss}`}
                aria-pressed={selected}
                onClick={() => {
                  setHoverKey(null);
                  onPick(point.taskId, point.modelId);
                }}
                onMouseEnter={() => setHoverKey(point.key)}
                onFocus={() => setHoverKey(point.key)}
                onBlur={() => setHoverKey((current) => (current === point.key ? null : current))}
                className="absolute size-8 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(point.x / VB_W) * 100}%`, top: `${(point.y / VB_H) * 100}%` }}
              />
            );
          })}

          {hover ? (
            <div
              className="pointer-events-none absolute z-10 w-max max-w-[240px] border border-[#0A0A0A] bg-white px-2 py-1.5 text-[11px] leading-relaxed"
              style={{
                left: `${(hover.x / VB_W) * 100}%`,
                top: `${(hover.y / VB_H) * 100}%`,
                transform: hover.y < 120 ? "translate(-50%, 16px)" : "translate(-50%, calc(-100% - 12px))",
              }}
            >
              <p>{hover.name}</p>
              <p className="text-[#5A5852]">{hover.title}</p>
              <p className="mt-1 tabular-nums">
                {hover.score.toFixed(1)}% score · {formatTokens(hover.tokens)} reasoning tokens
              </p>
              <p className="mt-1">{hover.miss}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#0A0A0A]/20 px-3 py-2 text-[11px]">
        {measured.map((model, index) => (
          <p key={model.id}>
            <LegendMarker shape={shapes[index % shapes.length]} color={seriesColor(index, model.color)} />
            {model.name}
          </p>
        ))}
        <p className="text-[#5A5852]">A line connects one model across the four tasks.</p>
      </div>
    </div>
  );
}
