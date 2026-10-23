package com.sentinelx.controller;

import com.sentinelx.dto.ApiResponse;
import com.sentinelx.dto.IncidentStatusUpdateDto;
import com.sentinelx.model.Incident;
import com.sentinelx.service.IncidentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/incidents")
@Tag(name = "Incidents", description = "SOC Incident Management & Triage APIs")
public class IncidentController {

    // Default primary org UUID for demonstration mode
    public static final UUID DEFAULT_ORG_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    @Operation(summary = "Retrieve all active and archived security incidents")
    public ApiResponse<List<Incident>> getIncidents(
            @RequestParam(required = false) UUID organizationId) {
        UUID org = organizationId != null ? organizationId : DEFAULT_ORG_ID;
        return ApiResponse.ok(incidentService.getAllIncidents(org));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retrieve a specific incident by internal UUID")
    public ResponseEntity<ApiResponse<Incident>> getIncidentById(@PathVariable UUID id) {
        return incidentService.getIncidentById(id)
                .map(i -> ResponseEntity.ok(ApiResponse.ok(i)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update incident triage status or initiate containment")
    public ApiResponse<Incident> updateIncidentStatus(
            @PathVariable UUID id,
            @Valid @RequestBody IncidentStatusUpdateDto dto) {
        return ApiResponse.ok("Incident status updated successfully", incidentService.updateIncidentStatus(id, dto));
    }
}
