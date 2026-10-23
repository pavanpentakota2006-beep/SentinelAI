import React, { useState } from "react";
import { Eye, Maximize2, X, Shield, Camera, ExternalLink, Radio, Play, CheckCircle2, Zap } from "lucide-react";
import { useToast } from "@/lib/toast";
import clsx from "clsx";

export interface SurveillanceFeed {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  src: string;
  badge: string;
  description: string;
  route: string;
  workspaceName: string;
}

export const SURVEILLANCE_FEEDS: SurveillanceFeed[] = [
  {
    id: "feed-1",
    title: "Executive Panoramic SOC Video Wall & Cyber Threat Matrix",
    subtitle: "Real-time global threat arcs, multi-screen telemetry, and blocked threats",
    category: "Global Operations",
    src: "/images/soc_global_surveillance_wall.jpg",
    badge: "GLOBAL SOC 24/7",
    description: "Panoramic multi-display cyber threat world map tracking live ingress trajectories, network traffic waveforms, and blocked threats with 24/7 physical operations bridge.",
    route: "/",
    workspaceName: "Executive Command Center",
  },
  {
    id: "feed-2",
    title: "CyCarrier APT Situation Graph & Forensic Process Timeline",
    subtitle: "Entity correlation graph, endpoint timeline, and threat radar",
    category: "Incident Forensics",
    src: "/images/cycarrier_apt_situation_graph.jpg",
    badge: "APT CASE ACTIVE",
    description: "Multi-layered situation graph detailing Server-HWA, Server-DONALD, and endpoint connections alongside chronologically executed processes (powershell.exe, whoami.exe).",
    route: "/incidents",
    workspaceName: "Incidents Management",
  },
  {
    id: "feed-3",
    title: "OpenCTI Threat Intelligence & Observables Platform",
    subtitle: "Intrusion sets, malware polar distribution, and CVE tracking",
    category: "Threat Intelligence",
    src: "/images/opencti_threat_intelligence.jpg",
    badge: "137.9K INDICATORS",
    description: "Structured cyber threat intelligence tracking 503 intrusion sets (APT29, Lazarus), 2K malware strains, CVE vulnerabilities, and targeted geopolitical regions.",
    route: "/threat-intel",
    workspaceName: "Threat Intelligence",
  },
  {
    id: "feed-4",
    title: "Vehere MITRE ATT&CK & Ingress Perimeter Hunt",
    subtitle: "14-stage kill-chain stepper, anomaly waveforms, and top offender risk table",
    category: "Active Defense",
    src: "/images/mitre_attack_alert_matrix.jpg",
    badge: "235K ALERTS",
    description: "Deep sensor grid mapping alerts directly to the MITRE ATT&CK matrix alongside real-time anomaly trend waveforms and high-risk offender IP telemetry.",
    route: "/alerts",
    workspaceName: "Alerts & Interceptor",
  },
  {
    id: "feed-5",
    title: "Emergency Level 3 Critical Incident War Room",
    subtitle: "Attack chain progress, asset containment, and SOAR execution",
    category: "War Room",
    src: "/images/critical_incident_warroom.jpg",
    badge: "LEVEL 3 ESCALATION",
    description: "Active emergency containment command center detailing real-time attack chain progression, host compromise status, and automated EDR execution.",
    route: "/attack-graph",
    workspaceName: "Incident War Room",
  },
];

