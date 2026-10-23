package com.sentinelx.service;

import com.sentinelx.model.Alert;
import com.sentinelx.repository.AlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<Alert> getAllAlerts(UUID orgId) {
        return alertRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    public Optional<Alert> getAlertById(UUID id) {
        return alertRepository.findById(id);
    }

    @Transactional
    public Alert updateAlertStatus(UUID id, String status) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found: " + id));
        alert.setStatus(status.toUpperCase());
        alert.setUpdatedAt(Instant.now());
        return alertRepository.save(alert);
    }

    @Transactional
    public Alert createAlert(Alert alert) {
        return alertRepository.save(alert);
    }
}
