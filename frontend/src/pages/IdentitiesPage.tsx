import { useState } from "react";
import { Users, Search, ShieldAlert, KeyRound, CheckCircle2, UserCheck, AlertTriangle } from "lucide-react";
import { IDENTITIES_LIST, type IdentityProfile } from "@/data/mockData";
import { Card, DemoTag } from "@/components/ui";
import clsx from "clsx";

export default function IdentitiesPage() {
  const [search, setSearch] = useState("");
  const [filterPriv, setFilterPriv] = useState("ALL");

  const filtered = IDENTITIES_LIST.filter((id) => {
    if (filterPriv === "PRIVILEGED" && !id.privileged) return false;
    if (filterPriv === "FLAGGED" && id.status !== "flagged") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        id.accountName.toLowerCase().includes(q) ||
        id.email.toLowerCase().includes(q) ||
        id.department.toLowerCase().includes(q) ||
        id.role.toLowerCase().includes(q)
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
            <h1 className="text-xl font-semibold">User & Service Identities</h1>
            <DemoTag>Identity Threat Detection (ITDR)</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Active Directory domain accounts, service principals, and privileged access monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-sev-critical/20 px-2 py-1 text-sev-critical">
            Flagged: {IDENTITIES_LIST.filter((i) => i.status === "flagged").length}
          </span>
          <span className="rounded bg-accent/20 px-2 py-1 text-accent">
            Privileged: {IDENTITIES_LIST.filter((i) => i.privileged).length}
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
            placeholder="Search account name, email, department or role..."
            className="w-full rounded-chip border border-line bg-bg py-1.5 pl-8 pr-3 text-xs placeholder:text-muted focus:border-accent focus:outline-none font-mono"
          />
        </div>

        <select
          value={filterPriv}
          onChange={(e) => setFilterPriv(e.target.value)}
          className="rounded-chip border border-line bg-bg px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="ALL">All Identities</option>
          <option value="PRIVILEGED">Privileged Accounts Only</option>
          <option value="FLAGGED">Flagged / High Risk Only</option>
        </select>
      </div>

      {/* Identities Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="rounded-card border border-line bg-surface p-4 space-y-3 hover:border-line/80 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-raised border border-line font-mono font-bold text-accent">
                  {user.accountName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-ink">{user.accountName}</h3>
                  <span className="text-xs text-muted block truncate max-w-[170px]">{user.email}</span>
                </div>
              </div>

              <span
                className={clsx(
                  "font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded",
                  user.status === "flagged"
                    ? "bg-sev-critical/20 text-sev-critical animate-pulse"
                    : user.status === "monitored"
                    ? "bg-sev-high/20 text-sev-high"
                    : "bg-ok/20 text-ok",
                )}
              >
                {user.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs bg-raised/40 p-2.5 rounded-chip border border-line/60">
              <div className="flex justify-between">
                <span className="text-muted">Department:</span>
                <span className="text-ink font-medium">{user.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Account Role:</span>
                <span className="text-ink font-mono text-[11px]">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Privileged Access:</span>
                <span className={clsx("font-semibold font-mono", user.privileged ? "text-sev-high" : "text-muted")}>
                  {user.privileged ? "YES (Admin)" : "Standard User"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Identity Risk Score:</span>
                <span
                  className={clsx(
                    "font-mono font-bold",
                    user.riskScore > 80
                      ? "text-sev-critical"
                      : user.riskScore > 50
                      ? "text-sev-high"
                      : "text-ok",
                  )}
                >
                  {user.riskScore} / 100
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-muted font-mono">
              <span>Failed Logins: {user.failedLogins24h}</span>
              <span>Last: {user.lastLogin.split(" ")[1]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
