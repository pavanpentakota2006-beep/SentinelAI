import { useState } from "react";
import { FolderSearch, Search, Play, Clock, User, Filter, ArrowRight, Bookmark, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, DemoTag, SeverityBadge } from "@/components/ui";

interface InvestigationItem {
  id: string;
  title: string;
  query: string;
  author: string;
  category: "Threat Hunting" | "Forensics" | "Compliance" | "Insider Threat";
  lastRun: string;
  resultsCount: number;
  status: "Active" | "Archived";
}

const INITIAL_INVESTIGATIONS: InvestigationItem[] = [
  {
    id: "INV-101",
    title: "Kerberos TGT Ticket Anomalies on Domain Controllers",
    query: "eventType:AUTH_FAILURE AND target:ad-dc-01 AND failure_code:PREAUTH_FAILED | stats count by srcIp, user",
    author: "Sarah Connor (SOC Lead)",
    category: "Threat Hunting",
    lastRun: "12 mins ago",
    resultsCount: 24,
    status: "Active",
  },
  {
    id: "INV-102",
    title: "Outbound Data Transfer Spikes to Bulletproof Subnets",
    query: "eventType:DATA_EXFIL OR (eventType:NET_CONN AND bytes_out > 100000000) | eval gb=bytes_out/1073741824",
    author: "Security Analyst (You)",
    category: "Forensics",
    lastRun: "25 mins ago",
    resultsCount: 14,
    status: "Active",
  },
  {
    id: "INV-103",
    title: "Cobalt Strike Malleable HTTP Listener Callbacks",
    query: "eventType:NET_CONN AND (dst_port:80 OR dst_port:443) AND jitter_pct < 15 | bucket _time span=30s",
    author: "David Miller",
    category: "Threat Hunting",
    lastRun: "1 hour ago",
    resultsCount: 62,
    status: "Active",
  },
  {
    id: "INV-104",
    title: "Privilege Escalation & Token Manipulation via LSASS",
    query: "eventType:PRIV_ESC AND target_process:\"lsass.exe\" AND granted_access:\"0x1FFFFF\"",
    author: "Security Analyst (You)",
    category: "Forensics",
    lastRun: "2 hours ago",
    resultsCount: 3,
    status: "Active",
  },
  {
    id: "INV-105",
    title: "High-Entropy DNS Query Volume (Tunneling Detection)",
    query: "eventType:DNS_QUERY AND query_type:TXT | eval shannon_entropy=calc_entropy(domain) | where shannon_entropy > 4.2",
    author: "Alex Mercer",
    category: "Insider Threat",
    lastRun: "Yesterday",
    resultsCount: 420,
    status: "Active",
  },
];

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState(INITIAL_INVESTIGATIONS);
  const [search, setSearch] = useState("");
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRerun = (id: string) => {
    setRunningId(id);
    setTimeout(() => {
      setRunningId(null);
      setInvestigations((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, lastRun: "Just now" } : inv)),
      );
    }, 600);
  };

  const filtered = investigations.filter(
    (inv) =>
      inv.title.toLowerCase().includes(search.toLowerCase()) ||
      inv.query.toLowerCase().includes(search.toLowerCase()) ||
      inv.author.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Saved Investigations & Threat Hunts</h1>
            <DemoTag>Analyst Notebooks</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Pre-configured security telemetry queries, forensic hunting routines, and historical audit queries.
          </p>
        </div>

        <button
          onClick={() => alert("Creating a new threat hunting workbook...")}
          className="flex items-center gap-1.5 self-start sm:self-center rounded-chip bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink hover:bg-accent/90 transition-colors shadow-sm"
        >
          <Bookmark size={14} />
          <span>New Hunt Notebook</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-card border border-line bg-surface p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search investigation title, author or telemetry query..."
            className="w-full rounded-chip border border-line bg-bg py-1.5 pl-8 pr-3 text-xs placeholder:text-muted focus:border-accent focus:outline-none font-mono"
          />
        </div>

        <span className="text-xs font-mono text-muted">
          Showing <span className="text-ink font-semibold">{filtered.length}</span> notebooks
        </span>
      </div>

      {/* Investigations List */}
      <div className="grid gap-3">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            className="rounded-card border border-line bg-surface p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-line/80 transition-all shadow-sm"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">{inv.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-raised border border-line text-muted">
                  {inv.category}
                </span>
                <span className="text-[10px] text-ok bg-ok/10 border border-ok/30 px-1.5 py-0.2 rounded font-mono font-semibold">
                  {inv.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-ink">{inv.title}</h3>

              <div className="rounded-chip border border-line bg-bg p-2 text-xs font-mono text-ink/80 max-w-3xl overflow-x-auto truncate">
                <code>{inv.query}</code>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted pt-1">
                <span className="flex items-center gap-1">
                  <User size={12} /> Author: <span className="text-ink font-medium">{inv.author}</span>
                </span>
                <span className="font-mono text-[11px] flex items-center gap-1">
                  <Clock size={11} /> Last executed: {inv.lastRun}
                </span>
                <span className="font-mono text-[11px] text-accent font-semibold">
                  {inv.resultsCount} matching telemetry events
                </span>
              </div>
            </div>

            <div className="shrink-0 self-end md:self-center">
              <button
                onClick={() => handleRerun(inv.id)}
                disabled={runningId === inv.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-chip border border-line bg-raised hover:bg-surface text-ink text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <Play size={12} className={runningId === inv.id ? "animate-spin text-accent" : "text-ok"} />
                <span>{runningId === inv.id ? "Executing..." : "Rerun Hunt"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
