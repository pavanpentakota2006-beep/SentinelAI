import React from "react";
import { Sparkles, Bot, ShieldAlert, TrendingUp, Layers } from "lucide-react";

export function AiInvestigationCard() {
  return (
    <div className="rounded-card border border-line bg-surface p-4 flex flex-col justify-between space-y-3.5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-accent/20 text-accent">
            <Sparkles size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ink">AI Copilot Threat Analysis</h3>
            <span className="font-mono text-[10px] text-muted">GPT-SOC Enterprise Engine</span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent font-semibold">
          CONFIDENCE 94%
        </span>
      </div>

      {/* AI Summary Narrative matching Image 1 */}
      <div className="rounded-chip border border-line/60 bg-raised/40 p-3 text-xs leading-relaxed font-sans space-y-1">
        <span className="text-accent font-bold text-[11px] block flex items-center gap-1">
          <Bot size={13} /> Automated Correlation Narrative:
        </span>
        <p className="text-ink/90">
          Unusual encrypted outbound stream (8.4 GB) from <span className="font-mono text-ink font-semibold">db-core-02</span> detected following 18 failed Kerberos pre-authentication attempts originating from known VPN exit node <span className="font-mono text-ink font-semibold">194.26.29.112</span>. Activity matches T1567.002 data staging and exfiltration patterns.
        </p>
      </div>

      {/* Threat Attribution breakdown matching Image 1 */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] text-muted font-medium">Adversary Threat Attribution</span>
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="font-bold text-ink text-sm">204</span>
            <span className="text-ok text-[11px] flex items-center">
              <TrendingUp size={11} /> +18%
            </span>
          </div>
        </div>

        {/* Multi-segment attribution bar */}
        <div className="h-2 w-full rounded-full bg-raised overflow-hidden flex">
          <div style={{ width: "48%" }} className="bg-sev-critical" title="Financial: 48%" />
          <div style={{ width: "34%" }} className="bg-sev-high" title="DPRK / APT: 34%" />
          <div style={{ width: "18%" }} className="bg-accent" title="Espionage: 18%" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-muted pt-0.5">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sev-critical" /> Financial (48%)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sev-high" /> State-Sponsored (34%)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Espionage (18%)
          </span>
        </div>
      </div>
    </div>
  );
}
