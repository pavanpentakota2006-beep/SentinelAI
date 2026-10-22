import { useState } from "react";
import { ShieldCheck, Search, Filter, Sliders, ToggleLeft, ToggleRight, Sparkles, AlertTriangle } from "lucide-react";
import { DETECTION_RULES, type DetectionRuleItem } from "@/data/mockData";
import { Card, DemoTag, SeverityBadge } from "@/components/ui";
import clsx from "clsx";

export default function DetectionRules() {
  const [rules, setRules] = useState<DetectionRuleItem[]>(DETECTION_RULES);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  const filteredRules = rules.filter((r) => {
    if (typeFilter !== "ALL" && r.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.mitreId.toLowerCase().includes(q) ||
        r.technique.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Detection Rules Catalog</h1>
            <DemoTag>Deterministic & ML Engines</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Active correlation rules, threshold triggers, and Isolation Forest ML models monitoring the telemetry stream.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-ok/20 px-2 py-1 text-ok">
            Enabled: {rules.filter((r) => r.enabled).length} / {rules.length}
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
            placeholder="Search rule name, MITRE ID (e.g. T1110), or description..."
            className="w-full rounded-chip border border-line bg-bg py-1.5 pl-8 pr-3 text-xs placeholder:text-muted focus:border-accent focus:outline-none font-mono"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-chip border border-line bg-bg px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="ALL">All Engine Types</option>
          <option value="Threshold">Threshold</option>
          <option value="Pattern Match">Pattern Match</option>
          <option value="Heuristic">Heuristic</option>
          <option value="Unsupervised ML">Unsupervised ML</option>
        </select>
      </div>

      {/* Rules List */}
      <div className="grid gap-3">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={clsx(
              "rounded-card border p-4 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
              rule.enabled
                ? "border-line bg-surface hover:border-line/80"
                : "border-line/40 bg-surface/40 opacity-70",
            )}
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">{rule.id}</span>
                <SeverityBadge severity={rule.severity} />
                <span className="font-mono text-[10px] bg-line/60 px-2 py-0.5 rounded text-ink font-semibold">
                  {rule.mitreId} - {rule.technique}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-raised border border-line text-muted font-mono">
                  {rule.type}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-ink">{rule.name}</h3>
              <p className="text-xs text-muted leading-relaxed">{rule.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-muted">
                <span>
                  Triggers (24h): <span className="text-ink font-semibold">{rule.triggers24h}</span>
                </span>
                <span>
                  Rule Fidelity: <span className="text-ok font-semibold">{rule.fidelityScore}%</span>
                </span>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => toggleRule(rule.id)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-chip text-xs font-mono font-medium transition-colors border",
                  rule.enabled
                    ? "bg-ok/15 text-ok border-ok/30 hover:bg-ok/25"
                    : "bg-raised text-muted border-line hover:text-ink",
                )}
              >
                {rule.enabled ? (
                  <>
                    <ToggleRight size={16} /> Enabled
                  </>
                ) : (
                  <>
                    <ToggleLeft size={16} /> Disabled
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
