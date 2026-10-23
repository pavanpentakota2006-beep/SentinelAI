import React from "react";

interface OverviewGaugeProps {
  type: "threat" | "health";
  value: number; // 76 for threat, 92 for health
  size?: number;
}

export function OverviewGauge({ type, value, size = 200 }: OverviewGaugeProps) {
  const isThreat = type === "threat";
  const cx = 100;
  const cy = 95;
  const r = 66;

  // Arc runs from 215° (lower left) through 90° (top) to -35° (lower right)
  // Total arc angle = 250 degrees
  const startAngle = 215;
  const totalAngle = 250;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Function to calculate (x, y) on the circle
  // In SVG coordinates: y decreases as angle goes from 0 to 90 (upwards)
  const getPoint = (deg: number, radius: number = r) => ({
    x: cx + radius * Math.cos(toRad(deg)),
    y: cy - radius * Math.sin(toRad(deg)),
  });

  // Calculate arc path string moving CLOCKWISE (sweep=1)
  const describeArc = (a1: number, a2: number, radius: number = r) => {
    const p1 = getPoint(a1, radius);
    const p2 = getPoint(a2, radius);
    const angleDiff = Math.abs(a1 - a2);
    const largeArc = angleDiff > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
  };

  // Target value angle
  const clampedVal = Math.max(0, Math.min(100, value));
  const currentAngle = startAngle - (clampedVal / 100) * totalAngle;

  // Needle coordinates: starts outside the center text (r=26) to near the rim (r=58)
  const needleStart = getPoint(currentAngle, 18);
  const needleEnd = getPoint(currentAngle, 56);

  const filterId = isThreat ? "threatGlow" : "healthGlow";

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        width={size}
        height={Math.round(size * 0.9)}
        viewBox="0 0 200 180"
        className="overflow-visible"
      >
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradients */}
          <linearGradient id="threatArcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="60%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#ff4d4d" />
          </linearGradient>

          <linearGradient id="healthArcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          {/* Bezel Gradient */}
          <linearGradient id="bezelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* ── 1. Outer Tech Bezel Dial (Matching Image 3) ── */}
        <circle
          cx={cx}
          cy={cy}
          r={78}
          fill="url(#bezelGrad)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
        />

        {/* Radial Bezel Segments (Tachometer notches around the perimeter) */}
        {[225, 180, 135, 90, 45, 0, -45].map((deg, i) => {
          const innerP = getPoint(deg, 74);
          const outerP = getPoint(deg, 78);
          return (
            <line
              key={i}
              x1={innerP.x}
              y1={innerP.y}
              x2={outerP.x}
              y2={outerP.y}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* ── 2. Inner Dial Plate ── */}
        <circle cx={cx} cy={cy} r={60} fill="#060c18" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />

        {/* ── 3. Background Gauge Track Arc (arching OVER the top) ── */}
        <path
          d={describeArc(startAngle, -35, r)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* ── 4. Active Glowing Meter Arc (arching OVER the top) ── */}
        {isThreat ? (
          // Red Threat Arc: fills from 215° to currentAngle (arching clockwise over the top)
          <path
            d={describeArc(startAngle, currentAngle, r)}
            fill="none"
            stroke="url(#threatArcGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            filter="url(#threatGlow)"
          />
        ) : (
          // System Health: Segmented Warning -> Normal -> Critical
          <>
            {/* Warning segment (Cyan: 215° to 150°) */}
            <path
              d={describeArc(215, 150, r)}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="8"
              strokeLinecap="round"
              opacity={0.9}
            />
            {/* Normal segment (Green: 148° to 30°) */}
            <path
              d={describeArc(148, 30, r)}
              fill="none"
              stroke="#22c55e"
              strokeWidth="9"
              filter="url(#healthGlow)"
            />
            {/* Critical segment (Orange/Red: 28° to -35°) */}
            <path
              d={describeArc(28, -35, r)}
              fill="none"
              stroke="#f97316"
              strokeWidth="8"
              strokeLinecap="round"
              opacity={0.85}
            />
          </>
        )}

        {/* ── 5. Dial Labels (Perfect non-overlapping positions matching cyber_health_radar) ── */}
        {isThreat ? (
          <>
            {/* "High" on top inside the arch */}
            <text
              x={cx}
              y={cy - 44}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontFamily="IBM Plex Sans, sans-serif"
              fontWeight="600"
            >
              High
            </text>
            {/* "Low" on upper-left inside the arch, clear of arc and center number */}
            <text
              x={cx - 36}
              y={cy - 22}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.8)"
              fontSize="9"
              fontFamily="IBM Plex Sans, sans-serif"
              fontWeight="500"
            >
              Low
            </text>
          </>
        ) : (
          <>
            {/* "Normal" on top center */}
            <text
              x={cx}
              y={cy - 44}
              textAnchor="middle"
              fill="#4ade80"
              fontSize="10"
              fontFamily="IBM Plex Sans, sans-serif"
              fontWeight="600"
            >
              Normal
            </text>
            {/* "Warning" on upper-left along cyan band, clear of arc and center number */}
            <text
              x={cx - 35}
              y={cy - 22}
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="9"
              fontFamily="IBM Plex Sans, sans-serif"
              fontWeight="500"
            >
              Warning
            </text>
            {/* "Critical" on upper-right along orange band, clear of arc, needle & center number */}
            <text
              x={cx + 35}
              y={cy - 22}
              textAnchor="middle"
              fill="#fb923c"
              fontSize="9"
              fontFamily="IBM Plex Sans, sans-serif"
              fontWeight="500"
            >
              Critical
            </text>
          </>
        )}

        {/* ── 6. Precision Indicator Needle (starts outside center text, points to rim) ── */}
        <line
          x1={needleStart.x}
          y1={needleStart.y}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter={isThreat ? "url(#threatGlow)" : "none"}
        />
        {/* Needle Tip Arrowhead Dot */}
        <circle cx={needleEnd.x} cy={needleEnd.y} r="2.5" fill={isThreat ? "#ef4444" : "#ffffff"} />

        {/* Center Pivot Ring (behind the text, subtle tech element) */}
        <circle
          cx={cx}
          cy={cy + 8}
          r={18}
          fill="#060c18"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1"
        />

        {/* ── 7. Primary Bold Center Number: 76% or 92% (Image 3 Style) ── */}
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="22"
          fontWeight="bold"
          fontFamily="IBM Plex Sans, sans-serif"
          letterSpacing="-0.02em"
        >
          {value}%
        </text>

        {/* ── 8. Bottom Bezel Cradle Arc & Accents ── */}
        <path
          d={`M ${cx - 38} ${cy + 44} Q ${cx} ${cy + 52} ${cx + 38} ${cy + 44}`}
          fill="none"
          stroke={isThreat ? "rgba(239, 68, 68, 0.4)" : "rgba(6, 182, 212, 0.4)"}
          strokeWidth="2"
        />
      </svg>

      {/* Label under the gauge */}
      <span className="text-[11px] font-mono text-muted tracking-tight -mt-1 text-center">
        {isThreat ? "Current Threat Level" : "Overall System Status"}
      </span>
    </div>
  );
}

export default OverviewGauge;
