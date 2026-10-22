import React, { useState, useEffect } from "react";
import { AlertOctagon, CheckCircle2, ShieldAlert, ArrowRight, Play, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/lib/store";
import clsx from "clsx";

export function WarRoomBanner() {
  const { incidents, triggerPlaybook } = useStore();
  const [seconds, setSeconds] = useState(4754); // ~1h 19m 14s
  const [contained, setContained] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const criticalIncident = incidents.find((i) => i.severity === "critical") || incidents[0];

  const handleExecute = async () => {
    await triggerPlaybook("PB-01", "War Room Emergency Containment");
    setContained(true);
  };

  return (
    <div className="rounded-card border border-sev-critical/50 bg-sev-critical/10 overflow-hidden shadow-lg shadow-sev-critical/5 animate-fadeIn">
      {/* Top War Room Red Bar matching Image 5 */}
      <div className="bg-sev-critical px-4 py-2 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertOctagon size={18} className="animate-pulse shrink-0" />
          <span className="font-extrabold tracking-wider text-xs uppercase">
            Critical Incident Active
          </span>
          <span className="font-mono text-xs opacity-90">| Incident ID: {criticalIncident.id}</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span>
            Active for: <span className="font-bold">{formatDuration(seconds)}</span>
          </span>
          <span>
            Escalation: <span className="rounded bg-black/30 px-1.5 py-0.5 font-bold">Level 3</span>
          </span>
          <span>
            Affected Assets: <span className="font-bold">{criticalIncident.affectedAssets.length}</span>
          </span>
        </div>
      </div>

      {/* Attack Chain Progress Stepper matching Image 5 */}
      <div className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/90">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider shrink-0 mr-2">
            Attack Chain:
          </span>

          {/* Step 1: Initial Access (Completed) */}
          <div className="flex items-center gap-1.5">
            <span className="h-6 w-6 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent text-xs font-bold">
              <Check size={13} />
            </span>
            <span className="text-xs font-semibold text-ink whitespace-nowrap">Initial Access</span>
            <span className="text-muted mx-1">&rarr;</span>
          </div>

          {/* Step 2: Lateral Movement (Completed) */}
          <div className="flex items-center gap-1.5">
            <span className="h-6 w-6 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent text-xs font-bold">
              <Check size={13} />
            </span>
            <span className="text-xs font-semibold text-ink whitespace-nowrap">Lateral Movement</span>
            <span className="text-muted mx-1">&rarr;</span>
          </div>

          {/* Step 3: Privilege Escalation (Active Step - Gold Badge) */}
          <div className="flex items-center gap-1.5">
            <span className="h-6 w-6 rounded-full bg-sev-medium text-black flex items-center justify-center text-xs font-extrabold animate-pulse">
              3
            </span>
            <span className="text-xs font-bold text-sev-medium whitespace-nowrap">Privilege Escalation</span>
            <span className="text-muted mx-1">&rarr;</span>
          </div>

          {/* Step 4: Data Exfiltration (Pending) */}
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="h-6 w-6 rounded-full border border-line flex items-center justify-center text-muted text-xs font-mono">
              4
            </span>
            <span className="text-xs text-muted whitespace-nowrap">Data Exfiltration</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/incidents"
            className="px-3 py-1.5 rounded-chip border border-line bg-raised hover:bg-surface text-ink text-xs font-medium transition-colors"
          >
            War Room Dossier
          </Link>
          <button
            onClick={handleExecute}
            disabled={contained}
            className={clsx(
              "px-3.5 py-1.5 rounded-chip text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm",
              contained
                ? "bg-ok text-accent-ink"
                : "bg-sev-critical text-white hover:bg-sev-critical/90",
            )}
          >
            {contained ? <CheckCircle2 size={13} /> : <Play size={13} />}
            <span>{contained ? "Containment Enforced" : "Execute Containment"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
