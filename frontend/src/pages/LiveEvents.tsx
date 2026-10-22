import { useState } from "react";
import { Activity, Download, Filter, Search, Terminal, X, Check, RefreshCw } from "lucide-react";
import { Card, DemoTag, SeverityBadge, SeverityRail, type Severity } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { SecurityEvent } from "@/data/mockData";
import clsx from "clsx";

export default function LiveEvents() {
  const { events, isSimulatorRunning } = useStore();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [inspectingEvent, setInspectingEvent] = useState<SecurityEvent | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredEvents = events.filter((e) => {
    if (selectedType !== "ALL" && e.eventType !== selectedType) return false;
    if (selectedSeverity !== "ALL" && e.severity !== selectedSeverity) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.id.toLowerCase().includes(q) ||
        e.srcIp.includes(q) ||
        e.dstIp.includes(q) ||
        e.asset.toLowerCase().includes(q) ||
        e.user.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCsv = () => {
    const headers = ["ID", "Timestamp", "EventType", "Severity", "SrcIP", "DstIP", "Asset", "User", "Message"];
    const rows = filteredEvents.map((e) => [
      e.id,
      e.timestamp,
      e.eventType,
      e.severity,
      e.srcIp,
      e.dstIp,
      e.asset,
      e.user,
      `"${e.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sentinelx_events_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Live Security Events</h1>
            <DemoTag>Normalized Ingestion Stream</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Streaming endpoint logs, authentication sessions, network connections, and forensic process starts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-chip border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-raised transition-colors"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-card border border-line bg-surface p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search IP, host, user, message or hash..."
            className="w-full rounded-chip border border-line bg-bg py-1.5 pl-8 pr-3 text-xs placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-chip border border-line bg-bg px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="ALL">All Event Types</option>
          <option value="AUTH_FAILURE">AUTH_FAILURE</option>
          <option value="AUTH_SUCCESS">AUTH_SUCCESS</option>
          <option value="PROCESS_START">PROCESS_START</option>
          <option value="NET_CONN">NET_CONN</option>
          <option value="DNS_QUERY">DNS_QUERY</option>
          <option value="DATA_EXFIL">DATA_EXFIL</option>
          <option value="PRIV_ESC">PRIV_ESC</option>
        </select>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="rounded-chip border border-line bg-bg px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <div className="ml-auto text-xs font-mono text-muted">
          Showing <span className="text-ink font-semibold">{filteredEvents.length}</span> of {events.length} events
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-raised/50 font-medium text-muted">
              <tr>
                <th className="py-2.5 pl-4 pr-2">Sev</th>
                <th className="px-2 py-2.5">Time</th>
                <th className="px-2 py-2.5">Event Type</th>
                <th className="px-2 py-2.5">Source IP</th>
                <th className="px-2 py-2.5">Destination</th>
                <th className="px-2 py-2.5">Asset / User</th>
                <th className="px-3 py-2.5">Message</th>
                <th className="py-2.5 pl-2 pr-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-raised/40 transition-colors group">
                  <td className="py-2.5 pl-4 pr-2">
                    <div className="flex items-center gap-1.5">
                      <SeverityRail severity={evt.severity} />
                      <SeverityBadge severity={evt.severity} />
                    </div>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-[11px] text-muted whitespace-nowrap">
                    {evt.timestamp}
                  </td>
                  <td className="px-2 py-2.5">
                    <span className="font-mono text-[11px] rounded bg-raised px-1.5 py-0.5 border border-line/60 text-accent">
                      {evt.eventType}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-[11px]">{evt.srcIp}</td>
                  <td className="px-2 py-2.5 font-mono text-[11px] text-muted">{evt.dstIp}</td>
                  <td className="px-2 py-2.5">
                    <div className="text-[11px]">
                      <span className="font-semibold text-ink">{evt.asset}</span>
                      <span className="text-muted block text-[10px]">{evt.user}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 max-w-md truncate text-muted group-hover:text-ink transition-colors">
                    {evt.message}
                  </td>
                  <td className="py-2.5 pl-2 pr-4 text-right">
                    <button
                      onClick={() => setInspectingEvent(evt)}
                      className="rounded bg-raised hover:bg-accent/20 hover:text-accent border border-line px-2 py-1 text-[11px] font-mono transition-colors"
                    >
                      Payload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Payload Inspector Modal */}
      {inspectingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-card border border-line bg-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-accent" />
                <h3 className="text-sm font-semibold">Security Event Raw Telemetry</h3>
                <span className="font-mono text-xs text-muted">[{inspectingEvent.id}]</span>
              </div>
              <button
                onClick={() => setInspectingEvent(null)}
                className="rounded-chip p-1 text-muted hover:bg-raised hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-raised/50 p-3 rounded-chip border border-line/60">
              <div>
                <span className="text-muted">Event Type:</span>{" "}
                <span className="text-accent">{inspectingEvent.eventType}</span>
              </div>
              <div>
                <span className="text-muted">Severity:</span>{" "}
                <SeverityBadge severity={inspectingEvent.severity} />
              </div>
              <div>
                <span className="text-muted">Host Asset:</span>{" "}
                <span className="text-ink font-semibold">{inspectingEvent.asset}</span>
              </div>
              <div>
                <span className="text-muted">Identity User:</span>{" "}
                <span className="text-ink">{inspectingEvent.user}</span>
              </div>
              <div>
                <span className="text-muted">Src/Dst IP:</span>{" "}
                <span className="text-ink">
                  {inspectingEvent.srcIp} → {inspectingEvent.dstIp}
                </span>
              </div>
              <div>
                <span className="text-muted">Timestamp:</span>{" "}
                <span className="text-ink">{inspectingEvent.timestamp}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-muted">Raw Process / Network Ingestion Payload</span>
                <button
                  onClick={() => copyJson(inspectingEvent.raw)}
                  className="flex items-center gap-1 text-[11px] text-accent hover:underline font-mono"
                >
                  {copied ? <Check size={12} className="text-ok" /> : null}
                  <span>{copied ? "Copied" : "Copy JSON"}</span>
                </button>
              </div>
              <pre className="max-h-60 overflow-y-auto rounded-chip border border-line bg-bg p-3 font-mono text-xs text-ink/90 custom-scrollbar">
                {JSON.stringify(inspectingEvent.raw, null, 2)}
              </pre>
            </div>

            <div className="text-[11px] text-muted flex items-center justify-between pt-2 border-t border-line">
              <span>Dedupe Hash: <span className="font-mono text-ink/70">{inspectingEvent.dedupeHash}</span></span>
              <button
                onClick={() => setInspectingEvent(null)}
                className="px-3 py-1 bg-raised hover:bg-raised/80 rounded-chip text-ink text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
