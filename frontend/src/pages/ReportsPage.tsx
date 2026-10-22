import { useState } from "react";
import { FileBarChart, Download, Calendar, ShieldCheck, CheckCircle2, TrendingUp, Check } from "lucide-react";
import { Card, DemoTag } from "@/components/ui";
import { generatePdfReport } from "@/lib/pdfReportGenerator";

const REPORTS = [
  { id: "REP-2026-Q3", title: "Quarterly Executive Threat Intelligence Briefing", date: "2026-10-20", author: "CISO Office", format: "PDF", size: "4.2 MB" },
  { id: "REP-2026-10", title: "Ransomware Precursor & Attack Surface Audit", date: "2026-10-22", author: "SOC Lead", format: "PDF", size: "1.8 MB" },
  { id: "REP-2026-NIST", title: "NIST SP 800-61 Rev. 2 Incident Handling Compliance", date: "2026-10-15", author: "Compliance Team", format: "PDF", size: "3.5 MB" },
];

export default function ReportsPage() {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = (rep: (typeof REPORTS)[number]) => {
    setDownloadedId(rep.id);
    generatePdfReport(rep);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Security Analytics Reports</h1>
            <DemoTag>Executive & Compliance</DemoTag>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Automated forensic reports, MTTD/MTTR operational performance, and compliance audit exports.
          </p>
        </div>

        <button
          onClick={() =>
            generatePdfReport({
              id: "REP-2026-LIVE",
              title: "Operational Threat Briefing & Forensic Audit",
              date: new Date().toISOString().split("T")[0],
              author: "Autonomous SOC Lead",
              format: "PDF",
              size: "3.2 MB",
            })
          }
          className="flex items-center gap-1.5 self-start sm:self-center rounded-chip bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink hover:bg-accent/90 transition-colors shadow-sm active:scale-95"
        >
          <FileBarChart size={14} />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Compliance / SLA summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-line bg-surface p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">SLA Compliance (P1 MTTC &lt; 1h)</span>
            <CheckCircle2 size={16} className="text-ok" />
          </div>
          <p className="font-mono text-2xl font-bold text-ok">97.4%</p>
          <div className="flex items-center gap-1 text-[11px] text-ok">
            <TrendingUp size={12} />
            <span>+2.1% improvement</span>
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">False Positive Suppression</span>
            <ShieldCheck size={16} className="text-accent" />
          </div>
          <p className="font-mono text-2xl font-bold text-accent">91.2%</p>
          <p className="text-[11px] text-muted">Aided by Unsupervised ML</p>
        </div>

        <div className="rounded-card border border-line bg-surface p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Attack Surface Exposure</span>
            <FileBarChart size={16} className="text-sev-high" />
          </div>
          <p className="font-mono text-2xl font-bold text-sev-high">Low Risk</p>
          <p className="text-[11px] text-muted">1 DMZ host quarantined</p>
        </div>
      </div>

      {/* Reports List */}
      <Card title="Published Compliance & Incident Reports">
        <div className="divide-y divide-line">
          {REPORTS.map((rep) => (
            <div key={rep.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-accent">{rep.id}</span>
                  <span className="font-semibold text-xs text-ink">{rep.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted font-mono text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} />
                    Published: {rep.date}
                  </span>
                  <span>Author: {rep.author}</span>
                  <span>Size: {rep.size}</span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(rep)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-chip border border-line bg-raised hover:bg-surface text-ink text-xs font-medium transition-colors active:scale-95"
              >
                {downloadedId === rep.id ? (
                  <>
                    <Check size={12} className="text-ok" />
                    <span className="text-ok font-semibold">Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download size={12} />
                    <span>Download {rep.format}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
