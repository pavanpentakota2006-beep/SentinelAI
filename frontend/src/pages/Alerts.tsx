import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { DemoTag, SeverityBadge } from "@/components/ui";
import { Search, Shield, Activity, Bell, Network, Users, Settings, Zap, Radio, ChevronDown, Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import clsx from "clsx";

const ACTIVE_ALERTS = [
  {
    score: 6, title: "Potential DDoS Campaign from Subnet", sub: "89.248.163.0", tags: ["DDoS", "Subnet"],
    severity: "medium" as const, escalated: true,
  },
  {
    score: 5, title: "Potential DDoS Campaign from Subnet", sub: "89.248.163.0", tags: ["DDoS"],
    severity: "medium" as const, escalated: false,
  },
  {
    score: 4, title: "Potential SMB Reconnaissance and Network", sub: "Scanning Activity", tags: ["SMB", "Recon"],
    severity: "high" as const, escalated: false,
  },
  {
    score: 2, title: "Potential Reconnaissance Activity from Malicious", sub: "Subnet", tags: [],
    severity: "medium" as const, escalated: false,
  },
  {
    score: 4, title: "Malicious Subnet Scanning for Reconnaissance or", sub: "Exploitation", tags: [],
    severity: "high" as const, escalated: false,
  },
  {
    score: 5, title: "Potential Reconnaissance Activity from Malicious IP", sub: "", tags: [],
    severity: "medium" as const, escalated: false,
  },
  {
    score: 3, title: "Potential Brute Force Attempt on POP3 Port", sub: "", tags: [],
    severity: "low" as const, escalated: false,
  },
];

const THREAT_ACTORS = [
  { ip: "13.117.79.194", asn: "Unknown", alerts: 1, score: 7, sev: "Medium", lastActive: "about 5 hours ago" },
  { ip: "159.65.174.25", asn: "DIGITALOCEAN-ASN 🇺🇸", alerts: 1, score: 7, sev: "Medium", lastActive: "about 23 hours ago" },
  { ip: "176.65.148.214", asn: "Pfcloud UG 🇩🇪", alerts: 1, score: 7, sev: "Medium", lastActive: "about 7 hours ago" },
  { ip: "89.248.165.49", asn: "IP Volume Inc 🇸🇽", alerts: 1, score: 7, sev: "Medium", lastActive: "about 23 hours ago" },
  { ip: "176.65.148.235", asn: "Pfcloud UG 🇩🇪", alerts: 2, score: 7, sev: "Low", lastActive: "about 2 hours ago" },
  { ip: "598.235.24.15", asn: "GOOGLE-CLOUD-PLATFORM 🇺🇸", alerts: 2, score: 7, sev: "Medium", lastActive: "about 1 hour ago" },
  { ip: "3.172.23.281", asn: "AMAZON-02 🇺🇸", alerts: 2, score: 7, sev: "Medium", lastActive: "about 8 hours ago" },
  { ip: "175.8.38.156", asn: "Chinanet 🇨🇳", alerts: 1, score: 6, sev: "Medium", lastActive: "about 1 hour ago" },
];

const RADAR_ATTRS = ["Threats", "Score", "Severity", "PCaps", "TTPs", "ATPs"];
const RADAR_VALS = [0.7, 0.85, 0.6, 0.4, 0.5, 0.55];

function RadarChart({ attrs, vals }: { attrs: string[]; vals: number[] }) {
  const n = attrs.length;
  const cx = 80, cy = 70, r = 50;
  const angle = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const pts = vals.map((v, i) => {
    const a = angle(i);
    return `${cx + r * v * Math.cos(a)},${cy + r * v * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width="160" height="130" viewBox="0 0 160 130">
      {[0.25, 0.5, 0.75, 1].map(scale => (
        <polygon key={scale} points={attrs.map((_, i) => {
          const a = angle(i);
          return `${cx + r * scale * Math.cos(a)},${cy + r * scale * Math.sin(a)}`;
        }).join(" ")} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      ))}
      {attrs.map((attr, i) => {
        const a = angle(i);
        return (
          <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        );
      })}
      <polygon points={pts} fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1.5" />
      {attrs.map((attr, i) => {
        const a = angle(i);
        const lx = cx + (r + 14) * Math.cos(a);
        const ly = cy + (r + 14) * Math.sin(a);
        return <text key={i} x={lx} y={ly + 3} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">{attr}</text>;
      })}
    </svg>
  );
}

import { useToast } from "@/lib/toast";
import { OperationalWorkspacesBar } from "@/components/OperationalWorkspacesBar";
import { Lock, CheckCircle2 } from "lucide-react";

export default function Alerts() {
  const { alerts, triggerPlaybook } = useStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"Alerts" | "Security Posture">("Alerts");
  const [selectedAlert, setSelectedAlert] = useState(ACTIVE_ALERTS[0]);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const handleBlockIP = async (ip: string) => {
    await triggerPlaybook("PB-PERIMETER-01", ip);
    showToast({
      type: "success",
      title: `IP Quarantined: ${ip}`,
      message: `BGP null-route enacted. All packets from ${ip} dropped.`,
    });
  };

  const handleAdminMode = () => {
    showToast({
      type: "info",
      title: "Admin Elevation Granted",
      message: "Session authenticated with role ADMINISTRATOR. Full SOAR write access enabled.",
    });
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* ── Header: Interceptor style ── */}
      <div className="rounded-card border border-line bg-surface p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-ink flex items-center gap-2">
              Alerts &amp; Security Detections
              <DemoTag>Image 4 Interceptor Mode</DemoTag>
            </h1>
            <p className="text-[11px] text-muted mt-0.5">Real-time alert monitoring, threat attribution, and active defense intelligence.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdminMode}
              className="px-3 py-1.5 rounded-chip border border-accent bg-accent/15 text-accent text-xs font-bold hover:bg-accent/25 transition-colors"
            >
              ADMIN MODE (ACTIVE)
            </button>
          </div>
        </div>
      </div>

      {/* ── 5 Core Operational Workspaces ── */}
      <OperationalWorkspacesBar compact />

      {/* ── Top KPI Strip ── */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="rounded-card border border-line bg-surface p-3 flex items-start gap-3">
          <Bell size={16} className="text-accent mt-0.5 shrink-0" />
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-ink">1</span>
              <span className="text-xs text-sev-critical font-mono">↓ -215 vs yesterday</span>
            </div>
            <p className="text-[11px] text-muted">Active Alerts</p>
          </div>
        </div>
        <div className="rounded-card border border-line bg-surface p-3 flex items-start gap-3">
          <Shield size={16} className="text-sev-high mt-0.5 shrink-0" />
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-ink">157</span>
              <span className="text-xs text-ok font-mono">+12 new threats</span>
            </div>
            <p className="text-[11px] text-muted">Threats Detected</p>
          </div>
        </div>
        <div className="rounded-card border border-line bg-surface p-3 flex items-start gap-3">
          <Activity size={16} className="text-sev-medium mt-0.5 shrink-0" />
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-ink">4,500</span>
              <span className="text-xs text-sev-critical font-mono">↓ -32 in last week</span>
            </div>
            <p className="text-[11px] text-muted">Detections</p>
          </div>
        </div>
        <div className="rounded-card border border-line bg-surface p-3 flex items-start gap-3">
          <Network size={16} className="text-ok mt-0.5 shrink-0" />
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-ink">892</span>
              <span className="text-xs text-ok font-mono">+25 monitored</span>
            </div>
            <p className="text-[11px] text-muted">Systems Monitored</p>
          </div>
        </div>
      </div>

      {/* ── Main 3-Col Layout ── */}
      <div className="grid gap-4 lg:grid-cols-12 flex-1">

        {/* LEFT: Alert list */}
        <div className="lg:col-span-4 rounded-card border border-line bg-surface flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-line">
            {(["Alerts", "Security Posture"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={clsx("px-3 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px",
                  activeTab === tab ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink"
                )}
              >{tab}</button>
            ))}
          </div>

          {/* Severity filter tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-line text-[10px] font-mono text-muted">
            <span className="font-bold text-ink">Alerts</span>
            <div className="flex gap-1 ml-auto">
              {["Critical", "High", "Medium", "Low"].map(s => (
                <button key={s} className="px-1.5 py-0.5 rounded hover:text-ink transition-colors">{s}</button>
              ))}
              <button className="px-1.5 py-0.5 rounded text-accent">View All</button>
            </div>
          </div>

          {/* Alert rows */}
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-line/60">
            {ACTIVE_ALERTS.map((a, i) => (
              <button
                key={i}
                onClick={() => setSelectedAlert(a)}
                className={clsx(
                  "w-full text-left p-3 flex items-start gap-2.5 transition-colors hover:bg-raised/50",
                  selectedAlert.title === a.title && i === ACTIVE_ALERTS.indexOf(selectedAlert) ? "bg-raised/80" : ""
                )}
              >
                <span className={clsx(
                  "h-6 w-6 rounded shrink-0 flex items-center justify-center text-xs font-bold text-white",
                  a.score >= 5 ? "bg-sev-critical" : a.score >= 3 ? "bg-sev-high" : "bg-sev-low"
                )}>{a.score}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-ink truncate">{a.title}</p>
                  {a.sub && <p className="text-[10px] text-muted truncate">{a.sub}</p>}
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {a.tags.map(t => <span key={t} className="text-[9px] px-1 py-0.5 rounded bg-raised border border-line font-mono text-muted">{t}</span>)}
                    {a.escalated && <span className="text-[9px] px-1 py-0.5 rounded bg-sev-critical/20 text-sev-critical font-mono">Escalated</span>}
                  </div>
                </div>
                <span className={clsx("h-2 w-2 rounded-full shrink-0 mt-1",
                  (a.severity as string) === "critical" ? "bg-sev-critical" :
                  a.severity === "high" ? "bg-sev-high" :
                  a.severity === "medium" ? "bg-sev-medium" : "bg-sev-low"
                )} />
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: World map + Threat Actor table */}
        <div className="lg:col-span-8 space-y-4">
          {/* World map from Image 4 */}
          <div className="rounded-card border border-line bg-surface overflow-hidden">
            <div className="relative" style={{ height: 200 }}>
              <img
                src="/images/interceptor_threat_hunt.jpg"
                alt="Global Threat Map & Interceptor Console"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/80" />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="text-[10px] font-mono text-ok bg-black/60 border border-ok/30 px-2 py-0.5 rounded">
                  <Radio size={9} className="inline mr-1 animate-pulse" />LIVE
                </span>
              </div>
            </div>

            {/* Threat Actor IP table */}
            <div className="p-3 overflow-x-auto">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-line text-[9px] text-muted uppercase">
                    <th className="text-left pb-1.5 pr-3">Threat Actor IP</th>
                    <th className="text-left pb-1.5 pr-3">AS / Location</th>
                    <th className="text-left pb-1.5 pr-3">Alerts</th>
                    <th className="text-left pb-1.5 pr-3">Score</th>
                    <th className="text-left pb-1.5 pr-3">Severity</th>
                    <th className="text-left pb-1.5">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/50">
                  {THREAT_ACTORS.map((t, i) => (
                    <tr key={i} className="hover:bg-raised/30 transition-colors">
                      <td className="py-1.5 pr-3 text-accent">{t.ip}</td>
                      <td className="py-1.5 pr-3 text-muted">{t.asn}</td>
                      <td className="py-1.5 pr-3 text-ink font-bold">{t.alerts}</td>
                      <td className="py-1.5 pr-3 text-ink font-bold">{t.score}</td>
                      <td className="py-1.5 pr-3">
                        <span className={clsx("px-1.5 py-0.5 rounded text-[9px] font-bold",
                          t.sev === "Medium" ? "bg-sev-medium/20 text-sev-medium" :
                          t.sev === "Low" ? "bg-sev-low/20 text-sev-low" :
                          "bg-sev-critical/20 text-sev-critical"
                        )}>{t.sev}</span>
                      </td>
                      <td className="py-1.5 text-muted">{t.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Alert Analysis */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-bold text-ink">
                    Potential DDoS Campaign from Subnet 89.248.163.0
                  </h2>
                  <button
                    onClick={() => {
                      setVoted("up");
                      showToast({ type: "success", title: "Analyst Feedback Saved", message: "Marked detection as TRUE POSITIVE." });
                    }}
                    className={clsx("p-1.5 rounded transition-colors", voted === "up" ? "bg-ok text-black" : "hover:bg-raised text-muted")}
                  >
                    <ThumbsUp size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setVoted("down");
                      showToast({ type: "warning", title: "Analyst Feedback Saved", message: "Flagged detection for tuning / false positive review." });
                    }}
                    className={clsx("p-1.5 rounded transition-colors", voted === "down" ? "bg-sev-critical text-white" : "hover:bg-raised text-muted")}
                  >
                    <ThumbsDown size={13} />
                  </button>
                </div>
                <p className="text-[11px] text-muted font-mono">23 minutes ago · 2025-08-07 @ 19:00:45 UTC</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBlockIP("89.248.163.173")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-chip bg-sev-critical/20 border border-sev-critical/40 text-sev-critical text-xs font-bold hover:bg-sev-critical hover:text-white transition-colors shrink-0"
                >
                  <Lock size={12} /> Block Threat IP
                </button>
                <button
                  onClick={() => {
                    showToast({ type: "info", title: "Deep PCAP Inspection", message: "Loaded full 429 TCP SYN packet captures for 89.248.163.173." });
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-chip border border-accent text-accent text-xs font-bold shrink-0 hover:bg-accent/10 transition-colors"
                >
                  <Eye size={12} /> View Raw PCAP
                </button>
              </div>
            </div>

            <p className="text-[11px] text-ink leading-relaxed">
              The IP 89.248.163.173 is involved in a potential DDoS campaign along with multiple other IPs from the same subnet. The activity is characterized by anomalous connection attempts and port scanning.
            </p>

            <div className="flex gap-2 flex-wrap text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-sev-medium/20 text-sev-medium border border-sev-medium/30">Medium</span>
              <span className="px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">Escalated</span>
              <span className="px-2 py-0.5 rounded bg-ok/20 text-ok border border-ok/30">↗ Boost</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted">Threat Actor IP</span>
                  <span className="text-accent font-mono">89.248.163.173</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Victim IP</span>
                  <span className="text-accent font-mono">10.0.45.58</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Score</span>
                  <span className="text-ink font-bold font-mono">6</span>
                </div>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted">Country</span>
                  <span className="text-ink font-mono">NL 🇳🇱</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">AS Organization</span>
                  <span className="text-ink font-mono">IP Volume Inc</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Detections</span>
                  <span className="text-ink font-bold font-mono">1</span>
                </div>
              </div>
              {/* Radar chart */}
              <div className="col-span-2 flex justify-end">
                <RadarChart attrs={RADAR_ATTRS} vals={RADAR_VALS} />
              </div>
            </div>

            <div className="rounded-chip bg-sev-critical/10 border border-sev-critical/30 px-3 py-2 text-[11px] font-mono text-sev-critical">
              Escalated 27 times, most recent: 2025-08-07 @ 18:51:26
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-ink">Observed Anomalies and Significance</h3>
              <p className="text-[11px] text-muted leading-relaxed">
                The IP 89.248.163.173 has been detected for possible DDoS activity with 429 connection attempts to a single destination IP.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
