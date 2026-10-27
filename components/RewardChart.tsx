"use client";

import { useState } from "react";
import { benchmarkModels, benchmarkTasks, isMeasured } from "@/lib/catalog";
import { firstMiss, traceFor } from "@/lib/traces";

const VB_W = 720;
const VB_H = 400;
const PAD = { l: 72, r: 20, t: 26, b: 64 };
const TOKEN_MIN = 20000;
const TOKEN_MAX = 80000;

type Mode = "task" | "length";
type Scale = "log" | "linear";
type Shape = "square" | "diamond";

type Point = {
  key: string;
  taskId: string;
  modelId: string;
  name: string;
  color: string;
  shape: Shape;
  reward: number;
  tokens: number;
  x: number;
  y: number;
  title: string;
  miss: string;
};

const measured = benchmarkModels.filter(isMeasured);
const shapes: Shape[] = ["square", "diamond"];

function yOf(reward: number) {
  const plotH = VB_H - PAD.t - PAD.b;
  return PAD.t + (1 - reward) * plotH;
}

function tokenT(tokens: number, scale: Scale) {
  if (scale === "log") {
    return (Math.log10(tokens) - Math.log10(TOKEN_MIN)) / (Math.log10(TOKEN_MAX) - Math.log10(TOKEN_MIN));
  }
  return (tokens - TOKEN_MIN) / (TOKEN_MAX - TOKEN_MIN);
}

function layout(mode: Mode, scale: Scale): Point[] {
  const plotW = VB_W - PAD.l - PAD.r;
  return benchmarkTasks.flatMap((task, taskIndex) => {
    const trace = traceFor(task.id);
    return measured.map((model, seriesIndex) => {
      const reward = Number(task.frontier[model.rewardIndex]);
      const center =
        mode === "task"
          ? PAD.l + (plotW / benchmarkTasks.length) * (taskIndex + 0.5)
          : PAD.l + tokenT(task.tokenCount, scale) * plotW;
      const offset = (seriesIndex - (measured.length - 1) / 2) * 16;
      const miss = firstMiss(task.id, model.id);
      return {
        key: `${task.id}:${model.id}`,
        taskId: task.id,
        modelId: model.id,
        name: model.name,
        color: model.color,
        shape: shapes[seriesIndex % shapes.length],
        reward,
        tokens: task.tokenCount,
        x: center + offset,
        y: yOf(reward),
        title: trace.title,
        miss: miss ? miss.label : "Passed the named checks",
      };
    });
  });
}

function formatTokens(tokens: number) {
  return `${Math.round(tokens / 1000)}k`;
}

function Marker({ x, y, shape, color }: { x: number; y: number; shape: Shape; color: string }) {
  if (shape === "diamond") {
    return <polygon points={`${x},${y - 6} ${x + 6},${y} ${x},${y + 6} ${x - 6},${y}`} fill={color} />;
  }
  return <rect x={x - 5} y={y - 5} width={10} height={10} fill={color} />;
}

function Ring({ x, y, shape }: { x: number; y: number; shape: Shape }) {
  if (shape === "diamond") {
    return (
      <polygon points={`${x},${y - 10} ${x + 10},${y} ${x},${y + 10} ${x - 10},${y}`} fill="none" stroke="#0A0A0A" strokeWidth="1" />
    );
  }
  return <rect x={x - 8} y={y - 8} width={16} height={16} fill="none" stroke="#0A0A0A" strokeWidth="1" />;
}

