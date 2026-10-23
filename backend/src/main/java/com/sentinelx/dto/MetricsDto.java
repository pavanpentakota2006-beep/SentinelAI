package com.sentinelx.dto;

public class MetricsDto {
    private int systemHealthIndex;
    private int threatSeverityLevel;
    private long activeIncidentsCount;
    private long openAlertsCount;
    private long monitoredAssetsCount;
    private long eventsLastHour;
    private String systemStatus;

    public MetricsDto() {}

    public MetricsDto(int systemHealthIndex, int threatSeverityLevel, long activeIncidentsCount,
                      long openAlertsCount, long monitoredAssetsCount, long eventsLastHour, String systemStatus) {
        this.systemHealthIndex = systemHealthIndex;
        this.threatSeverityLevel = threatSeverityLevel;
        this.activeIncidentsCount = activeIncidentsCount;
        this.openAlertsCount = openAlertsCount;
        this.monitoredAssetsCount = monitoredAssetsCount;
        this.eventsLastHour = eventsLastHour;
        this.systemStatus = systemStatus;
    }

    public int getSystemHealthIndex() { return systemHealthIndex; }
    public void setSystemHealthIndex(int systemHealthIndex) { this.systemHealthIndex = systemHealthIndex; }
    public int getThreatSeverityLevel() { return threatSeverityLevel; }
    public void setThreatSeverityLevel(int threatSeverityLevel) { this.threatSeverityLevel = threatSeverityLevel; }
    public long getActiveIncidentsCount() { return activeIncidentsCount; }
    public void setActiveIncidentsCount(long activeIncidentsCount) { this.activeIncidentsCount = activeIncidentsCount; }
    public long getOpenAlertsCount() { return openAlertsCount; }
    public void setOpenAlertsCount(long openAlertsCount) { this.openAlertsCount = openAlertsCount; }
    public long getMonitoredAssetsCount() { return monitoredAssetsCount; }
    public void setMonitoredAssetsCount(long monitoredAssetsCount) { this.monitoredAssetsCount = monitoredAssetsCount; }
    public long getEventsLastHour() { return eventsLastHour; }
    public void setEventsLastHour(long eventsLastHour) { this.eventsLastHour = eventsLastHour; }
    public String getSystemStatus() { return systemStatus; }
    public void setSystemStatus(String systemStatus) { this.systemStatus = systemStatus; }
}
