import { pixelIcons, type PixelIconType } from "@/lib/icons";

export function PixelIcon({
  type,
  pixel = 3,
  className = "",
  label,
}: {
  type: PixelIconType;
  pixel?: number;
  className?: string;
  label?: string;
}) {
  const rows = pixelIcons[type];
  const size = rows.length;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size * pixel}
      height={size * pixel}
      shapeRendering="crispEdges"
      className={`block shrink-0 ${className}`}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {rows.map((row, y) =>
        Array.from(row).map((cell, x) =>
          cell === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#EFECE6" /> : null,
        ),
      )}
    </svg>
  );
}
