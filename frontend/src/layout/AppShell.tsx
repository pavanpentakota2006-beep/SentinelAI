import {
  Moon,
  Play,
  Pause,
  Radio,
  Search,
  Sun,
  Bell,
  Shield,
  Menu,
  X,
  Command
} from "lucide-react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { NAV } from "@/nav";
import { useTheme } from "@/lib/theme";
import { useStore } from "@/lib/store";
import { DemoTag } from "@/components/ui";
import { SentinelLogo } from "@/components/SentinelLogo";
import { CommandPalette } from "@/components/CommandPalette";

const GROUPS = [...new Set(NAV.map((n) => n.group))];

export default function AppShell() {
  const { theme, toggle } = useTheme();
  const { isSimulatorRunning, toggleSimulator, alerts, incidents, lastSimulatedEvent } = useStore();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openAlertsCount = alerts.filter((a) => a.status === "open").length;
  const activeIncidentsCount = incidents.filter((i) => i.status !== "resolved").length;

  // Global keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-bg text-ink selection:bg-accent/20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface md:flex select-none" aria-label="Primary Navigation">
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

      {/* Mobile Drawer Backdrop & Navigation */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-line flex flex-col shadow-2xl animate-slideRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <div className="flex items-center gap-2.5" onClick={() => { navigate("/"); setMobileMenuOpen(false); }}>
                <SentinelLogo size={28} />
                <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  SentinelX AI
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-ink hover:bg-raised"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {GROUPS.map((group) => (
                <div key={group}>
                  <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted/70">{group}</p>
                  <div className="space-y-0.5">
                    {NAV.filter((n) => n.group === group).map(({ path, label, icon: Icon }) => (
                      <NavLink
                        key={path}
                        to={path}
                        end={path === "/"}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center justify-between rounded-chip px-2.5 py-2 text-xs transition-colors",
                            isActive
                              ? "bg-accent/15 text-accent font-medium border-l-2 border-accent"
                              : "text-muted hover:bg-raised hover:text-ink",
                          )
                        }
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon size={16} className="shrink-0" />
                          <span className="truncate">{label}</span>
                        </div>
                        {path === "/alerts" && openAlertsCount > 0 && (
                          <span className="rounded-full bg-sev-critical/20 px-1.5 py-0.2 text-[10px] font-mono text-sev-critical">
                            {openAlertsCount}
                          </span>
                        )}
                        {path === "/incidents" && activeIncidentsCount > 0 && (
                          <span className="rounded-full bg-sev-high/20 px-1.5 py-0.2 text-[10px] font-mono text-sev-high">
                            {activeIncidentsCount}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2.5 sm:gap-3 border-b border-line bg-surface/90 px-3 sm:px-4 backdrop-blur-md">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-raised border border-line/60"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>

          <DemoTag>Synthetic Security Telemetry</DemoTag>

          {/* Quick Command Palette Trigger */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="relative ml-2 flex items-center justify-between max-w-sm flex-1 rounded-chip border border-line bg-bg/80 py-1.5 px-3 text-xs text-muted hover:border-accent/60 hover:text-ink transition-colors cursor-pointer"
            title="Open Command Palette (Cmd+K / Ctrl+K)"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-muted" />
              <span className="truncate hidden sm:inline">Search command center, routes, tactics...</span>
              <span className="sm:hidden">Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-raised border border-line px-1.5 py-0.5 text-[10px] font-mono text-muted">
              <Command size={10} /> K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5 text-xs">
            {/* Notifications Button */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative rounded-chip p-2 text-muted hover:bg-raised hover:text-ink transition-colors border border-line/60"
              title="Notifications & SOC Alerts"
              aria-label="Notifications"
            >
              <Bell size={15} />
              {openAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sev-critical text-[9px] font-mono text-white font-bold animate-pulse">
                  {openAlertsCount > 9 ? "9+" : openAlertsCount}
                </span>
              )}
            </button>

            {/* Live simulator toggle */}
            <button
              onClick={toggleSimulator}
              className={clsx(
                "flex items-center gap-1.5 sm:gap-2 rounded-chip border px-2 sm:px-2.5 py-1 text-xs font-mono transition-all",
                isSimulatorRunning
                  ? "border-ok/30 bg-ok/10 text-ok hover:bg-ok/20"
                  : "border-line bg-raised text-muted hover:bg-surface hover:text-ink",
              )}
              title="Click to toggle the live background event generator"
            >
              {isSimulatorRunning ? (
                <>
                  <Radio size={13} className="text-ok animate-pulse" />
                  <span className="font-medium hidden sm:inline">Simulator: LIVE</span>
                  <span className="font-medium sm:hidden">LIVE</span>
                  <Pause size={12} className="opacity-70" />
                </>
              ) : (
                <>
                  <Radio size={13} className="text-muted" />
                  <span className="hidden sm:inline">Simulator: PAUSED</span>
                  <span className="sm:hidden">PAUSE</span>
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

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </div>
  );
}
