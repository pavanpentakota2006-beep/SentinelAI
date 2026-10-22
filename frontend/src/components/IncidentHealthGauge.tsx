import React from "react";

interface IncidentHealthGaugeProps {
  score?: number; // default 90
  size?: number;
}

export function IncidentHealthGauge({ score = 90, size = 180 }: IncidentHealthGaugeProps) {
  const cx = 90;
  const cy = 80;
  const r = 58;

  // Arch runs from 180° (left, 0) through 90° (top) to 0° (right, 100)
  // In SVG coordinates, y goes down, so to curve UP through the top:
  // start at (cx - r, cy) = (32, 80)
  // end at (cx + r, cy) = (148, 80)
  // sweep = 1 draws clockwise (UP through (90, 22))!
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Arc path generator
  const getArchPath = (startDeg: number, endDeg: number) => {
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy - r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy - r * Math.sin(toRad(endDeg));
    const diff = Math.abs(endDeg - startDeg);
    const largeArc = diff > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Needle angle for score (90/100 => 180 - 0.90 * 180 = 18 degrees)
  const needleDeg = 180 - (Math.max(0, Math.min(100, score)) / 100) * 180;
  // Needle line starts outside the center text (radius 24) and extends to radius 52
  const nx1 = cx + 22 * Math.cos(toRad(needleDeg));
  const ny1 = cy - 22 * Math.sin(toRad(needleDeg));
  const nx2 = cx + 52 * Math.cos(toRad(needleDeg));
  const ny2 = cy - 52 * Math.sin(toRad(needleDeg));

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        width={size}
        height={Math.round(size * 0.72)}
        viewBox="0 0 180 130"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="rainbowArch" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <filter id="archGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Background Track ── */}
        <path
          d={getArchPath(180, 0)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* ── Multi-Color Rainbow Arch (Matching Image 1) ── */}
        <path
          d={getArchPath(180, 0)}
          fill="none"
          stroke="url(#rainbowArch)"
          strokeWidth="9"
          strokeLinecap="round"
          filter="url(#archGlow)"
        />

        {/* Tick markers */}
        {[180, 135, 90, 45, 0].map((deg, i) => {
          const p1 = { x: cx + (r - 7) * Math.cos(toRad(deg)), y: cy - (r - 7) * Math.sin(toRad(deg)) };
          const p2 = { x: cx + (r + 1) * Math.cos(toRad(deg)), y: cy - (r + 1) * Math.sin(toRad(deg)) };
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1.2"
            />
          );
        })}

        {/* ── Precision Needle Line (Starts outside text, points towards 90%) ── */}
        <line
          x1={nx1}
          y1={ny1}
          x2={nx2}
          y2={ny2}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={nx2} cy={ny2} r="2.5" fill="#06b6d4" />

        {/* ── Center Value: 90 / 100 (Image 1 Style) ── */}
        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="24"
          fontWeight="bold"
          fontFamily="IBM Plex Sans, sans-serif"
        >
          {score}
          <tspan fontSize="11" fill="rgba(255, 255, 255, 0.45)" fontWeight="normal">
            /100
          </tspan>
        </text>

        {/* ── Subtitle: "Excellent" (Image 1 Style) ── */}
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fill="#10b981"
          fontSize="11"
          fontWeight="600"
          fontFamily="IBM Plex Sans, sans-serif"
        >
          Excellent
        </text>

        {/* Baseline anchor dots */}
        <circle cx={cx - r} cy={cy} r="2" fill="rgba(255, 255, 255, 0.3)" />
        <circle cx={cx + r} cy={cy} r="2" fill="rgba(255, 255, 255, 0.3)" />
      </svg>
    </div>
  );
}

export default IncidentHealthGauge;
