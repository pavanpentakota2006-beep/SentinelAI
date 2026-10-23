package com.sentinelx.repository;

import com.sentinelx.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssetRepository extends JpaRepository<Asset, UUID> {
    List<Asset> findByOrganizationIdOrderByCriticalityDesc(UUID organizationId);
    long countByOrganizationId(UUID organizationId);
}
