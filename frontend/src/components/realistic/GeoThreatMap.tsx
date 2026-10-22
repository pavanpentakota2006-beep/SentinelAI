import React, { useState } from "react";
import { Globe, ShieldAlert, Crosshair, Radio, Zap } from "lucide-react";
import clsx from "clsx";

interface AttackVector {
  id: string;
  sourceName: string;
  targetName: string;
  attackType: string;
  severity: "critical" | "high" | "medium";
  time: string;
  sX: number;
  sY: number;
  tX: number;
  tY: number;
}

const LIVE_ATTACKS: AttackVector[] = [
  { id: "atk-1", sourceName: "Netherlands", targetName: "US-East (vpn-edge)", attackType: "Password Spray / Kerberos", severity: "critical", time: "Just now", sX: 250, sY: 65, tX: 130, tY: 80 },
  { id: "atk-2", sourceName: "Russia (APT29)", targetName: "EU-West (web-gw-01)", attackType: "Cobalt Strike C2 Beacon", severity: "critical", time: "1m ago", sX: 320, sY: 55, tX: 245, tY: 70 },
  { id: "atk-3", sourceName: "China (Lazarus)", targetName: "AP-South (db-core-02)", attackType: "Ransomware Infiltration", severity: "high", time: "3m ago", sX: 390, sY: 85, tX: 340, tY: 110 },
  { id: "atk-4", sourceName: "US / Bulletproof", targetName: "Global Perimeter", attackType: "SYN Flood / Port Sweep", severity: "medium", time: "4m ago", sX: 110, sY: 80, tX: 260, tY: 85 },
];

