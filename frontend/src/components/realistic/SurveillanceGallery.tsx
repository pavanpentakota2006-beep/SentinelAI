import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Maximize2, X, Shield, Camera, ExternalLink, Radio, Play } from "lucide-react";
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
    title: "Global SOC Incident Management Console",
    subtitle: "Network topology, attack paths, and AI correlation engine",
    category: "Incident Operations",
    src: "/images/soc_incidents_management.jpg",
    badge: "INC-2847 ACTIVE",
    description: "Multi-layered network infrastructure topology highlighting active lateral movement from perimeter firewall to database cluster with automated AI triage summary.",
    route: "/incidents",
    workspaceName: "Incidents Management",
  },
  {
    id: "feed-2",
    title: "Global Threat Intelligence & Attack Geo-Vector Radar",
    subtitle: "Cross-border attack trajectories and severity distribution",
    category: "Threat Intelligence",
    src: "/images/threat_intelligence_map.jpg",
    badge: "12,345 THREATS",
    description: "Live global geospatial threat map tracking active DDoS, XSS, and malware campaigns across international subnets with multi-ring asset exposure analysis.",
    route: "/threat-intel",
    workspaceName: "Threat Intelligence",
  },
  {
    id: "feed-3",
    title: "Deep Cyber Health & 3D Network Traffic Matrix",
    subtitle: "Threat severity gauges, timeline milestones, and traffic planes",
    category: "Security Telemetry",
    src: "/images/cyber_health_radar.jpg",
    badge: "SYSTEM HEALTH 92%",
    description: "3D perspective traffic grid mapping communication between internal networks and external malicious IPs alongside dual-arc severity speedometer gauges.",
    route: "/",
    workspaceName: "Overview Command Center",
  },
  {
    id: "feed-4",
    title: "Threat Ingress & Subnet Reconnaissance Grid",
    subtitle: "Threat actor attribution, radar polygons, and PCAP analysis",
    category: "Active Defense",
    src: "/images/interceptor_threat_hunt.jpg",
    badge: "4,500 DETECTIONS",
    description: "Sensor grid monitoring threat actor origin IPs, ASNs, and DDoS campaigns with deep-packet inspection and multi-attribute risk radar.",
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
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedFeed, setSelectedFeed] = useState<SurveillanceFeed | null>(null);

  const handleLaunchWorkspace = (feed: SurveillanceFeed) => {
    navigate(feed.route);
    showToast({
      type: "info",
      title: `Workspace Launched: ${feed.workspaceName}`,
      message: `Switched to active operational module at ${feed.route}`,
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
              Click any feed image to immediately launch and work in that active operational workspace
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
            onClick={() => handleLaunchWorkspace(feed)}
            className="group cursor-pointer rounded-chip border border-line bg-bg/80 overflow-hidden hover:border-accent hover:shadow-lg transition-all flex flex-col justify-between"
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

              {/* Hover overlay with clear action */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                <span className="px-3 py-1.5 rounded-chip bg-accent text-accent-ink font-bold text-xs shadow-md flex items-center gap-1.5">
                  <Play size={12} fill="currentColor" /> Click to Launch Workspace
                </span>
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-white/90">
                <span className="truncate font-semibold">{feed.category}</span>
                <span className="text-[10px] text-accent font-bold">Feed #{idx + 1} &rarr; {feed.route}</span>
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
                <span className="text-muted">Target: {feed.workspaceName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFeed(feed);
                  }}
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  <Maximize2 size={11} /> Expand Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lightbox for Full-Resolution Inspection */}
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
                className="rounded-chip p-1 text-muted hover:bg-raised hover:text-ink"
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
                  onClick={() => setSelectedFeed(null)}
                  className="px-3 py-1.5 rounded-chip border border-line bg-surface text-ink text-xs font-semibold hover:bg-raised transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const target = selectedFeed;
                    setSelectedFeed(null);
                    handleLaunchWorkspace(target);
                  }}
                  className="px-4 py-1.5 rounded-chip bg-accent text-accent-ink font-bold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Play size={12} fill="currentColor" /> Launch Active Working Dashboard &rarr;
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
