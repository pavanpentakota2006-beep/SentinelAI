package com.sentinelx.controller;

import com.sentinelx.model.SecurityEvent;
import com.sentinelx.service.SecurityEventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class SecurityEventControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SecurityEventService securityEventService;

    @BeforeEach
    void setUp() {
        SecurityEventController controller = new SecurityEventController(securityEventService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testGetRecentEventsReturns200AndJsonEnvelope() throws Exception {
        SecurityEvent event = new SecurityEvent();
        event.setId(UUID.randomUUID());
        event.setEventType("AUTH_FAILURE");
        event.setSeverity("HIGH");
        event.setOccurredAt(Instant.now());
        event.setMessage("Repeated Kerberos pre-auth failure");

        when(securityEventService.getRecentEvents(any())).thenReturn(List.of(event));

        mockMvc.perform(get("/api/v1/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].eventType").value("AUTH_FAILURE"))
                .andExpect(jsonPath("$.data[0].severity").value("HIGH"));
    }

    @Test
    void testIngestEventReturns200() throws Exception {
        SecurityEvent event = new SecurityEvent();
        event.setId(UUID.randomUUID());
        event.setEventType("PROCESS_START");
        event.setSeverity("CRITICAL");
        event.setMessage("powershell.exe -enc recon");

        when(securityEventService.ingestEvent(any(SecurityEvent.class))).thenReturn(event);

        mockMvc.perform(post("/api/v1/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "eventType": "PROCESS_START",
                            "severity": "CRITICAL",
                            "message": "powershell.exe -enc recon"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.eventType").value("PROCESS_START"));
    }

    @Test
    void testStreamEventsReturnsSseEmitter() throws Exception {
        when(securityEventService.subscribeToEventStream()).thenReturn(new SseEmitter(10_000L));

        mockMvc.perform(get("/api/v1/events/stream"))
                .andExpect(status().isOk());
    }
}
