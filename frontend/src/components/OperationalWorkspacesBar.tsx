import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Radio, Activity, Globe, Flame, ExternalLink, ChevronRight, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import { useToast } from "@/lib/toast";

export interface WorkspaceItem {
  id: string;
  name: string;
  shortName: string;
  route: string;
  image: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: LucideIcon;
}

export const OPERATIONAL_WORKSPACES: WorkspaceItem[] = [
  {
    id: "ws-overview",
    name: "Executive Panoramic SOC Video Wall",
    shortName: "SOC Command Wall",
    route: "/",
    image: "/images/soc_global_surveillance_wall.jpg",
    badge: "GLOBAL SOC 24/7",
    badgeColor: "bg-ok/20 text-ok border-ok/40",
    description: "Panoramic multi-display cyber threat world map, network traffic waveforms, and blocked threats",
    icon: Activity,
  },
  {
    id: "ws-incidents",
    name: "CyCarrier APT Situation Graph & Timeline",
    shortName: "APT Situation Graph",
    route: "/incidents",
    image: "/images/cycarrier_apt_situation_graph.jpg",
    badge: "APT CASE: ACTIVE",
    badgeColor: "bg-sev-critical/20 text-sev-critical border-sev-critical/40",
    description: "Multi-hop process execution graph, endpoint timeline, radar risk polygon, and forensic heatmaps",
    icon: Shield,
  },
  {
    id: "ws-threat-intel",
    name: "OpenCTI Threat Intelligence & Observables",
    shortName: "OpenCTI Threat Intel",
    route: "/threat-intel",
    image: "/images/opencti_threat_intelligence.jpg",
    badge: "137.9K INDICATORS",
    badgeColor: "bg-accent/20 text-accent border-accent/40",
    description: "Intrusion sets (APT29, Lazarus), malware polar chart, CVE tracking, and targeted countries map",
    icon: Globe,
  },
  {
    id: "ws-alerts",
    name: "Vehere MITRE ATT&CK & Ingress Hunt",
    shortName: "MITRE ATT&CK Hunt",
    route: "/alerts",
    image: "/images/mitre_attack_alert_matrix.jpg",
    badge: "235K ALERTS",
    badgeColor: "bg-sev-high/20 text-sev-high border-sev-high/40",
    description: "14-stage MITRE kill chain stepper, anomaly trend waveforms, and top offender IP risk board",
    icon: Radio,
  },
  {
    id: "ws-warroom",
    name: "Level-3 Incident War Room",
    shortName: "Level-3 War Room",
    route: "/attack-graph",
    image: "/images/critical_incident_warroom.jpg",
    badge: "CRITICAL ESCALATION",
    badgeColor: "bg-sev-critical/20 text-sev-critical border-sev-critical/40 animate-pulse",
    description: "5-stage attack chain stepper, asset isolation, and automated SOAR response",
    icon: Flame,
  },
];

export function OperationalWorkspacesBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const handleLaunchWorkspace = (ws: WorkspaceItem) => {
    navigate(ws.route);
    showToast({
      type: "info",
      title: `Workspace Launched: ${ws.name}`,
      message: `Active operational module switched to ${ws.route}`,
    });
  };

  return (
    <div className="rounded-card border border-line bg-surface/90 backdrop-blur-sm p-3.5 space-y-3 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-chip bg-accent/15 text-accent border border-accent/30">
            <Radio size={15} className="animate-pulse" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
              The 5 Core Operational Workspaces
              <span className="text-[10px] font-mono font-normal text-muted normal-case">
                (Click any image to launch main working dashboard)
              </span>
            </h2>
          </div>
        </div>

        <span className="text-[11px] font-mono text-muted flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-ok animate-ping" />
          All 5 Real-Time Operational Pipelines Connected
        </span>
      </div>

      {/* Grid of the 5 Working Image Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {OPERATIONAL_WORKSPACES.map((ws, index) => {
          const isActive = location.pathname === ws.route;
          const Icon = ws.icon;

          return (
            <div
              key={ws.id}
              onClick={() => handleLaunchWorkspace(ws)}
              role="button"
              tabIndex={0}
              className={clsx(
                "group relative rounded-chip border p-2 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none",
                isActive
                  ? "bg-accent/10 border-accent shadow-lg shadow-accent/10 ring-1 ring-accent"
                  : "bg-bg/60 border-line hover:border-accent/60 hover:bg-raised/70 hover:shadow-md"
              )}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-video w-full rounded overflow-hidden bg-black/90 mb-2">
                <img
                  src={ws.image}
                  alt={ws.name}
                  className={clsx(
                    "w-full h-full object-cover transition-transform duration-500",
                    isActive ? "scale-105 opacity-100" : "opacity-80 group-hover:scale-105 group-hover:opacity-100"
                  )}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Badge */}
                <span
                  className={clsx(
                    "absolute top-1.5 left-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-xs",
                    ws.badgeColor
                  )}
                >
                  {ws.badge}
                </span>

                {/* Active Indicator or Action Icon */}
                <div
                  className={clsx(
                    "absolute top-1.5 right-1.5 p-1 rounded backdrop-blur-md transition-opacity text-white text-[10px]",
                    isActive ? "bg-accent text-accent-ink font-bold opacity-100" : "bg-black/60 opacity-0 group-hover:opacity-100"
                  )}
                >
                  {isActive ? "ACTIVE" : <ExternalLink size={12} />}
                </div>

                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[10px] font-mono text-white/90">
                  <span className="font-semibold flex items-center gap-1">
                    <Icon size={11} className="text-accent" />
                    Feed #{index + 1}
                  </span>
                  <span className="text-[9px] text-muted-foreground">{ws.route}</span>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={clsx(
                      "text-xs font-bold truncate transition-colors",
                      isActive ? "text-accent" : "text-ink group-hover:text-accent"
                    )}
                  >
                    {ws.shortName}
                  </h3>
                  <ChevronRight size={13} className="text-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
                </div>
                {!compact && (
                  <p className="text-[10px] text-muted line-clamp-1 leading-snug">
                    {ws.description}
                  </p>
                )}
              </div>

              {/* Launch Working Workspace Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLaunchWorkspace(ws);
                }}
                className={clsx(
                  "mt-2 w-full py-1 px-2 rounded text-[10px] font-mono font-medium flex items-center justify-center gap-1 transition-colors border",
                  isActive
                    ? "bg-accent text-accent-ink border-accent font-bold shadow-xs"
                    : "bg-raised text-muted hover:text-ink hover:border-line border-transparent"
                )}
              >
                {isActive ? "● Working Dashboard" : "Click to Work →"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OperationalWorkspacesBar;
