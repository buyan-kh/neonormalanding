import type { ReactNode } from "react";

export function WindowControls() {
  const box =
    "flex h-3.5 min-w-3.5 items-center justify-center border border-[#0A0A0A] px-[3px] text-[8px] leading-none text-[#0A0A0A]";
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
  dashed = false,
  wrapTitle = false,
  className = "",
  bodyClassName = "",
}: {
  title: string;
  children: ReactNode;
  dashed?: boolean;
  wrapTitle?: boolean;
  className?: string;
  bodyClassName?: string;
}) {
  const stroke = dashed ? "border-dashed" : "border-solid";
  return (
    <div className={`flex min-w-0 max-w-full flex-col border border-[#0A0A0A] bg-white ${stroke} ${className}`}>
      <div
        className={`flex justify-between gap-3 border-b border-[#0A0A0A] bg-[#F5F5F4] px-2 py-1 text-[#0A0A0A] ${wrapTitle ? "items-start" : "items-center"} ${stroke}`}
      >
        <p className={`min-w-0 text-[11px] tracking-wide ${wrapTitle ? "whitespace-normal" : "truncate"}`}>{title}</p>
        <WindowControls />
      </div>
      <div className={`min-h-0 flex-1 bg-white ${bodyClassName}`}>{children}</div>
    </div>
  );
}
