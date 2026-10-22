import { useState } from "react";
import { BriefcaseBusiness, Search, Clock, ShieldAlert, ArrowRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import { CASES_LIST, type CaseRecord } from "@/data/mockData";
import { Card, DemoTag } from "@/components/ui";
import clsx from "clsx";

export default function CasesPage() {
  const [cases] = useState<CaseRecord[]>(CASES_LIST);
  const [search, setSearch] = useState("");

  const filtered = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.assignee.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">SOC Investigation Cases</h1>
            <DemoTag>SLA & Escalation Tracker</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Structured forensic cases assigned to security analysts with timeline evidence and response milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-sev-critical/20 px-2.5 py-1 text-sev-critical font-semibold">
            P1 Active: {cases.filter((c) => c.priority.startsWith("P1")).length}
          </span>
        </div>
      </div>

      {/* Cases List */}
      <div className="grid gap-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="rounded-card border border-line bg-surface p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-line/80 transition-all shadow-sm"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">{c.id}</span>
                <span
                  className={clsx(
                    "font-mono text-[10px] font-bold px-2 py-0.5 rounded",
                    c.priority.startsWith("P1")
                      ? "bg-sev-critical/20 text-sev-critical"
                      : c.priority.startsWith("P2")
                      ? "bg-sev-high/20 text-sev-high"
                      : "bg-line text-muted",
                  )}
                >
                  {c.priority}
                </span>
                <span className="text-[10px] font-mono uppercase bg-raised px-2 py-0.5 rounded text-ink border border-line">
                  {c.status}
                </span>
                <Link to="/incidents" className="text-xs font-mono text-accent hover:underline flex items-center gap-0.5">
                  <span>Linked: {c.incidentId}</span>
                  <ArrowRight size={11} />
                </Link>
              </div>

              <h3 className="text-sm font-semibold text-ink">{c.title}</h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <User size={12} /> Assignee: <span className="text-ink font-medium">{c.assignee}</span>
                </span>
                <span>Opened: {c.openedAt}</span>
                <span className="font-mono text-[11px] text-accent">
                  SLA Target: {c.slaRemaining}
                </span>
                <span>Notes: {c.notesCount} entries</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
