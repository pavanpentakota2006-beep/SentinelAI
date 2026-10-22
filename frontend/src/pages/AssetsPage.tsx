import { useState } from "react";
import { Server, Search, Shield, AlertCircle, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";
import { ASSETS_LIST, type EnterpriseAsset } from "@/data/mockData";
import { Card, DemoTag } from "@/components/ui";
import clsx from "clsx";

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [envFilter, setEnvFilter] = useState("ALL");

  const filteredAssets = ASSETS_LIST.filter((a) => {
    if (envFilter !== "ALL" && a.environment !== envFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.hostname.toLowerCase().includes(q) ||
        a.ipAddress.includes(q) ||
        a.owner.toLowerCase().includes(q) ||
        a.os.toLowerCase().includes(q)
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
            <h1 className="text-xl font-semibold">Enterprise Assets Inventory</h1>
            <DemoTag>Hardware & Cloud Instances</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Monitored servers, workstations, databases, and network devices with real-time health telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-sev-critical/20 px-2 py-1 text-sev-critical">
            Compromised: {ASSETS_LIST.filter((a) => a.status === "compromised").length}
          </span>
          <span className="rounded bg-ok/20 px-2 py-1 text-ok">
            Healthy: {ASSETS_LIST.filter((a) => a.status === "healthy").length}
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
            placeholder="Search hostname, IP address, OS, or owner..."
            className="w-full rounded-chip border border-line bg-bg py-1.5 pl-8 pr-3 text-xs placeholder:text-muted focus:border-accent focus:outline-none font-mono"
          />
        </div>

        <select
          value={envFilter}
          onChange={(e) => setEnvFilter(e.target.value)}
          className="rounded-chip border border-line bg-bg px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="ALL">All Environments</option>
          <option value="production">Production</option>
          <option value="staging">Staging</option>
          <option value="dmz">DMZ Perimeter</option>
        </select>
      </div>

      {/* Assets Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-card border border-line bg-surface p-4 space-y-3 hover:border-line/80 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded bg-raised border border-line text-accent">
                  <Server size={16} />
                </span>
                <div>
                  <h3 className="font-mono text-sm font-bold text-ink">{asset.hostname}</h3>
                  <span className="font-mono text-[11px] text-muted">{asset.ipAddress}</span>
                </div>
              </div>

              <span
                className={clsx(
                  "font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded",
                  asset.status === "compromised"
                    ? "bg-sev-critical/20 text-sev-critical animate-pulse"
                    : asset.status === "warning"
                    ? "bg-sev-high/20 text-sev-high"
                    : "bg-ok/20 text-ok",
                )}
              >
                {asset.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs bg-raised/40 p-2.5 rounded-chip border border-line/60">
              <div className="flex justify-between">
                <span className="text-muted">Type:</span>
                <span className="font-semibold text-ink">{asset.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Environment:</span>
                <span className="font-mono text-accent uppercase text-[11px]">{asset.environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Criticality:</span>
                <span className="font-mono font-bold text-sev-critical">
                  {"★".repeat(asset.criticality)}{"☆".repeat(5 - asset.criticality)}
                </span>
              </div>
              <div className="flex justify-between truncate">
                <span className="text-muted">Operating Sys:</span>
                <span className="font-mono text-[11px] text-ink truncate max-w-[170px]">{asset.os}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-muted">
              <span>Owner: {asset.owner}</span>
              {asset.openAlerts > 0 ? (
                <span className="font-mono text-sev-critical font-semibold flex items-center gap-1">
                  <AlertCircle size={12} /> {asset.openAlerts} alerts
                </span>
              ) : (
                <span className="font-mono text-ok flex items-center gap-1">
                  <CheckCircle2 size={12} /> No active alerts
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