function LegendMarker({ shape, color }: { shape: Shape; color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="mr-2 inline-block align-[-1px]">
      {shape === "diamond" ? <polygon points="6,1 11,6 6,11 1,6" fill={color} /> : <rect x="1" y="1" width="10" height="10" fill={color} />}
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
  const [mode, setMode] = useState<Mode>("task");
  const [scale, setScale] = useState<Scale>("log");
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const points = layout(mode, scale);
  const hover = points.find((point) => point.key === hoverKey) ?? null;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xTicks = scale === "log" ? [20000, 40000, 80000] : [20000, 40000, 60000, 80000];
  const plotRight = VB_W - PAD.r;
  const axisY = yOf(0);

  return (
    <div className="border border-[#0A0A0A]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0A0A0A] px-3 py-2">
        <p className="text-[11px]">Reward against the known-correct answer</p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex border border-[#0A0A0A]" role="group" aria-label="Chart axis">
            <Toggle label="By task" pressed={mode === "task"} onClick={() => setMode("task")} />
            <Toggle label="By length" pressed={mode === "length"} onClick={() => setMode("length")} />
          </div>
          {mode === "length" ? (
            <div className="flex border border-[#0A0A0A]" role="group" aria-label="Length scale">
              <Toggle label="Log" pressed={scale === "log"} onClick={() => setScale("log")} />
              <Toggle label="Linear" pressed={scale === "linear"} onClick={() => setScale("linear")} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-2 pt-3">
        <div className="relative" onMouseLeave={() => setHoverKey(null)}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="block h-auto w-full" aria-hidden="true">
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={PAD.l} x2={plotRight} y1={yOf(tick)} y2={yOf(tick)} stroke="#0A0A0A" strokeOpacity={tick === 1 ? 1 : 0.12} />
              <text x={PAD.l - 8} y={yOf(tick) + 3} textAnchor="end" fill="#5A5852" fontSize="11" fontFamily="inherit">
                {tick.toFixed(2)}
              </text>
            </g>
          ))}
          <text x={plotRight - 4} y={yOf(1) - 8} textAnchor="end" fill="#0A0A0A" fontSize="11" fontFamily="inherit">
            Known-correct answer
          </text>
          {mode === "task"
            ? benchmarkTasks.map((task, index) => {
                const slot = (VB_W - PAD.l - PAD.r) / benchmarkTasks.length;
                const x = PAD.l + slot * (index + 0.5);
                return (
                  <text key={task.id} x={x} y={axisY + 22} textAnchor="middle" fill="#5A5852" fontSize="11" fontFamily="inherit">
                    {traceFor(task.id).axis}
                  </text>
                );
              })
            : xTicks.map((tick) => (
                <text
                  key={tick}
                  x={PAD.l + tokenT(tick, scale) * (VB_W - PAD.l - PAD.r)}
                  y={axisY + 22}
                  textAnchor="middle"
                  fill="#5A5852"
                  fontSize="11"
                  fontFamily="inherit"
                >
                  {formatTokens(tick)}
                </text>
              ))}
          <text x={(PAD.l + plotRight) / 2} y={VB_H - 16} textAnchor="middle" fill="#5A5852" fontSize="11" fontFamily="inherit">
            {mode === "task" ? "Task" : "Task length (tokens)"}
          </text>
          {points.map((point) => (
            <line key={`${point.key}-stem`} x1={point.x} x2={point.x} y1={point.y} y2={yOf(1)} stroke={point.color} strokeWidth="1" />
          ))}
          {points.map((point) => (
            <g key={point.key}>
              {point.taskId === taskId && point.modelId === modelId ? <Ring x={point.x} y={point.y} shape={point.shape} /> : null}
              <Marker x={point.x} y={point.y} shape={point.shape} color={point.color} />
            </g>
          ))}
        </svg>

        {points.map((point) => {
          const selected = point.taskId === taskId && point.modelId === modelId;
          return (
            <button
              key={point.key}
              type="button"
              aria-label={`${point.name}, ${point.title}, reward ${point.reward.toFixed(4)} of 1. ${point.miss}`}
              aria-pressed={selected}
              onClick={() => onPick(point.taskId, point.modelId)}
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
              transform: hover.y < 110 ? "translate(-50%, 18px)" : "translate(-50%, calc(-100% - 14px))",
            }}
          >
            <p>{hover.name}</p>
            <p className="text-[#5A5852]">{hover.title}</p>
            <p className="mt-1 tabular-nums">
              {hover.reward.toFixed(4)} reward · {formatTokens(hover.tokens)} tokens
            </p>
            <p className="mt-1">{hover.miss}</p>
          </div>
        ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#0A0A0A]/20 px-3 py-2 text-[11px]">
        {measured.map((model, index) => (
          <p key={model.id}>
            <LegendMarker shape={shapes[index % shapes.length]} color={model.color} />
            {model.name}
          </p>
        ))}
        <p className="text-[#5A5852]">
          <span className="mr-2 inline-block h-px w-6 bg-[#0A0A0A] align-middle" />
          Known-correct answer at 1.00
        </p>
      </div>
    </div>
  );
}
