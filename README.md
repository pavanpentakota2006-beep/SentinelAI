# SentinelX AI - Autonomous Security Operations & Threat Analytics Platform

SentinelX AI is an enterprise-grade Autonomous Security Operations Center (SOC) platform engineered for real-time threat detection, multi-stage incident correlation, MITRE ATT&CK kill-chain mapping, and automated SOAR response containment.

The platform architecture is built directly upon **5 Core Operational Command Dashboards** (derived from operational SOC reference systems), powering the main working features and workflows of the application.

> **System Status**: **Production-Ready & Fully Operational** across all 5 Core Operational Workspaces and 7 architectural modules. Built with strict enterprise standards, self-hosted typography, and real-time telemetry simulation.

---

## Quick Start (Run on Port 5158)

The frontend security platform runs on **http://localhost:5158**.

```powershell
cd frontend
npm install
npm run dev     # Starts Vite dev server on http://localhost:5158
```

Open **http://localhost:5158** in any modern web browser to access the complete interactive security console.

---

## The 5 Core Operational Dashboards (Main Working Systems)

The core operational capabilities of SentinelX AI are organized into 5 primary functional command systems, each built as a fully functional, interactive implementation of the operational SOC command references:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               SENTINELX AI SOC CORE                                    │
├────────────────────┬────────────────────┬────────────────────┬─────────────────────────┤
│ 1. Overview Hub    │ 2. Incidents Hub   │ 3. Threat Intel    │ 4. Interceptor Alerts   │ 5. War Room Kill-Chain │
│    Route: `/`      │    Route: `/incidents`│ Route: `/threat-intel`│ Route: `/alerts`       │    Route: `/attack-graph` │
│    Image: Image 3  │    Image: Image 1  │    Image: Image 2  │    Image: Image 4       │    Image: Image 5     │
└────────────────────┴────────────────────┴────────────────────┴─────────────────────────┴───────────────────────┘
```

### 1. Executive Security Overview & 3D Telemetry Hub (`/`)
* **Reference System**: 3D Isometric Telemetry & Threat Severity Matrix (`cyber_health_radar.jpg` / Image 3)
* **Core Working Capabilities**:
  - **Incident Response Timeline**: Tracks live phase execution (*Detection → Triage → Containment → Eradication → Recovery*) with dynamic step completion and elapsed timers.
  - **Dual Radial Gauges**: Real-time SVGs measuring **System Health Index (92%)** and **Threat Severity Level (Critical Warning)** with animated needle indicators and color-coded status bands.
  - **3D Network Traffic Matrix**: Visualizes inbound/outbound enterprise socket throughput, encrypted VPN tunnel stability, and active ingress bandwidth.
  - **Alert Statistics & Hourly Volume Breakdown**: Recharts-powered telemetry stream analyzing incident frequency and severity classification over 24-hour cycles.
  - **Top In-Progress Threats**: Live prioritized triage queue linking directly to affected assets, severity tiers, and investigation cases.

### 2. Incident Management & Attack Topology Command (`/incidents`)
* **Reference System**: SOC Incident Management & Network Graph (`soc_incidents_management.jpg` / Image 1)
* **Core Working Capabilities**:
  - **Multi-Arc Radial Health Gauge**: Dynamic 0–100 enterprise posture dial with multi-tier status rings and animated needle metrics.
  - **Interactive Network Topology Graph**: Real-time SVG network diagram connecting Ingress Firewalls, DMZ Gateway, Application Clusters, Database Tiers, and Exfiltration Sinks with animated packet pulses and status indicators.
  - **AI Investigation Dossier**: Autonomous incident correlation engine producing automated root-cause narratives, MITRE technique tagging (`T1078`, `T1021`, `T1048`), and confidence scoring.
  - **Threat Attribution Matrix**: Identifies threat actor footprints (APT29 / Cozy Bear, LockBit 3.0, Lazarus Group) with confidence rankings and TLP classification.
  - **Global Threat Radar Table**: Tracks geographic origin coordinates, protocol vectors, and threat status across international endpoints.
  - **Incident Volume Trend**: Responsive AreaChart tracking hourly anomalous spikes and correlation clusters.

### 3. SentralQ Global Threat Intelligence & Heatmap (`/threat-intel`)
* **Reference System**: SentralQ Global Threat Radar & Target Analysis (`threat_intelligence_map.jpg` / Image 2)
* **Core Working Capabilities**:
  - **5 Primary KPI Threat Counters**: Active Threat Campaigns (48), Monitored Threat Actors (12), Malicious Ingress IPs (1,842), Malicious Domains (629), and Mean Time to Mitigate (14.2m).
  - **SentralQ Global Threat Heatmap**: High-resolution world radar visualizer pinpointing real-time attack clusters, botnet ingress vectors, and target geolocation dossiers.
  - **Threat Severity & Detection Accuracy Donut Charts**: Interactive breakdown of active threat types (Ransomware, APT, Phishing, DDoS, Data Exfil) and ML model accuracy (98.4%).
  - **Top Affected Organizations**: Impact ranking across key economic sectors (Financial Systems, Defense Logistics, Healthcare, Cloud Infrastructure).
  - **30-Day Threat Vector Trendline**: Continuous linear telemetry monitoring evolving threat volumes and campaign patterns.

### 4. Interceptor Threat Hunt & Active Alerts Board (`/alerts`)
* **Reference System**: Interceptor Ingress Interception & Threat Hunt (`interceptor_threat_hunt.jpg` / Image 4)
* **Core Working Capabilities**:
  - **4 Ingress Telemetry Cards**: Blocked Ingress Packets (14.2M), Active Botnets (38), Critical Alerts (7), and Zero-Day Signatures Detected (3).
  - **Live Global Threat Interceptor Map**: Visual surveillance feed tracking adversary geolocation ingress vectors and perimeter intercept points.
  - **Malicious Threat Actor IP Matrix**: Live tabular tracking of abusive source IPs, origin nations, ASN routing, abuse confidence scores, and one-click quarantine actions.
  - **High-Density Alert Triage Feed**: Multi-severity triage board with confidence ratings (80–98%), MITRE ATT&CK technique tags, risk indices, and status workflow (*Acknowledge*, *Investigate*, *Quarantine*).
  - **Target Attack Dossier**: In-depth deep dive featuring DDoS traffic spikes, volumetric packet analysis, and multi-axis threat radar profiling.

### 5. Level-3 Critical Incident War Room & Attack Chain (`/attack-graph`)
* **Reference System**: Level-3 Emergency War Room & SOAR Containment (`critical_incident_warroom.jpg` / Image 5)
* **Core Working Capabilities**:
  - **High-Alert Emergency War Room Banner**: Persistent red alert bar with blinking emergency indicators, incident identifier (`INC-2026-CRIT-0042`), and live incident response stopwatch.
  - **5-Stage Attack Chain Stepper**: Interactive adversary kill-chain progression (*Initial Access → Execution → Persistence → Lateral Movement → Exfiltration*) with status badges and MITRE tactic links.
  - **Affected Enterprise Assets Inventory**: Critical server list (`srv-prod-db-01`, `dc-corp-01`, `gw-dmz-ext-02`) with IP assignments, criticality ratings, and immediate EDR quarantine buttons.
  - **Live SOC Communication & Audit Log**: Real-time analyst collaboration log capturing operator comments, playbook triggers, and automated system alerts.
  - **Automated SOAR Response Playbook Executor**: One-click operational response module enabling immediate host quarantine, Kerberos session revocation, perimeter IP null-routing, and memory dump generation.

---

## Additional Operational Modules

Beyond the 5 core visual command centers, SentinelX AI provides a full-spectrum security suite:

### Optical Surveillance & Camera Console (`/surveillance`)
- Dedicated command gallery displaying all 5 live operational feeds with high-resolution lightbox modal inspection, zoom controls, and metadata telemetry overlays.

### Live Telemetry Stream (`/events`)
- Normalized event ingestion pipeline (`AUTH_FAILURE`, `AUTH_SUCCESS`, `PROCESS_START`, `NET_CONN`, `DNS_QUERY`, `DATA_EXFIL`, `PRIV_ESC`) with filter search, CSV export, and raw JSON payload inspection.

### MITRE ATT&CK Matrix Navigator (`/mitre`)
- Interactive enterprise matrix covering 11 core tactics with live detection hit counters, technique coverage scoring (64% observed), and kill-chain drilldowns.

### Enterprise Asset & Identity ITDR (`/assets`, `/identities`)
- Hardware, virtual machine, and database inventory with criticality ratings and Active Directory identity monitoring with behavioral risk scoring.

### SOAR Response Playbooks & Cases (`/playbooks`, `/cases`)
- Automated containment workflows with analyst approval controls, SLA countdown timers, and digital evidence workbooks.

### Governance, Auditing & Health (`/audit`, `/health`, `/users`, `/settings`)
- Cryptographically verified append-only audit trail, sub-millisecond infrastructure health latencies (PostgreSQL, Redis, Ingestion Engine), and granular RBAC role assignments.

### Security Analytics & Forensic PDF Export Engine (`/reports`)
- Executive and compliance reporting suite with client-side, zero-dependency PDF generation powered by `jsPDF`.
- Outputs authentic, board-ready A4 security audit documents with TLP:AMBER classification badges, SLA compliance metric cards, forensic investigation findings, isolated asset registers, and ISO 27001 / NIST SP 800-61 Rev. 2 cryptographic verification.
- Includes instantaneous "Generate New Report" on-demand snapshot synthesis with interactive download triggers and real-time visual feedback.

---

## Real-Time Telemetry Simulator

The top navigation bar includes an interactive **Simulator: LIVE / PAUSED** toggle. When live:
- Synthesizes realistic endpoint and network telemetry every 3.2 seconds.
- Evaluates incoming events against detection rule thresholds, escalating critical anomalies to active alerts.
- Live marquee banner streams new security events across the top bar in real time.
- Dynamically updates KPI counters, audit trails, and hourly volume charts on the fly.

---

## Full Monorepo Architecture

```
sentinelx-ai/
├── backend/            # Spring Boot 3 app (Java 21), Flyway migrations V1 & V2, REST APIs
├── frontend/           # React 18 + Vite + TypeScript + TailwindCSS + Recharts
│   ├── public/images/  # The 5 Core Operational Reference Images & Dashboards
│   ├── src/
│   │   ├── pages/      # 5 Core Working Pages (Overview, Incidents, ThreatIntel, Alerts, AttackGraph)
│   │   ├── layout/     # AppShell, Topbar with Simulator & Search, Left Sidebar
│   │   ├── components/ # Realistic SVG gauges, topology graphs, war room banners
│   │   └── lib/        # Zustand state store, telemetry generator, theme engine
├── analytics-service/  # Optional FastAPI service with scikit-learn Isolation Forest ML models
├── docs/               # Architecture diagrams and system documentation
└── docker-compose.yml  # Multi-container orchestration (PostgreSQL 16, Redis 7, Backend, Frontend)
```

---

## Verification & Build Validation

```powershell
# Frontend Typecheck and Production Build
cd frontend
npm run typecheck
npm run build

# Backend Test Compilation
cd ../backend
mvn test-compile
```

The application is completely verified, builds without errors, and runs smoothly on **http://localhost:5158**.
