import React, { createContext, useContext, useEffect, useState } from "react";
import {
  INITIAL_ALERTS,
  INITIAL_EVENTS,
  INITIAL_INCIDENTS,
  AUDIT_LOGS,
  ASSETS_LIST,
  IDENTITIES_LIST,
  DETECTION_RULES,
  RESPONSE_PLAYBOOKS,
  CASES_LIST,
  THREAT_INTEL_IOCS,
  HOURLY_METRICS,
  type SecurityAlert,
  type SecurityEvent,
  type Incident,
  type AuditRecord,
  type ResponsePlaybook,
  type Severity,
} from "@/data/mockData";

interface StoreContextType {
  isSimulatorRunning: boolean;
  toggleSimulator: () => void;
  events: SecurityEvent[];
  alerts: SecurityAlert[];
  incidents: Incident[];
  auditLogs: AuditRecord[];
  playbooks: ResponsePlaybook[];
  kpiStats: {
    totalEvents: number;
    criticalAlerts: number;
    activeIncidents: number;
    mttd: string;
    mttr: string;
  };
  hourlyMetrics: typeof HOURLY_METRICS;
  updateAlertStatus: (alertId: string, status: SecurityAlert["status"]) => void;
  updateIncidentStatus: (incidentId: string, status: Incident["status"]) => void;
  triggerPlaybook: (playbookId: string, target?: string) => Promise<boolean>;
  lastSimulatedEvent: SecurityEvent | null;
}

const StoreContext = createContext<StoreContextType | null>(null);

