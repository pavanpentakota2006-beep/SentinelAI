import { useState } from "react";
import { PlugZap, CheckCircle2, RefreshCw, Power, Plus, Shield, Settings, Server } from "lucide-react";
import { Card, DemoTag } from "@/components/ui";
import clsx from "clsx";

interface DataSource {
  id: string;
  name: string;
  sourceType: "SIMULATOR" | "SYSLOG" | "HTTP_API" | "FILE_IMPORT";
  status: "ACTIVE" | "CONNECTED" | "DISABLED";
  throughputEps: number;
  lastIngested: string;
  description: string;
}

const INITIAL_SOURCES: DataSource[] = [
  {
    id: "SRC-001",
    name: "Synthetic Security Event Simulator",
    sourceType: "SIMULATOR",
    status: "ACTIVE",
    throughputEps: 340,
    lastIngested: "Just now",
    description: "Built-in synthetic attack and normal traffic generator emitting MITRE ATT&CK attack campaigns.",
  },
  {
    id: "SRC-002",
    name: "Syslog RFC 5424 Edge Ingestion Forwarder",
    sourceType: "SYSLOG",
    status: "ACTIVE",
    throughputEps: 510,
    lastIngested: "Just now",
    description: "TLS listening endpoint receiving network flow, firewall drop logs, and proxy connections.",
  },
  {
    id: "SRC-003",
    name: "CrowdStrike Falcon Endpoint Security API",
    sourceType: "HTTP_API",
    status: "CONNECTED",
    throughputEps: 85,
    lastIngested: "1 min ago",
    description: "Ingests host process executions, DLL injection alerts, and endpoint containment telemetry.",
  },
  {
    id: "SRC-004",
    name: "AWS CloudTrail & VPC Flow Logs (S3)",
    sourceType: "FILE_IMPORT",
    status: "ACTIVE",
    throughputEps: 120,
    lastIngested: "2 mins ago",
    description: "Pulls AWS IAM privilege changes, S3 bucket access, and security group modifications.",
  },
  {
    id: "SRC-005",
    name: "Palo Alto Networks Perimeter Firewall",
    sourceType: "SYSLOG",
    status: "ACTIVE",
    throughputEps: 290,
    lastIngested: "Just now",
    description: "Border gateway traffic inspect logs, NAT sessions, and threat prevention signatures.",
  },
  {
    id: "SRC-006",
    name: "Okta Identity Cloud Audit Stream",
    sourceType: "HTTP_API",
    status: "CONNECTED",
    throughputEps: 45,
    lastIngested: "3 mins ago",
    description: "SSO authentications, MFA push challenges, password resets, and user geo-velocity deviations.",
  },
];

export default function IntegrationsPage() {
  const [sources, setSources] = useState(INITIAL_SOURCES);

  const toggleSource = (id: string) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "ACTIVE" ? "DISABLED" : "ACTIVE" }
          : s,
      ),
    );
  };

  const totalEps = sources
    .filter((s) => s.status === "ACTIVE" || s.status === "CONNECTED")
    .reduce((acc, s) => acc + s.throughputEps, 0);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Ingestion & Data Source Integrations</h1>
            <DemoTag>V1 Core Connectors</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Enterprise log collectors, cloud audit feeds, and SIEM connectors mapping directly to the database schema.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="rounded-chip border border-line bg-surface px-3 py-1.5 flex items-center gap-2">
            <span className="text-muted">Total Ingestion Throughput:</span>
            <span className="font-bold text-accent">{totalEps} events/sec</span>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {sources.map((src) => (
          <div
            key={src.id}
            className="rounded-card border border-line bg-surface p-4 flex flex-col justify-between space-y-4 hover:border-line/80 transition-all shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-accent">{src.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-raised border border-line text-muted uppercase">
                  {src.sourceType}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink">{src.name}</h3>
                <span
                  className={clsx(
                    "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded",
                    src.status === "ACTIVE"
                      ? "bg-ok/20 text-ok"
                      : src.status === "CONNECTED"
                      ? "bg-accent/20 text-accent"
                      : "bg-line text-muted",
                  )}
                >
                  {src.status}
                </span>
              </div>

              <p className="text-xs text-muted leading-relaxed font-sans">{src.description}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-line/60">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-raised/40 p-2.5 rounded-chip border border-line/40">
                <div className="flex justify-between">
                  <span className="text-muted">Throughput:</span>
                  <span className="text-ok font-semibold">{src.throughputEps} EPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Last Ingested:</span>
                  <span className="text-ink">{src.lastIngested}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => alert(`Configuring ${src.name}...`)}
                  className="flex items-center gap-1 text-xs text-accent hover:underline font-mono"
                >
                  <Settings size={12} />
                  <span>Configure Connector</span>
                </button>

                <button
                  onClick={() => toggleSource(src.id)}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1 rounded-chip text-xs font-mono font-semibold transition-colors",
                    src.status === "ACTIVE"
                      ? "bg-raised hover:bg-surface text-ink border border-line"
                      : "bg-ok/20 hover:bg-ok/30 text-ok border border-ok/30",
                  )}
                >
                  <Power size={12} />
                  <span>{src.status === "ACTIVE" ? "Pause" : "Activate"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
