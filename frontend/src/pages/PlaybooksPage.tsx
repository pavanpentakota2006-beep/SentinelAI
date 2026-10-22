import { useState } from "react";
import { Workflow, Play, CheckCircle2, Shield, Lock, Clock, History, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, DemoTag } from "@/components/ui";
import clsx from "clsx";

export default function PlaybooksPage() {
  const { playbooks, triggerPlaybook } = useStore();
  const [runningId, setRunningId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRun = async (id: string, name: string) => {
    setRunningId(id);
    await triggerPlaybook(id);
    setTimeout(() => {
      setRunningId(null);
      setSuccessMsg(`Playbook "${name}" executed successfully across integrated security infrastructure.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">SOAR Response Playbooks</h1>
            <DemoTag>Automated Containment Workflows</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Orchestrated mitigation playbooks integrating EDR containment, perimeter firewall rules, and Active Directory lockout.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-ok/20 px-2.5 py-1 text-ok font-semibold">
            Avg Success Rate: 98.6%
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-card border border-ok/40 bg-ok/10 p-3.5 text-xs text-ok flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Playbooks Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {playbooks.map((pb) => (
          <div
            key={pb.id}
            className="rounded-card border border-line bg-surface p-4 flex flex-col justify-between space-y-4 hover:border-line/80 transition-all shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-accent">{pb.id}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-raised border border-line text-muted">
                  {pb.category}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-ink">{pb.name}</h3>
              <p className="text-xs text-muted leading-relaxed">{pb.description}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-line/60">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-raised/40 p-2 rounded-chip border border-line/40">
                <div>
                  <span className="text-[10px] text-muted block">Runs</span>
                  <span className="font-semibold text-ink">{pb.executionsCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block">Success</span>
                  <span className="font-semibold text-ok">{pb.successRate}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block">Approval</span>
                  <span className="font-semibold text-accent text-[11px]">
                    {pb.approvalRequired ? "Required" : "Automated"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted font-mono flex items-center gap-1">
                  <Clock size={11} /> Last run: {pb.lastRun}
                </span>

                <button
                  onClick={() => handleRun(pb.id, pb.name)}
                  disabled={runningId === pb.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-chip bg-accent text-accent-ink hover:bg-accent/90 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <Play size={12} />
                  <span>{runningId === pb.id ? "Executing..." : "Trigger Playbook"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
