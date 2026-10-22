import { useState } from "react";
import { ScrollText, Search, ShieldCheck, Lock, CheckCircle2, AlertOctagon } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, DemoTag } from "@/components/ui";
import clsx from "clsx";

export default function AuditLogsPage() {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState("");

  const filtered = auditLogs.filter(
    (l) =>
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.ipAddress.includes(search),
  );

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Immutable Audit Trail</h1>
            <DemoTag>Append-Only Ledger</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Cryptographically sealed audit trail capturing every analyst investigation, status update, and playbook execution.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-ok bg-ok/10 border border-ok/30 px-2.5 py-1 rounded-chip">
            <ShieldCheck size={13} /> Tamper-Proof Trigger Enforced
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-card border border-line bg-surface p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actor, action, target entity, or IP address..."
            className="w-full rounded-chip border border-line bg-bg py-1.5 pl-8 pr-3 text-xs placeholder:text-muted focus:border-accent focus:outline-none font-mono"
          />
        </div>

        <span className="ml-auto text-xs font-mono text-muted">
          Showing <span className="text-ink font-semibold">{filtered.length}</span> audit events
        </span>
      </div>

      {/* Audit Table */}
      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-raised/50 font-medium text-muted">
              <tr>
                <th className="py-2.5 pl-4 pr-2">ID</th>
                <th className="px-2 py-2.5">Timestamp</th>
                <th className="px-2 py-2.5">Actor</th>
                <th className="px-2 py-2.5">Assigned Role</th>
                <th className="px-2 py-2.5">Action Executed</th>
                <th className="px-3 py-2.5">Target Entity</th>
                <th className="px-2 py-2.5">Source IP</th>
                <th className="py-2.5 pl-2 pr-4 text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-mono">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-raised/40 transition-colors">
                  <td className="py-2.5 pl-4 pr-2 text-muted text-[11px]">{log.id}</td>
                  <td className="px-2 py-2.5 text-muted text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-2 py-2.5 font-semibold text-ink">{log.actor}</td>
                  <td className="px-2 py-2.5 text-[10px] text-accent">{log.role}</td>
                  <td className="px-2 py-2.5 font-bold text-ink">{log.action}</td>
                  <td className="px-3 py-2.5 text-muted max-w-xs truncate">{log.target}</td>
                  <td className="px-2 py-2.5 text-muted text-[11px]">{log.ipAddress}</td>
                  <td className="py-2.5 pl-2 pr-4 text-right">
                    <span
                      className={clsx(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded",
                        log.status === "SUCCESS"
                          ? "bg-ok/20 text-ok"
                          : log.status === "DENIED"
                          ? "bg-sev-critical/20 text-sev-critical"
                          : "bg-sev-high/20 text-sev-high",
                      )}
                    >
                      {log.status}
                    </span>
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
