import React from "react";
import { Users, Laptop, Server, Network } from "lucide-react";

export function ConcentricImpactRings() {
  const items = [
    { label: "Users", count: 450, status: "Investigating", color: "rgb(var(--sev-critical))", percent: 75, icon: Users },
    { label: "Endpoints", count: 150, status: "Blocked", color: "rgb(var(--sev-high))", percent: 60, icon: Laptop },
    { label: "Servers", count: 15, status: "Mitigated", color: "rgb(var(--sev-medium))", percent: 35, icon: Server },
    { label: "Network Devices", count: 8, status: "Unresolved", color: "rgb(var(--accent))", percent: 85, icon: Network },
  ];

  return (
    <div className="rounded-card border border-line bg-surface p-4 flex flex-col justify-between space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <div>
          <h3 className="text-xs font-bold text-ink">Affected Systems & Severity Ring Exposure</h3>
          <p className="text-[11px] text-muted">Infrastructure blast radius across 4 perimeter tiers</p>
        </div>
        <span className="font-mono text-xs text-muted">Tier 1-4</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {items.map((item) => {
          const radius = 26;
          const stroke = 5;
          const circum = 2 * Math.PI * radius;
          const offset = circum - (item.percent / 100) * circum;
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex flex-col items-center space-y-1.5 p-2 rounded bg-raised/30">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="rgb(var(--line))"
                    strokeWidth={stroke}
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke={item.color}
                    strokeWidth={stroke}
                    strokeDasharray={circum}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono font-bold text-xs text-ink">{item.count}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-ink block">{item.label}</span>
                <span className="text-[10px] font-mono text-muted">{item.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
