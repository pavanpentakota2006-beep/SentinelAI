package com.sentinelx.service;

import com.sentinelx.dto.MetricsDto;
import com.sentinelx.repository.AlertRepository;
import com.sentinelx.repository.AssetRepository;
import com.sentinelx.repository.IncidentRepository;
import com.sentinelx.repository.SecurityEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class MetricsService {

    private final IncidentRepository incidentRepository;
    private final AlertRepository alertRepository;
    private final AssetRepository assetRepository;
    private final SecurityEventRepository securityEventRepository;

    public MetricsService(IncidentRepository incidentRepository,
                          AlertRepository alertRepository,
                          AssetRepository assetRepository,
                          SecurityEventRepository securityEventRepository) {
        this.incidentRepository = incidentRepository;
        this.alertRepository = alertRepository;
        this.assetRepository = assetRepository;
        this.securityEventRepository = securityEventRepository;
    }

    public MetricsDto getOverviewMetrics(UUID orgId) {
        long activeIncidents = incidentRepository.countByOrganizationIdAndStatusNot(orgId, "CLOSED");
        long openAlerts = alertRepository.countByOrganizationIdAndStatus(orgId, "NEW");
        long monitoredAssets = assetRepository.countByOrganizationId(orgId);
        long eventsLastHour = securityEventRepository.countByOrganizationIdAndOccurredAtAfter(
                orgId, Instant.now().minus(1, ChronoUnit.HOURS));

        // Dynamic System Health calculation: 100 base minus incident penalties
        int health = Math.max(15, 100 - (int)(activeIncidents * 8 + openAlerts * 2));
        int severity = activeIncidents > 5 ? 88 : (activeIncidents > 2 ? 65 : 28);
        String status = health > 80 ? "OPTIMAL" : (health > 50 ? "DEGRADED" : "CRITICAL_DEFENSE");

        return new MetricsDto(
                health,
                severity,
                activeIncidents,
                openAlerts,
                monitoredAssets,
                eventsLastHour,
                status
        );
    }
}
