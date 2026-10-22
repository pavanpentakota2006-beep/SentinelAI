import { Moon, Play, Pause, Radio, Search, Sun, Bell, Shield, Terminal } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import clsx from "clsx";
import { NAV } from "@/nav";
import { useTheme } from "@/lib/theme";
import { useStore } from "@/lib/store";
import { DemoTag } from "@/components/ui";

import { SentinelLogo } from "@/components/SentinelLogo";

const GROUPS = [...new Set(NAV.map((n) => n.group))];

export default function AppShell() {
  const { theme, toggle } = useTheme();
  const { isSimulatorRunning, toggleSimulator, alerts, incidents, lastSimulatedEvent } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const openAlertsCount = alerts.filter((a) => a.status === "open").length;
  const activeIncidentsCount = incidents.filter((i) => i.status !== "resolved").length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("event")) navigate("/events");
    else if (q.includes("surveillance") || q.includes("camera") || q.includes("image") || q.includes("feed")) navigate("/surveillance");
    else if (q.includes("alert")) navigate("/alerts");
    else if (q.includes("inc")) navigate("/incidents");
    else if (q.includes("graph")) navigate("/attack-graph");
    else if (q.includes("mitre") || q.includes("tactic")) navigate("/mitre");
    else if (q.includes("intel") || q.includes("ioc")) navigate("/threat-intel");
    else if (q.includes("asset") || q.includes("server")) navigate("/assets");
    else if (q.includes("rule")) navigate("/rules");
    else if (q.includes("playbook")) navigate("/playbooks");
    else if (q.includes("user") || q.includes("role")) navigate("/users");
    else if (q.includes("audit")) navigate("/audit");
    else navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface md:flex select-none" aria-label="Primary">
        <div
          onClick={() => navigate("/")}
          className="flex h-14 items-center gap-3 border-b border-line px-4 cursor-pointer hover:bg-raised/50 transition-colors"
        >
          <SentinelLogo size={32} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SentinelX AI
              </span>
              <span className="rounded bg-accent/20 px-1 py-0.2 text-[9px] font-mono text-accent">v1.2</span>
            </div>
            <p className="text-[10px] text-muted font-mono leading-none">Autonomous SOC</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-3 custom-scrollbar">
          {GROUPS.map((group) => (
            <div key={group}>
              <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted/70">{group}</p>
              <div className="space-y-0.5">
                {NAV.filter((n) => n.group === group).map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === "/"}
                    className={({ isActive }) =>
                      clsx(
                        "group flex items-center justify-between rounded-chip px-2.5 py-1.5 text-xs transition-colors",
                        isActive
                          ? "bg-accent/15 text-accent font-medium border-l-2 border-accent"
                          : "text-muted hover:bg-raised hover:text-ink",
                      )
                    }
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon size={15} className="shrink-0 transition-transform group-hover:scale-110" aria-hidden />
                      <span className="truncate">{label}</span>
                    </div>
                    {path === "/alerts" && openAlertsCount > 0 && (
                      <span className="rounded-full bg-sev-critical/20 px-1.5 py-0.2 text-[10px] font-mono font-medium text-sev-critical">
                        {openAlertsCount}
                      </span>
                    )}
                    {path === "/incidents" && activeIncidentsCount > 0 && (
                      <span className="rounded-full bg-sev-high/20 px-1.5 py-0.2 text-[10px] font-mono font-medium text-sev-high">
                        {activeIncidentsCount}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer info in sidebar */}
        <div className="border-t border-line p-3 bg-raised/40">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <Shield size={12} className="text-ok" /> Ingestion Active
            </span>
            <span className="font-mono text-[10px]">850 evt/s</span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-md">
          <DemoTag>Synthetic Security Telemetry</DemoTag>

          <form onSubmit={handleSearch} className="relative ml-2 hidden max-w-md flex-1 sm:block">
            <span className="sr-only">Search events, incidents, and assets</span>
            <Search size={15} className="absolute left-2.5 top-2.5 text-muted pointer-events-none" aria-hidden />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick jump: events, alerts, incidents, mitre, graph..."
              className="w-full rounded-chip border border-line bg-bg py-1.5 pl-8 pr-3 text-xs placeholder:text-muted focus:border-accent focus:outline-none transition-colors font-mono"
            />
          </form>

          <div className="ml-auto flex items-center gap-2.5 text-xs">
            {/* Live simulator toggle */}
            <button
              onClick={toggleSimulator}
              className={clsx(
                "flex items-center gap-2 rounded-chip border px-2.5 py-1 text-xs font-mono transition-all",
                isSimulatorRunning
                  ? "border-ok/30 bg-ok/10 text-ok hover:bg-ok/20"
                  : "border-line bg-raised text-muted hover:bg-surface hover:text-ink",
              )}
              title="Click to toggle the live background event generator"
            >
              {isSimulatorRunning ? (
                <>
                  <Radio size={13} className="text-ok animate-pulse" />
                  <span className="font-medium">Simulator: LIVE</span>
                  <Pause size={12} className="opacity-70" />
                </>
              ) : (
                <>
                  <Radio size={13} className="text-muted" />
                  <span>Simulator: PAUSED</span>
                  <Play size={12} className="opacity-70" />
                </>
              )}
            </button>

            {/* Theme switcher */}
            <button
              onClick={toggle}
              className="rounded-chip p-2 text-muted hover:bg-raised hover:text-ink transition-colors border border-line/60"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        {/* Live event ticker if simulator is running */}
        {isSimulatorRunning && lastSimulatedEvent && (
          <div className="border-b border-line/40 bg-accent/5 px-4 py-1 text-[11px] font-mono flex items-center gap-2 overflow-hidden text-muted animate-fadeIn">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            <span className="text-accent font-semibold shrink-0">LIVE INGESTION:</span>
            <span className="truncate">
              [{lastSimulatedEvent.timestamp.split(" ")[1]}] {lastSimulatedEvent.eventType} on{" "}
              <span className="text-ink font-semibold">{lastSimulatedEvent.asset}</span> ({lastSimulatedEvent.srcIp}) -{" "}
              {lastSimulatedEvent.message}
            </span>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
