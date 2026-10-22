import { useState } from "react";
import { BellRing, Bell, Check, CheckCheck, Filter, ShieldAlert, MessageSquare, Mail, Radio } from "lucide-react";
import { Card, DemoTag, SeverityBadge } from "@/components/ui";
import clsx from "clsx";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  channel: "Slack #soc-incidents" | "PagerDuty" | "Email Security Ops" | "Webhook";
  severity: "critical" | "high" | "medium" | "low";
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-01",
    title: "P1 Incident Escalated: Data Exfiltration from db-core-02",
    message: "Automated trigger: Outbound transfer to 185.220.101.5 exceeded 8.4 GB. PagerDuty on-call security engineer paged.",
    time: "4 mins ago",
    channel: "PagerDuty",
    severity: "critical",
    read: false,
  },
  {
    id: "NOTIF-02",
    title: "Cobalt Strike C2 Beacon Detected on web-gw-01",
    message: "Repeated beaconing to updates-cdn-auth.com every 30 seconds. Host quarantine recommended.",
    time: "15 mins ago",
    channel: "Slack #soc-incidents",
    severity: "critical",
    read: false,
  },
  {
    id: "NOTIF-03",
    title: "Admin Account Brute-Forced via External VPN",
    message: "Identity alex.mercer authenticated from NL exit node following 18 Kerberos pre-auth failures.",
    time: "28 mins ago",
    channel: "Slack #soc-incidents",
    severity: "high",
    read: false,
  },
  {
    id: "NOTIF-04",
    title: "Threat Intel Sync: 120 new malicious IOCs ingested",
    message: "Daily CTI synchronization completed successfully. New bulletproof IPs injected into edge filters.",
    time: "2 hours ago",
    channel: "Email Security Ops",
    severity: "low",
    read: true,
  },
  {
    id: "NOTIF-05",
    title: "Daily SOC Threat Analytics Summary Ready",
    message: "Daily report generated for October 22, 2026. 12,480 events correlated into 5 active incidents.",
    time: "5 hours ago",
    channel: "Email Security Ops",
    severity: "medium",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filterChannel, setFilterChannel] = useState("ALL");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const filtered = notifications.filter(
    (n) => filterChannel === "ALL" || n.channel.includes(filterChannel),
  );

  return (
    <div className="space-y-5 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Security Notifications & Alerts Dispatch</h1>
            <DemoTag>Multi-Channel Alerting</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Real-time critical incident escalations routed to on-call responders across Slack, PagerDuty, and email.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 self-start sm:self-center rounded-chip border border-line bg-raised px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface transition-colors"
          >
            <CheckCheck size={14} className="text-ok" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center gap-2.5 rounded-card border border-line bg-surface p-3">
        <span className="text-xs text-muted font-medium">Filter by channel:</span>
        <select
          value={filterChannel}
          onChange={(e) => setFilterChannel(e.target.value)}
          className="rounded-chip border border-line bg-bg px-2.5 py-1 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="ALL">All Dispatch Channels</option>
          <option value="Slack">Slack #soc-incidents</option>
          <option value="PagerDuty">PagerDuty (On-Call)</option>
          <option value="Email">Email</option>
        </select>
        <span className="ml-auto font-mono text-xs text-muted">
          {unreadCount} unread / {notifications.length} total
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => toggleRead(n.id)}
            className={clsx(
              "cursor-pointer rounded-card border p-4 transition-all flex items-start gap-3.5 shadow-sm group",
              n.read
                ? "border-line/50 bg-surface/60 opacity-80"
                : "border-accent/40 bg-surface ring-1 ring-accent/20",
            )}
          >
            <div className="pt-0.5">
              <span
                className={clsx(
                  "grid h-8 w-8 place-items-center rounded-full border text-xs font-bold",
                  n.severity === "critical"
                    ? "bg-sev-critical/15 text-sev-critical border-sev-critical/30"
                    : n.severity === "high"
                    ? "bg-sev-high/15 text-sev-high border-sev-high/30"
                    : "bg-raised text-accent border-line",
                )}
              >
                <Bell size={14} />
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className={clsx("text-xs font-semibold", n.read ? "text-ink/80" : "text-ink font-bold")}>
                    {n.title}
                  </h3>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  )}
                </div>
                <span className="font-mono text-[10px] text-muted">{n.time}</span>
              </div>

              <p className="text-xs text-muted leading-relaxed font-sans">{n.message}</p>

              <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-muted">
                <span className="rounded bg-raised px-1.5 py-0.2 border border-line text-accent">
                  {n.channel}
                </span>
                <SeverityBadge severity={n.severity} />
                <span className="text-muted/60">{n.read ? "Read" : "Click to mark read"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
