package com.sentinelx.repository;

import com.sentinelx.model.SecurityEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface SecurityEventRepository extends JpaRepository<SecurityEvent, UUID> {
    Page<SecurityEvent> findByOrganizationIdOrderByOccurredAtDesc(UUID organizationId, Pageable pageable);
    List<SecurityEvent> findTop20ByOrganizationIdOrderByOccurredAtDesc(UUID organizationId);
    long countByOrganizationIdAndOccurredAtAfter(UUID organizationId, Instant after);
    long countByOrganizationId(UUID organizationId);
}