export function GeoThreatMap() {
  const [selectedAttack, setSelectedAttack] = useState<AttackVector>(LIVE_ATTACKS[0]);

  return (
    <div className="rounded-card border border-line bg-surface p-4 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-sm">
      {/* Top Header matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-3">
        <div>
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <Globe size={16} className="text-accent" />
            <span>Global Threat Map & Geo Ingress Vectors</span>
          </h2>
          <p className="text-[11px] text-muted">
            Live cross-border adversary origin trajectories targeting corporate perimeter
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-sev-critical font-semibold">
            <Radio size={12} className="animate-pulse" /> Live Intercepts
          </span>
        </div>
      </div>

      {/* Grid: Left Live Ticker + Right World Map Canvas */}
      <div className="grid gap-3 lg:grid-cols-12 items-center">
        {/* Left Live Attack Ticker matching Image 2 ("Attacks") */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-muted font-mono px-1">
            <span>Recent Geo Incursions</span>
            <span className="text-accent">Current Rate: 4/min</span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
            {LIVE_ATTACKS.map((atk) => {
              const isSelected = selectedAttack.id === atk.id;
              return (
                <div
                  key={atk.id}
                  onClick={() => setSelectedAttack(atk)}
                  className={clsx(
                    "cursor-pointer rounded-chip p-2 text-left border transition-all text-xs",
                    isSelected
                      ? "border-accent bg-accent/10 shadow-sm"
                      : "border-line/60 bg-raised/40 hover:bg-raised",
                  )}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span
                      className={clsx(
                        "font-bold uppercase",
                        atk.severity === "critical"
                          ? "text-sev-critical"
                          : atk.severity === "high"
                          ? "text-sev-high"
                          : "text-sev-medium",
                      )}
                    >
                      {atk.severity}
                    </span>
                    <span className="text-muted">{atk.time}</span>
                  </div>
                  <p className="font-semibold text-ink text-[11px] truncate mt-0.5">{atk.attackType}</p>
                  <p className="text-[10px] font-mono text-muted flex items-center gap-1 mt-0.5">
                    <span className="text-accent">{atk.sourceName}</span> &rarr;{" "}
                    <span className="text-ink">{atk.targetName}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right World Map SVG with Curved Arcs matching Image 2 */}
        <div className="lg:col-span-8 relative h-60 cyber-grid rounded-chip border border-line/40 overflow-hidden bg-bg/60 flex items-center justify-center">
          <svg viewBox="0 0 500 240" className="w-full h-full">
            <defs>
              <linearGradient id="arcGradientCrit" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(var(--sev-critical))" stopOpacity="0.2" />
                <stop offset="50%" stopColor="rgb(var(--sev-critical))" stopOpacity="1" />
                <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Simplified World Continents Geo Silhouettes */}
            {/* North America */}
            <path
              d="M 60 40 Q 120 30 160 50 Q 140 90 110 110 Q 70 80 60 40 Z"
              fill="rgb(var(--line))"
              fillOpacity="0.4"
              stroke="rgb(var(--line))"
              strokeWidth="0.8"
            />
            {/* South America */}
            <path
              d="M 120 120 Q 150 130 140 180 Q 110 200 100 150 Z"
              fill="rgb(var(--line))"
              fillOpacity="0.4"
              stroke="rgb(var(--line))"
              strokeWidth="0.8"
            />
            {/* Europe */}
            <path
              d="M 230 40 Q 280 40 280 80 Q 240 85 230 40 Z"
              fill="rgb(var(--line))"
              fillOpacity="0.4"
              stroke="rgb(var(--line))"
              strokeWidth="0.8"
            />
            {/* Africa */}
            <path
              d="M 230 90 Q 290 90 280 160 Q 240 160 230 90 Z"
              fill="rgb(var(--line))"
              fillOpacity="0.4"
              stroke="rgb(var(--line))"
              strokeWidth="0.8"
            />
            {/* Asia */}
            <path
              d="M 290 35 Q 420 30 440 90 Q 360 120 290 85 Z"
              fill="rgb(var(--line))"
              fillOpacity="0.4"
              stroke="rgb(var(--line))"
              strokeWidth="0.8"
            />
            {/* Australia */}
            <path
              d="M 390 145 Q 440 150 430 180 Q 380 175 390 145 Z"
              fill="rgb(var(--line))"
              fillOpacity="0.4"
              stroke="rgb(var(--line))"
              strokeWidth="0.8"
            />

            {/* Render Attack Curved Trajectory Arcs */}
            {LIVE_ATTACKS.map((atk) => {
              const isSelected = selectedAttack.id === atk.id;
              // Arc control point for curve
              const midX = (atk.sX + atk.tX) / 2;
              const midY = Math.min(atk.sY, atk.tY) - 35;

              return (
                <g key={atk.id}>
                  {/* Curved Path */}
                  <path
                    d={`M ${atk.sX} ${atk.sY} Q ${midX} ${midY} ${atk.tX} ${atk.tY}`}
                    fill="none"
                    stroke={isSelected ? "url(#arcGradientCrit)" : "rgb(var(--sev-high))"}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    strokeDasharray={isSelected ? "5 3" : "2 2"}
                    strokeOpacity={isSelected ? 0.95 : 0.4}
                    className={isSelected ? "animate-pulse" : undefined}
                  />

                  {/* Origin Pulsing Marker */}
                  <circle
                    cx={atk.sX}
                    cy={atk.sY}
                    r={isSelected ? 5 : 3.5}
                    fill="rgb(var(--sev-critical))"
                    className="animate-ping opacity-60"
                  />
                  <circle cx={atk.sX} cy={atk.sY} r={3} fill="rgb(var(--sev-critical))" />

                  {/* Target Protected Host Marker */}
                  <circle
                    cx={atk.tX}
                    cy={atk.tY}
                    r={isSelected ? 6 : 4}
                    fill="none"
                    stroke="rgb(var(--accent))"
                    strokeWidth="1.5"
                  />
                  <circle cx={atk.tX} cy={atk.tY} r={2.5} fill="rgb(var(--accent))" />
                </g>
              );
            })}
          </svg>

          {/* Active Vector Tooltip Footer */}
          <div className="absolute bottom-2 left-2 right-2 bg-surface/90 border border-line backdrop-blur-md rounded-chip px-3 py-1.5 text-[11px] font-mono flex items-center justify-between">
            <span className="text-muted">
              Intercept: <span className="font-bold text-sev-critical">{selectedAttack.attackType}</span> ({selectedAttack.sourceName} &rarr; {selectedAttack.targetName})
            </span>
            <span className="text-ok font-semibold">AUTOMATICALLY MITIGATED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
