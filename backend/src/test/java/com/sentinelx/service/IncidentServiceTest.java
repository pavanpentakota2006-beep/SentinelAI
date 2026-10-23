package com.sentinelx.service;

import com.sentinelx.dto.IncidentStatusUpdateDto;
import com.sentinelx.model.Incident;
import com.sentinelx.repository.IncidentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock
    private IncidentRepository incidentRepository;

    private IncidentService incidentService;

    @BeforeEach
    void setUp() {
        incidentService = new IncidentService(incidentRepository);
    }

    @Test
    void testUpdateIncidentStatusToContainedSetsClosedAt() {
        UUID id = UUID.randomUUID();
        Incident incident = new Incident();
        incident.setId(id);
        incident.setStatus("INVESTIGATING");
        incident.setPublicId("INC-2026-TEST");
        incident.setSeverity("HIGH");
        incident.setConfidence(BigDecimal.valueOf(0.95));

        when(incidentRepository.findById(id)).thenReturn(Optional.of(incident));
        when(incidentRepository.save(any(Incident.class))).thenAnswer(invocation -> invocation.getArgument(0));

        IncidentStatusUpdateDto dto = new IncidentStatusUpdateDto("CONTAINED", "Host quarantined from network");
        Incident updated = incidentService.updateIncidentStatus(id, dto);

        assertNotNull(updated);
        assertEquals("CONTAINED", updated.getStatus());
        assertNotNull(updated.getClosedAt(), "Closed timestamp must be set upon containment");
        verify(incidentRepository, times(1)).save(incident);
    }

    @Test
    void testGetIncidentByIdNotFound() {
        UUID id = UUID.randomUUID();
        when(incidentRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Incident> result = incidentService.getIncidentById(id);
        assertTrue(result.isEmpty());
    }
}
