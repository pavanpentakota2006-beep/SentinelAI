package com.sentinelx.controller;

import com.sentinelx.dto.ApiResponse;
import com.sentinelx.model.Alert;
import com.sentinelx.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/alerts")
@Tag(name = "Alerts", description = "Detection Alerts & Interceptor Feeds")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    @Operation(summary = "List all detection alerts")
    public ApiResponse<List<Alert>> getAlerts(
            @RequestParam(required = false) UUID organizationId) {
        UUID org = organizationId != null ? organizationId : IncidentController.DEFAULT_ORG_ID;
        return ApiResponse.ok(alertService.getAllAlerts(org));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get alert details by UUID")
    public ResponseEntity<ApiResponse<Alert>> getAlertById(@PathVariable UUID id) {
        return alertService.getAlertById(id)
                .map(a -> ResponseEntity.ok(ApiResponse.ok(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/acknowledge")
    @Operation(summary = "Acknowledge an alert to assign analyst review")
    public ApiResponse<Alert> acknowledgeAlert(@PathVariable UUID id) {
        return ApiResponse.ok("Alert acknowledged", alertService.updateAlertStatus(id, "ACKNOWLEDGED"));
    }

    @PatchMapping("/{id}/quarantine")
    @Operation(summary = "Initiate emergency quarantine for alert target")
    public ApiResponse<Alert> quarantineAlert(@PathVariable UUID id) {
        return ApiResponse.ok("Quarantine command executed", alertService.updateAlertStatus(id, "INVESTIGATING"));
    }
}
