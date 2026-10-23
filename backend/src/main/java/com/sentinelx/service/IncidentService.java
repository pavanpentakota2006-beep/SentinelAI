package com.sentinelx.service;

import com.sentinelx.dto.IncidentStatusUpdateDto;
import com.sentinelx.model.Incident;
import com.sentinelx.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<Incident> getAllIncidents(UUID orgId) {
        return incidentRepository.findByOrganizationIdOrderByLastSeenAtDesc(orgId);
    }

    public Optional<Incident> getIncidentById(UUID id) {
        return incidentRepository.findById(id);
    }

    public Optional<Incident> getIncidentByPublicId(UUID orgId, String publicId) {
        return incidentRepository.findByOrganizationIdAndPublicId(orgId, publicId);
    }

    @Transactional
    public Incident updateIncidentStatus(UUID id, IncidentStatusUpdateDto dto) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found: " + id));

        incident.setStatus(dto.getStatus().toUpperCase());
        if ("CONTAINED".equalsIgnoreCase(dto.getStatus()) || "CLOSED".equalsIgnoreCase(dto.getStatus())) {
            incident.setClosedAt(Instant.now());
        }
        incident.setUpdatedAt(Instant.now());
        return incidentRepository.save(incident);
    }

    @Transactional
    public Incident createIncident(Incident incident) {
        return incidentRepository.save(incident);
    }
}
