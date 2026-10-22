import { HeartPulse, CheckCircle2, Server, Database, Zap, Cpu, Activity, ShieldCheck } from "lucide-react";
import { SYSTEM_HEALTH_METRICS } from "@/data/mockData";
import { Card, DemoTag } from "@/components/ui";

export default function HealthPage() {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">System & Infrastructure Health</h1>
            <DemoTag>Component Telemetry</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Operational status, database connection pools, ingestion buffer capacity, and ML model performance.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 rounded bg-ok/20 px-2.5 py-1 text-ok font-semibold">
            <CheckCircle2 size={13} /> {SYSTEM_HEALTH_METRICS.overallStatus} ({SYSTEM_HEALTH_METRICS.uptime} uptime)
          </span>
        </div>
      </div>

      {/* Grid of Components */}
      <div className="grid gap-4 md:grid-cols-2">
        {SYSTEM_HEALTH_METRICS.components.map((comp) => (
          <div
            key={comp.name}
            className="rounded-card border border-line bg-surface p-4 space-y-3 hover:border-line/80 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-raised border border-line text-accent">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-ink">{comp.name}</h3>
                  <p className="text-xs text-muted font-mono">{comp.details}</p>
                </div>
              </div>

              <span className="font-mono text-[10px] uppercase font-bold text-ok bg-ok/15 px-2 py-0.5 rounded border border-ok/30">
                {comp.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-raised/50 p-2.5 rounded-chip border border-line/60">
              <div className="flex justify-between">
                <span className="text-muted">Roundtrip Latency:</span>
                <span className="text-ok font-semibold">{comp.latencyMs} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Capacity Load:</span>
                <span className="text-accent font-semibold">{comp.load}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
