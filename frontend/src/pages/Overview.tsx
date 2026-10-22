import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { DemoTag } from "@/components/ui";
import { OverviewGauge } from "@/components/OverviewGauge";
import { OperationalWorkspacesBar } from "@/components/OperationalWorkspacesBar";
import {
  Shield, Radio, Activity, AlertTriangle, ArrowUpRight, Zap, RefreshCw,
  Flame, CheckCircle2, Lock, ExternalLink, Play, X
} from "lucide-react";
import clsx from "clsx";

export default function Overview() {
  const navigate = useNavigate();
  const { alerts, incidents, triggerPlaybook } = useStore();
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* Timeline steps */
  const [timelineSteps, setTimelineSteps] = useState([
    { id: 1, label: "Detection", time: "12:45 PM", done: true },
    { id: 2, label: "Analysis", time: "01:10 PM", done: true },
    { id: 3, label: "Containment", time: "01:35 PM", done: true },
    { id: 4, label: "Resolution", time: "02:05 PM", done: false },
  ]);

  /* Alert statistics */
  const alertStats = [
    { label: "Active Incident", value: "32m", color: "border-line/40 bg-surface" },
    { label: "Containment in Progress", value: "25m", color: "border-line/40 bg-surface" },
    { label: "Resolved Today", value: "8", color: "border-line/40 bg-surface" },
    { label: "Escalated Cases", value: "3", color: "border-line/40 bg-surface" },
  ];

  /* Top Threats */
  const [topThreats, setTopThreats] = useState([
    { id: "th-1", type: "Ransomware Activity", source: "194.26.29.112 (Russia)", severity: "High", status: "Contained", statusColor: "text-ok bg-ok/10 border-ok/30" },
    { id: "th-2", type: "Phishing Attack Vector", source: "198.51.100.44 (USA)", severity: "Medium", status: "In Progress", statusColor: "text-sev-high bg-sev-high/10 border-sev-high/30" },
    { id: "th-3", type: "Brute Force Kerberos", source: "103.224.182.25 (China)", severity: "High", status: "Active", statusColor: "text-sev-critical bg-sev-critical/10 border-sev-critical/30" },
    { id: "th-4", type: "Data Exfiltration Stream", source: "185.220.101.5 (Brazil)", severity: "Medium", status: "Resolved", statusColor: "text-ok bg-ok/10 border-ok/30" },
  ]);

  /* Spark lines */
  const intrSpark = [20, 45, 30, 88, 55, 70, 88];
  const malwareSpark = [5, 12, 8, 27, 18, 22, 27];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast({
        type: "success",
        title: "Telemetry Synchronized",
        message: "Live SOC event stream and telemetry indices updated to latest epoch.",
      });
    }, 600);
  };

  const handleStepClick = (idx: number) => {
    setTimelineSteps((prev) =>
      prev.map((step, i) => (i === idx ? { ...step, done: !step.done } : step))
    );
    showToast({
      type: "info",
      title: "Incident Milestone Toggled",
      message: `Phase "${timelineSteps[idx].label}" status adjusted by operator.`,
    });
  };

  const handleContainThreat = async (threatId: string, threatType: string) => {
    await triggerPlaybook("PB-EDR-01", threatType);
    setTopThreats((prev) =>
      prev.map((t) => (t.id === threatId ? { ...t, status: "Contained", statusColor: "text-ok bg-ok/10 border-ok/30" } : t))
    );
    showToast({
      type: "success",
      title: "Automated Containment Executed",
      message: `Target ${threatType} contained. Host isolated and firewall null-routed.`,
    });
  };

  const handleQuickPlaybook = async (name: string, playbookId: string) => {
    await triggerPlaybook(playbookId, name);
    showToast({
      type: "success",
      title: `SOAR Action Triggered: ${name}`,
      message: `Playbook ${playbookId} executed across enterprise endpoint perimeter.`,
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-ink">
            Security Operations Command Center
          </h1>
          <DemoTag>Live Telemetry</DemoTag>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-chip text-xs font-mono border border-line bg-surface hover:bg-raised text-ink transition-colors"
          >
            <RefreshCw size={12} className={clsx("text-accent", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Syncing..." : "Sync Feeds"}
          </button>

          <span className="flex items-center gap-1.5 text-xs font-mono text-ok bg-ok/10 border border-ok/30 px-3 py-1.5 rounded-chip">
            <Radio size={12} className="animate-pulse" /> All Systems Online
          </span>
        </div>
      </div>

      {/* ── THE 5 CORE OPERATIONAL WORKSPACES (Click any image to launch) ── */}
      <OperationalWorkspacesBar />

      {/* ── ROW 1: Incident Response Timeline + Threat Severity Gauge + System Health Gauge ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Incident Response Timeline */}
        <div className="rounded-card border border-line bg-surface p-4 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Incident Response Timeline</h2>
            <span className="text-[10px] font-mono text-muted">Click step to toggle</span>
          </div>

          {/* Stepper with interactive click handlers */}
          <div className="flex items-center gap-0 my-2">
            {timelineSteps.map((step, i) => (
              <React.Fragment key={step.id}>
                <div
                  onClick={() => handleStepClick(i)}
                  className="flex flex-col items-center gap-1 min-w-0 flex-1 cursor-pointer group"
                >
                  <div
                    className={clsx(
                      "h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-transform group-hover:scale-125 shadow-xs",
                      step.done
                        ? "bg-accent border-accent text-accent-ink"
                        : "bg-surface border-muted text-transparent"
                    )}
                  >
                    {step.done && <CheckCircle2 size={10} />}
                  </div>
                  <span className="text-[10px] font-mono text-muted text-center truncate w-full group-hover:text-ink">
                    {step.label}
                  </span>
                  <span className="text-[9px] font-mono text-ink/70 text-center">
                    {step.time}
                  </span>
                </div>
                {i < timelineSteps.length - 1 && (
                  <div
                    className={clsx(
                      "h-0.5 flex-1 mx-1 mb-5 transition-colors",
                      step.done && timelineSteps[i + 1].done ? "bg-accent" : "bg-line"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Metrics list */}
          <div className="space-y-2 pt-2 border-t border-line/60">
            {alertStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-xs">
                <span className="text-muted">{s.label}</span>
                <div className="flex items-center gap-2 flex-1 mx-3">
                  <div className="h-1.5 flex-1 rounded-full bg-raised/80 overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all duration-500",
                        s.label.includes("Active")
                          ? "bg-accent"
                          : s.label.includes("Contain")
                          ? "bg-sev-high"
                          : "bg-ok"
                      )}
                      style={{
                        width: s.label.includes("Active")
                          ? "72%"
                          : s.label.includes("Contain")
                          ? "55%"
                          : s.label.includes("Resolved")
                          ? "40%"
                          : "15%",
                      }}
                    />
                  </div>
                </div>
                <span className="font-mono font-bold text-ink">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Severity Gauge (Faithful recreation of Image 3) */}
        <div className="rounded-card border border-line bg-surface p-4 flex flex-col items-center justify-between gap-2 shadow-sm">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Threat Severity</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sev-critical/20 text-sev-critical font-bold border border-sev-critical/30">
              HIGH ALERT
            </span>
          </div>

          <div className="py-1">
            <OverviewGauge type="threat" value={76} size={210} />
          </div>

          <div className="w-full flex justify-between text-[10px] font-mono pt-2 border-t border-line/60">
            <span className="text-muted">Threshold: 70%</span>
            <span className="text-sev-critical font-bold">Severity Score: 76 / 100</span>
          </div>
        </div>

        {/* System Health Gauge (Faithful recreation of Image 3) */}
        <div className="rounded-card border border-line bg-surface p-4 flex flex-col items-center justify-between gap-2 shadow-sm">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">System Health</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ok/20 text-ok font-bold border border-ok/30">
              OPTIMAL
            </span>
          </div>

          <div className="py-1">
            <OverviewGauge type="health" value={92} size={210} />
          </div>

          <div className="w-full flex justify-between text-[10px] font-mono pt-2 border-t border-line/60">
            <span className="text-muted">Target SLA: 99.9%</span>
            <span className="text-ok font-bold">Health Score: 92 / 100</span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: 3D Network Traffic + Alert Statistics ── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Network Traffic – Image 3 Operational Working Screen */}
        <div className="lg:col-span-5 rounded-card border border-line bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">3D Network Traffic Plane</h2>
            <button
              onClick={() => navigate("/surveillance")}
              className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1"
            >
              Surveillance View <ExternalLink size={10} />
            </button>
          </div>

          <div
            onClick={() => {
              navigate("/alerts");
              showToast({
                type: "info",
                title: "Network Interceptor Launched",
                message: "Navigated to real-time traffic interception board.",
              });
            }}
            className="group relative aspect-video overflow-hidden rounded-chip border border-line/60 bg-black/90 cursor-pointer shadow-inner"
          >
            <img
              src="/images/cyber_health_radar.jpg"
              alt="3D Network Traffic Grid"
              className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            />
            {/* Interactive Overlay click tag */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-accent-ink font-bold text-xs px-3 py-1.5 rounded-chip shadow-lg flex items-center gap-1.5">
                <Play size={12} fill="currentColor" /> Click to Inspect Live Packets
              </span>
            </div>

            {/* Overlay labels */}
            <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400 bg-black/75 px-2 py-0.5 rounded border border-cyan-500/30">
              Internal Network: 10.0.0.0/16
            </div>
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-blue-400 bg-black/75 px-2 py-0.5 rounded border border-blue-500/30">
              External Sources: 8.65 Gbps
            </div>
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-red-400 bg-black/75 px-2 py-0.5 rounded border border-red-500/30">
              Malicious Ingress: 1,842 IPs
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono pt-1">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="h-2 w-2 rounded-full bg-blue-400" /> Internal: 94.2%
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <span className="h-2 w-2 rounded-full bg-cyan-400" /> External: 5.1%
            </span>
            <span className="flex items-center gap-1.5 text-sev-critical font-bold">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Malicious: 0.7%
            </span>
          </div>
        </div>

        {/* Alert Statistics Grid */}
        <div className="lg:col-span-7 rounded-card border border-line bg-surface p-4 space-y-3 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Alert & Incident Ingestion Statistics</h2>
            <button
              onClick={() => navigate("/alerts")}
              className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1"
            >
              View All Alerts ({alerts.length}) <ArrowUpRight size={11} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-card border border-line bg-bg/60 p-3 space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase">Total Ingested</span>
              <p className="text-2xl font-bold font-mono text-ink">324</p>
              <span className="text-[9px] text-ok flex items-center gap-0.5 font-mono">↑ 12% vs last hr</span>
            </div>

            <div className="rounded-card border border-sev-critical/40 bg-sev-critical/5 p-3 space-y-1">
              <span className="text-[10px] font-mono text-sev-critical uppercase font-semibold">Critical Alerts</span>
              <p className="text-2xl font-bold font-mono text-sev-critical">56</p>
              <div className="h-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[10, 15, 22, 18, 30, 28, 56].map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-card border border-line bg-bg/60 p-3 space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase">Intrusion Attempts</span>
              <p className="text-2xl font-bold font-mono text-ink">88</p>
              <div className="h-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={intrSpark.map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-card border border-line bg-bg/60 p-3 space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase">Anomalous Outbound</span>
              <p className="text-2xl font-bold font-mono text-ink">42</p>
              <div className="h-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[12, 18, 25, 30, 22, 38, 42].map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 rounded-card border border-line bg-bg/60 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted uppercase">Malware Quarantine Activity</span>
                <span className="text-[10px] font-mono text-ok font-bold">27 Contained</span>
              </div>
              <p className="text-2xl font-bold font-mono text-ink">27</p>
              <div className="h-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={malwareSpark.map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Top Threats Table with WORKING Buttons ── */}
      <div className="rounded-card border border-line bg-surface p-4 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-ink">Active Threat Vectors & Incident Response Actions</h2>
            <p className="text-[11px] text-muted">Real-time correlated attack sources requiring SOC operator decision</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickPlaybook("Isolate Ingress Perimeter", "PB-PERIMETER-01")}
              className="px-3 py-1 rounded-chip bg-sev-critical/20 border border-sev-critical/40 text-sev-critical hover:bg-sev-critical hover:text-white text-xs font-mono font-medium transition-colors flex items-center gap-1"
            >
              <Lock size={12} /> Emergency Null-Route
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-line text-muted font-mono text-[10px] uppercase">
                <th className="text-left pb-2.5 pr-4">Threat Type</th>
                <th className="text-left pb-2.5 pr-4">Origin / Source</th>
                <th className="text-left pb-2.5 pr-4">Severity</th>
                <th className="text-left pb-2.5 pr-4">Status</th>
                <th className="text-right pb-2.5">SOC Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {topThreats.map((t) => (
                <tr key={t.id} className="hover:bg-raised/30 transition-colors">
                  <td className="py-2.5 pr-4 font-semibold text-ink flex items-center gap-2">
                    <span
                      className={clsx(
                        "h-2 w-2 rounded-full shrink-0",
                        t.severity === "High" ? "bg-sev-critical" : "bg-sev-medium"
                      )}
                    />
                    {t.type}
                  </td>
                  <td className="py-2.5 pr-4 text-muted font-mono">{t.source}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={clsx(
                        "px-2 py-0.5 rounded text-[10px] font-bold border",
                        t.severity === "High"
                          ? "bg-sev-critical/20 text-sev-critical border-sev-critical/30"
                          : "bg-sev-medium/20 text-sev-medium border-sev-medium/30"
                      )}
                    >
                      {t.severity}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold border", t.statusColor)}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right space-x-2">
                    <button
                      onClick={() => {
                        navigate("/incidents");
                        showToast({
                          type: "info",
                          title: "Dossier Opened",
                          message: `Navigating to Incident Investigation for ${t.type}`,
                        });
                      }}
                      className="px-2.5 py-1 rounded text-[11px] font-mono border border-line bg-surface hover:bg-raised text-ink transition-colors"
                    >
                      Investigate
                    </button>
                    {t.status !== "Contained" && (
                      <button
                        onClick={() => handleContainThreat(t.id, t.type)}
                        className="px-2.5 py-1 rounded text-[11px] font-mono bg-sev-critical/20 border border-sev-critical/40 text-sev-critical hover:bg-sev-critical hover:text-white transition-colors"
                      >
                        Contain Host
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
