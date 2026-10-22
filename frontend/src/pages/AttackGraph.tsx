import React, { useState, useEffect } from "react";
import { AlertOctagon, Check, Radio, Play, ChevronRight, ArrowUpRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { DemoTag } from "@/components/ui";
import clsx from "clsx";

/* ── Confirmed Malicious Activity live stream data ── */
const LIVE_EVENTS = [
  { time: "14:47:23", sev: "Critical", msg: "Privilege escalation detected", host: "WEB-PRD0-02" },
  { time: "14:46:56", sev: "Critical", msg: "Lateral movement attempt", host: "DB-MASTER-01" },
  { time: "14:46:13", sev: "High", msg: "Unauthorized data access", host: "FILE-SRV-05" },
  { time: "14:45:47", sev: "Critical", msg: "Suspicious process execution", host: "FILE-SRV-05" },
  { time: "14:45:03", sev: "Critical", msg: "Credential theft attempt", host: "AD-DC-01" },
  { time: "14:44:31", sev: "High", msg: "Malicious network traffic", host: "WEB-PRD-01" },
  { time: "14:43:55", sev: "High", msg: "File system modification", host: "WEB-PRD-01" },
  { time: "14:43:18", sev: "High", msg: "Failed authentication (brute force)", host: "VPN-GW-01" },
  { time: "14:42:47", sev: "Critical", msg: "Anomalous outbound connection", host: "WEB-PRD-02" },
  { time: "14:42:05", sev: "High", msg: "Registry modification", host: "WEB-PRD0-02" },
];

/* ── Attack chain steps ── */
const ATTACK_CHAIN = [
  { label: "Initial Access", status: "done" },
  { label: "Lateral Movement", status: "done" },
  { label: "Priv Escalation", status: "active", number: 3 },
  { label: "Data Exfiltration", status: "pending", number: 4 },
];

/* ── Affected assets ── */
const AFFECTED_ASSETS = [
  { hostname: "WEB-PROD-02", type: "Web Server", status: "Compromised", sev: "Critical", lastActivity: "14:47:23" },
  { hostname: "DB-MASTER-01", type: "Database", status: "At Risk", sev: "Critical", lastActivity: "14:46:58" },
  { hostname: "FILE-SRV-05", type: "File Server", status: "At Risk", sev: "High", lastActivity: "14:46:12" },
  { hostname: "AD-DC-01", type: "Domain Controller", status: "Compromised", sev: "Critical", lastActivity: "14:45:03" },
  { hostname: "WEB-PROD-01", type: "Web Server", status: "Contained", sev: "High", lastActivity: "14:44:31" },
  { hostname: "VPN-GW-01", type: "VPN Gateway", status: "At Risk", sev: "High", lastActivity: "14:43:18" },
];

/* ── SOC Communication messages ── */
const INITIAL_MESSAGES = [
  { author: "J. Martinez", time: "14:47:45", msg: "Network Isolation in progress for WEB-PRD0-02. Coordinating with infrastructure team.", isSystem: false },
  { author: "System", time: "14:46:30", msg: "Automated containment rule triggered for lateral movement pattern.", isSystem: true },
  { author: "A. Chen", time: "14:45:13", msg: "Confirmed privilege escalation via CVE-2024-xxxx. Disabling affected service accounts.", isSystem: false },
  { author: "System", time: "14:44:05", msg: "EDR isolation initiated on WEB-PROD-02 and DB-MASTER-01.", isSystem: true },
];

/* ── Playbook steps ── */
const INITIAL_PLAYBOOK = [
  { label: "Contain affected hosts", assigned: "J. Martinez", status: "In Progress" },
  { label: "Disable compromised credentials", assigned: "A. Chen", status: "In Progress" },
  { label: "Block malicious IP range", assigned: "", status: "Pending" },
  { label: "Notify CISO", assigned: "", status: "Pending" },
  { label: "Trigger forensic snapshot", assigned: "", status: "Pending" },
];

import { useToast } from "@/lib/toast";
import { OperationalWorkspacesBar } from "@/components/OperationalWorkspacesBar";

export default function AttackGraph() {
  const { incidents, events, triggerPlaybook } = useStore();
  const { showToast } = useToast();
  const selectedIncident = incidents[0];
  const [durationSeconds, setDurationSeconds] = useState(4754);
  const [playbookSteps, setPlaybookSteps] = useState(INITIAL_PLAYBOOK);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newNote, setNewNote] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setDurationSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setMessages(prev => [{ author: "You (Analyst)", time: new Date().toTimeString().slice(0, 8), msg: newNote.trim(), isSystem: false }, ...prev]);
    showToast({
      type: "success",
      title: "SOC Note Recorded",
      message: "Note appended to War Room emergency log.",
    });
    setNewNote("");
  };

  const executeContainment = async () => {
    setIsExecuting(true);
    await triggerPlaybook("PB-01", "War Room All Assets");
    showToast({
      type: "warning",
      title: "Executing Containment",
      message: "Isolating compromised hosts and revoking Kerberos tokens...",
    });
    setTimeout(() => {
      setPlaybookSteps(prev => prev.map(s => ({ ...s, status: "Completed" })));
      setMessages(prev => [{
        author: "SOAR",
        time: new Date().toTimeString().slice(0, 8),
        msg: "Full emergency containment executed: hosts isolated, credentials revoked, IPs blocked.",
        isSystem: true,
      }, ...prev]);
      setIsExecuting(false);
      showToast({
        type: "success",
        title: "All Assets Contained",
        message: "Perimeter null-routed. Forensic memory snapshot captured.",
      });
    }, 900);
  };

  const handleEscalateTier3 = () => {
    showToast({
      type: "error",
      title: "Tier 3 Critical Escalation Dispatched",
      message: "Incident Commander notified. PagerDuty on-call response team dispatched.",
    });
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* ── CRITICAL INCIDENT BANNER (top red bar from Image 5) ── */}
      <div className="rounded-card overflow-hidden border border-sev-critical/60 shadow-lg shadow-sev-critical/10">
        <div className="bg-sev-critical px-4 py-2.5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <AlertOctagon size={18} className="animate-pulse shrink-0" />
            <span className="font-extrabold text-sm uppercase tracking-wider">CRITICAL INCIDENT ACTIVE</span>
            <span className="font-mono text-xs opacity-90">
              | Incident ID: {selectedIncident?.id || "INC-2026-03-047"}
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs font-mono">
            <span>Active for: <span className="font-bold">{formatTimer(durationSeconds)}</span></span>
            <span>Escalation: <span className="rounded bg-black/35 px-1.5 py-0.5 font-bold">Level 3</span></span>
            <span>Affected Assets: <span className="font-bold">24</span></span>
          </div>
        </div>
      </div>

      {/* ── 5 Core Operational Workspaces ── */}
      <OperationalWorkspacesBar compact />

      {/* Visual Reference Image (Image 5 integrated as the tactical visual) */}
      <div className="rounded-card border border-sev-critical/30 overflow-hidden shadow-md relative">
        <img
          src="/images/critical_incident_warroom.jpg"
          alt="Critical Incident War Room Command Console"
          className="w-full object-cover"
          style={{ maxHeight: 160, objectPosition: "top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        <div className="absolute bottom-2 left-4 text-[11px] font-mono text-white/70">
          War Room Command Console · INC-2026-03-047 · Level 3 Escalation Active
        </div>
      </div>

      {/* ── 3-Column Layout (matching Image 5 exactly) ── */}
      <div className="grid gap-4 lg:grid-cols-12">

        {/* LEFT: Confirmed Malicious Activity live stream */}
        <div className="lg:col-span-3 rounded-card border border-line bg-surface p-3.5 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <div>
              <h2 className="text-xs font-bold text-ink">Confirmed Malicious Activity</h2>
              <p className="text-[10px] text-muted font-mono">Live event stream</p>
            </div>
            <Radio size={12} className="text-sev-critical animate-pulse" />
          </div>

          <div className="space-y-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: 480 }}>
            {LIVE_EVENTS.map((evt, i) => (
              <div key={i} className="p-2 rounded-chip bg-raised/50 border border-line/60 text-xs space-y-0.5 hover:border-line transition-colors">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-muted">{evt.time}</span>
                  <span className={clsx(
                    "font-bold uppercase px-1 py-0.5 rounded text-[9px]",
                    evt.sev === "Critical" ? "bg-sev-critical/20 text-sev-critical" : "bg-sev-high/20 text-sev-high"
                  )}>{evt.sev}</span>
                </div>
                <p className="font-semibold text-ink text-[11px] leading-snug">{evt.msg}</p>
                <span className="font-mono text-[10px] text-muted">{evt.host}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Attack Chain + Affected Assets + SOC Communication */}
        <div className="lg:col-span-6 space-y-4">
          {/* Attack Chain Progress */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3">
            <span className="text-xs font-bold text-ink block">Attack Chain Progress</span>
            <div className="flex items-center justify-between overflow-x-auto pb-1 text-center font-mono">
              {ATTACK_CHAIN.map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center gap-1 min-w-[75px]">
                    {step.status === "done" ? (
                      <span className="h-8 w-8 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent">
                        <Check size={15} />
                      </span>
                    ) : step.status === "active" ? (
                      <span className="h-8 w-8 rounded-full bg-sev-medium text-black flex items-center justify-center text-sm font-bold ring-4 ring-sev-medium/20 animate-pulse">
                        {step.number}
                      </span>
                    ) : (
                      <span className="h-8 w-8 rounded-full border border-line flex items-center justify-center text-muted text-xs opacity-60">
                        {step.number}
                      </span>
                    )}
                    <span className={clsx("text-[10px]",
                      step.status === "done" ? "text-accent" :
                      step.status === "active" ? "text-sev-medium font-bold" :
                      "text-muted opacity-60"
                    )}>{step.label}</span>
                  </div>
                  {i < ATTACK_CHAIN.length - 1 && (
                    <div className={clsx("h-0.5 flex-1 mx-1",
                      i < 1 ? "bg-accent/60" : i === 1 ? "bg-gradient-to-r from-accent/60 to-line" : "bg-line"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Affected Assets Table */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">Affected Assets</span>
              <span className="text-[10px] font-mono text-muted">{AFFECTED_ASSETS.length} assets impacted</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-line text-[10px] text-muted font-mono uppercase">
                    <th className="text-left pb-1.5 pr-3">Hostname</th>
                    <th className="text-left pb-1.5 pr-3">Type</th>
                    <th className="text-left pb-1.5 pr-3">Status</th>
                    <th className="text-left pb-1.5 pr-3">Severity</th>
                    <th className="text-left pb-1.5">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/50">
                  {AFFECTED_ASSETS.map((a, i) => (
                    <tr key={i} className="hover:bg-raised/30 transition-colors">
                      <td className="py-2 pr-3 font-mono text-accent font-semibold">{a.hostname}</td>
                      <td className="py-2 pr-3 text-muted">{a.type}</td>
                      <td className="py-2 pr-3">
                        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold border",
                          a.status === "Compromised" ? "bg-sev-critical/20 text-sev-critical border-sev-critical/30" :
                          a.status === "At Risk" ? "bg-sev-high/20 text-sev-high border-sev-high/30" :
                          "bg-ok/20 text-ok border-ok/30"
                        )}>{a.status}</span>
                      </td>
                      <td className="py-2 pr-3">
                        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold",
                          a.sev === "Critical" ? "bg-sev-critical/10 text-sev-critical" : "bg-sev-high/10 text-sev-high"
                        )}>{a.sev}</span>
                      </td>
                      <td className="py-2 text-muted font-mono">{a.lastActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SOC Communication */}
          <div className="rounded-card border border-line bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-ink block">SOC Communication</span>
                <span className="text-[10px] text-muted">Internal analyst notes and system updates</span>
              </div>
              <button className="text-[11px] text-accent border border-accent/30 bg-accent/10 px-2.5 py-1 rounded-chip hover:bg-accent/20 transition-colors">
                Add Note
              </button>
            </div>

            <form onSubmit={handleNote} className="flex gap-2">
              <input
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add analyst note..."
                className="flex-1 rounded-chip border border-line bg-raised px-3 py-1.5 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <button type="submit" className="px-3 py-1.5 rounded-chip bg-accent text-accent-ink text-xs font-bold hover:bg-accent/90">Send</button>
            </form>

            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={clsx("flex gap-2 p-2 rounded-chip text-[11px]",
                  m.isSystem ? "bg-accent/5 border border-accent/20" : "bg-raised/40 border border-line/60"
                )}>
                  <div className={clsx("h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    m.isSystem ? "bg-accent/20 text-accent" : "bg-raised text-ink"
                  )}>
                    {m.isSystem ? "S" : m.author.split(" ").map(p => p[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="font-semibold text-ink">{m.author}</span>
                      <span className="font-mono text-muted text-[9px]">{m.time}</span>
                    </div>
                    <p className="text-muted leading-relaxed">{m.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Response Playbook */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-card border border-line bg-surface p-4 space-y-3">
            <div>
              <h2 className="text-xs font-bold text-ink">Response Playbook</h2>
              <p className="text-[10px] text-muted font-mono">Automated response actions</p>
            </div>

            <div className="space-y-2">
              {playbookSteps.map((step, i) => (
                <div key={i} className={clsx(
                  "rounded-chip p-3 border space-y-1",
                  step.status === "Completed" ? "border-ok/30 bg-ok/5" :
                  step.status === "In Progress" ? "border-sev-medium/30 bg-sev-medium/5" :
                  "border-line bg-raised/30"
                )}>
                  <div className="flex items-start gap-2">
                    <div className={clsx(
                      "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                      step.status === "Completed" ? "bg-ok text-black" :
                      step.status === "In Progress" ? "bg-sev-medium text-black" :
                      "bg-raised border border-line text-muted"
                    )}>
                      {step.status === "Completed" ? <Check size={10} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-ink">{step.label}</p>
                      {step.assigned && (
                        <p className="text-[10px] font-mono text-muted">Assigned: {step.assigned}</p>
                      )}
                      <span className={clsx("text-[9px] font-mono",
                        step.status === "Completed" ? "text-ok" :
                        step.status === "In Progress" ? "text-sev-medium" :
                        "text-muted"
                      )}>⏳ {step.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={executeContainment}
              disabled={isExecuting}
              className="w-full py-2.5 rounded-chip bg-sev-critical text-white font-bold text-xs hover:bg-sev-critical/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Play size={13} />
              {isExecuting ? "Executing..." : "Execute Containment"}
            </button>

            <button
              onClick={handleEscalateTier3}
              className="w-full py-2 rounded-chip border border-sev-high/40 text-sev-high text-xs font-bold hover:bg-sev-high/10 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronRight size={12} /> Escalate to Tier 3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
