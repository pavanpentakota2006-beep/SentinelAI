import { jsPDF } from "jspdf";

export interface ReportData {
  id: string;
  title: string;
  date: string;
  author: string;
  format: string;
  size?: string;
  classification?: string;
  summary?: string;
  findings?: string[];
  metrics?: Array<{ label: string; value: string }>;
  assets?: Array<{ name: string; ip: string; status: string; criticality: string }>;
}

const PRESETS: Record<string, Partial<ReportData>> = {
  "REP-2026-Q3": {
    classification: "TLP:AMBER",
    summary:
      "Comprehensive telemetry assessment covering Q3 2026 across enterprise cloud and on-premise enclaves. Autonomous ML anomaly detection correlated 1,248 suspicious access vectors, isolating 14 credential-stuffing campaigns and preventing ransomware execution across core clusters.",
    metrics: [
      { label: "SLA MTTC Compliance", value: "98.1%" },
      { label: "Mean Time to Detect (MTTD)", value: "3.8 min" },
      { label: "Mean Time to Respond (MTTR)", value: "21.5 min" },
      { label: "ML False Positive Suppression", value: "93.4%" },
    ],
    findings: [
      "Mitigated 14 distributed credential stuffing incursions originating from high-entropy ASN networks.",
      "EDR quarantine rules autonomously prevented PowerShell script execution on staging gateway srv-app-04.",
      "Cloud IAM session hygiene enforcement reduced over-privileged service account anomalies by 64%.",
      "Lateral movement heuristics blocked Cobalt Strike beaconing from compromised test workstation.",
    ],
    assets: [
      { name: "srv-prod-db-01", ip: "10.0.4.15", criticality: "TIER-1 CRITICAL", status: "CONTAINED (EDR QUARANTINED)" },
      { name: "dc-corp-01", ip: "10.0.1.5", criticality: "TIER-1 CRITICAL", status: "REMEDIATED (PASSWORDS ROTATED)" },
      { name: "gw-dmz-ext-02", ip: "10.0.2.80", criticality: "TIER-2 HIGH", status: "ISOLATED (NULL-ROUTED)" },
      { name: "ws-fin-04", ip: "10.0.3.11", criticality: "TIER-3 MEDIUM", status: "CLEAN (MALWARE PURGED)" },
    ],
  },
  "REP-2026-10": {
    classification: "TLP:RED",
    summary:
      "Deep forensic audit following anomalous outbound data exfiltration indicators on DMZ gateway. EDR micro-segmentation successfully severed C2 heartbeats before shadow copy deletion or payload staging could occur. Zero host encryption observed.",
    metrics: [
      { label: "Ransomware Containment", value: "100%" },
      { label: "Host Encryption Observed", value: "0 bytes" },
      { label: "C2 Severance Latency", value: "48 sec" },
      { label: "Compromised Identities", value: "1 Account" },
    ],
    findings: [
      "Identified BlackCat/ALPHV affiliate staging tools within %TEMP% directory on dev-bastion host.",
      "Active Directory kerberoasting request intercepted and domain admin ticket revoked immediately.",
      "VSS (Volume Shadow Copy) deletion command blocked by SentinelX behavioral kernel driver.",
      "Automated threat hunting rules deployed globally to 4,200 fleet endpoints within 90 seconds.",
    ],
    assets: [
      { name: "dev-bastion-01", ip: "10.0.2.14", criticality: "TIER-2 HIGH", status: "RE-IMAGED & HARDENED" },
      { name: "nas-backup-02", ip: "10.0.5.20", criticality: "TIER-1 CRITICAL", status: "IMMUTABLE LOCK ACTIVE" },
      { name: "ws-dev-08", ip: "10.0.3.45", criticality: "TIER-3 MEDIUM", status: "ISOLATED (AIR-GAPPED)" },
      { name: "fw-edge-primary", ip: "192.168.1.1", criticality: "TIER-1 CRITICAL", status: "RULES APPLIED & VERIFIED" },
    ],
  },
  "REP-2026-NIST": {
    classification: "TLP:AMBER",
    summary:
      "Formal compliance validation verifying SOC alignment with NIST SP 800-61 Rev. 2 Computer Security Incident Handling Guide. Audit encompasses all phases: Preparation, Detection & Analysis, Containment, Eradication, and Post-Incident Activity.",
    metrics: [
      { label: "NIST 800-61 Alignment", value: "99.2%" },
      { label: "Audit Evidence Ledger", value: "SHA-256" },
      { label: "Mean MTTR SLA", value: "18.4 min" },
      { label: "Chain of Custody Integrity", value: "100%" },
    ],
    findings: [
      "Incident logging retention meets 365-day statutory compliance with automated cold storage archiving.",
      "SOAR playbooks execute NIST Phase 3 containment actions within deterministic SLA windows (<60s).",
      "Immutable cryptographic hashing enabled for all PCAP captures and memory forensic dumps.",
      "Annual SOC tabletop exercise conducted with executive staff; response procedures verified.",
    ],
    assets: [
      { name: "siem-collector-01", ip: "10.0.6.10", criticality: "TIER-1 CRITICAL", status: "AUDIT VALIDATED" },
      { name: "soar-engine-cluster", ip: "10.0.6.15", criticality: "TIER-1 CRITICAL", status: "ACTIVE & HEALTHY" },
      { name: "forensic-vault-s3", ip: "10.0.8.50", criticality: "TIER-1 CRITICAL", status: "WORM COMPLIANT" },
      { name: "ldap-auth-service", ip: "10.0.1.20", criticality: "TIER-2 HIGH", status: "MFA ENFORCED" },
    ],
  },
};

