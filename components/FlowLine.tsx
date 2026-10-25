export function FlowLine({
  direction = "horizontal",
  length = 64,
  reverse = false,
  className = "",
}: {
  direction?: "horizontal" | "vertical";
  length?: number;
  reverse?: boolean;
  className?: string;
}) {
  const dash = reverse ? "flow-line flow-line-reverse" : "flow-line";
  if (direction === "vertical") {
    const height = length;
    return (
      <svg
        width="12"
        height={height}
        viewBox={`0 0 12 ${height}`}
        className={`shrink-0 ${className}`}
        aria-hidden="true"
      >
        <path
          d={`M6 0 V${height - 8}`}
          fill="none"
          stroke="#EFECE6"
          strokeWidth="3"
          strokeDasharray="3 3"
          strokeLinecap="butt"
          className={dash}
        />
        <path d={`M3 ${height - 8} L6 ${height - 1} L9 ${height - 8}`} fill="none" stroke="#EFECE6" strokeWidth="1.5" />
      </svg>
    );
  }

  const width = length;
  return (
    <svg width={width} height="12" viewBox={`0 0 ${width} 12`} className={`shrink-0 ${className}`} aria-hidden="true">
      <path
        d={`M0 6 H${width - 8}`}
        fill="none"
        stroke="#EFECE6"
        strokeWidth="3"
        strokeDasharray="3 3"
        strokeLinecap="butt"
        className={dash}
      />
      <path d={`M${width - 8} 2.5 L${width - 1} 6 L${width - 8} 9.5`} fill="none" stroke="#EFECE6" strokeWidth="1.5" />
    </svg>
  );
}
