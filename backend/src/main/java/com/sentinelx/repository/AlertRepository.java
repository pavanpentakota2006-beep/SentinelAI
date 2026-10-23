package com.sentinelx.repository;

import com.sentinelx.model.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {
    List<Alert> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
    Page<Alert> findByOrganizationIdAndStatus(UUID organizationId, String status, Pageable pageable);
    long countByOrganizationIdAndStatus(UUID organizationId, String status);
    long countByOrganizationIdAndSeverity(UUID organizationId, String severity);
}
