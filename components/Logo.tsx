export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="4 2 24 26"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="14" y="4" width="3" height="3" fill="#0A0A0A" />
      <rect x="10" y="8" width="3" height="3" fill="#0A0A0A" />
      <rect x="14" y="8" width="3" height="3" fill="#0A0A0A" />
      <rect x="18" y="8" width="3" height="3" fill="#0A0A0A" />
      <rect x="6" y="12" width="3" height="3" fill="#0A0A0A" />
      <rect x="10" y="12" width="3" height="3" fill="#0A0A0A" />
      <rect x="18" y="12" width="3" height="3" fill="#0A0A0A" />
      <rect x="22" y="12" width="3" height="3" fill="#0A0A0A" />
      <rect x="6" y="16" width="3" height="3" fill="#0A0A0A" />
      <rect x="14" y="16" width="3" height="3" fill="#0A0A0A" />
      <rect x="22" y="16" width="3" height="3" fill="#0A0A0A" />
      <rect x="10" y="20" width="3" height="3" fill="#0A0A0A" />
      <rect x="18" y="20" width="3" height="3" fill="#0A0A0A" />
      <rect x="14" y="24" width="3" height="3" fill="#0A0A0A" />
    </svg>
  );
}
