import React from "react";
import clsx from "clsx";

interface CyberGaugeProps {
  value: number; // 0 to 100
  label: string; // e.g. "High", "Normal", "Critical", "Excellent"
  sublabel: string; // e.g. "Current Threat Level", "Overall System Status"
  mode?: "threat" | "health" | "segmented";
  color?: "red" | "green" | "amber" | "cyan";
  size?: number;
}

export function CyberGauge({
  value,
  label,
  sublabel,
  mode = "threat",
  color,
  size = 200,
}: CyberGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const cx = 100, cy = 82, r = 62;

  // Semicircle arc: 180° (left, 0%) to 0° (right, 100%)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Arc path generator
  const getArc = (startAngle: number, endAngle: number) => {
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy - r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy - r * Math.sin(toRad(endAngle));
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweep = endAngle < startAngle ? 0 : 1;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`;
  };

  // Needle angle: 0% -> 180°, 100% -> 0°
  // For standard speedometer: 0% is left (180 deg), 100% is right (0 deg)
  const needleAngle = 180 - (clamped / 100) * 180;
  const needleLen = r - 12;
  const needleX = cx + needleLen * Math.cos(toRad(needleAngle));
  const needleY = cy - needleLen * Math.sin(toRad(needleAngle));

  // Determine active color theme
  const resolvedColor = color || (mode === "threat" ? (clamped > 70 ? "red" : clamped > 40 ? "amber" : "green") : (clamped > 80 ? "green" : clamped > 50 ? "amber" : "red"));

  const strokeColor =
    resolvedColor === "red"
      ? "#ef4444"
      : resolvedColor === "green"
      ? "#22c55e"
      : resolvedColor === "amber"
      ? "#f59e0b"
      : "#00f5ff";

  const glowId = `gauge-glow-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        width={size}
        height={Math.round(size * 0.78)}
        viewBox="0 0 200 156"
        className="overflow-visible"
      >
        <defs>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle guide arc */}
        <path
          d={getArc(180, 0)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Mode-specific Track */}
        {mode === "segmented" ? (
          // Segmented: Red -> Amber -> Green
          <>
            <path
              d={getArc(180, 120)}
              fill="none"
              stroke="#ef4444"
              strokeWidth="10"
              strokeLinecap="round"
              opacity={0.85}
            />
            <path
              d={getArc(118, 62)}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
              opacity={0.85}
            />
            <path
              d={getArc(60, 0)}
              fill="none"
              stroke="#22c55e"
              strokeWidth="10"
              strokeLinecap="round"
              opacity={0.85}
            />
          </>
        ) : (
          // Solid progressive fill with glow
          <path
            d={getArc(180, 180 - (clamped / 100) * 180)}
            fill="none"
            stroke={strokeColor}
            strokeWidth="11"
            strokeLinecap="round"
            filter={`url(#${glowId})`}
          />
        )}

        {/* Tick marks at 0%, 25%, 50%, 75%, 100% */}
        {[180, 135, 90, 45, 0].map((deg, i) => {
          const t1 = cy - (r - 9) * Math.sin(toRad(deg));
          const t2 = cy - (r - 1) * Math.sin(toRad(deg));
          const x1 = cx + (r - 9) * Math.cos(toRad(deg));
          const x2 = cx + (r - 1) * Math.cos(toRad(deg));
          return (
            <line
              key={i}
              x1={x1}
              y1={t1}
              x2={x2}
              y2={t2}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Min / Max Labels positioned outside the arc */}
        <text
          x={cx - r - 2}
          y={cy + 16}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.45)"
          fontSize="9"
          fontFamily="IBM Plex Mono, monospace"
        >
          {mode === "health" ? "0%" : "Low"}
        </text>
        <text
          x={cx + r + 2}
          y={cy + 16}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.45)"
          fontSize="9"
          fontFamily="IBM Plex Mono, monospace"
        >
          {mode === "health" ? "100%" : "High"}
        </text>

        {/* Needle Line (Stays strictly above cy=82, never overlaps text below) */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Pivot center cap */}
        <circle cx={cx} cy={cy} r="6" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx={cx} cy={cy} r="2.5" fill={strokeColor} />

        {/* PRIMARY VALUE DISPLAY (Positioned cleanly below pivot at y=108) */}
        <text
          x={cx}
          y={cy + 26}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="22"
          fontWeight="bold"
          fontFamily="IBM Plex Mono, monospace"
        >
          {mode === "segmented" ? value : `${value}%`}
        </text>

        {/* STATUS PILL BADGE (Positioned at y=124 to y=140 with zero collision) */}
        <g transform={`translate(${cx - 36}, ${cy + 34})`}>
          <rect
            width="72"
            height="18"
            rx="4"
            fill={
              resolvedColor === "red"
                ? "rgba(239, 68, 68, 0.15)"
                : resolvedColor === "green"
                ? "rgba(34, 197, 94, 0.15)"
                : resolvedColor === "amber"
                ? "rgba(245, 158, 11, 0.15)"
                : "rgba(0, 245, 255, 0.15)"
            }
            stroke={strokeColor}
            strokeWidth="1"
          />
          <text
            x="36"
            y="13"
            textAnchor="middle"
            fill={strokeColor}
            fontSize="10"
            fontWeight="bold"
            fontFamily="IBM Plex Sans, sans-serif"
            letterSpacing="0.05em"
          >
            {label.toUpperCase()}
          </text>
        </g>
      </svg>

      {/* Sublabel below the gauge */}
      <span className="text-[11px] text-muted font-mono tracking-tight -mt-1 text-center">
        {sublabel}
      </span>
    </div>
  );
}

export default CyberGauge;
