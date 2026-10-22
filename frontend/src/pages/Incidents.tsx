import React, { useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  RotateCw, Download, Share2, Radio, Shield, ArrowUpRight, Bot,
  Activity, CheckCircle2, Lock, Flame, ExternalLink, AlertTriangle
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { DemoTag } from "@/components/ui";
import { IncidentHealthGauge } from "@/components/IncidentHealthGauge";
import { OperationalWorkspacesBar } from "@/components/OperationalWorkspacesBar";
import clsx from "clsx";

const INCIDENT_TREND = [
  { day: "Mon", new: 4, recv: 8, escalated: 1 },
  { day: "Tue", new: 6, recv: 5, escalated: 2 },
  { day: "Wed", new: 3, recv: 9, escalated: 0 },
  { day: "Thu", new: 8, recv: 6, escalated: 3 },
  { day: "Fri", new: 5, recv: 7, escalated: 1 },
  { day: "Sat", new: 2, recv: 10, escalated: 0 },
  { day: "Sun", new: 7, recv: 4, escalated: 2 },
];

const INCIDENT_VOLUME_STEPS = [
  { label: "Detection", time: "02:02 PM", status: "Resolve", color: "text-ok" },
  { label: "Investigation Started", time: "02:03 PM", status: "Monitoring", color: "text-accent" },
  { label: "Threat Confirmed", time: "02:05 PM", status: "Resolve", color: "text-ok" },
  { label: "Containment Initiated", time: "02:05 PM", status: "Deleted", color: "text-sev-critical" },
  { label: "Recovery In Progress", time: "02:08 PM", status: "Resolve", color: "text-ok" },
  { label: "Resolution", time: "02:09 PM", status: "Monitoring", color: "text-accent" },
];

const GLOBAL_THREAT_RADAR = [
  { assigned: "Sarah Chen", id: "INC-2847", type: "Ransomware Activity", severity: "critical" as const, time: "02:14 PM", origin: "194.26.29.112 (RU)" },
  { assigned: "Alex Morgan", id: "INC-2848", type: "Unauthorized Access", severity: "high" as const, time: "01:58 PM", origin: "103.224.182.25 (CN)" },
  { assigned: "David Lee", id: "INC-2849", type: "Data Exfiltration", severity: "medium" as const, time: "01:12 PM", origin: "185.220.101.5 (BR)" },
  { assigned: "Emma Wilson", id: "INC-2850", type: "Privilege Escalation", severity: "critical" as const, time: "12:55 PM", origin: "45.154.255.88 (NL)" },
  { assigned: "James Park", id: "INC-2851", type: "Lateral Movement", severity: "high" as const, time: "12:30 PM", origin: "198.51.100.44 (US)" },
];

const NETWORK_NODES = [
  { id: "internet", x: 60, y: 140, label: "Internet", color: "#ef4444", ip: "194.26.29.112" },
  { id: "firewall", x: 170, y: 140, label: "Firewall", color: "#f59e0b", ip: "10.0.1.1" },
  { id: "switch", x: 280, y: 140, label: "Switch", color: "#6366f1", ip: "10.0.1.2" },
  { id: "ws001", x: 340, y: 80, label: "WS-001", color: "#22c55e", ip: "10.0.2.14" },
  { id: "ws002", x: 390, y: 140, label: "WS-002", color: "#f59e0b", ip: "10.0.2.15" },
  { id: "ws003", x: 450, y: 200, label: "WS-003", color: "#22c55e", ip: "10.0.2.16" },
  { id: "fin-gfv", x: 350, y: 200, label: "FIN-GFV", color: "#ef4444", compromised: true, ip: "10.0.4.15" },
  { id: "db-prod", x: 500, y: 130, label: "DB-Prod", color: "#ef4444", compromised: true, ip: "10.0.4.50" },
  { id: "cloud", x: 570, y: 80, label: "Cloud", color: "#6366f1", ip: "aws-east-1" },
];

const EDGES = [
  { from: "internet", to: "firewall", attack: true },
  { from: "firewall", to: "switch", attack: true },
  { from: "switch", to: "ws001" },
  { from: "switch", to: "ws002", attack: true },
  { from: "ws002", to: "fin-gfv", attack: true },
  { from: "fin-gfv", to: "db-prod", attack: true },
  { from: "ws002", to: "ws003" },
  { from: "db-prod", to: "cloud" },
];

export default function Incidents() {
  const { triggerPlaybook } = useStore();
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(GLOBAL_THREAT_RADAR[0]);
  const [selectedNode, setSelectedNode] = useState(NETWORK_NODES[6]); // FIN-GFV default

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast({
        type: "success",
        title: "Incidents Synchronized",
        message: "Live incident storyline, correlation graphs, and SLA metrics updated.",
      });
    }, 600);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(GLOBAL_THREAT_RADAR, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `incidents-dossier-${selectedIncident.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast({
      type: "success",
      title: "Dossier Export Generated",
      message: `Downloaded incidents-dossier-${selectedIncident.id}.json successfully.`,
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast({
      type: "info",
      title: "Investigation Link Copied",
      message: `Case ${selectedIncident.id} secure URL copied to clipboard.`,
    });
  };

  const handleIsolateNode = async () => {
    await triggerPlaybook("PB-EDR-01", selectedNode.label);
    showToast({
      type: "success",
      title: `Node Isolated: ${selectedNode.label}`,
      message: `Host ${selectedNode.ip} quarantined by EDR agent. Active sockets severed.`,
    });
  };

  /* ── Summary KPIs ── */
  const kpis = [
    { label: "Currently Active Cases", value: 38 },
    { label: "Immediate Action Required", value: 5 },
    { label: "Successfully Closed", value: 127 },
    { label: "Mean Time To Respond", value: "12m" },
  ];

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* ── Header toolbar (matching Image 1) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface p-3 shadow-sm text-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ink">Incidents Management</h1>
            <DemoTag>Image 1 Operational Console</DemoTag>
          </div>
          <p className="text-[11px] text-muted mt-0.5">
            Monitor, investigate, prioritize, and resolve enterprise threat incidents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-chip border border-line bg-raised hover:bg-surface text-ink text-xs font-semibold transition-colors"
          >
            <RotateCw size={12} className={clsx("text-accent", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Syncing..." : "Refresh Data"}
          </button>
          <button
            onClick={handleExport}
            title="Export JSON Dossier"
            className="p-2 rounded-chip border border-line bg-raised hover:bg-surface text-muted hover:text-ink transition-colors"
          >
            <Download size={14} />
          </button>
          <button
            onClick={handleShare}
            title="Share Incident URL"
            className="p-2 rounded-chip border border-line bg-raised hover:bg-surface text-muted hover:text-ink transition-colors"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* ── THE 5 CORE OPERATIONAL WORKSPACES SWITCHER ── */}
      <OperationalWorkspacesBar compact />

      {/* ── 3-Column Layout matching Image 1 ── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* LEFT COL: Health Score + AI Investigation (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Incident Health Score (Zero-Overlap Precision Gauge) */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-ink uppercase tracking-wider">Incident Health Score</h2>
              <span className="text-[9px] font-mono text-ok bg-ok/10 border border-ok/30 px-1.5 py-0.5 rounded font-bold">
                OPERATIONAL
              </span>
            </div>

            <div className="flex justify-center py-2">
              <IncidentHealthGauge score={90} size={195} />
            </div>

            <div className="space-y-1.5 text-[11px] font-mono pt-1 border-t border-line/60">
              <div className="flex justify-between">
                <span className="text-muted">Active Cases</span>
                <span className="text-ink font-bold">38</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Critical Cases</span>
                <span className="text-sev-critical font-bold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Avg Resolution Time</span>
                <span className="text-ink font-bold">18m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">SLA Compliance</span>
                <span className="text-ok font-bold">97%</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-ok pt-1">
              <span className="h-2 w-2 rounded-full bg-ok animate-pulse" /> Status: Normal Defense Posture
            </div>
          </div>

          {/* AI Investigation */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bot size={14} className="text-accent" />
                <span className="text-xs font-bold text-ink">AI SOC Investigation</span>
              </div>
              <span className="text-[9px] font-mono text-accent bg-accent/10 border border-accent/30 px-1.5 py-0.5 rounded font-bold">
                GPT-SOC v4
              </span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              <span className="font-semibold text-ink">Autonomous Summary:</span> Unusual outbound traffic from{" "}
              <span className="text-accent font-mono font-semibold">{selectedNode.label}</span> detected after
              repeated failed Kerberos pre-auth attempts from DPRK-attributed IP ranges.
            </p>
            <button
              onClick={() => {
                showToast({
                  type: "info",
                  title: "AI Analysis Generated",
                  message: `Correlated 42 endpoint events with MITRE ATT&CK T1078 & T1048 for ${selectedIncident.id}.`,
                });
              }}
              className="w-full py-1.5 rounded-chip text-[11px] font-mono font-medium border border-line bg-raised hover:bg-surface text-ink transition-colors flex items-center justify-center gap-1"
            >
              <Bot size={12} className="text-accent" /> Regenerate AI Summary
            </button>
          </div>

          {/* Threat Attribution */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-2 shadow-sm">
            <h3 className="text-xs font-bold text-ink">Threat Attribution</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-ink">204</span>
              <span className="text-xs text-ok font-mono">+18% ↑</span>
            </div>
            <div className="flex gap-1.5 text-[9px] font-mono text-muted flex-wrap">
              <span>Firewall &bull; 14%</span>
              <span>DNS &bull; 31%</span>
              <span>Suricata &bull; 55%</span>
            </div>
          </div>
        </div>

        {/* CENTER COL: Network Topology (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Network Topology SVG */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h2 className="text-xs font-bold text-ink">Interactive Attack Topology Map</h2>
                <p className="text-[10px] text-muted font-mono">
                  Selected Node: <span className="text-accent font-bold">{selectedNode.label}</span> ({selectedNode.ip})
                </p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sev-critical" /> Attack Path
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-ok" /> Normal
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-chip border border-line bg-black/90 shadow-inner" style={{ height: 230 }}>
              <img
                src="/images/soc_incidents_management.jpg"
                alt="Network Topology"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <svg width="100%" height="230" viewBox="0 0 640 230" className="absolute inset-0 select-none">
                {/* Edges */}
                {EDGES.map((e, i) => {
                  const from = NETWORK_NODES.find((n) => n.id === e.from)!;
                  const to = NETWORK_NODES.find((n) => n.id === e.to)!;
                  if (!from || !to) return null;
                  const mx = (from.x + to.x) / 2;
                  const my = Math.min(from.y, to.y) - 25;
                  return (
                    <path
                      key={i}
                      d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                      fill="none"
                      stroke={e.attack ? "#ef4444" : "#22c55e"}
                      strokeWidth={e.attack ? 2.5 : 1.2}
                      strokeDasharray={e.attack ? "6 3" : "none"}
                      opacity={0.85}
                    />
                  );
                })}
                {/* Nodes with Click interaction */}
                {NETWORK_NODES.map((n) => {
                  const isSelected = selectedNode.id === n.id;
                  return (
                    <g
                      key={n.id}
                      onClick={() => {
                        setSelectedNode(n);
                        showToast({
                          type: "info",
                          title: `Inspecting Node: ${n.label}`,
                          message: `IP: ${n.ip} • Status: ${(n as any).compromised ? "Compromised / Lateral Target" : "Healthy"}`,
                        });
                      }}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={isSelected ? 17 : 14}
                        fill={n.color + (isSelected ? "66" : "33")}
                        stroke={n.color}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                      {(n as any).compromised && (
                        <circle
                          cx={n.x}
                          cy={n.y}
                          r={20}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth={1.2}
                          strokeDasharray="3 2"
                          className="animate-pulse"
                        />
                      )}
                      <text
                        x={n.x}
                        y={n.y + 26}
                        textAnchor="middle"
                        fill="white"
                        fontSize="9"
                        fontFamily="IBM Plex Mono, monospace"
                        fontWeight={isSelected ? "bold" : "normal"}
                      >
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Node Inspection Pill Overlay */}
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-line p-2 rounded text-[10px] font-mono space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted">Target:</span>
                  <span className="text-white font-bold">{selectedNode.label}</span>
                  <span className="text-muted">({selectedNode.ip})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleIsolateNode}
                    className="px-2 py-0.5 rounded bg-sev-critical text-white font-bold hover:bg-sev-critical/80 transition-colors flex items-center gap-1"
                  >
                    <Lock size={10} /> Quarantine Node
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-card border border-line bg-surface p-3 text-center space-y-1 shadow-sm">
                <p className="text-lg font-bold font-mono text-ink">{k.value}</p>
                <p className="text-[10px] text-muted leading-tight">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Global Threat Radar Table */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-ink uppercase tracking-wider">Global Threat Radar</h2>
                <p className="text-[10px] text-muted">Click any row to load into investigation dossier</p>
              </div>
              <span className="text-[10px] font-mono text-accent">5 Live Escalations</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-line text-[10px] text-muted font-mono uppercase">
                    <th className="text-left pb-2 pr-3">Assigned To</th>
                    <th className="text-left pb-2 pr-3">Incident ID</th>
                    <th className="text-left pb-2 pr-3">Threat Type</th>
                    <th className="text-left pb-2 pr-3">Origin</th>
                    <th className="text-left pb-2 pr-3">Severity</th>
                    <th className="text-right pb-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {GLOBAL_THREAT_RADAR.map((r) => {
                    const isSelected = selectedIncident.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => {
                          setSelectedIncident(r);
                          showToast({
                            type: "info",
                            title: `Loaded ${r.id}`,
                            message: `Assigned to ${r.assigned} • ${r.type}`,
                          });
                        }}
                        className={clsx(
                          "cursor-pointer transition-colors",
                          isSelected ? "bg-accent/15" : "hover:bg-raised/30"
                        )}
                      >
                        <td className="py-2.5 pr-3 font-semibold text-ink flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-accent/20 text-accent text-[9px] font-bold flex items-center justify-center shrink-0">
                            {r.assigned.split(" ").map((p) => p[0]).join("")}
                          </div>
                          {r.assigned}
                        </td>
                        <td className="py-2.5 pr-3 font-mono text-accent font-bold">{r.id}</td>
                        <td className="py-2.5 pr-3 text-ink">{r.type}</td>
                        <td className="py-2.5 pr-3 text-muted font-mono">{r.origin}</td>
                        <td className="py-2.5 pr-3">
                          <span
                            className={clsx(
                              "px-2 py-0.5 rounded text-[9px] font-bold border",
                              r.severity === "critical"
                                ? "bg-sev-critical/20 text-sev-critical border-sev-critical/30"
                                : r.severity === "high"
                                ? "bg-sev-high/20 text-sev-high border-sev-high/30"
                                : "bg-sev-medium/20 text-sev-medium border-sev-medium/30"
                            )}
                          >
                            {r.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIncident(r);
                              showToast({
                                type: "success",
                                title: `Case ${r.id} Prioritized`,
                                message: `Lead analyst ${r.assigned} notified.`,
                              });
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-mono border border-line bg-surface hover:bg-raised text-ink transition-colors"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COL: Incident Volume Trend (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Incident Volume Steps */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-ink">Incident Storyline</h2>
              <span className="text-[10px] font-mono text-accent font-bold">{selectedIncident.id}</span>
            </div>
            <div className="space-y-2">
              {INCIDENT_VOLUME_STEPS.map((step, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div
                      className={clsx(
                        "h-2 w-2 rounded-full shrink-0",
                        step.color.includes("ok")
                          ? "bg-ok"
                          : step.color.includes("accent")
                          ? "bg-accent"
                          : "bg-sev-critical"
                      )}
                    />
                    <div>
                      <p className="font-semibold text-ink text-[11px]">{step.label}</p>
                      <p className="font-mono text-[9px] text-muted">{step.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      showToast({
                        type: "info",
                        title: `Step Updated: ${step.label}`,
                        message: `Marked as ${step.status}`,
                      });
                    }}
                    className={clsx(
                      "text-[9px] font-mono font-bold px-2 py-0.5 rounded border transition-colors hover:brightness-125",
                      step.color,
                      step.color.includes("ok")
                        ? "border-ok/30 bg-ok/10"
                        : step.color.includes("accent")
                        ? "border-accent/30 bg-accent/10"
                        : "border-sev-critical/30 bg-sev-critical/10"
                    )}
                  >
                    {step.status}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Area Chart: Volume trend */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">Incident Ingestion Trend</span>
              <span className="text-[10px] font-mono text-muted">24 Hours ↓</span>
            </div>
            <div className="flex gap-3 text-[9px] font-mono mb-1">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" /> New
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Received
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-sev-critical" /> Escalated
              </span>
            </div>
            <div className="h-[125px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={INCIDENT_TREND}>
                  <defs>
                    <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--ok))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(var(--ok))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" fontSize={9} stroke="rgba(255,255,255,0.3)" />
                  <YAxis fontSize={9} stroke="rgba(255,255,255,0.3)" width={20} />
                  <Tooltip
                    contentStyle={{
                      background: "rgb(var(--surface))",
                      border: "1px solid rgb(var(--line))",
                      borderRadius: 6,
                      fontSize: 11,
                    }}
                  />
                  <Area type="monotone" dataKey="new" stroke="rgb(var(--ok))" strokeWidth={1.5} fill="url(#gradNew)" />
                  <Area type="monotone" dataKey="recv" stroke="rgb(var(--accent))" strokeWidth={1.5} fill="transparent" />
                  <Area type="monotone" dataKey="escalated" stroke="rgb(var(--sev-critical))" strokeWidth={1.5} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
