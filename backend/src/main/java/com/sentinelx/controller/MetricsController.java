package com.sentinelx.controller;

import com.sentinelx.dto.ApiResponse;
import com.sentinelx.dto.MetricsDto;
import com.sentinelx.service.MetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/metrics")
@Tag(name = "Metrics", description = "SOC Health, Threat Severity, and Ingestion Telemetry")
public class MetricsController {

    private final MetricsService metricsService;

    public MetricsController(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @GetMapping("/overview")
    @Operation(summary = "Get executive SOC posture indicators and radial gauge metrics")
    public ApiResponse<MetricsDto> getOverview(
            @RequestParam(required = false) UUID organizationId) {
        UUID org = organizationId != null ? organizationId : IncidentController.DEFAULT_ORG_ID;
        return ApiResponse.ok(metricsService.getOverviewMetrics(org));
    }
}
