import { useState } from "react";
import { Settings, Save, Shield, Bell, Database, Cpu, CheckCircle2 } from "lucide-react";
import { Card, DemoTag } from "@/components/ui";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [retentionDays, setRetentionDays] = useState(90);
  const [mlSensitivity, setMlSensitivity] = useState(85);
  const [autoContainment, setAutoContainment] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Platform & Detection Settings</h1>
            <DemoTag>Tenant Configuration</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Configure telemetry retention policies, machine learning thresholds, and emergency containment automation.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 self-start sm:self-center rounded-chip bg-accent px-4 py-2 text-xs font-bold text-accent-ink hover:bg-accent/90 transition-colors shadow-sm"
        >
          {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          <span>{saved ? "Settings Saved!" : "Save Configuration"}</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Retention Policy */}
        <Card title="Telemetry Data Retention">
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">Raw Security Event Retention</p>
                <p className="text-muted text-[11px]">Duration to retain high-throughput normalized events in PostgreSQL partitions.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(Number(e.target.value))}
                  className="w-20 rounded-chip border border-line bg-bg px-2 py-1 font-mono text-xs text-right"
                />
                <span className="text-muted font-mono">days</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Machine Learning */}
        <Card title="Unsupervised Anomaly Model Settings">
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-ink">Isolation Forest Outlier Sensitivity</span>
                <span className="font-mono text-accent font-bold">{mlSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={mlSensitivity}
                onChange={(e) => setMlSensitivity(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-muted text-[11px] mt-1">
                Higher sensitivity catches subtle low-and-slow reconnaissance but may elevate triage alert volume.
              </p>
            </div>
          </div>
        </Card>

        {/* Automated Containment */}
        <Card title="SOAR Auto-Containment Safeguards">
          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoContainment}
                onChange={(e) => setAutoContainment(e.target.checked)}
                className="mt-0.5 rounded accent-cyan-400"
              />
              <div>
                <span className="font-semibold text-ink block">Enable Autonomous EDR Quarantine on Critical Score &gt; 90</span>
                <span className="text-muted text-[11px]">
                  When enabled, systems detecting verified ransomware deletion commands (vssadmin) are automatically isolated from the subnet.
                </span>
              </div>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