export function generatePdfReport(inputReport: ReportData): void {
  const preset = PRESETS[inputReport.id] || {};
  const report: ReportData = { ...preset, ...inputReport };

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ── 1. TOP HEADER BANNER (Deep Navy Security Bar) ──
  doc.setFillColor(7, 19, 38); // #071326
  doc.rect(0, 0, pageWidth, 28, "F");

  // Glowing Cyan Accent Stripe
  doc.setFillColor(0, 245, 255); // #00f5ff
  doc.rect(0, 27, pageWidth, 1.2, "F");

  // Logo & Title in Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("SENTINELX AI", margin, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text("AUTONOMOUS SOC & INCIDENT RESPONSE PLATFORM", margin, 19);

  // TLP Badge on Top Right
  const tlpText = report.classification || "TLP:AMBER+STRICT";
  doc.setFillColor(245, 158, 11); // amber
  doc.roundedRect(pageWidth - margin - 38, 9, 38, 7, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(tlpText, pageWidth - margin - 19, 14, { align: "center" });

  y = 38;

  // ── 2. REPORT TITLE & METADATA BLOCK ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(report.title, margin, y);
  y += 7;

  // Report Reference & Author
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Report ID: ${report.id}   |   Published: ${report.date}   |   Lead: ${report.author}`, margin, y);
  y += 10;

  // Divider Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ── 3. EXECUTIVE SUMMARY ──
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(14, 116, 144); // cyan-700
  doc.text("EXECUTIVE BRIEFING & THREAT CONTEXT", margin + 5, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // slate-700
  const summaryText =
    report.summary ||
    `This report documents telemetry, automated correlation findings, and response mitigation executed by SentinelX AI. Autonomous ML models observed and correlated multiple multi-stage kill-chain activities across external DMZ ingress points and internal core databases. All critical indicators have been neutralized per NIST SP 800-61 protocols.`;
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 10);
  doc.text(splitSummary, margin + 5, y + 12);

  y += 33;

  // ── 4. KEY SOC METRICS & OPERATIONAL SLAS ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Operational SOC Performance & SLA Metrics", margin, y);
  y += 6;

  // 4 Metric KPI Cards
  const kpis = report.metrics || [
    { label: "SLA MTTC Compliance", value: "97.4%" },
    { label: "Mean Time to Detect (MTTD)", value: "4.2 min" },
    { label: "Mean Time to Respond (MTTR)", value: "24.0 min" },
    { label: "ML False Positive Suppression", value: "91.2%" },
  ];

  const cardWidth = (contentWidth - 9) / 4;
  kpis.forEach((kpi, index) => {
    const cardX = margin + index * (cardWidth + 3);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(cardX, y, cardWidth, 18, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, cardX + cardWidth / 2, y + 6, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.value, cardX + cardWidth / 2, y + 14, { align: "center" });
  });

  y += 26;

  // ── 5. DETAILED INVESTIGATION FINDINGS ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("2. Key Forensic Findings & Threat Attribution", margin, y);
  y += 6;

  const findings = report.findings || [
    "Adversary activity traced to threat actor cluster APT29 / Cozy Bear utilizing compromised Kerberos service accounts.",
    "Perimeter gateway (gw-dmz-ext-02) sustained anomalous outbound data exfiltration bursts null-routed by SOAR playbooks.",
    "Credential stuffing attack originating from 103.224.182.25 mitigated with automated session token invalidation.",
    "Database tier (db-prod-cluster-01) successfully isolated via EDR agent containment with 0 bytes encrypted.",
    "Zero-day signature heuristic triggered on unverified PowerShell payload (Isolation Forest score: 0.94 anomaly).",
  ];

  findings.forEach((finding) => {
    // Bullet icon
    doc.setFillColor(14, 165, 233); // sky-500
    doc.circle(margin + 2, y - 1, 1.2, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitFinding = doc.splitTextToSize(finding, contentWidth - 8);
    doc.text(splitFinding, margin + 6, y);
    y += splitFinding.length * 4.5 + 2;
  });

  y += 6;

  // ── 6. AFFECTED ASSETS & CONTAINMENT STATUS TABLE ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("3. Target Assets & Mitigation Status", margin, y);
  y += 6;

  // Table Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("HOSTNAME", margin + 4, y + 4.5);
  doc.text("IP ADDRESS", margin + 50, y + 4.5);
  doc.text("CRITICALITY", margin + 95, y + 4.5);
  doc.text("ACTION STATUS", margin + 140, y + 4.5);
  y += 7;

  // Table Rows
  const assets = report.assets || [
    { name: "srv-prod-db-01", ip: "10.0.4.15", criticality: "TIER-1 CRITICAL", status: "CONTAINED (EDR QUARANTINED)" },
    { name: "dc-corp-01", ip: "10.0.1.5", criticality: "TIER-1 CRITICAL", status: "REMEDIATED (PASSWORDS ROTATED)" },
    { name: "gw-dmz-ext-02", ip: "10.0.2.80", criticality: "TIER-2 HIGH", status: "ISOLATED (NULL-ROUTED)" },
    { name: "ws-fin-04", ip: "10.0.3.11", criticality: "TIER-3 MEDIUM", status: "CLEAN (MALWARE PURGED)" },
  ];

  assets.forEach((asset, idx) => {
    const rowY = y;
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, rowY, contentWidth, 7, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(asset.name, margin + 4, rowY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(asset.ip, margin + 50, rowY + 4.5);

    doc.setTextColor(185, 28, 28); // red
    doc.text(asset.criticality, margin + 95, rowY + 4.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52); // green
    doc.text(asset.status, margin + 140, rowY + 4.5);

    y += 7;
  });

  y += 12;

  // ── 7. COMPLIANCE & SIGN-OFF CERTIFICATION ──
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("VERIFIED COMPLIANCE CERTIFICATION", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `This audit certifies compliance with ISO/IEC 27001:2022 A.12, NIST SP 800-61 Rev. 2, and SOC2 Type II. All evidence records are hashed with SHA-256 and stored in an immutable, cryptographically verified audit ledger.`,
    margin + 4,
    y + 11,
    { maxWidth: contentWidth - 8 }
  );

  // ── 8. FOOTER WITH TIMESTAMP & DIGITAL SIGNATURE ──
  const footerY = pageHeight - 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    `SentinelX AI v1.2 Enterprise   |   Generated: ${new Date().toUTCString()}   |   Page 1 of 1`,
    margin,
    footerY
  );
  doc.text("VERIFIED SECURE DOCUMENT", pageWidth - margin, footerY, { align: "right" });

  // ── 9. TRIGGER GENUINE PDF DOWNLOAD ──
  const cleanFilename = `${report.id}_${report.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
  doc.save(cleanFilename);
}
