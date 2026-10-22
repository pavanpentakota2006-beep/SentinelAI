import { BookOpenCheck, Shield, Radio, Play, Network, Target, Workflow, ExternalLink, Info, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, DemoTag } from "@/components/ui";

export default function HelpPage() {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Help & Guided Demo Tour</h1>
            <DemoTag>Interactive Walkthrough</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Architecture notes, incident response workflows, and quick-start tips for SentinelX AI.
          </p>
        </div>
      </div>

      {/* Quick Start Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-line bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs">
            <Radio size={16} className="text-ok animate-pulse" />
            <span>1. Live Ingestion Simulator</span>
          </div>
          <p className="text-xs text-muted">
            The top bar includes a live simulator toggle. While active, synthetic attack telemetry streams in every 3 seconds.
          </p>
          <Link to="/events" className="text-xs text-accent hover:underline flex items-center gap-1 font-mono pt-1">
            <span>Inspect Live Stream</span> &rarr;
          </Link>
        </div>

        <div className="rounded-card border border-line bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs">
            <Target size={16} className="text-sev-critical" />
            <span>2. Investigate Correlated Incidents</span>
          </div>
          <p className="text-xs text-muted">
            Explore multi-stage attack campaigns mapped to MITRE ATT&CK kill chain tactics with adversary storylines.
          </p>
          <Link to="/incidents" className="text-xs text-accent hover:underline flex items-center gap-1 font-mono pt-1">
            <span>View Incidents</span> &rarr;
          </Link>
        </div>

        <div className="rounded-card border border-line bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs">
            <Workflow size={16} className="text-ok" />
            <span>3. Execute SOAR Playbooks</span>
          </div>
          <p className="text-xs text-muted">
            Simulate automated host network isolation, credential revocation, and border firewall IP blocks in real time.
          </p>
          <Link to="/playbooks" className="text-xs text-accent hover:underline flex items-center gap-1 font-mono pt-1">
            <span>Run Playbooks</span> &rarr;
          </Link>
        </div>
      </div>

      {/* Architecture Deep Dive */}
      <Card title="SentinelX AI Core Architecture">
        <div className="space-y-4 text-xs">
          <p className="text-ink leading-relaxed">
            SentinelX AI is designed for high-throughput enterprise security telemetry ingestion, correlation, and automated incident triage. All demonstration events, hosts, and identities are synthetic and clearly labeled.
          </p>

          <div className="grid grid-cols-2 gap-3 font-mono bg-raised/40 p-3 rounded-chip border border-line/60">
            <div>
              <span className="text-muted block">Backend Engine:</span>
              <span className="text-ink font-semibold">Spring Boot 3 (Java 21)</span>
            </div>
            <div>
              <span className="text-muted block">Relational Schema:</span>
              <span className="text-ink font-semibold">PostgreSQL 16 (Flyway V1, V2)</span>
            </div>
            <div>
              <span className="text-muted block">Frontend Architecture:</span>
              <span className="text-ink font-semibold">React + TypeScript + Vite + Tailwind</span>
            </div>
            <div>
              <span className="text-muted block">Active Port:</span>
              <span className="text-accent font-semibold">http://localhost:5158</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
