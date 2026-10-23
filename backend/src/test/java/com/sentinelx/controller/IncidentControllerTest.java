package com.sentinelx.controller;

import com.sentinelx.model.Incident;
import com.sentinelx.service.IncidentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class IncidentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private IncidentService incidentService;

    @BeforeEach
    void setUp() {
        IncidentController controller = new IncidentController(incidentService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testGetIncidentsReturns200AndJsonEnvelope() throws Exception {
        Incident incident = new Incident();
        incident.setId(UUID.randomUUID());
        incident.setPublicId("INC-2026-TEST");
        incident.setTitle("Active Ransomware Activity");
        incident.setSeverity("CRITICAL");
        incident.setStatus("INVESTIGATING");
        incident.setRiskScore(BigDecimal.valueOf(98.5));

        when(incidentService.getAllIncidents(any())).thenReturn(List.of(incident));

        mockMvc.perform(get("/api/v1/incidents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].publicId").value("INC-2026-TEST"))
                .andExpect(jsonPath("$.data[0].severity").value("CRITICAL"));
    }

    @Test
    void testGetIncidentByIdFound() throws Exception {
        UUID id = UUID.randomUUID();
        Incident incident = new Incident();
        incident.setId(id);
        incident.setPublicId("INC-2026-0042");
        incident.setTitle("Lateral Movement Detected");

        when(incidentService.getIncidentById(id)).thenReturn(Optional.of(incident));

        mockMvc.perform(get("/api/v1/incidents/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.publicId").value("INC-2026-0042"));
    }
}
