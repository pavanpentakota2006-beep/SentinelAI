import { useState } from "react";
import { UserCog, ShieldCheck, Key, Check, Lock, Users } from "lucide-react";
import { Card, DemoTag } from "@/components/ui";

const ROLES = [
  {
    name: "ADMINISTRATOR",
    desc: "Manage users, settings, integrations, and detection configuration",
    grants: "All 23 permissions (Full Control)",
    usersCount: 2,
    badge: "bg-sev-critical/20 text-sev-critical",
  },
  {
    name: "SECURITY_ANALYST",
    desc: "Review events, investigate incidents, enrich evidence, create reports",
    grants: "15 permissions: events, alerts:w, incidents:w, intel:w, rules, playbooks:req",
    usersCount: 8,
    badge: "bg-accent/20 text-accent",
  },
  {
    name: "INCIDENT_RESPONDER",
    desc: "Execute authorized and approved response playbooks",
    grants: "11 permissions: dashboard, events, alerts, playbooks:approve/execute, cases",
    usersCount: 4,
    badge: "bg-sev-high/20 text-sev-high",
  },
  {
    name: "READ_ONLY_VIEWER",
    desc: "View dashboards, incidents, and reports",
    grants: "4 permissions: dashboard:read, alerts:read, incidents:read, assets:read",
    usersCount: 16,
    badge: "bg-line text-muted",
  },
];

const USERS = [
  { name: "Admin Operations", email: "admin_sec@sentinelx-ai.com", role: "ADMINISTRATOR", lastLogin: "10 mins ago", status: "Active" },
  { name: "Sarah Connor", email: "sarah.connor@sentinelx-ai.com", role: "SECURITY_ANALYST", lastLogin: "1 hour ago", status: "Active" },
  { name: "David Miller", email: "david.miller@sentinelx-ai.com", role: "INCIDENT_RESPONDER", lastLogin: "25 mins ago", status: "Active" },
  { name: "Auditor Guest", email: "auditor@compliance.corp", role: "READ_ONLY_VIEWER", lastLogin: "3 days ago", status: "Active" },
];

export default function UsersRolesPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Users, Roles & RBAC Foundation</h1>
            <DemoTag>Flyway V2 Seeded Schema</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Role-Based Access Control enforcing deny-by-default granular permissions.
          </p>
        </div>
      </div>

      {/* Roles Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {ROLES.map((r) => (
          <div key={r.name} className="rounded-card border border-line bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${r.badge}`}>
                {r.name}
              </span>
              <span className="font-mono text-xs text-muted">{r.usersCount} Assigned Users</span>
            </div>

            <p className="text-xs text-ink">{r.desc}</p>

            <div className="text-[11px] font-mono bg-raised/50 p-2.5 rounded-chip border border-line/60 text-muted">
              <span className="text-ink font-semibold block mb-0.5">Granted Capabilities:</span>
              {r.grants}
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <Card title="Active System Accounts">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line text-muted font-medium bg-raised/30">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email Address</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Last Active</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {USERS.map((u) => (
                <tr key={u.email} className="hover:bg-raised/30">
                  <td className="py-2.5 px-3 font-semibold text-ink">{u.name}</td>
                  <td className="py-2.5 px-3 font-mono text-muted">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-raised border border-line text-accent">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-muted text-[11px]">{u.lastLogin}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-ok font-mono text-[11px] font-semibold">{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
