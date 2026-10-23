package com.sentinelx.controller;

import com.sentinelx.dto.ApiResponse;
import com.sentinelx.model.SecurityEvent;
import com.sentinelx.service.SecurityEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@Tag(name = "Events", description = "Raw Telemetry Ingestion & Real-Time Event Streaming")
public class SecurityEventController {

    private final SecurityEventService securityEventService;

    public SecurityEventController(SecurityEventService securityEventService) {
        this.securityEventService = securityEventService;
    }

    @GetMapping
    @Operation(summary = "Get recent ingested security telemetry events")
    public ApiResponse<List<SecurityEvent>> getRecentEvents(
            @RequestParam(required = false) UUID organizationId) {
        UUID org = organizationId != null ? organizationId : IncidentController.DEFAULT_ORG_ID;
        return ApiResponse.ok(securityEventService.getRecentEvents(org));
    }

    @PostMapping
    @Operation(summary = "Ingest a new raw telemetry event")
    public ApiResponse<SecurityEvent> ingestEvent(@RequestBody SecurityEvent event) {
        if (event.getOrganizationId() == null) {
            event.setOrganizationId(IncidentController.DEFAULT_ORG_ID);
        }
        return ApiResponse.ok("Event ingested successfully", securityEventService.ingestEvent(event));
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Subscribe to live Server-Sent Events (SSE) telemetry stream")
    public SseEmitter streamEvents() {
        return securityEventService.subscribeToEventStream();
    }
}
