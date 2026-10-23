import { useState } from "react";
import { Target, CheckCircle2, AlertTriangle, ShieldCheck, Search, Filter } from "lucide-react";
import { MITRE_TACTICS } from "@/data/mockData";
import { Card, DemoTag, SeverityBadge } from "@/components/ui";
import clsx from "clsx";

export default function MitreMatrix() {
  const [selectedTech, setSelectedTech] = useState<{ id: string; name: string; count: number; tactic: string } | null>(null);
  const [search, setSearch] = useState("");

  const totalTechniques = MITRE_TACTICS.reduce((acc, t) => acc + t.techniques.length, 0);
  const observedCount = MITRE_TACTICS.reduce(
    (acc, t) => acc + t.techniques.filter((tech) => tech.observed).length,
    0,
  );
  const coveragePercent = Math.round((observedCount / totalTechniques) * 100);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">MITRE ATT&CK Matrix Navigator</h1>
            <DemoTag>Enterprise v14.1</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Adversary tactical landscape mapped against active telemetry detections and rule coverage.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="rounded-chip border border-line bg-surface px-3 py-1.5 flex items-center gap-2">
            <span className="text-muted">Kill Chain Coverage:</span>
            <span className="font-bold text-accent">{coveragePercent}% ({observedCount}/{totalTechniques})</span>
          </div>
        </div>
      </div>

      {/* Vehere MITRE ATT&CK Tactical Sensor Feed */}
      <div className="relative rounded-card border border-line bg-surface overflow-hidden shadow-md">
        <div className="relative aspect-[21/9] sm:aspect-[24/7] max-h-48 w-full overflow-hidden bg-black/90">
          <img
            src="/images/mitre_attack_alert_matrix.jpg"
            alt="Vehere MITRE ATT&CK Alert Trend & Offender Matrix"
            className="w-full h-full object-cover object-top opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />

          {/* Telemetry Overlays */}
          <div className="absolute top-2.5 left-3 flex flex-wrap gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sev-high/20 text-sev-high border border-sev-high/40 shadow">
              MITRE ATT&CK: 14 TACTIC KILL-CHAIN ACTIVE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/75 text-ink border border-line/60">
              IOC Detections: 235,563
            </span>
          </div>

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
            <span className="bg-black/75 text-cyan-400 px-2.5 py-0.5 rounded border border-cyan-500/30">
              Initial Access (15) → Privilege Escalation → Lateral Movement → Exfiltration
            </span>
            <span className="hidden sm:inline bg-black/75 text-muted px-2 py-0.5 rounded border border-line/50">
              Sensor: Vehere Real-Time Network Packet Inspection
            </span>
          </div>
        </div>
      </div>

      {/* MITRE Columns Grid */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-3 min-w-[1300px]">
          {MITRE_TACTICS.map((tactic) => (
            <div key={tactic.name} className="flex-1 min-w-[170px] space-y-2">
              <div className="rounded-t-card border border-line bg-surface p-2.5 text-center">
                <h3 className="text-xs font-semibold text-ink truncate">{tactic.name}</h3>
                <span className="text-[10px] font-mono text-muted">
                  {tactic.techniques.filter((t) => t.observed).length} / {tactic.techniques.length} Active
                </span>
              </div>

              <div className="space-y-1.5">
                {tactic.techniques.map((tech) => {
                  const isSelected = selectedTech?.id === tech.id;
                  return (
                    <div
                      key={tech.id}
                      onClick={() =>
                        setSelectedTech({
                          id: tech.id,
                          name: tech.name,
                          count: tech.count,
                          tactic: tactic.name,
                        })
                      }
                      className={clsx(
                        "cursor-pointer rounded-chip border p-2 text-left transition-all group",
                        isSelected
                          ? "border-accent bg-accent/10 shadow-sm"
                          : tech.observed
                          ? "border-line bg-surface hover:border-accent/60 hover:bg-raised"
                          : "border-line/40 bg-surface/30 opacity-60 hover:opacity-100",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-accent">{tech.id}</span>
                        {tech.count > 0 && (
                          <span className="rounded-full bg-sev-critical/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-sev-critical">
                            {tech.count}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] font-medium text-ink leading-tight group-hover:text-accent transition-colors">
                        {tech.name}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px]">
                        <SeverityBadge severity={tech.severity} />
                        <span className="font-mono text-muted">
                          {tech.observed ? "OBSERVED" : "MONITORED"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Technique Inspector */}
      {selectedTech && (
        <Card title={`Technique Intelligence: ${selectedTech.id} - ${selectedTech.name}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-muted">
                Tactic Phase: <span className="font-semibold text-accent">{selectedTech.tactic}</span>
              </p>
              <p className="text-ink">
                SentinelX currently has active behavioral and signature-based detectors monitoring this adversary technique.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono bg-raised px-3 py-1.5 rounded-chip border border-line text-ink">
                Telemetry Detections: <span className="font-bold text-sev-critical">{selectedTech.count} hits</span>
              </span>
              <button
                onClick={() => setSelectedTech(null)}
                className="px-2.5 py-1.5 text-xs text-muted hover:text-ink font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
