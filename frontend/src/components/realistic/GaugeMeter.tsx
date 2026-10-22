import React from "react";
import clsx from "clsx";

interface GaugeMeterProps {
  score: number;
  label: string;
  sublabel: string;
  type?: "health" | "threat";
  metrics?: {
    activeCases?: number;
    criticalCases?: number;
    avgResolutionTime?: string;
    slaCompliance?: string;
  };
}

export function GaugeMeter({
  score,
  label,
  sublabel,
  type = "health",
  metrics = {
    activeCases: 38,
    criticalCases: 5,
    avgResolutionTime: "18m",
    slaCompliance: "97%",
  },
}: GaugeMeterProps) {
  // Semicircular stroke angle calculation (180 degrees)
  const radius = 68;
  const strokeWidth = 10;
  const circumference = Math.PI * radius; // Half-circle length
  const progressOffset = circumference - (score / 100) * circumference;

  const isHealth = type === "health";
  const statusColor = isHealth
    ? score > 80
      ? "text-ok"
      : score > 60
      ? "text-sev-medium"
      : "text-sev-critical"
    : score > 70
    ? "text-sev-critical"
    : "text-ok";

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-3">
      {/* Semi-circular gauge container */}
      <div className="relative w-48 h-28 flex items-end justify-center">
        <svg viewBox="0 0 160 90" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(var(--sev-critical))" />
              <stop offset="35%" stopColor="rgb(var(--sev-high))" />
              <stop offset="65%" stopColor="rgb(var(--sev-medium))" />
              <stop offset="100%" stopColor="rgb(var(--ok))" />
            </linearGradient>
            <linearGradient id="threatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(var(--ok))" />
              <stop offset="50%" stopColor="rgb(var(--sev-medium))" />
              <stop offset="100%" stopColor="rgb(var(--sev-critical))" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 12 80 A 68 68 0 0 1 148 80"
            fill="none"
            stroke="rgb(var(--line))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored Progress Arc */}
          <path
            d="M 12 80 A 68 68 0 0 1 148 80"
            fill="none"
            stroke={isHealth ? "url(#healthGradient)" : "url(#threatGradient)"}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Inner tick indicator / needle glow */}
          <circle
            cx="80"
            cy="80"
            r="4"
            fill="rgb(var(--ink))"
            className="shadow-sm"
          />
        </svg>

        {/* Center Text inside gauge */}
        <div className="absolute bottom-0 flex flex-col items-center text-center">
          <div className="flex items-baseline">
            <span className="font-mono text-3xl font-bold tracking-tight text-ink">{score}</span>
            <span className="text-xs text-muted font-mono font-medium">/100</span>
          </div>
          <span className={clsx("text-xs font-semibold tracking-wide", statusColor)}>
            {label}
          </span>
        </div>
      </div>

      {/* Metrics Row matching Image 1 & 3 */}
      <div className="w-full grid grid-cols-2 gap-2 text-xs pt-1 border-t border-line/60">
        <div className="flex items-center justify-between p-1.5 rounded bg-raised/40">
          <span className="text-[11px] text-muted flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Active Cases
          </span>
          <span className="font-mono font-bold text-ink">{metrics.activeCases}</span>
        </div>

        <div className="flex items-center justify-between p-1.5 rounded bg-raised/40">
          <span className="text-[11px] text-muted flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sev-critical" /> Critical
          </span>
          <span className="font-mono font-bold text-sev-critical">{metrics.criticalCases}</span>
        </div>

        <div className="flex items-center justify-between p-1.5 rounded bg-raised/40">
          <span className="text-[11px] text-muted">Avg Resolution</span>
          <span className="font-mono font-semibold text-ink">{metrics.avgResolutionTime}</span>
        </div>

        <div className="flex items-center justify-between p-1.5 rounded bg-raised/40">
          <span className="text-[11px] text-muted">SLA Compliance</span>
          <span className="font-mono font-bold text-ok">{metrics.slaCompliance}</span>
        </div>
      </div>
    </div>
  );
}
