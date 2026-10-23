import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Shield,
  Maximize2,
  Radio,
  ExternalLink,
  Layers,
  Activity,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Compass,
  Cpu,
  Globe,
  Network,
  Zap,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Send,
  Terminal,
  Server,
  Lock,
  Unlock,
  Eye,
  FileText,
  Search,
  Filter,
  Check,
  AlertCircle,
  Clock,
  User,
  Monitor,
} from "lucide-react";
import { useToast } from "@/lib/toast";
import { DemoTag } from "@/components/ui";
import { SURVEILLANCE_FEEDS, type SurveillanceFeed } from "@/components/realistic/SurveillanceGallery";
import clsx from "clsx";

export default function SurveillancePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedFeedId, setSelectedFeedId] = useState<string>(SURVEILLANCE_FEEDS[0].id);
  const [zoomModal, setZoomModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"interactive" | "optical">("interactive");

  /* Live Telemetry State */
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [ingressBw, setIngressBw] = useState<number>(4.2);
  const [elapsedSecs, setElapsedSecs] = useState<number>(314);

  /* Feed 1 Interactive State (Executive Panoramic) */
  const [selectedMapNode, setSelectedMapNode] = useState<string>("US Target Hub");
  const [execFilter, setExecFilter] = useState<string>("All");

  /* Feed 2 Interactive State (CyCarrier APT) */
  const [selectedAptNode, setSelectedAptNode] = useState<string>("WS-027");
  const [isolatedHosts, setIsolatedHosts] = useState<Record<string, boolean>>({
    "WS-027": false,
    "Server-HWA": false,
    "Server-DONALD": false,
  });
  const [selectedProcess, setSelectedProcess] = useState<string>("powershell.exe");

  /* Feed 3 Interactive State (OpenCTI Threat Intel) */
  const [selectedActor, setSelectedActor] = useState<string>("APT29");
  const [iocSearch, setIocSearch] = useState<string>("");

  /* Feed 4 Interactive State (Vehere MITRE) */
  const [selectedMitreStage, setSelectedMitreStage] = useState<number>(3);
  const [blockedIps, setBlockedIps] = useState<Record<string, boolean>>({});

  /* Feed 5 Interactive State (War Room) */
  const [containedAssets, setContainedAssets] = useState<Record<string, boolean>>({
    "srv-prod-db-01": false,
    "dc-corp-01": false,
    "endpoint-win-27": true,
  });
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; time: string; text: string; role: string }>>([
    { sender: "Lead Analyst (Tier 3)", time: "10:21:40", text: "Lateral movement observed towards dc-corp-01 via Kerberos ticket forgery.", role: "Lead" },
    { sender: "Incident Commander", time: "10:22:15", text: "Approved immediate host isolation for endpoint-win-27. Proceed with memory dump.", role: "Commander" },
    { sender: "Automated SOAR Bot", time: "10:22:18", text: "Quarantine applied to endpoint-win-27. Active C2 sockets severed.", role: "Bot" },
  ]);

  /* Action Vectors Interactive Toggles */
  const [actionVectors, setActionVectors] = useState<Record<string, boolean>>({
    subnet: true,
    memory: true,
    edr: true,
    zerotrust: false,
  });

  const currentFeed =
    SURVEILLANCE_FEEDS.find((f) => f.id === selectedFeedId) || SURVEILLANCE_FEEDS[0];

  /* Live Tick Timer */
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setElapsedSecs((prev) => prev + 1);
      setIngressBw((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Math.max(2.1, Math.min(8.9, Number((prev + delta).toFixed(2))));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const formatStopwatch = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  /* Helper to toggle host isolation in Feed 2 */
  const toggleHostIsolation = (host: string) => {
    setIsolatedHosts((prev) => {
      const next = !prev[host];
      showToast({
        type: next ? "warning" : "info",
        title: next ? `Host Isolated: ${host}` : `Isolation Lifted: ${host}`,
        message: next
          ? `EDR network containment rule enforced on ${host}. All non-management traffic dropped.`
          : `Network access restored to ${host}.`,
      });
      return { ...prev, [host]: next };
    });
  };

  /* Helper to block IP in Feed 4 */
  const toggleBlockIp = (ip: string) => {
    setBlockedIps((prev) => {
      const next = !prev[ip];
      showToast({
        type: next ? "error" : "info",
        title: next ? `Perimeter Null-Route Enforced` : `IP Unblocked`,
        message: next
          ? `BGP Null-Route applied across all edge firewalls for ${ip}. Ingress dropped.`
          : `Traffic from ${ip} is no longer dropped at border routers.`,
      });
      return { ...prev, [ip]: next };
    });
  };

  /* Helper to post chat message in War Room */
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      sender: "Security Analyst (You)",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      text: chatInput.trim(),
      role: "Analyst",
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    showToast({
      type: "success",
      title: "Tactical Message Broadcast",
      message: "Message dispatched to active War Room channel.",
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-ink">
              Tactical SOC Visual Surveillance Feeds
            </h1>
            <DemoTag>5 Live Operational Workspaces</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Real-time interactive security consoles, optical surveillance telemetry, and direct operational command across the 5 reference workspaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-chip border border-line bg-surface p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode("interactive")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1 rounded transition-colors font-semibold",
                viewMode === "interactive"
                  ? "bg-accent text-accent-ink shadow-xs"
                  : "text-muted hover:text-ink",
              )}
            >
              <Zap size={13} />
              <span>Live Working Console</span>
            </button>
            <button
              onClick={() => setViewMode("optical")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1 rounded transition-colors font-semibold",
                viewMode === "optical"
                  ? "bg-accent text-accent-ink shadow-xs"
                  : "text-muted hover:text-ink",
              )}
            >
              <Camera size={13} />
              <span>Optical Feed</span>
            </button>
          </div>

          <button
            onClick={() => {
              setIsSimulating(!isSimulating);
              showToast({
                type: "info",
                title: isSimulating ? "Simulation Paused" : "Live Ingestion Resumed",
                message: isSimulating
                  ? "Telemetry waveform frozen at current state."
                  : "Real-time telemetry and network socket bursts active.",
              });
            }}
            className={clsx(
              "flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-chip border transition-colors",
              isSimulating
                ? "text-ok bg-ok/10 border-ok/30 hover:bg-ok/20"
                : "text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20",
            )}
          >
            {isSimulating ? <Radio size={13} className="animate-pulse" /> : <Pause size={13} />}
            <span>{isSimulating ? "5 Feeds Synced" : "Telemetry Paused"}</span>
          </button>
        </div>
      </div>

      {/* Feed Selector Tabs (CAM 01 - CAM 05) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {SURVEILLANCE_FEEDS.map((feed, idx) => {
          const isActive = feed.id === selectedFeedId;
          return (
            <button
              key={feed.id}
              onClick={() => {
                setSelectedFeedId(feed.id);
                showToast({
                  type: "info",
                  title: `Switched to CAM 0${idx + 1}: ${feed.workspaceName}`,
                  message: `Active console locked on ${feed.title}`,
                });
              }}
              className={clsx(
                "flex flex-col items-start gap-1 p-2.5 rounded-card border text-left transition-all duration-200 relative group cursor-pointer",
                isActive
                  ? "border-accent bg-accent/10 shadow-md ring-1 ring-accent/40"
                  : "border-line bg-surface hover:bg-raised/80 hover:border-line/80",
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[10px] text-muted">CAM 0{idx + 1}</span>
                <span
                  className={clsx(
                    "text-[9px] font-mono font-bold px-1.5 py-0.2 rounded",
                    isActive
                      ? "bg-accent text-accent-ink"
                      : "bg-sev-critical/20 text-sev-critical",
                  )}
                >
                  LIVE
                </span>
              </div>
              <p
                className={clsx(
                  "text-xs font-bold truncate w-full",
                  isActive ? "text-accent" : "text-ink",
                )}
              >
                {feed.title.split(" ")[0]} {feed.title.split(" ")[1] || ""}
              </p>
              <span className="text-[10px] text-muted truncate w-full">{feed.category}</span>
            </button>
          );
        })}
      </div>

      {/* Primary Big Screen View of Selected Console / Image */}
      <div className="rounded-card border border-line bg-surface overflow-hidden shadow-lg">
        {/* Top Screen Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-raised/70 px-4 py-2.5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sev-critical animate-ping" />
            <span className="font-bold text-ink">{currentFeed.title}</span>
            <span className="rounded bg-black/40 px-2 py-0.5 text-muted border border-line hidden sm:inline">
              Source: {currentFeed.src}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "interactive" ? "optical" : "interactive")}
              className="flex items-center gap-1.5 rounded-chip border border-line bg-surface px-3 py-1 text-ink hover:border-accent hover:text-accent transition-colors"
            >
              {viewMode === "interactive" ? <Camera size={12} /> : <Zap size={12} />}
              <span>{viewMode === "interactive" ? "View Optical CCTV" : "Switch to Live Console"}</span>
            </button>
            <button
              onClick={() => setZoomModal(true)}
              className="flex items-center gap-1.5 rounded-chip border border-line bg-surface px-3 py-1 text-ink hover:border-accent hover:text-accent transition-colors"
            >
              <Maximize2 size={12} />
              <span>Full Screen</span>
            </button>
          </div>
        </div>

        {/* Content Area: Main Live Interactive View / Optical Image on Left (8 cols), Telemetry Panel on Right (4 cols) */}
        <div className="grid lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-line">
          {/* Main Display Container */}
          <div className="lg:col-span-8 p-4 bg-black/95 flex flex-col justify-between relative min-h-[540px]">
            {viewMode === "optical" ? (
              /* OPTICAL CCTV VIEW */
              <div className="relative w-full h-full flex flex-col justify-center items-center group">
                <div className="relative w-full max-h-[540px] overflow-hidden rounded-chip border border-line/60 bg-black flex items-center justify-center">
                  <img
                    src={currentFeed.src}
                    alt={currentFeed.title}
                    className="w-full h-auto max-h-[520px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-white border border-white/20">
                    {currentFeed.badge}
                  </div>
                  <button
                    onClick={() => setZoomModal(true)}
                    className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md p-2 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
                    title="Inspect high resolution"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between w-full mt-2 px-2 text-[11px] font-mono text-muted">
                  <span>Camera Optical Calibration: 100% OK</span>
                  <span className="text-accent cursor-pointer hover:underline" onClick={() => setViewMode("interactive")}>
                    Click here to switch to Live Interactive Console &rarr;
                  </span>
                </div>
              </div>
            ) : (
              /* ── IN-PLACE LIVE INTERACTIVE WORKING CONSOLES ── */
              <div className="w-full h-full flex flex-col justify-between space-y-4">
                {/* ── CAM 01: EXECUTIVE PANORAMIC SOC VIDEO WALL ── */}
                {selectedFeedId === "feed-1" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-line/50 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-accent" />
                        <span className="text-sm font-bold text-ink">Global Operations Cyber Threat Matrix</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          Active Telemetry Stream
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-muted">Node:</span>
                        <span className="font-bold text-accent">{selectedMapNode}</span>
                      </div>
                    </div>

                    {/* Interactive World Map & Arc Canvas */}
                    <div className="relative aspect-[16/9] w-full rounded-chip overflow-hidden bg-black/90 border border-line/70">
                      <svg viewBox="0 0 400 210" className="w-full h-full select-none">
                        {/* World Map Outline */}
                        <path
                          d="M 40 40 C 65 30 95 32 120 45 C 128 58 115 75 95 85 C 80 92 65 75 55 65 C 45 55 35 45 40 40 Z"
                          fill="rgba(56, 189, 248, 0.12)"
                          stroke="rgba(56, 189, 248, 0.3)"
                          strokeWidth="0.8"
                        />
                        <path
                          d="M 90 98 C 105 102 122 115 118 138 C 112 158 100 175 92 172 C 85 160 82 135 84 115 C 86 102 88 98 90 98 Z"
                          fill="rgba(56, 189, 248, 0.12)"
                          stroke="rgba(56, 189, 248, 0.3)"
                          strokeWidth="0.8"
                        />
                        <path
                          d="M 180 42 C 200 36 215 42 225 55 C 220 68 205 72 190 70 C 182 65 178 52 180 42 Z"
                          fill="rgba(56, 189, 248, 0.12)"
                          stroke="rgba(56, 189, 248, 0.3)"
                          strokeWidth="0.8"
                        />
                        <path
                          d="M 182 78 C 205 76 226 84 225 110 C 222 135 210 155 198 152 C 188 142 180 120 178 100 C 176 86 180 80 182 78 Z"
                          fill="rgba(56, 189, 248, 0.12)"
                          stroke="rgba(56, 189, 248, 0.3)"
                          strokeWidth="0.8"
                        />
                        <path
                          d="M 226 42 C 270 32 335 34 365 52 C 375 75 355 100 325 105 C 295 108 265 92 245 78 C 235 68 228 55 226 42 Z"
                          fill="rgba(56, 189, 248, 0.12)"
                          stroke="rgba(56, 189, 248, 0.3)"
                          strokeWidth="0.8"
                        />
                        <path
                          d="M 315 132 C 345 130 358 142 352 160 C 342 168 322 168 312 155 C 308 144 310 135 315 132 Z"
                          fill="rgba(56, 189, 248, 0.12)"
                          stroke="rgba(56, 189, 248, 0.3)"
                          strokeWidth="0.8"
                        />

                        {/* Trajectory Arcs */}
                        <path d="M 310 55 Q 200 -10 95 80" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                        <path d="M 330 75 Q 220 20 95 80" fill="none" stroke="#f97316" strokeWidth="1.3" />
                        <path d="M 210 65 Q 160 30 95 80" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                        <path d="M 95 80 Q 170 110 325 150" fill="none" stroke="#eab308" strokeWidth="1.2" />

                        {/* Interactive Clickable Nodes */}
                        <g
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedMapNode("Russia APT29 Source (185.220.101.5)");
                            showToast({ type: "error", title: "Threat Source Inspected", message: "APT29 C2 Hub located in Moscow region. Active brute force." });
                          }}
                        >
                          <circle cx="310" cy="55" r="7" fill="#ef4444" className="animate-ping" opacity={0.5} />
                          <circle cx="310" cy="55" r="4.5" fill="#ef4444" />
                          <text x="320" y="58" fill="#f87171" fontSize="8" fontFamily="IBM Plex Mono">APT29 (C2)</text>
                        </g>

                        <g
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedMapNode("China Botnet Ingress (194.26.29.112)");
                            showToast({ type: "warning", title: "Threat Source Inspected", message: "Mirai botnet ingress cluster probing Port 443." });
                          }}
                        >
                          <circle cx="330" cy="75" r="5" fill="#f97316" />
                          <text x="340" y="78" fill="#fb923c" fontSize="8" fontFamily="IBM Plex Mono">Botnet Hub</text>
                        </g>

                        <g
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedMapNode("US Central Defense Hub (DMZ Gateway)");
                            showToast({ type: "success", title: "Target Hub Inspected", message: "US Enterprise Core. 99.4% ingress blocked by perimeter firewalls." });
                          }}
                        >
                          <circle cx="95" cy="80" r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                          <circle cx="95" cy="80" r="5" fill="#0284c7" />
                          <text x="105" y="83" fill="#38bdf8" fontSize="8" fontFamily="IBM Plex Mono">US Defense Core</text>
                        </g>

                        <g
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedMapNode("EU Relay Node (Frankfurt)");
                            showToast({ type: "info", title: "Relay Node Inspected", message: "European proxy relay scrubbing encrypted traffic." });
                          }}
                        >
                          <circle cx="210" cy="65" r="4.5" fill="#eab308" />
                          <text x="218" y="68" fill="#fde047" fontSize="8" fontFamily="IBM Plex Mono">EU Proxy</text>
                        </g>
                      </svg>

                      {/* Map Inset Badge */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-line text-[10px] font-mono text-ink">
                        <span className="h-2 w-2 rounded-full bg-ok animate-pulse" />
                        <span>Real-Time Ingress: <strong>{ingressBw} Gbps</strong></span>
                      </div>
                    </div>

                    {/* Operational Controls Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <button
                        onClick={() => {
                          showToast({ type: "error", title: "BGP Null-Route Executed", message: "Ingress trajectory from 185.220.101.5 dropped at edge." });
                        }}
                        className="p-2 rounded bg-surface border border-line hover:border-sev-critical text-ink hover:text-sev-critical flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Shield size={13} />
                        <span>Null-Route Ingress</span>
                      </button>
                      <button
                        onClick={() => {
                          setIngressBw(7.8);
                          showToast({ type: "warning", title: "Simulated Volumetric Surge", message: "Ingress traffic spiked to 7.8 Gbps." });
                        }}
                        className="p-2 rounded bg-surface border border-line hover:border-accent text-ink hover:text-accent flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Activity size={13} />
                        <span>Simulate Surge</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMapNode("Global Telemetry Scrubbed");
                          showToast({ type: "success", title: "Telemetry Refreshed", message: "All socket connections synchronized with edge sensors." });
                        }}
                        className="p-2 rounded bg-surface border border-line hover:border-ok text-ink hover:text-ok flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RefreshCw size={13} />
                        <span>Scrub Telemetry</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/");
                          showToast({ type: "info", title: "Full Overview Workspace", message: "Switched to root SOC overview console." });
                        }}
                        className="p-2 rounded bg-accent/20 border border-accent/40 text-accent font-bold flex items-center justify-center gap-1.5 hover:bg-accent/30 transition-colors"
                      >
                        <ExternalLink size={13} />
                        <span>Open Full Overview</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── CAM 02: CYCARRIER APT FORENSIC SITUATION GRAPH ── */}
                {selectedFeedId === "feed-2" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-line/50 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-sev-critical" />
                        <span className="text-sm font-bold text-ink">CyCarrier APT Situation Graph & Timeline</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          APT Case Active
                        </span>
                      </div>
                      <span className="text-xs font-mono text-muted">
                        Selected: <strong className="text-accent">{selectedAptNode}</strong>
                      </span>
                    </div>

                    {/* Situation Graph Node Diagram */}
                    <div className="rounded-chip border border-line/70 bg-black/80 p-3 relative">
                      <div className="flex flex-wrap items-center justify-around gap-4 py-3">
                        {/* Host Node: Server-HWA */}
                        <div
                          onClick={() => {
                            setSelectedAptNode("Server-HWA");
                            showToast({ type: "info", title: "Server-HWA Inspected", message: "IP 10.0.1.15 | Apache Tomcat 9.0 | Port 8080 | Status: Clean" });
                          }}
                          className={clsx(
                            "cursor-pointer p-3 rounded-card border flex flex-col items-center gap-1 transition-all",
                            selectedAptNode === "Server-HWA"
                              ? "border-accent bg-accent/20 shadow-md scale-105"
                              : "border-line bg-surface hover:border-accent/60",
                          )}
                        >
                          <Server size={22} className="text-blue-400" />
                          <span className="text-xs font-bold text-ink">Server-HWA</span>
                          <span className="text-[9px] font-mono text-muted">10.0.1.15 (Web)</span>
                          <span className="text-[9px] font-mono text-ok px-1.5 py-0.2 rounded bg-ok/10 border border-ok/30">Protected</span>
                        </div>

                        <span className="text-muted font-mono text-xs">⟷</span>

                        {/* Host Node: WS-027 (Compromised) */}
                        <div
                          onClick={() => {
                            setSelectedAptNode("WS-027");
                            showToast({ type: "error", title: "WS-027 Inspected", message: "IP 10.0.2.80 | Windows 11 Enterprise | Status: COMPROMISED (Mimikatz memory dump detected)" });
                          }}
                          className={clsx(
                            "cursor-pointer p-3 rounded-card border flex flex-col items-center gap-1 transition-all",
                            selectedAptNode === "WS-027"
                              ? "border-rose-500 bg-rose-500/20 shadow-md scale-105"
                              : "border-line bg-surface hover:border-rose-500/60",
                          )}
                        >
                          <Monitor size={22} className="text-rose-400 animate-pulse" />
                          <span className="text-xs font-bold text-ink">WS-027 (Compromised)</span>
                          <span className="text-[9px] font-mono text-muted">10.0.2.80 (Workstation)</span>
                          <span className={clsx(
                            "text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold",
                            isolatedHosts["WS-027"] ? "text-amber-400 bg-amber-500/20 border-amber-500/40" : "text-sev-critical bg-sev-critical/20 border-sev-critical/40"
                          )}>
                            {isolatedHosts["WS-027"] ? "CONTAINED" : "COMPROMISED"}
                          </span>
                        </div>

                        <span className="text-muted font-mono text-xs">⟷</span>

                        {/* Host Node: Server-DONALD */}
                        <div
                          onClick={() => {
                            setSelectedAptNode("Server-DONALD");
                            showToast({ type: "warning", title: "Server-DONALD Inspected", message: "IP 10.0.3.50 | PostgreSQL 16 | Target Database | Status: Monitored" });
                          }}
                          className={clsx(
                            "cursor-pointer p-3 rounded-card border flex flex-col items-center gap-1 transition-all",
                            selectedAptNode === "Server-DONALD"
                              ? "border-amber-400 bg-amber-500/20 shadow-md scale-105"
                              : "border-line bg-surface hover:border-amber-400/60",
                          )}
                        >
                          <Cpu size={22} className="text-amber-400" />
                          <span className="text-xs font-bold text-ink">Server-DONALD</span>
                          <span className="text-[9px] font-mono text-muted">10.0.3.50 (DB Core)</span>
                          <span className="text-[9px] font-mono text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">Target Asset</span>
                        </div>
                      </div>
                    </div>

                    {/* Forensic Process Execution Timeline */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono font-bold text-ink flex items-center justify-between">
                        <span>Chronological Process Timeline (Click to Inspect)</span>
                        <span className="text-[10px] text-muted">5 Anomalous Events</span>
                      </span>

                      <div className="grid gap-1.5 text-xs font-mono max-h-36 overflow-y-auto">
                        {[
                          { time: "10:14:22", cmd: "cmd.exe /c whoami /all", pid: 4028, sev: "Medium" },
                          { time: "10:16:05", cmd: "powershell.exe -enc SQBFAFgA...", pid: 5120, sev: "Critical" },
                          { time: "10:18:40", cmd: "mimikatz.exe sekurlsa::logonpasswords", pid: 5892, sev: "Critical" },
                          { time: "10:20:12", cmd: "vssadmin.exe delete shadows /all /quiet", pid: 6104, sev: "Critical" },
                          { time: "10:21:45", cmd: "rundll32.exe C:\\Temp\\payload.dll,Start", pid: 6720, sev: "High" },
                        ].map((proc) => (
                          <div
                            key={proc.pid}
                            onClick={() => {
                              setSelectedProcess(proc.cmd);
                              showToast({
                                type: proc.sev === "Critical" ? "error" : "warning",
                                title: `Process Inspected (PID ${proc.pid})`,
                                message: `Command: ${proc.cmd} | Parent: explorer.exe | Hash: 8f4a...29b1`,
                              });
                            }}
                            className={clsx(
                              "p-2 rounded border flex items-center justify-between cursor-pointer transition-colors",
                              selectedProcess === proc.cmd
                                ? "border-accent bg-accent/15 text-ink"
                                : "border-line bg-surface hover:bg-raised text-muted",
                            )}
                          >
                            <span className="text-accent">{proc.time}</span>
                            <span className="font-bold text-ink truncate max-w-[240px]">{proc.cmd}</span>
                            <span className="text-muted">PID {proc.pid}</span>
                            <span className={clsx(
                              "px-1.5 py-0.2 rounded text-[9px] font-bold",
                              proc.sev === "Critical" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                            )}>
                              {proc.sev}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Execution Bar */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
                      <button
                        onClick={() => toggleHostIsolation("WS-027")}
                        className={clsx(
                          "px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors",
                          isolatedHosts["WS-027"]
                            ? "bg-ok text-ok-ink hover:bg-ok/90"
                            : "bg-sev-critical text-white hover:bg-sev-critical/90",
                        )}
                      >
                        {isolatedHosts["WS-027"] ? <Unlock size={13} /> : <Lock size={13} />}
                        <span>{isolatedHosts["WS-027"] ? "Lift Isolation on WS-027" : "EDR Isolate WS-027"}</span>
                      </button>

                      <button
                        onClick={() => {
                          showToast({
                            type: "info",
                            title: "Memory Dump Initiated",
                            message: "Full volatile memory captured from WS-027 (16.2 GB). Uploaded to S3 forensic vault.",
                          });
                        }}
                        className="px-3 py-1.5 rounded border border-line bg-surface text-ink hover:border-accent text-xs font-mono font-semibold flex items-center gap-1.5"
                      >
                        <FileText size={13} />
                        <span>Dump Memory</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate("/incidents");
                          showToast({ type: "info", title: "Incidents Workspace", message: "Navigating to deep incident dossier." });
                        }}
                        className="px-3 py-1.5 rounded border border-accent/40 bg-accent/20 text-accent font-bold text-xs font-mono ml-auto flex items-center gap-1.5"
                      >
                        <ExternalLink size={13} />
                        <span>Open Incidents Hub</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── CAM 03: OPENCTI THREAT INTELLIGENCE PLATFORM ── */}
                {selectedFeedId === "feed-3" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-line/50 pb-2.5">
                      <div className="flex items-center gap-2">
                        <RadarIcon className="text-cyan-400" />
                        <span className="text-sm font-bold text-ink">OpenCTI Threat Intelligence & Observables</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          137.9K Indicators Synced
                        </span>
                      </div>
                      <span className="text-xs font-mono text-muted">STIX 2.1 Standard</span>
                    </div>

                    {/* Threat Actor Selector Tabs */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "APT29", name: "APT29 (Cozy Bear)", origin: "Russia (SVR)", cves: 14 },
                        { id: "Lazarus", name: "Lazarus Group", origin: "North Korea (RGB)", cves: 22 },
                        { id: "LockBit", name: "LockBit 3.0", origin: "Criminal RaaS", cves: 8 },
                        { id: "VoltTyphoon", name: "Volt Typhoon", origin: "China (PLA)", cves: 19 },
                      ].map((actor) => (
                        <button
                          key={actor.id}
                          onClick={() => {
                            setSelectedActor(actor.id);
                            showToast({
                              type: "info",
                              title: `Actor Profile Loaded: ${actor.name}`,
                              message: `Origin: ${actor.origin} | Tracking ${actor.cves} CVE exploit chains.`,
                            });
                          }}
                          className={clsx(
                            "px-2.5 py-1 rounded text-xs font-mono transition-colors",
                            selectedActor === actor.id
                              ? "bg-accent text-accent-ink font-bold shadow-xs"
                              : "bg-surface border border-line text-muted hover:text-ink",
                          )}
                        >
                          {actor.name}
                        </button>
                      ))}
                    </div>

                    {/* Live IOC Search & Indicator Table */}
                    <div className="rounded-chip border border-line bg-surface p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Search size={14} className="text-muted" />
                        <input
                          type="text"
                          value={iocSearch}
                          onChange={(e) => setIocSearch(e.target.value)}
                          placeholder="Search 137.9K indicators by IP, domain, hash, or CVE..."
                          className="bg-bg text-ink text-xs font-mono px-2.5 py-1 rounded border border-line w-full focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div className="max-h-36 overflow-y-auto space-y-1 text-xs font-mono">
                        {[
                          { ioc: "203.0.113.45", type: "IPv4", actor: "APT29", sev: "Critical", score: 98 },
                          { ioc: "c2-cdn-verify.net", type: "Domain", actor: "APT29", sev: "High", score: 92 },
                          { ioc: "e3b0c44298fc1c149afbf4c8996fb924", type: "SHA256", actor: "Lazarus", sev: "Critical", score: 100 },
                          { ioc: "CVE-2025-22457", type: "Vulnerability", actor: "LockBit", sev: "Critical", score: 96 },
                          { ioc: "update-auth-service.org", type: "Domain", actor: "Volt Typhoon", sev: "High", score: 88 },
                        ]
                          .filter((i) => i.ioc.toLowerCase().includes(iocSearch.toLowerCase()) || i.actor.toLowerCase().includes(iocSearch.toLowerCase()))
                          .map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                showToast({
                                  type: "error",
                                  title: `IOC Tagged: ${item.ioc}`,
                                  message: `Type: ${item.type} | Risk Score: ${item.score}/100 | Actor: ${item.actor}`,
                                });
                              }}
                              className="p-1.5 rounded bg-bg/80 border border-line/60 flex items-center justify-between hover:border-accent cursor-pointer transition-colors"
                            >
                              <span className="font-bold text-ink">{item.ioc}</span>
                              <span className="text-muted">{item.type}</span>
                              <span className="text-accent">{item.actor}</span>
                              <span className="text-rose-400 font-bold">{item.score}% Risk</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Operational Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-line/60">
                      <button
                        onClick={() => {
                          showToast({
                            type: "success",
                            title: "IOC Rules Deployed to Firewalls",
                            message: "42 active indicators pushed to Palo Alto and Fortinet perimeter gateways.",
                          });
                        }}
                        className="px-3 py-1.5 rounded bg-accent text-accent-ink font-bold text-xs font-mono hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                      >
                        <Shield size={13} />
                        <span>Push IOCs to EDR & Perimeter</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate("/threat-intel");
                          showToast({ type: "info", title: "Threat Intel Platform", message: "Opening full SentralQ radar." });
                        }}
                        className="px-3 py-1.5 rounded border border-line bg-surface text-ink hover:border-accent text-xs font-mono font-semibold flex items-center gap-1.5"
                      >
                        <ExternalLink size={13} />
                        <span>Open Threat Intel Hub</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── CAM 04: VEHERE MITRE ATT&CK INGRESS HUNT ── */}
                {selectedFeedId === "feed-4" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-line/50 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Layers size={16} className="text-amber-400" />
                        <span className="text-sm font-bold text-ink">Vehere MITRE ATT&CK Ingress Hunt Matrix</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          235K Alerts Scored
                        </span>
                      </div>
                      <span className="text-xs font-mono text-muted">14 Tactic Stages</span>
                    </div>

                    {/* Kill Chain Stepper Bar */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
                      {[
                        "Initial Access",
                        "Execution",
                        "Persistence",
                        "Privilege Esc",
                        "Defense Evasion",
                        "Credential Access",
                        "Lateral Move",
                        "Exfiltration",
                      ].map((stage, sIdx) => (
                        <button
                          key={stage}
                          onClick={() => {
                            setSelectedMitreStage(sIdx);
                            showToast({
                              type: "info",
                              title: `MITRE Tactic Filter: ${stage}`,
                              message: `Filtering alerts mapped to ${stage} phase.`,
                            });
                          }}
                          className={clsx(
                            "px-2 py-1 rounded whitespace-nowrap transition-colors border",
                            selectedMitreStage === sIdx
                              ? "bg-accent text-accent-ink border-accent font-bold shadow-xs"
                              : "bg-surface text-muted border-line hover:text-ink",
                          )}
                        >
                          {sIdx + 1}. {stage}
                        </button>
                      ))}
                    </div>

                    {/* Top Offender Ingress IPs */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono font-bold text-ink">Top Offender Ingress IPs (Click Block IP to Null-Route)</span>
                      <div className="grid gap-1.5 text-xs font-mono max-h-36 overflow-y-auto">
                        {[
                          { ip: "185.220.101.5", hits: "4,210 hits", asn: "Tor Exit Node", country: "NL" },
                          { ip: "194.26.29.112", hits: "3,140 hits", asn: "HostKey AS", country: "RU" },
                          { ip: "45.154.255.89", hits: "1,890 hits", asn: "Cobalt Strike", country: "DE" },
                          { ip: "103.251.167.20", hits: "920 hits", asn: "Mirai C2", country: "HK" },
                        ].map((item) => (
                          <div
                            key={item.ip}
                            className="p-2 rounded bg-surface border border-line flex items-center justify-between"
                          >
                            <span className="font-bold text-ink">{item.ip}</span>
                            <span className="text-muted">{item.asn} ({item.country})</span>
                            <span className="text-sev-critical font-bold">{item.hits}</span>
                            <button
                              onClick={() => toggleBlockIp(item.ip)}
                              className={clsx(
                                "px-2.5 py-0.5 rounded text-[10px] font-bold transition-colors",
                                blockedIps[item.ip]
                                  ? "bg-ok text-ok-ink hover:bg-ok/80"
                                  : "bg-sev-critical text-white hover:bg-sev-critical/80",
                              )}
                            >
                              {blockedIps[item.ip] ? "QUARANTINED" : "Block IP"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-line/60">
                      <button
                        onClick={() => {
                          showToast({
                            type: "warning",
                            title: "Deep Packet Inspection Triggered",
                            message: "PCAP payload capture streaming for top 5 offenders on port 443/8443.",
                          });
                        }}
                        className="px-3 py-1.5 rounded bg-surface border border-line hover:border-accent text-ink text-xs font-mono font-bold flex items-center gap-1.5"
                      >
                        <Sliders size={13} />
                        <span>Trigger Deep Packet Inspect</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate("/alerts");
                          showToast({ type: "info", title: "Alerts & Interceptor", message: "Opening full Interceptor Threat Hunt board." });
                        }}
                        className="px-3 py-1.5 rounded border border-accent/40 bg-accent/20 text-accent font-bold text-xs font-mono flex items-center gap-1.5"
                      >
                        <ExternalLink size={13} />
                        <span>Open Alerts Hub</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── CAM 05: LEVEL 3 CRITICAL INCIDENT WAR ROOM ── */}
                {selectedFeedId === "feed-5" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-line/50 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Flame size={16} className="text-sev-critical animate-pulse" />
                        <span className="text-sm font-bold text-ink">Emergency Incident War Room (INC-2026-CRIT-0042)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
                          LEVEL 3 ACTIVE
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <Clock size={13} className="text-accent" />
                        <span>Elapsed: <strong className="text-ink">{formatStopwatch(elapsedSecs)}</strong></span>
                      </div>
                    </div>

                    {/* Affected Assets Isolation Grid */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono font-bold text-ink">Affected Enterprise Hosts (1-Click EDR Containment)</span>
                      <div className="grid sm:grid-cols-3 gap-2 text-xs font-mono">
                        {[
                          { id: "srv-prod-db-01", name: "srv-prod-db-01", ip: "10.0.3.50", role: "Postgres DB" },
                          { id: "dc-corp-01", name: "dc-corp-01", ip: "10.0.1.10", role: "Active Directory" },
                          { id: "endpoint-win-27", name: "endpoint-win-27", ip: "10.0.2.80", role: "Finance WS" },
                        ].map((asset) => (
                          <div
                            key={asset.id}
                            className="p-2.5 rounded bg-surface border border-line flex flex-col justify-between gap-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-ink">{asset.name}</span>
                              <span className="text-[9px] text-muted">{asset.role}</span>
                            </div>
                            <span className="text-[10px] text-muted">{asset.ip}</span>
                            <button
                              onClick={() => {
                                setContainedAssets((prev) => {
                                  const next = !prev[asset.id];
                                  showToast({
                                    type: next ? "error" : "info",
                                    title: next ? `Asset Isolated: ${asset.name}` : `Asset Restored: ${asset.name}`,
                                    message: next ? `EDR containment applied. IP dropped.` : `Network access restored.`,
                                  });
                                  return { ...prev, [asset.id]: next };
                                });
                              }}
                              className={clsx(
                                "w-full py-1 rounded text-[10px] font-bold transition-colors",
                                containedAssets[asset.id]
                                  ? "bg-sev-critical text-white"
                                  : "bg-surface border border-line text-ink hover:border-sev-critical",
                              )}
                            >
                              {containedAssets[asset.id] ? "CONTAINED (ISOLATED)" : "Isolate Asset"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live War Room Tactical Chat Log */}
                    <div className="rounded-chip border border-line bg-black/60 p-2.5 space-y-2">
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                        Live Analyst War Room Transmission
                      </span>
                      <div className="max-h-24 overflow-y-auto space-y-1.5 text-xs font-mono">
                        {chatMessages.map((msg, mIdx) => (
                          <div key={mIdx} className="p-1.5 rounded bg-surface/70 border border-line/40 text-[11px]">
                            <div className="flex items-center justify-between text-muted text-[10px]">
                              <span className="font-bold text-accent">{msg.sender}</span>
                              <span>{msg.time}</span>
                            </div>
                            <p className="text-ink mt-0.5">{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input Box */}
                      <form onSubmit={handleSendChat} className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Broadcast tactical directive to War Room..."
                          className="bg-bg text-ink text-xs font-mono px-2.5 py-1.5 rounded border border-line w-full focus:outline-none focus:border-accent"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded bg-accent text-accent-ink font-bold text-xs font-mono hover:bg-accent/90 transition-colors flex items-center gap-1"
                        >
                          <Send size={12} />
                          <span>Send</span>
                        </button>
                      </form>
                    </div>

                    {/* Automated SOAR Containment Trigger */}
                    <div className="flex items-center justify-between pt-2 border-t border-line/60">
                      <button
                        onClick={() => {
                          showToast({
                            type: "error",
                            title: "SOAR Level-3 Containment Executed",
                            message: "All Kerberos sessions revoked. Perimeter BGP null-routes applied. Evidence snapshot archived.",
                          });
                        }}
                        className="px-4 py-2 rounded bg-sev-critical text-white font-bold text-xs font-mono hover:bg-sev-critical/90 transition-colors flex items-center gap-1.5 shadow-md"
                      >
                        <Zap size={13} fill="currentColor" />
                        <span>Execute Emergency SOAR Playbook</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate("/attack-graph");
                          showToast({ type: "info", title: "War Room Workspace", message: "Opening full War Room Kill-Chain view." });
                        }}
                        className="px-3 py-1.5 rounded border border-line bg-surface text-ink hover:border-accent text-xs font-mono font-semibold flex items-center gap-1.5"
                      >
                        <ExternalLink size={13} />
                        <span>Open War Room Hub</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right-Hand Telemetry & Analysis Panel */}
          <div className="lg:col-span-4 p-5 space-y-4 bg-surface flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                  Console Intelligence Breakdown
                </span>
                <h3 className="text-base font-bold text-ink mt-0.5">{currentFeed.title}</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">{currentFeed.description}</p>
              </div>

              {/* Extracted Telemetry Grid */}
              <div className="rounded-chip border border-line bg-raised/50 p-3 space-y-2 text-xs">
                <span className="font-semibold text-ink text-[11px] block">Extracted Telemetry Data</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div
                    onClick={() => {
                      showToast({ type: "success", title: "Telemetry Validated", message: "Sensor pipelines reporting 0 packet loss." });
                    }}
                    className="p-2 rounded bg-surface border border-line cursor-pointer hover:border-accent transition-colors"
                  >
                    <span className="text-muted block text-[10px]">OPERATIONAL STATE</span>
                    <span className="font-bold text-ok flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-ok animate-ping" />
                      SYNCHRONIZED
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      showToast({ type: "error", title: "Severity Level Confirmed", message: "Incident escalated to Tier-1 SOC Manager oversight." });
                    }}
                    className="p-2 rounded bg-surface border border-line cursor-pointer hover:border-sev-critical transition-colors"
                  >
                    <span className="text-muted block text-[10px]">SEVERITY INDEX</span>
                    <span className="font-bold text-sev-critical">CRITICAL TIER-1</span>
                  </div>

                  <div
                    onClick={() => {
                      showToast({ type: "info", title: "Bandwidth Metric", message: `Current live ingress throughput: ${ingressBw} Gbps` });
                    }}
                    className="p-2 rounded bg-surface border border-line cursor-pointer hover:border-accent transition-colors"
                  >
                    <span className="text-muted block text-[10px]">INGRESS BANDWIDTH</span>
                    <span className="font-bold text-ink">{ingressBw} Gbps</span>
                  </div>

                  <div
                    onClick={() => {
                      showToast({ type: "info", title: "AI Model Verified", message: "GPT-SOC v4 running unsupervised anomaly detection ensemble." });
                    }}
                    className="p-2 rounded bg-surface border border-line cursor-pointer hover:border-accent transition-colors"
                  >
                    <span className="text-muted block text-[10px]">CORRELATION ENGINE</span>
                    <span className="font-bold text-accent">GPT-SOC v4</span>
                  </div>
                </div>
              </div>

              {/* Related Action Vectors (Clickable Toggles) */}
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-ink text-[11px] block">Related Action Vectors (Click to Enforce)</span>

                <div
                  onClick={() => {
                    setActionVectors((prev) => {
                      const next = !prev.subnet;
                      showToast({
                        type: next ? "success" : "warning",
                        title: next ? "Subnet Segmentation Enforced" : "Segmentation Rules Bypassed",
                        message: next ? "VLAN 20 and VLAN 30 isolated." : "Standard routing re-enabled.",
                      });
                      return { ...prev, subnet: next };
                    });
                  }}
                  className="flex items-center gap-2 p-2 rounded bg-surface border border-line hover:border-accent cursor-pointer transition-colors text-ink text-[11px]"
                >
                  <CheckCircle2 size={14} className={actionVectors.subnet ? "text-ok shrink-0" : "text-muted shrink-0"} />
                  <span className={actionVectors.subnet ? "font-semibold" : "line-through text-muted"}>
                    Subnet segmentation rules enforced
                  </span>
                </div>

                <div
                  onClick={() => {
                    setActionVectors((prev) => {
                      const next = !prev.memory;
                      showToast({
                        type: next ? "success" : "warning",
                        title: next ? "Memory Dump Stored" : "Memory Dump Canceled",
                        message: next ? "Memory snapshot synced to cold storage." : "Snapshot unsaved.",
                      });
                      return { ...prev, memory: next };
                    });
                  }}
                  className="flex items-center gap-2 p-2 rounded bg-surface border border-line hover:border-accent cursor-pointer transition-colors text-ink text-[11px]"
                >
                  <CheckCircle2 size={14} className={actionVectors.memory ? "text-ok shrink-0" : "text-muted shrink-0"} />
                  <span className={actionVectors.memory ? "font-semibold" : "line-through text-muted"}>
                    Forensic memory snapshot captured to cold storage
                  </span>
                </div>

                <div
                  onClick={() => {
                    setActionVectors((prev) => {
                      const next = !prev.edr;
                      showToast({
                        type: next ? "error" : "info",
                        title: next ? "EDR Containment Active" : "EDR Containment Lifted",
                        message: next ? "4 endpoints isolated from network." : "Endpoints restored.",
                      });
                      return { ...prev, edr: next };
                    });
                  }}
                  className="flex items-center gap-2 p-2 rounded bg-surface border border-line hover:border-accent cursor-pointer transition-colors text-ink text-[11px]"
                >
                  <CheckCircle2 size={14} className={actionVectors.edr ? "text-ok shrink-0" : "text-muted shrink-0"} />
                  <span className={actionVectors.edr ? "font-semibold" : "line-through text-muted"}>
                    EDR isolation triggered across 4 compromised endpoints
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-line flex flex-col gap-2">
              <button
                onClick={() => {
                  setViewMode("interactive");
                  showToast({
                    type: "success",
                    title: `Console Active: ${currentFeed.workspaceName}`,
                    message: `Working in live interactive console for CAM 0${SURVEILLANCE_FEEDS.findIndex((f) => f.id === currentFeed.id) + 1}.`,
                  });
                }}
                className="w-full py-2.5 px-3 rounded-chip bg-accent text-accent-ink font-bold text-xs hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Zap size={14} fill="currentColor" />
                <span>Work in Live Console ({currentFeed.workspaceName})</span>
              </button>

              <button
                onClick={() => setZoomModal(true)}
                className="w-full py-2 px-3 rounded-chip border border-line bg-surface text-ink font-semibold text-xs hover:bg-raised transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Maximize2 size={13} />
                <span>Examine High-Res Image Detail</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All 5 Images in Synchronized Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-accent" />
            <h2 className="text-sm font-bold text-ink">
              All 5 Optical Surveillance Feeds (Click Any to Select & Work)
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">5 Feeds Displayed</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SURVEILLANCE_FEEDS.map((feed, idx) => {
            const isSelected = feed.id === selectedFeedId;
            return (
              <div
                key={feed.id}
                onClick={() => {
                  setSelectedFeedId(feed.id);
                  showToast({
                    type: "info",
                    title: `Switched to Feed #${idx + 1}: ${feed.workspaceName}`,
                    message: `Active console loaded in surveillance view.`,
                  });
                }}
                className={clsx(
                  "cursor-pointer rounded-card border overflow-hidden transition-all duration-200 group flex flex-col justify-between",
                  isSelected
                    ? "border-accent ring-2 ring-accent/30 bg-surface shadow-md"
                    : "border-line bg-surface/80 hover:border-accent/70 hover:bg-surface",
                )}
              >
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img
                    src={feed.src}
                    alt={feed.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-white">
                    Feed #{idx + 1}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-accent pointer-events-none" />
                  )}
                </div>

                <div className="p-2.5 space-y-1">
                  <p className="text-xs font-bold text-ink truncate group-hover:text-accent transition-colors">
                    {feed.title}
                  </p>
                  <p className="text-[10px] text-muted line-clamp-1">{feed.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-6xl rounded-card border border-line bg-surface p-4 shadow-2xl space-y-3 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-accent" />
                <h3 className="text-sm font-bold text-ink">{currentFeed.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sev-critical/20 text-sev-critical font-bold">
                  {currentFeed.badge}
                </span>
              </div>
              <button
                onClick={() => setZoomModal(false)}
                className="rounded-chip px-3 py-1 bg-raised text-ink hover:bg-line text-xs font-bold cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-chip border border-line bg-black flex items-center justify-center p-2">
              <img
                src={currentFeed.src}
                alt={currentFeed.title}
                className="max-h-[74vh] w-auto object-contain rounded"
              />
            </div>

            <div className="text-xs text-muted flex items-center justify-between">
              <span>{currentFeed.description}</span>
              <span className="font-mono text-[10px] text-accent">Target: {currentFeed.src}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RadarIcon({ className }: { className?: string }) {
  return (
    <svg className={clsx("w-4 h-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 12 L20 6" />
      <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
