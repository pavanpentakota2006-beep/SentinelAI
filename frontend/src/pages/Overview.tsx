import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Clock,
  Activity,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Globe,
  Radio,
  User,
  Server,
  Database,
  FileText,
  Lock,
  ArrowUp,
  ArrowDown,
  Layers,
  HardDrive,
  Cpu,
  Zap,
} from "lucide-react";
import clsx from "clsx";

export default function Overview() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  /* Time filter state */
  const [eventsTimeRange, setEventsTimeRange] = useState("24 Hours");

  /* Threat Map Interactive State */
  const [mapZoom, setMapZoom] = useState<number>(1.0);
  const [mapSeverityFilter, setMapSeverityFilter] = useState<string>("All");
  const [mapTimeRange, setMapTimeRange] = useState<string>("Last 24 Hours");
  const [selectedThreatNode, setSelectedThreatNode] = useState<{
    name: string;
    ip: string;
    actor: string;
    sev: string;
    vector: string;
  } | null>(null);
  const [blockedMapIps, setBlockedMapIps] = useState<Record<string, boolean>>({});

  /* Attack Graph Selected Node */
  const [selectedGraphNode, setSelectedGraphNode] = useState<{
    name: string;
    type: string;
    details: string;
    risk: string;
  } | null>(null);

  /* ── 1. Top KPI Cards Data ── */
  const kpiStats = [
    {
      id: "kpi-events",
      label: "Total Events",
      value: "1.24M",
      delta: "18.6%",
      deltaType: "up",
      sub: "vs last 24h",
      icon: Activity,
      iconBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    {
      id: "kpi-alerts",
      label: "High Risk Alerts",
      value: "102",
      delta: "12.4%",
      deltaType: "up",
      sub: "vs last 24h",
      icon: AlertTriangle,
      iconBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    {
      id: "kpi-crit",
      label: "Critical Incidents",
      value: "7",
      delta: "40%",
      deltaType: "up-danger",
      sub: "vs last 24h",
      icon: ShieldAlert,
      iconBg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    },
    {
      id: "kpi-unresolved",
      label: "Unresolved Incidents",
      value: "23",
      delta: "4.3%",
      deltaType: "up",
      sub: "vs last 24h",
      icon: Flame,
      iconBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    {
      id: "kpi-mttd",
      label: "Mean Time to Detect",
      value: "16m 24s",
      delta: "-18.7%",
      deltaType: "down-good",
      sub: "vs last 7d",
      icon: Clock,
      iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "kpi-mttr",
      label: "Mean Time to Respond",
      value: "42m 11s",
      delta: "-22.1%",
      deltaType: "down-good",
      sub: "vs last 7d",
      icon: Shield,
      iconBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "kpi-posture",
      label: "Security Posture",
      value: "92/100",
      delta: "5.2%",
      deltaType: "up-good",
      sub: "vs last 7d",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
  ];

  /* ── 2. Events Over Time Chart Data (24-hour wave) ── */
  const eventsOverTime = [
    { time: "00:00", events: 32000 },
    { time: "02:00", events: 45000 },
    { time: "04:00", events: 28000 },
    { time: "06:00", events: 58000 },
    { time: "08:00", events: 36000 },
    { time: "10:00", events: 78000 },
    { time: "12:00", events: 54000 },
    { time: "14:00", events: 62000 },
    { time: "16:00", events: 48000 },
    { time: "18:00", events: 72000 },
    { time: "20:00", events: 58000 },
    { time: "22:00", events: 68000 },
    { time: "24:00", events: 42000 },
  ];

  /* ── 3. Event Breakdown Donut ── */
  const eventBreakdown = [
    { name: "Authentication", count: "441K", percent: "35.6%", color: "#3b82f6" },
    { name: "Network", count: "294K", percent: "23.7%", color: "#10b981" },
    { name: "Endpoint", count: "221K", percent: "17.8%", color: "#eab308" },
    { name: "Access", count: "155K", percent: "12.5%", color: "#f97316" },
    { name: "System", count: "83K", percent: "6.7%", color: "#a855f7" },
    { name: "Other", count: "46K", percent: "3.7%", color: "#64748b" },
  ];

  /* ── 4. Recent Alerts List ── */
  const recentAlerts = [
    {
      id: "ra-1",
      title: "Suspicious Login from Unfamiliar Location",
      time: "10:24:35 AM",
      sev: "Critical",
      sevColor: "bg-rose-500/20 text-rose-400 border-rose-500/40",
      dotColor: "bg-rose-500",
    },
    {
      id: "ra-2",
      title: "Malware Detected on Workstation WS-027",
      time: "10:22:11 AM",
      sev: "High",
      sevColor: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      dotColor: "bg-orange-500",
    },
    {
      id: "ra-3",
      title: "Brute Force Attack Detected",
      time: "10:19:47 AM",
      sev: "High",
      sevColor: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      dotColor: "bg-orange-500",
    },
    {
      id: "ra-4",
      title: "Unusual Data Exfiltration Pattern",
      time: "10:18:23 AM",
      sev: "Medium",
      sevColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      dotColor: "bg-amber-500",
    },
    {
      id: "ra-5",
      title: "Privileged Account Anomaly",
      time: "10:15:09 AM",
      sev: "Medium",
      sevColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      dotColor: "bg-amber-500",
    },
  ];

  /* ── 5. Incident Status Data ── */
  const incidentStatusData = [
    { name: "Open", count: 23, percent: "76.7%", color: "#ef4444" },
    { name: "In Progress", count: 4, percent: "13.3%", color: "#f97316" },
    { name: "On Hold", count: 2, percent: "6.7%", color: "#eab308" },
    { name: "Closed", count: 1, percent: "3.3%", color: "#10b981" },
  ];

  /* ── 6. Top Attack Techniques (MITRE) ── */
  const topTechniques = [
    { id: "T1059", name: "Command & Scripting Interpreter", count: 312, percent: 95, color: "bg-rose-500" },
    { id: "T1078", name: "Valid Accounts", count: 245, percent: 75, color: "bg-orange-500" },
    { id: "T1046", name: "Network Service Scanning", count: 198, percent: 60, color: "bg-blue-500" },
    { id: "T1566", name: "Phishing", count: 171, percent: 52, color: "bg-emerald-500" },
    { id: "T1021", name: "Remote Services", count: 146, percent: 45, color: "bg-cyan-500" },
  ];

  /* ── 7. Top Targeted Assets ── */
  const topTargetedAssets = [
    {
      asset: "SRV-PROD-DB-01",
      crit: 98,
      critColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      alerts: 156,
      spark: [20, 45, 38, 70, 65, 88, 98],
      sparkColor: "#f97316",
    },
    {
      asset: "SRV-PROD-WEB-02",
      crit: 95,
      critColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      alerts: 132,
      spark: [18, 35, 42, 60, 58, 80, 95],
      sparkColor: "#f97316",
    },
    {
      asset: "ENDPOINT-WIN-27",
      crit: 80,
      critColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
      alerts: 98,
      spark: [12, 28, 30, 45, 52, 68, 80],
      sparkColor: "#eab308",
    },
    {
      asset: "SRV-APP-03",
      crit: 75,
      critColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
      alerts: 85,
      spark: [10, 20, 25, 40, 48, 62, 75],
      sparkColor: "#06b6d4",
    },
    {
      asset: "FIREWALL-01",
      crit: 70,
      critColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      alerts: 73,
      spark: [8, 18, 22, 35, 40, 55, 70],
      sparkColor: "#06b6d4",
    },
  ];

  /* ── 8. Threat Intelligence Feed ── */
  const threatIntelFeed = [
    {
      type: "IOC Matched: Malicious IP",
      value: "203.0.113.45",
      time: "10:23 AM",
      sev: "Critical",
      sevColor: "bg-rose-500/20 text-rose-400 border-rose-500/40",
      iconColor: "text-rose-500",
    },
    {
      type: "IOC Matched: Malicious Domain",
      value: "bad-domain[.]com",
      time: "10:20 AM",
      sev: "High",
      sevColor: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      iconColor: "text-orange-500",
    },
    {
      type: "IOC Matched: Malicious Hash",
      value: "a3f5...9c2d",
      time: "10:18 AM",
      sev: "High",
      sevColor: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      iconColor: "text-orange-500",
    },
    {
      type: "New CVE Published",
      value: "CVE-2025-22457",
      time: "10:15 AM",
      sev: "Medium",
      sevColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      iconColor: "text-amber-500",
    },
  ];

  /* ── 9. Active Incidents Table ── */
  const activeIncidentsList = [
    {
      id: "INC-2025-0007",
      title: "Data Exfiltration Detected",
      sev: "Critical",
      sevBadge: "bg-rose-500/20 text-rose-400 border-rose-500/40",
      status: "In Progress",
      statusBadge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      asset: "SRV-PROD-DB-01",
      assignee: "Alice Johnson",
      update: "2 min ago",
    },
    {
      id: "INC-2025-0006",
      title: "Ransomware Activity",
      sev: "Critical",
      sevBadge: "bg-rose-500/20 text-rose-400 border-rose-500/40",
      status: "In Progress",
      statusBadge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      asset: "ENDPOINT-WIN-27",
      assignee: "Mark Wilson",
      update: "5 min ago",
    },
    {
      id: "INC-2025-0005",
      title: "Multiple Failed Logins",
      sev: "High",
      sevBadge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      status: "Open",
      statusBadge: "bg-rose-500/20 text-rose-400 border-rose-500/40",
      asset: "SRV-PROD-WEB-02",
      assignee: "Sophia Brown",
      update: "8 min ago",
    },
    {
      id: "INC-2025-0004",
      title: "Privilege Escalation Attempt",
      sev: "High",
      sevBadge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      status: "Open",
      statusBadge: "bg-rose-500/20 text-rose-400 border-rose-500/40",
      asset: "SRV-APP-03",
      assignee: "James Smith",
      update: "15 min ago",
    },
    {
      id: "INC-2025-0003",
      title: "Suspicious Lateral Movement",
      sev: "Medium",
      sevBadge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      status: "Open",
      statusBadge: "bg-rose-500/20 text-rose-400 border-rose-500/40",
      asset: "FIREWALL-01",
      assignee: "Daniel Lee",
      update: "22 min ago",
    },
  ];

  /* ── 10. System Health Checks ── */
  const systemHealthChecks = [
    { service: "Event Ingestion", status: "Healthy", dot: "bg-emerald-400" },
    { service: "Correlation Engine", status: "Healthy", dot: "bg-emerald-400" },
    { service: "AI/ML Engine", status: "Healthy", dot: "bg-emerald-400" },
    { service: "Threat Intel Feeds", status: "Healthy", dot: "bg-emerald-400" },
    { service: "Database", status: "Healthy", dot: "bg-emerald-400" },
    { service: "Storage", status: "Warning", dot: "bg-amber-400" },
    { service: "Backup", status: "Healthy", dot: "bg-emerald-400" },
  ];

  return (
    <div className="space-y-4 animate-fadeIn pb-12 font-sans select-none text-ink text-xs">
      {/* ── ROW 1: 7 KPI CARDS (Matching Image 2 exactly) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {kpiStats.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="rounded-card border border-line bg-surface p-3 flex flex-col justify-between shadow-xs hover:border-line/80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted font-medium truncate">{kpi.label}</span>
                <div className={clsx("h-6 w-6 rounded-chip flex items-center justify-center shrink-0 border", kpi.iconBg)}>
                  <Icon size={13} />
                </div>
              </div>

              <div className="mt-1.5">
                <span className="text-lg font-bold font-mono tracking-tight text-ink block">{kpi.value}</span>
                <div className="flex items-center gap-1 mt-0.5 text-[9px] font-mono">
                  {kpi.deltaType.includes("up") ? (
                    <span className={clsx("flex items-center font-semibold", kpi.deltaType === "up-danger" ? "text-rose-400" : "text-emerald-400")}>
                      ↑ {kpi.delta}
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center font-semibold">
                      ↓ {kpi.delta}
                    </span>
                  )}
                  <span className="text-muted">{kpi.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ROW 2: LIVE THREAT MAP, EVENTS OVER TIME, EVENT BREAKDOWN, RECENT ALERTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Col 1 (span-4): LIVE THREAT MAP */}
        <div className="lg:col-span-4 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ink">Live Threat Map</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    const filters = ["All", "Critical", "High", "Medium", "Low"];
                    const next = filters[(filters.indexOf(mapSeverityFilter) + 1) % filters.length];
                    setMapSeverityFilter(next);
                    showToast({ type: "info", title: "Severity Filter Changed", message: `Filter active: ${next} Threats` });
                  }}
                  className="px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold border border-accent/40 hover:bg-accent/30 transition-colors cursor-pointer"
                  title="Click to cycle severity filter"
                >
                  {mapSeverityFilter}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const times = ["Last 24 Hours", "Today", "Last 7 Days", "Last 1 Hour"];
                    const next = times[(times.indexOf(mapTimeRange) + 1) % times.length];
                    setMapTimeRange(next);
                    showToast({ type: "info", title: "Time Window Updated", message: `Map telemetry window: ${next}` });
                  }}
                  className="text-muted hover:text-ink transition-colors cursor-pointer"
                  title="Click to change time range"
                >
                  {mapTimeRange} ▾
                </button>
              </div>
            </div>

            {/* SVG Interactive World Threat Map with Arcs */}
            <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-black/90 border border-line/60">
              <svg viewBox="0 0 400 210" className="w-full h-full select-none">
                <g
                  transform={`scale(${mapZoom})`}
                  style={{
                    transformOrigin: "200px 105px",
                    transition: "transform 0.25s ease-out",
                  }}
                >
                  {/* North America */}
                  <path
                    d="M 40 40 C 65 30 95 32 120 45 C 128 58 115 75 95 85 C 80 92 65 75 55 65 C 45 55 35 45 40 40 Z"
                    fill="rgba(56, 189, 248, 0.12)"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="0.8"
                  />
                  {/* Greenland */}
                  <path
                    d="M 125 25 C 135 22 145 28 140 38 C 132 42 122 35 125 25 Z"
                    fill="rgba(56, 189, 248, 0.12)"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="0.8"
                  />
                  {/* South America */}
                  <path
                    d="M 90 98 C 105 102 122 115 118 138 C 112 158 100 175 92 172 C 85 160 82 135 84 115 C 86 102 88 98 90 98 Z"
                    fill="rgba(56, 189, 248, 0.12)"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="0.8"
                  />
                  {/* Europe */}
                  <path
                    d="M 180 42 C 200 36 215 42 225 55 C 220 68 205 72 190 70 C 182 65 178 52 180 42 Z"
                    fill="rgba(56, 189, 248, 0.12)"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="0.8"
                  />
                  {/* Africa */}
                  <path
                    d="M 182 78 C 205 76 226 84 225 110 C 222 135 210 155 198 152 C 188 142 180 120 178 100 C 176 86 180 80 182 78 Z"
                    fill="rgba(56, 189, 248, 0.12)"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="0.8"
                  />
                  {/* Asia / Eurasia */}
                  <path
                    d="M 226 42 C 270 32 335 34 365 52 C 375 75 355 100 325 105 C 295 108 265 92 245 78 C 235 68 228 55 226 42 Z"
                    fill="rgba(56, 189, 248, 0.12)"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="0.8"
                  />
                  {/* Australia */}
                  <path
                    d="M 315 132 C 345 130 358 142 352 160 C 342 168 322 168 312 155 C 308 144 310 135 315 132 Z"
                    fill="rgba(56, 189, 248, 0.12)"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="0.8"
                  />

                  {/* Threat Trajectory Arcs (Filtered by mapSeverityFilter) */}
                  {(mapSeverityFilter === "All" || mapSeverityFilter === "Critical") && (
                    <path
                      d="M 310 55 Q 200 -10 95 80"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                  )}
                  {(mapSeverityFilter === "All" || mapSeverityFilter === "High") && (
                    <path d="M 330 75 Q 220 20 95 80" fill="none" stroke="#f97316" strokeWidth="1.3" />
                  )}
                  {(mapSeverityFilter === "All" || mapSeverityFilter === "Critical") && (
                    <path d="M 210 65 Q 160 30 95 80" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  )}
                  {(mapSeverityFilter === "All" || mapSeverityFilter === "Medium") && (
                    <path d="M 95 80 Q 170 110 325 150" fill="none" stroke="#eab308" strokeWidth="1.2" />
                  )}

                  {/* Interactive Threat Source & Target Nodes */}
                  {/* Russia APT node */}
                  {(mapSeverityFilter === "All" || mapSeverityFilter === "Critical") && (
                    <g
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedThreatNode({
                          name: "APT29 C2 Ingress (Moscow)",
                          ip: "185.220.101.5",
                          actor: "Cozy Bear (SVR)",
                          sev: "Critical",
                          vector: "Kerberos TGT Forgery & Brute Force",
                        });
                        showToast({ type: "error", title: "Russia Node Inspected", message: "APT29 C2 Hub located in Moscow region. Active brute force." });
                      }}
                    >
                      <circle cx="310" cy="55" r="7" fill="#ef4444" className="animate-ping" opacity={0.6} />
                      <circle cx="310" cy="55" r="4.5" fill="#ef4444" />
                    </g>
                  )}

                  {/* China node */}
                  {(mapSeverityFilter === "All" || mapSeverityFilter === "High") && (
                    <g
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedThreatNode({
                          name: "Volt Typhoon Ingress (Beijing)",
                          ip: "194.26.29.112",
                          actor: "Volt Typhoon (PLA)",
                          sev: "High",
                          vector: "DMZ Port 443 Scanning & Exploits",
                        });
                        showToast({ type: "warning", title: "China Node Inspected", message: "Mirai botnet ingress cluster probing Port 443." });
                      }}
                    >
                      <circle cx="330" cy="75" r="4.5" fill="#f97316" />
                    </g>
                  )}

                  {/* US Target hub */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedThreatNode({
                        name: "US Central Defense Hub (DMZ Gateway)",
                        ip: "10.0.1.1",
                        actor: "SentinelX Core Defense",
                        sev: "Protected",
                        vector: "Active Edge Filtering (99.4% Blocked)",
                      });
                      showToast({ type: "success", title: "US Hub Inspected", message: "US Enterprise Core. 99.4% ingress dropped by perimeter ACL." });
                    }}
                  >
                    <circle cx="95" cy="80" r="9" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="2 2" />
                    <circle cx="95" cy="80" r="5" fill="#3b82f6" />
                  </g>

                  {/* Europe node */}
                  {(mapSeverityFilter === "All" || mapSeverityFilter === "Critical") && (
                    <g
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedThreatNode({
                          name: "Frankfurt Relay Proxy",
                          ip: "45.154.255.89",
                          actor: "Cobalt Strike Team",
                          sev: "Critical",
                          vector: "Encrypted SSL Tunnel Lateral Pivot",
                        });
                        showToast({ type: "error", title: "EU Node Inspected", message: "European proxy relay scrubbing encrypted traffic." });
                      }}
                    >
                      <circle cx="210" cy="65" r="4" fill="#ef4444" />
                    </g>
                  )}

                  {/* South America node */}
                  {(mapSeverityFilter === "All" || mapSeverityFilter === "Medium") && (
                    <g
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedThreatNode({
                          name: "São Paulo Botnet Ingress",
                          ip: "103.251.167.20",
                          actor: "Mirai IoT Cluster",
                          sev: "Medium",
                          vector: "Volumetric SYN Flood Packet Attempts",
                        });
                        showToast({ type: "info", title: "South America Node Inspected", message: "IoT ingress dropped by edge rate-limiter." });
                      }}
                    >
                      <circle cx="105" cy="150" r="3.5" fill="#eab308" />
                    </g>
                  )}
                </g>
              </svg>

              {/* Map Zoom Controls (+ / - / Reset) */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(2.5, Number((mapZoom + 0.25).toFixed(2)));
                    setMapZoom(next);
                    showToast({ type: "info", title: "Map Zoom In", message: `Zoom Level: ${next}x` });
                  }}
                  className="h-5 w-5 rounded bg-surface/90 border border-line text-[11px] font-mono font-bold text-ink flex items-center justify-center hover:bg-accent hover:text-accent-ink transition-colors cursor-pointer shadow-xs"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(0.75, Number((mapZoom - 0.25).toFixed(2)));
                    setMapZoom(next);
                    showToast({ type: "info", title: "Map Zoom Out", message: `Zoom Level: ${next}x` });
                  }}
                  className="h-5 w-5 rounded bg-surface/90 border border-line text-[11px] font-mono font-bold text-ink flex items-center justify-center hover:bg-accent hover:text-accent-ink transition-colors cursor-pointer shadow-xs"
                  title="Zoom Out"
                >
                  -
                </button>
                {mapZoom !== 1.0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setMapZoom(1.0);
                      showToast({ type: "info", title: "Zoom Reset", message: "Reset to 1.0x view." });
                    }}
                    className="h-5 px-1 rounded bg-surface/90 border border-line text-[8px] font-mono text-muted hover:text-ink flex items-center justify-center cursor-pointer shadow-xs"
                    title="Reset Zoom"
                  >
                    1x
                  </button>
                )}
              </div>

              {/* In-Place Threat Node Inspector Card */}
              {selectedThreatNode && (
                <div className="absolute top-2 right-2 max-w-[220px] rounded-card border border-line bg-surface/95 backdrop-blur-md p-2.5 shadow-xl text-[9px] font-mono space-y-1.5 z-20 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-line pb-1">
                    <span className="font-bold text-ink truncate pr-1">{selectedThreatNode.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedThreatNode(null)}
                      className="text-muted hover:text-ink font-bold px-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-0.5 text-muted">
                    <div>IP: <span className="text-ink font-bold">{selectedThreatNode.ip}</span></div>
                    <div>Actor: <span className="text-accent">{selectedThreatNode.actor}</span></div>
                    <div className="truncate">Vector: <span className="text-ink">{selectedThreatNode.vector}</span></div>
                    <div>Status: <span className={blockedMapIps[selectedThreatNode.ip] ? "text-ok font-bold" : "text-sev-critical font-bold"}>
                      {blockedMapIps[selectedThreatNode.ip] ? "QUARANTINED" : "ACTIVE INGRESS"}
                    </span></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const ip = selectedThreatNode.ip;
                      setBlockedMapIps((prev) => {
                        const next = !prev[ip];
                        showToast({
                          type: next ? "error" : "info",
                          title: next ? "Perimeter IP Null-Routed" : "IP Restored",
                          message: next ? `BGP null-route enforced on ${ip}. Ingress dropped.` : `Perimeter filter removed for ${ip}.`,
                        });
                        return { ...prev, [ip]: next };
                      });
                    }}
                    className="w-full py-1 rounded bg-sev-critical/20 border border-sev-critical/40 text-sev-critical font-bold hover:bg-sev-critical/30 transition-colors cursor-pointer text-center block"
                  >
                    {blockedMapIps[selectedThreatNode.ip] ? "Restore Ingress" : "Null-Route IP at Edge"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Map Legend (Clickable Filters) */}
          <div className="flex items-center justify-between text-[9px] font-mono pt-2 border-t border-line/60">
            <button
              type="button"
              onClick={() => {
                setMapSeverityFilter("Critical");
                showToast({ type: "info", title: "Filter Applied", message: "Displaying Critical severity trajectories." });
              }}
              className={clsx(
                "flex items-center gap-1 transition-colors cursor-pointer px-1 py-0.5 rounded",
                mapSeverityFilter === "Critical" ? "text-rose-400 bg-rose-500/10 font-bold" : "text-muted hover:text-ink"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical
            </button>
            <button
              type="button"
              onClick={() => {
                setMapSeverityFilter("High");
                showToast({ type: "info", title: "Filter Applied", message: "Displaying High severity trajectories." });
              }}
              className={clsx(
                "flex items-center gap-1 transition-colors cursor-pointer px-1 py-0.5 rounded",
                mapSeverityFilter === "High" ? "text-orange-400 bg-orange-500/10 font-bold" : "text-muted hover:text-ink"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-orange-500" /> High
            </button>
            <button
              type="button"
              onClick={() => {
                setMapSeverityFilter("Medium");
                showToast({ type: "info", title: "Filter Applied", message: "Displaying Medium severity trajectories." });
              }}
              className={clsx(
                "flex items-center gap-1 transition-colors cursor-pointer px-1 py-0.5 rounded",
                mapSeverityFilter === "Medium" ? "text-amber-400 bg-amber-500/10 font-bold" : "text-muted hover:text-ink"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Medium
            </button>
            <button
              type="button"
              onClick={() => {
                setMapSeverityFilter("Low");
                showToast({ type: "info", title: "Filter Applied", message: "Displaying Low severity trajectories." });
              }}
              className={clsx(
                "flex items-center gap-1 transition-colors cursor-pointer px-1 py-0.5 rounded",
                mapSeverityFilter === "Low" ? "text-emerald-400 bg-emerald-500/10 font-bold" : "text-muted hover:text-ink"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Low
            </button>
          </div>
        </div>

        {/* Col 2 (span-3): EVENTS OVER TIME */}
        <div className="lg:col-span-3 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">Events Over Time</span>
              <span className="text-[9px] font-mono text-muted bg-bg px-2 py-0.5 rounded border border-line">
                24 Hours ▾
              </span>
            </div>
            <span className="text-[9px] font-mono text-muted block mb-1">Events (K)</span>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={eventsOverTime} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="eventsWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="80%" stopColor="#06b6d4" stopOpacity={0.05} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#64748b", fontSize: 8, fontFamily: "IBM Plex Mono" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 8, fontFamily: "IBM Plex Mono" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                    tickFormatter={(val) => `${val / 1000}K`}
                  />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="#06b6d4"
                    strokeWidth={1.8}
                    fill="url(#eventsWaveGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Col 3 (span-2.5): EVENT BREAKDOWN */}
        <div className="lg:col-span-2 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink block mb-2">Event Breakdown</span>

            <div className="flex flex-col items-center">
              {/* Donut Chart */}
              <div className="h-28 w-28 relative my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eventBreakdown}
                      dataKey="percent"
                      nameKey="name"
                      innerRadius={30}
                      outerRadius={48}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {eventBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold font-mono text-ink">1.24M</span>
                  <span className="text-[7px] text-muted font-mono">Total</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="w-full space-y-1 text-[9px] font-mono mt-1">
                {eventBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-muted">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="text-ink font-semibold shrink-0">{item.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Col 4 (span-2.5): RECENT ALERTS */}
        <div className="lg:col-span-3 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">Recent Alerts</span>
              <button
                type="button"
                onClick={() => navigate("/alerts")}
                className="text-[9px] font-mono text-accent hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-1.5">
              {recentAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-1.5 rounded-chip bg-bg/50 border border-line/50 flex items-center justify-between gap-1.5 hover:border-line transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0", alt.dotColor)} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-ink truncate leading-tight">{alt.title}</p>
                      <span className="text-[8px] text-muted font-mono block">{alt.time}</span>
                    </div>
                  </div>
                  <span className={clsx("text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0", alt.sevColor)}>
                    {alt.sev}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: INCIDENT STATUS, TOP ATTACK TECHNIQUES, TOP TARGETED ASSETS, THREAT INTEL FEED ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Col 1 (span-2.5): INCIDENT STATUS */}
        <div className="lg:col-span-2 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">Incident Status</span>
              <button
                type="button"
                onClick={() => navigate("/incidents")}
                className="text-[9px] font-mono text-accent hover:underline"
              >
                View All
              </button>
            </div>

            <div className="flex flex-col items-center">
              {/* Semi-Donut / Gauge */}
              <div className="h-28 w-28 relative my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incidentStatusData}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={32}
                      outerRadius={48}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {incidentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-bold font-mono text-ink">30</span>
                  <span className="text-[8px] text-muted font-mono">Total</span>
                </div>
              </div>

              {/* Status List */}
              <div className="w-full space-y-1 text-[9px] font-mono mt-1">
                {incidentStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </span>
                    <span className="text-ink font-semibold">{item.count} ({item.percent})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Col 2 (span-3.5): TOP ATTACK TECHNIQUES (MITRE) */}
        <div className="lg:col-span-3 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">Top Attack Techniques</span>
              <button
                type="button"
                onClick={() => navigate("/mitre")}
                className="text-[9px] font-mono text-accent hover:underline"
              >
                MITRE ATT&CK
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {topTechniques.map((tech) => (
                <div key={tech.id} className="space-y-0.5 text-[9px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-muted truncate max-w-[170px]">
                      <span className="font-bold text-ink mr-1">{tech.id}</span>
                      {tech.name}
                    </span>
                    <span className="text-ink font-bold">{tech.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden">
                    <div
                      className={clsx("h-full rounded-full", tech.color)}
                      style={{ width: `${tech.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3 (span-3.5): TOP TARGETED ASSETS */}
        <div className="lg:col-span-4 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">Top Targeted Assets</span>
              <button
                type="button"
                onClick={() => navigate("/assets")}
                className="text-[9px] font-mono text-accent hover:underline"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[9px] font-mono">
                <thead>
                  <tr className="border-b border-line text-muted uppercase text-[8px]">
                    <th className="pb-1.5">Asset</th>
                    <th className="pb-1.5 text-center">Criticality</th>
                    <th className="pb-1.5 text-center">Alerts</th>
                    <th className="pb-1.5 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {topTargetedAssets.map((ast) => (
                    <tr key={ast.asset} className="hover:bg-raised/40 transition-colors">
                      <td className="py-1.5 font-bold text-ink truncate max-w-[120px]">{ast.asset}</td>
                      <td className="py-1.5 text-center">
                        <span className={clsx("px-1 py-0.2 rounded border font-bold text-[8px]", ast.critColor)}>
                          {ast.crit}
                        </span>
                      </td>
                      <td className="py-1.5 text-center font-bold text-ink">{ast.alerts}</td>
                      <td className="py-1.5 text-right w-14">
                        <div className="h-4 w-14 ml-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ast.spark.map((v, i) => ({ i, v }))}>
                              <Line type="monotone" dataKey="v" stroke={ast.sparkColor} strokeWidth={1.5} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Col 4 (span-3): THREAT INTELLIGENCE FEED */}
        <div className="lg:col-span-3 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">Threat Intelligence Feed</span>
              <button
                type="button"
                onClick={() => navigate("/threat-intel")}
                className="text-[9px] font-mono text-accent hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-1.5">
              {threatIntelFeed.map((feed, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded-chip bg-bg/50 border border-line/50 flex items-center justify-between gap-1.5 hover:border-line transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Radio size={11} className={clsx("shrink-0", feed.iconColor)} />
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold text-ink truncate leading-tight">{feed.type}</p>
                      <span className="text-[8px] text-muted font-mono truncate block">{feed.value}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={clsx("text-[8px] font-mono font-bold px-1 py-0.2 rounded border", feed.sevColor)}>
                      {feed.sev}
                    </span>
                    <span className="text-[7px] text-muted font-mono block mt-0.5">{feed.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 4: ACTIVE INCIDENTS, ATTACK GRAPH, SYSTEM HEALTH ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Col 1 (span-5): ACTIVE INCIDENTS TABLE */}
        <div className="lg:col-span-5 rounded-card border border-line bg-surface p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink">Active Incidents</span>
            <button
              type="button"
              onClick={() => navigate("/incidents")}
              className="text-[9px] font-mono text-accent hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[9px] font-mono">
              <thead>
                <tr className="border-b border-line text-muted uppercase text-[8px]">
                  <th className="pb-1.5 pr-2">ID</th>
                  <th className="pb-1.5 pr-2">Title</th>
                  <th className="pb-1.5 pr-2">Severity</th>
                  <th className="pb-1.5 pr-2">Status</th>
                  <th className="pb-1.5 pr-2">Affected Asset</th>
                  <th className="pb-1.5 pr-2">Assigned To</th>
                  <th className="pb-1.5 text-right">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {activeIncidentsList.map((inc) => (
                  <tr key={inc.id} className="hover:bg-raised/40 transition-colors">
                    <td className="py-1.5 pr-2 font-bold text-accent whitespace-nowrap">{inc.id}</td>
                    <td className="py-1.5 pr-2 font-medium text-ink truncate max-w-[130px]">{inc.title}</td>
                    <td className="py-1.5 pr-2 whitespace-nowrap">
                      <span className={clsx("text-[8px] font-bold px-1.5 py-0.2 rounded border", inc.sevBadge)}>
                        {inc.sev}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 whitespace-nowrap">
                      <span className={clsx("text-[8px] font-bold px-1.5 py-0.2 rounded border", inc.statusBadge)}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 text-muted whitespace-nowrap">{inc.asset}</td>
                    <td className="py-1.5 pr-2 text-ink whitespace-nowrap">{inc.assignee}</td>
                    <td className="py-1.5 text-right text-muted whitespace-nowrap">{inc.update}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Col 2 (span-4): ATTACK GRAPH (INC-2025-0007) */}
        <div className="lg:col-span-4 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">Attack Graph (INC-2025-0007)</span>
              <button
                type="button"
                onClick={() => navigate("/attack-graph")}
                className="text-[9px] font-mono text-accent hover:underline flex items-center gap-1"
              >
                View Full Graph <ExternalLink size={9} />
              </button>
            </div>

            {/* SVG Interactive Node-Link Attack Chain matching Image 2 */}
            <div className="relative aspect-[16/9] w-full rounded bg-black/90 border border-line/60 overflow-hidden flex items-center justify-center p-2">
              <svg viewBox="0 0 340 140" className="w-full h-full select-none font-mono">
                {/* Connecting Lines */}
                <line x1="45" y1="70" x2="115" y2="70" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2" />
                <line x1="115" y1="70" x2="185" y2="70" stroke="#3b82f6" strokeWidth="1.5" />
                <path d="M 185 70 Q 215 45 255 45" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M 185 70 Q 215 95 255 95" fill="none" stroke="#3b82f6" strokeWidth="1.5" />

                {/* Node 1: Malicious IP (External, red) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedGraphNode({
                      name: "203.0.113.45",
                      type: "External Adversary IP",
                      details: "Origin: Moscow, RU | ASN 49505 | Cobalt Strike C2",
                      risk: "Critical (99/100)",
                    });
                    showToast({ type: "error", title: "Adversary Node Selected", message: "203.0.113.45 - Malicious C2 ingress channel." });
                  }}
                >
                  <circle cx="45" cy="70" r="14" fill="#ef4444" opacity={0.2} className="animate-pulse" />
                  <circle cx="45" cy="70" r="11" fill="#1e1e2d" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="45" y="73" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">IP</text>
                  <text x="45" y="93" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="bold">203.0.113.45</text>
                  <text x="45" y="101" textAnchor="middle" fill="#64748b" fontSize="6">Malicious IP</text>
                </g>

                {/* Node 2: Compromised Account (Account, amber) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedGraphNode({
                      name: "user.john",
                      type: "Compromised AD User",
                      details: "Domain: CORP.LOCAL | Kerberos Golden Ticket forged",
                      risk: "High Risk Tier",
                    });
                    showToast({ type: "warning", title: "Account Node Selected", message: "user.john - Kerberos privilege escalation detected." });
                  }}
                >
                  <circle cx="115" cy="70" r="11" fill="#1e1e2d" stroke="#f97316" strokeWidth="1.5" />
                  <text x="115" y="73" textAnchor="middle" fill="#f97316" fontSize="8">👤</text>
                  <text x="115" y="93" textAnchor="middle" fill="#f97316" fontSize="7" fontWeight="bold">user.john</text>
                  <text x="115" y="101" textAnchor="middle" fill="#64748b" fontSize="6">Compromised Acct</text>
                </g>

                {/* Node 3: Web Server (Host, blue) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedGraphNode({
                      name: "SRV-PROD-WEB-02",
                      type: "Web Application Server",
                      details: "IP: 10.0.2.80 | Apache/Tomcat | Reverse shell active",
                      risk: "Compromised Host",
                    });
                    showToast({ type: "error", title: "Web Server Inspected", message: "SRV-PROD-WEB-02 initial entry point via CVE-2025-22457." });
                  }}
                >
                  <circle cx="185" cy="70" r="11" fill="#1e1e2d" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="185" y="73" textAnchor="middle" fill="#3b82f6" fontSize="8">🖥️</text>
                  <text x="185" y="93" textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="bold">SRV-PROD-WEB-02</text>
                  <text x="185" y="101" textAnchor="middle" fill="#64748b" fontSize="6">Web Server</text>
                </g>

                {/* Node 4 (Top): Database Server (Critical Target, red) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedGraphNode({
                      name: "SRV-PROD-DB-01",
                      type: "PostgreSQL Database Cluster",
                      details: "IP: 10.0.3.50 | Exfiltration target | PCI-DSS Vault",
                      risk: "Critical Asset Target",
                    });
                    showToast({ type: "error", title: "Database Target Inspected", message: "SRV-PROD-DB-01 active target of SQL exfiltration attempts." });
                  }}
                >
                  <circle cx="255" cy="45" r="11" fill="#1e1e2d" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="255" y="48" textAnchor="middle" fill="#ef4444" fontSize="8">🗄️</text>
                  <text x="255" y="24" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="bold">SRV-PROD-DB-01</text>
                  <text x="255" y="32" textAnchor="middle" fill="#64748b" fontSize="6">Database Server</text>
                </g>

                {/* Node 5 (Bottom): File Server (Internal Host, blue) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedGraphNode({
                      name: "FILE-SRV-01",
                      type: "Corporate SMB File Server",
                      details: "IP: 10.0.1.25 | Ransomware shadow copy deletion",
                      risk: "Contained",
                    });
                    showToast({ type: "info", title: "File Server Inspected", message: "FILE-SRV-01 shadow copies preserved. EDR containment active." });
                  }}
                >
                  <circle cx="255" cy="95" r="11" fill="#1e1e2d" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="255" y="98" textAnchor="middle" fill="#3b82f6" fontSize="8">📁</text>
                  <text x="255" y="116" textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="bold">FILE-SRV-01</text>
                  <text x="255" y="124" textAnchor="middle" fill="#64748b" fontSize="6">File Server</text>
                </g>
              </svg>

              {/* In-Place Graph Node Inspector Card */}
              {selectedGraphNode && (
                <div className="absolute top-2 right-2 max-w-[210px] rounded-card border border-line bg-surface/95 backdrop-blur-md p-2 shadow-xl text-[9px] font-mono space-y-1 z-20 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-line pb-0.5">
                    <span className="font-bold text-ink truncate">{selectedGraphNode.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedGraphNode(null)}
                      className="text-muted hover:text-ink font-bold px-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-accent text-[8px]">{selectedGraphNode.type}</div>
                  <div className="text-muted text-[8px] leading-tight">{selectedGraphNode.details}</div>
                  <div className="text-rose-400 font-bold text-[8px]">{selectedGraphNode.risk}</div>
                </div>
              )}
            </div>
          </div>

          {/* Graph Legend */}
          <div className="flex items-center justify-between text-[8px] font-mono pt-2 border-t border-line/60">
            <span className="flex items-center gap-1 text-muted">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> External
            </span>
            <span className="flex items-center gap-1 text-muted">
              <span className="h-2 w-2 rounded-full bg-orange-400" /> Account
            </span>
            <span className="flex items-center gap-1 text-muted">
              <span className="h-2 w-2 rounded-full bg-blue-400" /> Host
            </span>
            <span className="text-muted">── Data Flow</span>
          </div>
        </div>

        {/* Col 3 (span-3): SYSTEM HEALTH */}
        <div className="lg:col-span-3 rounded-card border border-line bg-surface p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">System Health</span>
              <button
                type="button"
                onClick={() => navigate("/health")}
                className="text-[9px] font-mono text-accent hover:underline"
              >
                View Details
              </button>
            </div>

            <div className="space-y-1.5 mt-1">
              {systemHealthChecks.map((srv) => (
                <div
                  key={srv.service}
                  className="p-1.5 rounded-chip bg-bg/50 border border-line/50 flex items-center justify-between text-[9px] font-mono"
                >
                  <span className="text-ink font-medium flex items-center gap-1.5">
                    <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0", srv.dot)} />
                    {srv.service}
                  </span>
                  <span
                    className={clsx(
                      "font-bold",
                      srv.status === "Healthy" ? "text-emerald-400" : "text-amber-400"
                    )}
                  >
                    {srv.status} ●
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 5: BOTTOM FOOTER (Matching Image 2 exactly) ── */}
      <div className="rounded-card border border-line bg-surface/90 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[10px] font-mono text-muted shadow-xs">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <span>Data Retention:</span>
            <span className="text-ink font-bold">90 days</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Last Data Update:</span>
            <span className="text-ink font-semibold">10:24:35 AM</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>All times are shown in</span>
            <span className="text-ink font-semibold">UTC+05:30</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-ink transition-colors">Support</a>
        </div>
      </div>
    </div>
  );
}