const SIMULATED_TEMPLATES: Array<Omit<SecurityEvent, "id" | "timestamp" | "dedupeHash">> = [
  {
    eventType: "AUTH_FAILURE",
    severity: "medium",
    srcIp: "194.26.29.112",
    dstIp: "10.0.1.5",
    asset: "vpn-edge",
    user: "alex.mercer",
    message: "Repeated authentication failure: Kerberos pre-auth invalid password",
    raw: { protocol: "UDP/88", failure_code: "PREAUTH_FAILED", attempt: 19 },
    isSynthetic: true,
  },
  {
    eventType: "PROCESS_START",
    severity: "critical",
    srcIp: "10.0.4.15",
    dstIp: "10.0.4.15",
    asset: "db-core-02",
    user: "NT AUTHORITY\\SYSTEM",
    message: "powershell.exe -enc JAB3AGgAbwBhAG0AaQA= (Base64 encoded recon command)",
    raw: { pid: 9102, parent: "cmd.exe", decoded: "$whoami; Get-Process" },
    isSynthetic: true,
  },
  {
    eventType: "NET_CONN",
    severity: "high",
    srcIp: "10.0.2.80",
    dstIp: "198.51.100.44",
    asset: "web-gw-01",
    user: "www-data",
    message: "HTTPS C2 outbound connection callback to updates-cdn-auth.com:443",
    raw: { bytes_transferred: 4096, duration_s: 0.2, c2_type: "Cobalt Strike" },
    isSynthetic: true,
  },
  {
    eventType: "DNS_QUERY",
    severity: "low",
    srcIp: "10.0.3.11",
    dstIp: "10.0.0.2",
    asset: "ws-dev-04",
    user: "marcus.vance",
    message: "Standard corporate DNS resolution for github.com",
    raw: { query_type: "A", domain: "github.com", response_code: "NOERROR" },
    isSynthetic: true,
  },
  {
    eventType: "DATA_EXFIL",
    severity: "critical",
    srcIp: "10.0.4.15",
    dstIp: "185.220.101.5",
    asset: "db-core-02",
    user: "svc_backup",
    message: "Chunked transfer stream detected to bulletproof storage server",
    raw: { chunk_id: 42, chunk_size_mb: 250, total_stream_gb: 8.65 },
    isSynthetic: true,
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isSimulatorRunning, setIsSimulatorRunning] = useState<boolean>(true);
  const [events, setEvents] = useState<SecurityEvent[]>(INITIAL_EVENTS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(AUDIT_LOGS);
  const [playbooks, setPlaybooks] = useState<ResponsePlaybook[]>(RESPONSE_PLAYBOOKS);
  const [hourlyMetrics, setHourlyMetrics] = useState(HOURLY_METRICS);
  const [lastSimulatedEvent, setLastSimulatedEvent] = useState<SecurityEvent | null>(null);

  // Real-time Event Streaming (SSE with Intelligent Fallback)
  useEffect(() => {
    if (!isSimulatorRunning) return;

    let sseActive = false;
    let eventSource: EventSource | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;

    const pushTelemetry = (template: (typeof SIMULATED_TEMPLATES)[0], timeStr: string, id: string) => {
      const newEvent: SecurityEvent = {
        ...template,
        id,
        timestamp: timeStr,
        dedupeHash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 199)]);
      setLastSimulatedEvent(newEvent);

      // Randomly escalate critical events to alerts
      if (template.severity === "critical" && Math.random() > 0.4) {
        const alertId = `ALT-${Math.floor(1050 + Math.random() * 100)}`;
        const newAlert: SecurityAlert = {
          id: alertId,
          title: `Automated Detection: ${template.message.substring(0, 50)}...`,
          ruleName: template.eventType === "DATA_EXFIL" ? "Outbound Spike Threshold" : "Process Threat Detector",
          mitreTechnique: template.eventType === "DATA_EXFIL" ? "T1567.002" : "T1059.001",
          mitreTactic: template.eventType === "DATA_EXFIL" ? "Exfiltration" : "Execution",
          severity: template.severity,
          confidence: Math.floor(85 + Math.random() * 14),
          riskScore: Math.floor(80 + Math.random() * 18),
          asset: template.asset,
          user: template.user,
          timestamp: timeStr.substring(0, 16),
          status: "open",
          evidenceCount: Math.floor(4 + Math.random() * 8),
          incidentId: "INC-001",
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }

      // Update hourly metric graph live
      setHourlyMetrics((prev) => {
        const last = { ...prev[prev.length - 1] };
        last.events += 1;
        return [...prev.slice(0, prev.length - 1), last];
      });
    };

    const startLocalFallback = () => {
      if (fallbackInterval) return;
      fallbackInterval = setInterval(() => {
        const template = SIMULATED_TEMPLATES[Math.floor(Math.random() * SIMULATED_TEMPLATES.length)];
        const now = new Date();
        const timeStr = now.toISOString().replace("T", " ").substring(0, 19);
        const newId = `EVT-${Math.floor(8950 + Math.random() * 1000)}`;
        pushTelemetry(template, timeStr, newId);
      }, 3200);
    };

    if (typeof window !== "undefined" && "EventSource" in window) {
      try {
        eventSource = new EventSource("/api/v1/events/stream");

        eventSource.addEventListener("SECURITY_EVENT", (e) => {
          sseActive = true;
          if (fallbackInterval) {
            clearInterval(fallbackInterval);
            fallbackInterval = null;
          }
          try {
            const raw = JSON.parse(e.data);
            const template: (typeof SIMULATED_TEMPLATES)[0] = {
              eventType: raw.eventType || "NET_CONN",
              severity: raw.severity || "medium",
              srcIp: raw.srcIp || "10.0.1.20",
              dstIp: raw.dstIp || "10.0.2.50",
              asset: "srv-core",
              user: "system",
              message: raw.message || "Live SSE Security Telemetry Ingested",
              raw: raw,
              isSynthetic: raw.synthetic ?? true,
            };
            const timeStr = raw.occurredAt
              ? new Date(raw.occurredAt).toISOString().replace("T", " ").substring(0, 19)
              : new Date().toISOString().replace("T", " ").substring(0, 19);
            pushTelemetry(template, timeStr, `EVT-${raw.id ? raw.id.toString().substring(0, 8) : Date.now()}`);
          } catch {
            // Fallback gracefully on parsing anomaly
          }
        });

        eventSource.onerror = () => {
          if (!sseActive) {
            startLocalFallback();
          }
        };
      } catch {
        startLocalFallback();
      }
    } else {
      startLocalFallback();
    }

    const initialTimer = setTimeout(() => {
      if (!sseActive) {
        startLocalFallback();
      }
    }, 1500);

    return () => {
      clearTimeout(initialTimer);
      if (fallbackInterval) clearInterval(fallbackInterval);
      if (eventSource) eventSource.close();
    };
  }, [isSimulatorRunning]);

  const toggleSimulator = () => {
    setIsSimulatorRunning((prev) => !prev);
  };

  const updateAlertStatus = (alertId: string, status: SecurityAlert["status"]) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status } : a)),
    );
    // Add audit log entry
    const newLog: AuditRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "admin_sec",
      role: "ADMINISTRATOR",
      action: "ALERT_STATUS_UPDATE",
      target: `${alertId} -> ${status.toUpperCase()}`,
      ipAddress: "10.0.1.50",
      status: "SUCCESS",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateIncidentStatus = (incidentId: string, status: Incident["status"]) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) } : inc)),
    );
    const newLog: AuditRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "admin_sec",
      role: "ADMINISTRATOR",
      action: "INCIDENT_STATUS_CHANGE",
      target: `${incidentId} -> ${status.toUpperCase()}`,
      ipAddress: "10.0.1.50",
      status: "SUCCESS",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const triggerPlaybook = async (playbookId: string, target: string = "All Affected Assets"): Promise<boolean> => {
    setPlaybooks((prev) =>
      prev.map((pb) =>
        pb.id === playbookId
          ? {
              ...pb,
              lastRun: "Just now",
              executionsCount: pb.executionsCount + 1,
            }
          : pb,
      ),
    );
    const newLog: AuditRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "admin_sec",
      role: "ADMINISTRATOR",
      action: "PLAYBOOK_TRIGGER",
      target: `${playbookId}: ${target}`,
      ipAddress: "10.0.1.50",
      status: "SUCCESS",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    return true;
  };

  const kpiStats = {
    totalEvents: 12480 + events.length,
    criticalAlerts: alerts.filter((a) => a.severity === "critical" || a.severity === "high").length,
    activeIncidents: incidents.filter((i) => i.status !== "resolved").length,
    mttd: "4.2 min",
    mttr: "24 min",
  };

  return (
    <StoreContext.Provider
      value={{
        isSimulatorRunning,
        toggleSimulator,
        events,
        alerts,
        incidents,
        auditLogs,
        playbooks,
        kpiStats,
        hourlyMetrics,
        updateAlertStatus,
        updateIncidentStatus,
        triggerPlaybook,
        lastSimulatedEvent,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
