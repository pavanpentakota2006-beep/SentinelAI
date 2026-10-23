import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Shield,
  AlertTriangle,
  Flame,
  Radio,
  FileText,
  Activity,
  Layers,
  Server,
  Users,
  Settings,
  Eye,
  Crosshair,
  Lock,
  Moon,
  Sun,
  Play,
  Pause,
  LucideIcon,
  X,
  CornerDownLeft
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: "Dashboards" | "Forensics" | "Management" | "Quick Actions";
  icon: LucideIcon;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isSimulatorRunning, toggleSimulator } = useStore();
  const { theme, toggle: toggleTheme } = useTheme();

  const commands: CommandItem[] = [
    // Dashboards
    {
      id: "dash-overview",
      title: "Executive Security Overview",
      description: "Real-time 3D telemetry, dual radial gauges, and threat radar",
      category: "Dashboards",
      icon: Activity,
      action: () => { navigate("/"); onClose(); },
      shortcut: "G O"
    },
    {
      id: "dash-incidents",
      title: "Incident Management Hub",
      description: "Active investigation triage, attack topology graph & MITRE tags",
      category: "Dashboards",
      icon: AlertTriangle,
      action: () => { navigate("/incidents"); onClose(); },
      shortcut: "G I"
    },
    {
      id: "dash-threat-intel",
      title: "Global Threat Intelligence",
      description: "SentralQ global threat heatmap, botnet vectors, IOC counters",
      category: "Dashboards",
      icon: Flame,
      action: () => { navigate("/threat-intel"); onClose(); },
      shortcut: "G T"
    },
    {
      id: "dash-alerts",
      title: "Interceptor Ingress & Alerts Board",
      description: "Ingress packet interception, abusive IP matrix & threat hunt",
      category: "Dashboards",
      icon: Shield,
      action: () => { navigate("/alerts"); onClose(); },
      shortcut: "G A"
    },
    {
      id: "dash-warroom",
      title: "Critical Incident War Room",
      description: "Level-3 emergency response, 5-stage attack chain & SOAR containment",
      category: "Dashboards",
      icon: Crosshair,
      action: () => { navigate("/attack-graph"); onClose(); },
      shortcut: "G W"
    },
    // Forensics
    {
      id: "forensics-events",
      title: "Live Event Telemetry Stream",
      description: "Normalized high-speed endpoint, network & authentication events",
      category: "Forensics",
      icon: Radio,
      action: () => { navigate("/events"); onClose(); }
    },
    {
      id: "forensics-surveillance",
      title: "Optical Surveillance Feeds",
      description: "5 live operational SOC video channels with telemetry inspection",
      category: "Forensics",
      icon: Eye,
      action: () => { navigate("/surveillance"); onClose(); }
    },
    {
      id: "forensics-mitre",
      title: "MITRE ATT&CK Matrix",
      description: "Full enterprise matrix mapping tactics from Recon to Exfiltration",
      category: "Forensics",
      icon: Layers,
      action: () => { navigate("/mitre"); onClose(); }
    },
    {
      id: "forensics-reports",
      title: "Forensic PDF Export Engine",
      description: "Generate board-ready A4 compliance & executive audit reports",
      category: "Forensics",
      icon: FileText,
      action: () => { navigate("/reports"); onClose(); }
    },
    // Management
    {
      id: "mgmt-assets",
      title: "Monitored Enterprise Assets",
      description: "Servers, database tiers, DMZ gateways and criticality ratings",
      category: "Management",
      icon: Server,
      action: () => { navigate("/assets"); onClose(); }
    },
    {
      id: "mgmt-users",
      title: "Users, Roles & RBAC",
      description: "Multi-tenant role permissions, analyst tiers and access control",
      category: "Management",
      icon: Users,
      action: () => { navigate("/users"); onClose(); }
    },
    {
      id: "mgmt-settings",
      title: "Platform Settings & Connectors",
      description: "Configure syslog, SOAR integrations and ingestion rates",
      category: "Management",
      icon: Settings,
      action: () => { navigate("/settings"); onClose(); }
    },
    // Quick Actions
    {
      id: "action-sim-toggle",
      title: isSimulatorRunning ? "Pause Real-Time Simulator" : "Start Real-Time Simulator",
      description: isSimulatorRunning ? "Halt synthetic telemetry generation" : "Stream live security events every 3.2s",
      category: "Quick Actions",
      icon: isSimulatorRunning ? Pause : Play,
      action: () => { toggleSimulator(); onClose(); },
      shortcut: "Space"
    },
    {
      id: "action-theme-toggle",
      title: `Switch Theme to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      description: "Toggle between high-contrast Dark Cyber and Clean Light modes",
      category: "Quick Actions",
      icon: theme === "dark" ? Sun : Moon,
      action: () => { toggleTheme(); onClose(); }
    }
  ];

  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === "Enter" && filteredCommands.length > 0) {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl rounded-xl border border-line bg-surface/95 shadow-2xl overflow-hidden text-ink flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3 bg-raised/30">
          <Search size={18} className="text-accent shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search dashboards, events, assets..."
            className="flex-1 bg-transparent text-sm font-sans placeholder:text-muted focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted hover:text-ink p-1 rounded"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
          <span className="rounded bg-raised border border-line px-1.5 py-0.5 text-[10px] font-mono text-muted">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted">
              No matching commands or navigation routes found for "{query}".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "text-ink hover:bg-raised/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-md ${isSelected ? "bg-accent text-accent-ink" : "bg-raised text-muted"}`}>
                      <Icon size={16} />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs truncate">{cmd.title}</span>
                        <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted truncate">{cmd.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {cmd.shortcut && (
                      <span className="rounded bg-raised/80 border border-line/60 px-1.5 py-0.5 text-[10px] font-mono text-muted">
                        {cmd.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft size={13} className="text-accent" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between border-t border-line px-4 py-2 bg-raised/40 text-[11px] text-muted font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="font-semibold text-ink">↑↓</kbd> navigate</span>
            <span><kbd className="font-semibold text-ink">↵</kbd> select</span>
          </div>
          <span>SentinelX AI Command Line</span>
        </div>
      </div>
    </div>
  );
}
