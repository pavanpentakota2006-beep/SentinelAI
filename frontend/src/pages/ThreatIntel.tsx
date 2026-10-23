import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { DemoTag } from "@/components/ui";
import { Search, Radio, ChevronDown } from "lucide-react";
import clsx from "clsx";

/* ── Top Threat Rows (world map attacks table) ── */
const ATTACKS = [
  { type: "Cross-Site Scripting Over HTTP", id: "12.11\u00a0EPS", from: "US", to: "Turkey", color: "text-sev-high" },
  { type: "Cross-Site Scripting Over HTTP", id: "12.11\u00a0EPS", from: "US", to: "Turkey", color: "text-sev-high" },
  { type: "UERPO Windows Windows FTP Process", id: "3.8\u00a0EPS", from: "France", to: "Greece", color: "text-sev-critical" },
  { type: "Cross-Site Scripting Over HTTP", id: "3.6\u00a0EPS", from: "US", to: "Turkey", color: "text-sev-high" },
  { type: "Infecting URL XSLTC &&4Agpbktc", id: "2.5\u00a0EPS", from: "China", to: "Japan", color: "text-sev-critical" },
];

const ORGANIZATIONS_LIST = [
  { name: "Global Financial Systems Corp", count: 47, detail: "23 ransomware, 12 botnet, 12 exploits" },
  { name: "Defense Logistics Agency", count: 22, detail: "11 Spyware, 11 DGA" },
  { name: "Apex Cloud Services", count: 47, detail: "23 ransomware, 23 Scanner IP, 12 exploits" },
  { name: "BioHealth Pharma Labs", count: 22, detail: "23 Suspicious" },
  { name: "Metro Grid Power & Energy", count: 19, detail: "14 Virus, 5 Exploits" },
  { name: "Nordic Telecom AS", count: 18, detail: "9 DDoS, 9 Phishing" },
  { name: "Trans-Pacific Shipping Lines", count: 15, detail: "15 Ingress Scans" },
  { name: "AeroDynamics Space Tech", count: 14, detail: "7 APT29, 7 C2 Beacons" },
  { name: "Federal Reserve Data Center", count: 12, detail: "12 Kerberos Attacks" },
  { name: "EuroRail Transportation Ltd", count: 11, detail: "11 Credential Stuffing" },
  { name: "Quantum Computing Lab", count: 9, detail: "4 Virus, 5 Brute Force" },
  { name: "Pacific Semiconductor Foundry", count: 8, detail: "8 Malicious Payload" },
];

const BREAKDOWN_BY_TYPE = [
  { name: "DDoS", v: 45 },
  { name: "Malware", v: 72 },
  { name: "Ransom", v: 55 },
  { name: "Spyware", v: 118 },
  { name: "Botnet", v: 38 },
  { name: "Phishing", v: 64 },
  { name: "Virus", v: 30 },
  { name: "DGA", v: 44 },
  { name: "Exploits", v: 67 },
  { name: "Suspicious", v: 52 },
];

const TREND_DATA = Array.from({ length: 24 }, (_, i) => ({
  h: `${String(i).padStart(2, "0")}:00`,
  malware: Math.floor(Math.random() * 18 + 2),
  ransom: Math.floor(Math.random() * 12 + 1),
  ddos: Math.floor(Math.random() * 8 + 1),
}));

/* Donut ring data */
const SEVERITY_DONUT = [
  { name: "Critical", value: 35, color: "#ef4444" },
  { name: "High", value: 64, color: "#f97316" },
  { name: "Medium", value: 52, color: "#eab308" },
  { name: "Low", value: 49, color: "#22c55e" },
];

const DETECTION_DONUT = [
  { name: "Confirmed", value: 46, color: "#22c55e" },
  { name: "False Positive", value: 26, color: "#ef4444" },
  { name: "Blocked Auto", value: 28, color: "#3b82f6" },
];

const AFFECTED_SYSTEMS = [
  { label: "Users", value: 450, sub: "Investigating", subColor: "text-sev-high", ring: "#ef4444" },
  { label: "Endpoints", value: 150, sub: "Blocked", subColor: "text-accent", ring: "#3b82f6" },
  { label: "Servers", value: 15, sub: "Mitigated", subColor: "text-ok", ring: "#22c55e" },
  { label: "Network Devices", value: 8, sub: "Unresolved", subColor: "text-sev-critical", ring: "#ef4444" },
];

