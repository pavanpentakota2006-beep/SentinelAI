/**
 * SentinelX AI - Enterprise REST & SSE Client
 * Connects frontend state to Spring Boot 3 backend with resilient offline fallback to local simulator.
 */

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:8080/api/v1";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface BackendMetrics {
  systemHealthIndex: number;
  threatSeverityLevel: number;
  activeIncidentsCount: number;
  openAlertsCount: number;
  monitoredAssetsCount: number;
  eventsLastHour: number;
  systemStatus: string;
}

export const api = {
  async getMetrics(): Promise<BackendMetrics | null> {
    try {
      const res = await fetch(`${API_BASE}/metrics/overview`, {
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) return null;
      const json: ApiResponse<BackendMetrics> = await res.json();
      return json.data;
    } catch {
      return null; // Fallback to simulated local metrics
    }
  },

  async getIncidents(): Promise<any[] | null> {
    try {
      const res = await fetch(`${API_BASE}/incidents`, {
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  },

  async updateIncidentStatus(id: string, status: string, comment?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/incidents/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comment })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getAlerts(): Promise<any[] | null> {
    try {
      const res = await fetch(`${API_BASE}/alerts`, {
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  },

  async checkHealth(): Promise<{ status: string; engine: string } | null> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};
