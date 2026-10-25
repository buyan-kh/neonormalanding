import type { ReactNode } from "react";

export function WindowControls() {
  const box =
    "flex h-3.5 min-w-3.5 items-center justify-center border border-[#EFECE6]/80 px-[3px] text-[8px] leading-none text-[#EFECE6]";
  return (
    <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
      <span className={box}>-</span>
      <span className={box}>o</span>
      <span className={box}>x</span>
    </div>
  );
}

export function TerminalWindow({
  title,
  children,
  dashed = true,
  className = "",
  bodyClassName = "",
}: {
  title: string;
  children: ReactNode;
  dashed?: boolean;
  className?: string;
  bodyClassName?: string;
}) {
  const stroke = dashed ? "border-dashed" : "border-solid";
  return (
    <div className={`flex min-w-0 max-w-full flex-col border border-[#EFECE6]/70 ${stroke} ${className}`}>
      <div className={`flex items-center justify-between gap-3 border-b border-[#EFECE6]/70 px-2 py-1 ${stroke}`}>
        <p className="min-w-0 truncate text-[11px] tracking-wide text-[#EFECE6]">{title}</p>
        <WindowControls />
      </div>
      <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
