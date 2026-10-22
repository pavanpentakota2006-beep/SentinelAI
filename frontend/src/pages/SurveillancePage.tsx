import React, { useState } from "react";
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

  const currentFeed =
    SURVEILLANCE_FEEDS.find((f) => f.id === selectedFeedId) || SURVEILLANCE_FEEDS[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-ink">
              Tactical SOC Visual Surveillance Feeds
            </h1>
            <DemoTag>5 Live Optical Feeds</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Real-time visual surveillance captures and telemetry from global Security Operations Center consoles, war rooms, and threat radars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-mono text-ok bg-ok/10 border border-ok/30 px-3 py-1.5 rounded-chip">
            <Radio size={13} className="animate-pulse" /> All 5 Cameras Connected
          </span>
        </div>
      </div>

      {/* Feed Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {SURVEILLANCE_FEEDS.map((feed, idx) => {
          const isActive = feed.id === selectedFeedId;
          return (
            <button
              key={feed.id}
              onClick={() => setSelectedFeedId(feed.id)}
              className={clsx(
                "flex flex-col items-start gap-1 p-2.5 rounded-card border text-left transition-all duration-200",
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

      {/* Primary Big Screen View of Selected Image */}
      <div className="rounded-card border border-line bg-surface overflow-hidden shadow-lg">
        {/* Top Screen Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-raised/70 px-4 py-2.5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sev-critical animate-ping" />
            <span className="font-bold text-ink">{currentFeed.title}</span>
            <span className="rounded bg-black/40 px-2 py-0.5 text-muted border border-line">
              Source: {currentFeed.src}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomModal(true)}
              className="flex items-center gap-1.5 rounded-chip border border-line bg-surface px-3 py-1 text-ink hover:border-accent hover:text-accent transition-colors"
            >
              <Maximize2 size={12} />
              <span>Full Screen Zoom</span>
            </button>
          </div>
        </div>

        {/* Content: Main Real Image on Left (7 cols), Contextual Telemetry on Right (5 cols) */}
        <div className="grid lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-line">
          {/* Main Visual Image */}
          <div className="lg:col-span-8 p-4 bg-black/90 flex flex-col justify-center items-center relative group">
            <div className="relative w-full max-h-[580px] overflow-hidden rounded-chip border border-line/60 bg-black flex items-center justify-center">
              <img
                src={currentFeed.src}
                alt={currentFeed.title}
                className="w-full h-auto max-h-[560px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-white border border-white/20">
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
            <p className="text-[11px] font-mono text-muted/70 mt-2 text-center">
              Optical capture feed calibrated from SentinelX AI secure operations infrastructure
            </p>
          </div>

          {/* Telemetry & Analysis Panel */}
          <div className="lg:col-span-4 p-5 space-y-4 bg-surface flex flex-col justify-between">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                  Console Intelligence Breakdown
                </span>
                <h3 className="text-base font-bold text-ink mt-0.5">{currentFeed.title}</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">{currentFeed.description}</p>
              </div>

              <div className="rounded-chip border border-line bg-raised/50 p-3 space-y-2 text-xs">
                <span className="font-semibold text-ink text-[11px] block">Extracted Telemetry Data</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-surface border border-line">
                    <span className="text-muted block text-[10px]">OPERATIONAL STATE</span>
                    <span className="font-bold text-ok">SYNCHRONIZED</span>
                  </div>
                  <div className="p-2 rounded bg-surface border border-line">
                    <span className="text-muted block text-[10px]">SEVERITY INDEX</span>
                    <span className="font-bold text-sev-critical">CRITICAL TIER-1</span>
                  </div>
                  <div className="p-2 rounded bg-surface border border-line">
                    <span className="text-muted block text-[10px]">INGRESS BANDWIDTH</span>
                    <span className="font-bold text-ink">4.2 Gbps</span>
                  </div>
                  <div className="p-2 rounded bg-surface border border-line">
                    <span className="text-muted block text-[10px]">CORRELATION ENGINE</span>
                    <span className="font-bold text-accent">GPT-SOC v4</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-ink text-[11px] block">Related Action Vectors</span>
                <div className="flex items-center gap-2 text-muted text-[11px]">
                  <CheckCircle2 size={14} className="text-ok shrink-0" />
                  <span>Subnet segmentation rules enforced</span>
                </div>
                <div className="flex items-center gap-2 text-muted text-[11px]">
                  <CheckCircle2 size={14} className="text-ok shrink-0" />
                  <span>Forensic memory snapshot captured to cold storage</span>
                </div>
                <div className="flex items-center gap-2 text-muted text-[11px]">
                  <CheckCircle2 size={14} className="text-ok shrink-0" />
                  <span>EDR isolation triggered across 4 compromised endpoints</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-line flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate(currentFeed.route);
                  showToast({
                    type: "info",
                    title: `Workspace Launched: ${currentFeed.workspaceName}`,
                    message: `Switched to active operational module at ${currentFeed.route}`,
                  });
                }}
                className="w-full py-2.5 px-3 rounded-chip bg-accent text-accent-ink font-bold text-xs hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Play size={14} fill="currentColor" />
                <span>Launch Working Dashboard ({currentFeed.workspaceName}) &rarr;</span>
              </button>
              <button
                onClick={() => setZoomModal(true)}
                className="w-full py-2 px-3 rounded-chip border border-line bg-surface text-ink font-semibold text-xs hover:bg-raised transition-colors flex items-center justify-center gap-2"
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
              All 5 Optical Surveillance Feeds (Click Any to Select)
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
                onClick={() => setSelectedFeedId(feed.id)}
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
                className="rounded-chip px-3 py-1 bg-raised text-ink hover:bg-line text-xs font-bold"
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