function MiniDonut({ value, max, color }: { value: number; max: number; color: string }) {
  const r = 28, cx = 36, cy = 36;
  const pct = value / max;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{value}</text>
    </svg>
  );
}

import { useToast } from "@/lib/toast";
import { OperationalWorkspacesBar } from "@/components/OperationalWorkspacesBar";
import { Download, RefreshCw, Shield, Globe, Play } from "lucide-react";

export default function ThreatIntel() {
  const { showToast } = useToast();
  const [orgFilter, setOrgFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 24 hours");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAllOrgs, setShowAllOrgs] = useState(false);
  const [threatTypeFilter, setThreatTypeFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  const KPI_CARDS = [
    { icon: "🔴", value: "12,345", label: "Total Threats", change: "", color: "bg-gradient-to-br from-red-900/30 to-red-800/10 border-red-700/30" },
    { icon: "🚫", value: "1,870", label: "Malware Incidents", change: "", color: "bg-gradient-to-br from-orange-900/30 to-orange-800/10 border-orange-700/30" },
    { icon: "💥", value: "2,430", label: "DDoS Attacks", change: "", color: "bg-gradient-to-br from-purple-900/30 to-purple-800/10 border-purple-700/30" },
    { icon: "🌐", value: "3,210", label: "Anomalous Traffic", change: "", color: "bg-gradient-to-br from-blue-900/30 to-blue-800/10 border-blue-700/30" },
    { icon: "🔎", value: "3,120", label: "IPs Blocked", change: "", color: "bg-gradient-to-br from-green-900/30 to-green-800/10 border-green-700/30" },
  ];

  const handleSyncFeeds = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast({
        type: "success",
        title: "Threat Feeds Synchronized",
        message: "AlienVault OTX, MISP, and CrowdStrike Falcon indicators fetched.",
      });
    }, 600);
  };

  const handleExportIOCs = () => {
    showToast({
      type: "success",
      title: "IOC Feeds Exported",
      message: "Exported 3,120 malicious IP/domain rules to STIX 2.1 format.",
    });
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* ── Navigation bar matching Image 2 style ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface p-3 text-xs">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2">
            Threat Intelligence Dashboard
            <DemoTag>Image 2 Operational Console</DemoTag>
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncFeeds}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1 rounded-chip border border-line bg-raised hover:bg-surface text-ink text-xs font-semibold transition-colors"
          >
            <RefreshCw size={12} className={clsx("text-accent", isSyncing && "animate-spin")} />
            {isSyncing ? "Syncing..." : "Sync Feeds"}
          </button>
          <button
            onClick={handleExportIOCs}
            className="flex items-center gap-1.5 px-3 py-1 rounded-chip border border-line bg-raised hover:bg-surface text-ink text-xs font-semibold transition-colors"
          >
            <Download size={12} /> Export IOCs
          </button>
          <button
            onClick={() => {
              setDateRange("Today");
              showToast({ type: "info", title: "Time Filter", message: "Viewing Today's intelligence." });
            }}
            className={clsx("px-3 py-1 rounded-chip text-xs font-semibold border", dateRange === "Today" ? "border-accent bg-accent/20 text-accent" : "border-line text-muted")}
          >
            Today
          </button>
          <button
            onClick={() => {
              setDateRange("Last 24 hours");
              showToast({ type: "info", title: "Time Filter", message: "Viewing Last 24 hours intelligence." });
            }}
            className={clsx("px-3 py-1 rounded-chip text-xs font-semibold border", dateRange === "Last 24 hours" ? "border-accent bg-accent/20 text-accent" : "border-line text-muted")}
          >
            Last 24 hours
          </button>
        </div>
      </div>

      {/* ── 5 Core Operational Workspaces ── */}
      <OperationalWorkspacesBar compact />

      {/* ── Top 5 KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {KPI_CARDS.map(k => (
          <div key={k.label} className={clsx("rounded-card border p-4 space-y-2", k.color)}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{k.icon}</span>
            </div>
            <p className="text-2xl font-bold font-mono text-ink">{k.value}</p>
            <p className="text-[11px] text-muted">{k.label}</p>
          </div>
        ))}
      </div>

      {/* ── Main Grid: Left 2 panels + Right panels ── */}
      <div className="grid gap-4 lg:grid-cols-12">

        {/* LEFT: Threat Distribution + Detection Accuracy */}
        <div className="lg:col-span-3 space-y-4">
          {/* Threat Distribution by Severity (radar/donut) */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3">
            <h2 className="text-xs font-bold text-ink">Threat Distribution by Severity</h2>
            <div className="flex justify-center">
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={SEVERITY_DONUT} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" startAngle={90} endAngle={-270}>
                      {SEVERITY_DONUT.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--line))", borderRadius: 6, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-1">
              {SEVERITY_DONUT.map(d => (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} />{d.name}</span>
                  <span className="font-mono font-bold text-ink">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detection Accuracy */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3">
            <h2 className="text-xs font-bold text-ink">Detection Accuracy</h2>
            <div className="flex justify-center">
              <div className="relative w-28 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={DETECTION_DONUT} cx="50%" cy="50%" innerRadius={30} outerRadius={48} dataKey="value" startAngle={90} endAngle={-270}>
                      {DETECTION_DONUT.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-1">
              {DETECTION_DONUT.map(d => (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />{d.name}</span>
                  <span className="font-mono font-bold text-ink">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Threat Map + Attacks Table + Top 5 Orgs */}
        <div className="lg:col-span-5 space-y-4">
          {/* Threat Map */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-ink">Threat Map</h2>
              <div className="flex gap-2 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    const next = dateRange === "Today" ? "Last 24 hours" : "Today";
                    setDateRange(next);
                    showToast({ type: "info", title: "Map Time Window", message: `Filtering map data for ${next}.` });
                  }}
                  className="px-2 py-0.5 rounded border border-line text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
                >
                  Range: {dateRange} ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const types = ["All", "Malware", "Phishing", "Exploit", "XSS"];
                    const next = types[(types.indexOf(threatTypeFilter) + 1) % types.length];
                    setThreatTypeFilter(next);
                    showToast({ type: "info", title: "Threat Filter", message: `Filtering map threats by ${next}.` });
                  }}
                  className="px-2 py-0.5 rounded border border-line text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
                >
                  Type: {threatTypeFilter} ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sevs = ["All", "Critical", "High", "Medium"];
                    const next = sevs[(sevs.indexOf(severityFilter) + 1) % sevs.length];
                    setSeverityFilter(next);
                    showToast({ type: "info", title: "Severity Filter", message: `Filtering map severity by ${next}.` });
                  }}
                  className="px-2 py-0.5 rounded border border-line text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
                >
                  Severity: {severityFilter} ↓
                </button>
              </div>
            </div>

            <div className="flex gap-3 text-[10px]">
              {/* Attacks list */}
              <div className="flex-1 space-y-1.5">
                <p className="text-[10px] font-mono text-muted uppercase font-semibold">Attacks</p>
                {ATTACKS.map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px]">
                    <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0", a.color.replace("text-", "bg-"))} />
                    <span className="text-ink truncate flex-1">{a.type}</span>
                    <span className="text-muted font-mono shrink-0">{a.from} → {a.to}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* OpenCTI Threat Intelligence Observables Platform */}
            <div className="relative rounded-chip overflow-hidden border border-line bg-black group" style={{ height: 210 }}>
              <img
                src="/images/opencti_threat_intelligence.jpg"
                alt="OpenCTI Cyber Threat Intelligence Platform"
                className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/40 shadow">
                  OPENCTI OBSERVABLES: 137.9K
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/70 text-ink border border-line/60">
                  APT29 • Lazarus • Kimsuky
                </span>
              </div>
              {/* Legend overlay */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 text-[9px] font-mono">
                <span className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-line/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> 503 Intrusion Sets
                </span>
                <span className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-line/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> 2K Malware Strains
                </span>
                <span className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-line/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> Active CVEs (117)
                </span>
              </div>
            </div>

            {/* Top 5 / All 12 Affected Organizations */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-ink">
                  {showAllOrgs ? "All 12 Monitored Organizations" : "Top 5 Affected Organizations"}
                </p>
                <button
                  type="button"
                  onClick={() => setShowAllOrgs(!showAllOrgs)}
                  className="text-[10px] text-accent hover:underline cursor-pointer"
                >
                  {showAllOrgs ? "Collapse to Top 5" : "View All 12"}
                </button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {ORGANIZATIONS_LIST.slice(0, showAllOrgs ? 12 : 5).map((o, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] p-1 rounded hover:bg-raised/40 transition-colors">
                    <span className="text-ink font-medium">{o.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sev-critical bg-sev-critical/10 px-1.5 py-0.5 rounded">{o.count}</span>
                      <span className="text-muted text-[9px] truncate max-w-[120px]">{o.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Trend + Breakdown + Affected Systems */}
        <div className="lg:col-span-4 space-y-4">
          {/* Threat Trends Over Time */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-ink">Threat Trends Over Time</h2>
              <div className="flex gap-1.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setDateRange("Today");
                    showToast({ type: "info", title: "Time Filter: Today", message: "Viewing 12-hour threat trends." });
                  }}
                  className={clsx(
                    "px-2.5 py-1 rounded border transition-all cursor-pointer font-medium",
                    dateRange === "Today"
                      ? "border-accent text-accent bg-accent/15 shadow-sm"
                      : "border-line text-muted hover:text-ink hover:bg-raised"
                  )}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateRange("Last 24 hours");
                    showToast({ type: "info", title: "Time Filter: 24h", message: "Viewing 24-hour threat trends." });
                  }}
                  className={clsx(
                    "px-2.5 py-1 rounded border transition-all cursor-pointer font-medium",
                    dateRange === "Last 24 hours"
                      ? "border-accent text-accent bg-accent/15 shadow-sm"
                      : "border-line text-muted hover:text-ink hover:bg-raised"
                  )}
                >
                  Last 24 hours
                </button>
              </div>
            </div>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dateRange === "Today" ? TREND_DATA.slice(0, 12) : TREND_DATA}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="h" fontSize={8} stroke="rgba(255,255,255,0.3)" interval={dateRange === "Today" ? 2 : 4} />
                  <YAxis fontSize={8} stroke="rgba(255,255,255,0.3)" width={18} />
                  <Tooltip contentStyle={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--line))", borderRadius: 6, fontSize: 10 }} />
                  <Line type="monotone" dataKey="ransom" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Ransomware" />
                  <Line type="monotone" dataKey="malware" stroke="#f97316" strokeWidth={1.5} dot={false} name="Malware" />
                  <Line type="monotone" dataKey="ddos" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="DDoS" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-3 text-[9px] font-mono">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Ransomware</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" />Malware</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />DDoS</span>
            </div>
          </div>

          {/* Breakdown of Threats by Type */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-2">
            <h2 className="text-xs font-bold text-ink">Breakdown of Threats by Type</h2>
            <div className="h-[110px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BREAKDOWN_BY_TYPE} barSize={8}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" fontSize={8} stroke="rgba(255,255,255,0.3)" />
                  <YAxis fontSize={8} stroke="rgba(255,255,255,0.3)" width={18} />
                  <Tooltip contentStyle={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--line))", borderRadius: 6, fontSize: 10 }} />
                  <Bar dataKey="v" fill="#3b82f6" radius={[2, 2, 0, 0]}>
                    {BREAKDOWN_BY_TYPE.map((d, i) => (
                      <Cell key={i} fill={d.v === 118 ? "#ef4444" : "#3b82f6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Affected Systems & Severity */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3">
            <h2 className="text-xs font-bold text-ink">Affected Systems &amp; Severity</h2>
            <div className="grid grid-cols-4 gap-2 text-center">
              {AFFECTED_SYSTEMS.map(s => (
                <div key={s.label} className="space-y-1 flex flex-col items-center">
                  <MiniDonut value={s.value} max={500} color={s.ring} />
                  <p className="text-[10px] font-bold text-ink font-mono">{s.label}</p>
                  <span className={clsx("text-[9px] font-mono", s.subColor)}>{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