export function SurveillanceGallery() {
  const { showToast } = useToast();
  const [selectedFeed, setSelectedFeed] = useState<SurveillanceFeed | null>(null);
  const [activeFeedId, setActiveFeedId] = useState<string>(SURVEILLANCE_FEEDS[0].id);

  const handleSelectFeedInPlace = (feed: SurveillanceFeed) => {
    setActiveFeedId(feed.id);
    setSelectedFeed(feed);
    showToast({
      type: "info",
      title: `Inspecting Feed: ${feed.workspaceName}`,
      message: `Operational intelligence loaded directly in-place.`,
    });
  };

  return (
    <div className="rounded-card border border-line bg-surface p-4 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-chip bg-accent/20 text-accent">
            <Camera size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">The 5 Core Operational Security Command Feeds</h3>
            <p className="text-[11px] text-muted">
              Tap any feed image to inspect details and execute operations directly in place
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-ok bg-ok/10 border border-ok/30 px-2.5 py-1 rounded-chip">
            <Radio size={12} className="animate-pulse" /> 5 Feeds Synced
          </span>
        </div>
      </div>

      {/* Grid of the 5 Real Reference Images */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SURVEILLANCE_FEEDS.map((feed, idx) => (
          <div
            key={feed.id}
            onClick={() => handleSelectFeedInPlace(feed)}
            className={clsx(
              "group cursor-pointer rounded-chip border bg-bg/80 overflow-hidden transition-all flex flex-col justify-between",
              activeFeedId === feed.id ? "border-accent ring-1 ring-accent/40 shadow-md" : "border-line hover:border-accent hover:shadow-lg"
            )}
          >
            {/* Image Preview Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img
                src={feed.src}
                alt={feed.title}
                className="w-full h-full object-cover object-top opacity-85 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <span className="absolute top-2 left-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sev-critical/90 text-white shadow-xs">
                {feed.badge}
              </span>

              {/* Hover overlay with in-place action */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                <span className="px-3 py-1.5 rounded-chip bg-accent text-accent-ink font-bold text-xs shadow-md flex items-center gap-1.5">
                  <Maximize2 size={12} /> Tap to Inspect in Place
                </span>
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-white/90">
                <span className="truncate font-semibold">{feed.category}</span>
                <span className="text-[10px] text-accent font-bold">CAM 0{idx + 1}</span>
              </div>
            </div>

            {/* Info Snippet */}
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-ink group-hover:text-accent transition-colors truncate">
                  {feed.title}
                </h4>
                <p className="text-[11px] text-muted line-clamp-2 leading-relaxed mt-1">
                  {feed.description}
                </p>
              </div>

              <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted">Console: {feed.workspaceName}</span>
                <span className="text-accent hover:underline flex items-center gap-1 font-semibold">
                  <Maximize2 size={11} /> Inspect Details
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lightbox for In-Place Full-Resolution & Telemetry Inspection */}
      {selectedFeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-5xl rounded-card border border-line bg-surface p-4 shadow-2xl space-y-3 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-accent" />
                <h3 className="text-sm font-bold text-ink">{selectedFeed.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sev-critical/20 text-sev-critical font-bold">
                  {selectedFeed.badge}
                </span>
              </div>
              <button
                onClick={() => setSelectedFeed(null)}
                className="rounded-chip p-1 text-muted hover:bg-raised hover:text-ink cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Large Full Image View */}
            <div className="flex-1 overflow-auto rounded-chip border border-line bg-black flex items-center justify-center p-1">
              <img
                src={selectedFeed.src}
                alt={selectedFeed.title}
                className="max-h-[65vh] w-auto object-contain rounded"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-1 border-t border-line/60">
              <p className="text-muted leading-relaxed flex-1">
                <span className="font-semibold text-ink">Intelligence Analysis:</span> {selectedFeed.description}
              </p>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => {
                    showToast({
                      type: "success",
                      title: "In-Place Containment Vector Triggered",
                      message: `Telemetry sensor synchronized with ${selectedFeed.workspaceName}.`,
                    });
                  }}
                  className="px-3 py-1.5 rounded-chip bg-accent/20 border border-accent/40 text-accent font-bold text-xs hover:bg-accent/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap size={12} fill="currentColor" /> Synchronize Telemetry
                </button>
                <button
                  onClick={() => setSelectedFeed(null)}
                  className="px-4 py-1.5 rounded-chip bg-accent text-accent-ink font-bold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SurveillanceGallery;
