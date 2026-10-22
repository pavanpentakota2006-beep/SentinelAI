import React, { useState } from "react";
import { Network, ShieldAlert, CheckCircle2, Clock, Globe, Shield, Server, Database, Cloud } from "lucide-react";
import clsx from "clsx";

interface TopologyNode {
  id: string;
  label: string;
  x: number;
  y: number;
  status: "normal" | "compromised" | "at-risk";
  type: string;
  ip: string;
}

const TOPOLOGY_NODES: TopologyNode[] = [
  { id: "node-internet", label: "Internet", x: 40, y: 130, status: "normal", type: "Gateway", ip: "0.0.0.0/0" },
  { id: "node-fw", label: "Firewall", x: 140, y: 130, status: "normal", type: "Perimeter", ip: "10.0.1.1" },
  { id: "node-sw", label: "Switch", x: 240, y: 130, status: "normal", type: "Core Switch", ip: "10.0.1.254" },
  { id: "node-ws2", label: "WS-002", x: 340, y: 80, status: "normal", type: "Workstation", ip: "10.0.3.12" },
  { id: "node-ws1", label: "WS-001", x: 440, y: 40, status: "normal", type: "Workstation", ip: "10.0.3.11" },
  { id: "node-cloud", label: "Cloud", x: 530, y: 90, status: "normal", type: "AWS VPC", ip: "10.0.8.0/24" },
  { id: "node-finsrv", label: "FIN-SRV", x: 350, y: 175, status: "compromised", type: "Database/App", ip: "10.0.4.15" },
  { id: "node-dbprod", label: "DB-Prod", x: 450, y: 130, status: "at-risk", type: "Crown Jewel DB", ip: "10.0.4.10" },
  { id: "node-ws3", label: "WS-003", x: 450, y: 220, status: "normal", type: "Finance Workstation", ip: "10.0.3.15" },
];

export function NetworkTopologyVisualizer() {
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(TOPOLOGY_NODES[6]); // default FIN-SRV

  return (
    <div className="rounded-card border border-line bg-surface p-4 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-sm">
      {/* Top Header & Legend matching Image 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-3">
        <div>
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <Network size={16} className="text-accent" />
            <span>Network Topology</span>
          </h2>
          <p className="text-[11px] text-muted">Monitor and secure network infrastructure visibility</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-sev-critical">
            <span className="h-2 w-2 rounded-full bg-sev-critical animate-ping" />
            <span>Attack Path</span>
          </span>
          <span className="flex items-center gap-1.5 text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Normal Traffic</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas Topology matching Image 1 */}
      <div className="relative w-full h-56 cyber-grid rounded-chip border border-line/40 overflow-hidden bg-bg/50">
        <svg viewBox="0 0 600 250" className="w-full h-full">
          <defs>
            <linearGradient id="normalPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="attackPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(var(--sev-high))" />
              <stop offset="100%" stopColor="rgb(var(--sev-critical))" />
            </linearGradient>
          </defs>

          {/* Normal Traffic Paths */}
          <path
            d="M 40 130 L 140 130 L 240 130 Q 290 100 340 80 Q 390 60 440 40 Q 485 65 530 90"
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="2.5"
            strokeOpacity="0.6"
          />

          {/* Lateral branch from Switch to Cloud */}
          <path
            d="M 340 80 Q 435 110 530 90"
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeOpacity="0.4"
          />

          {/* Red Attack Infiltration Path (Switch -> FIN-SRV -> DB-Prod) */}
          <path
            d="M 240 130 Q 290 155 350 175 Q 400 150 450 130"
            fill="none"
            stroke="url(#attackPathGrad)"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />

          {/* Attack Recon Path (FIN-SRV -> WS-003) */}
          <path
            d="M 350 175 Q 400 200 450 220"
            fill="none"
            stroke="rgb(var(--sev-high))"
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* Nodes Rendering */}
          {TOPOLOGY_NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isCompromised = node.status === "compromised";
            const isAtRisk = node.status === "at-risk";

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
              >
                {/* Glow ring for compromised node */}
                {isCompromised && (
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill="none"
                    stroke="rgb(var(--sev-critical))"
                    strokeWidth="2"
                    className="animate-ping opacity-40"
                  />
                )}

                <circle
                  cx="0"
                  cy="0"
                  r={isCompromised ? 16 : 14}
                  fill="rgb(var(--surface))"
                  stroke={
                    isCompromised
                      ? "rgb(var(--sev-critical))"
                      : isAtRisk
                      ? "rgb(var(--sev-high))"
                      : isSelected
                      ? "rgb(var(--accent))"
                      : "rgb(var(--line))"
                  }
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-transform group-hover:scale-125"
                />

                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill={
                    isCompromised
                      ? "rgb(var(--sev-critical))"
                      : isAtRisk
                      ? "rgb(var(--sev-high))"
                      : "rgb(var(--accent))"
                  }
                />

                {/* Node Label Text */}
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill="rgb(var(--ink))"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="IBM Plex Sans"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Floating Tooltip */}
        {selectedNode && (
          <div className="absolute top-2 left-2 bg-surface/90 border border-line backdrop-blur-md rounded-chip p-2 text-xs font-mono shadow-md flex items-center gap-3">
            <div>
              <span className="font-bold text-ink">{selectedNode.label}</span> ({selectedNode.type})
              <span className="text-muted block text-[10px]">{selectedNode.ip}</span>
            </div>
            <span
              className={clsx(
                "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                selectedNode.status === "compromised"
                  ? "bg-sev-critical/20 text-sev-critical"
                  : selectedNode.status === "at-risk"
                  ? "bg-sev-high/20 text-sev-high"
                  : "bg-ok/20 text-ok",
              )}
            >
              {selectedNode.status}
            </span>
          </div>
        )}
      </div>

      {/* 4 Bottom Metric Pills matching Image 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <div className="rounded-chip border border-line/60 bg-raised/40 p-2 text-left">
          <div className="flex items-center gap-1.5 text-accent text-[11px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Open Incidents
          </div>
          <p className="font-mono text-lg font-bold text-ink mt-0.5">38</p>
          <span className="text-[10px] text-muted">Currently Active</span>
        </div>

        <div className="rounded-chip border border-line/60 bg-raised/40 p-2 text-left">
          <div className="flex items-center gap-1.5 text-sev-critical text-[11px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-sev-critical animate-pulse" /> Critical Incidents
          </div>
          <p className="font-mono text-lg font-bold text-sev-critical mt-0.5">5</p>
          <span className="text-[10px] text-muted">Action Required</span>
        </div>

        <div className="rounded-chip border border-line/60 bg-raised/40 p-2 text-left">
          <div className="flex items-center gap-1.5 text-ok text-[11px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Resolved Today
          </div>
          <p className="font-mono text-lg font-bold text-ink mt-0.5">127</p>
          <span className="text-[10px] text-ok">Successfully Closed</span>
        </div>

        <div className="rounded-chip border border-line/60 bg-raised/40 p-2 text-left">
          <div className="flex items-center gap-1.5 text-sev-medium text-[11px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-sev-medium" /> Avg Time
          </div>
          <p className="font-mono text-lg font-bold text-ink mt-0.5">12m</p>
          <span className="text-[10px] text-muted">Mean Time to Respond</span>
        </div>
      </div>
    </div>
  );
}
