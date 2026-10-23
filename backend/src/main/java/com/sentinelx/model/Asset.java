package com.sentinelx.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(nullable = false, length = 255)
    private String hostname;

    @Column(name = "asset_type", nullable = false, length = 40)
    private String assetType;

    @Column(nullable = false)
    private short criticality;

    @Column(nullable = false, length = 30)
    private String environment = "production";

    @Column(name = "ip_address", columnDefinition = "inet")
    private String ipAddress;

    @Column(name = "last_seen_at")
    private Instant lastSeenAt;

    @Column(name = "is_synthetic", nullable = false)
    private boolean synthetic = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Asset() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOrganizationId() { return organizationId; }
    public void setOrganizationId(UUID organizationId) { this.organizationId = organizationId; }
    public String getHostname() { return hostname; }
    public void setHostname(String hostname) { this.hostname = hostname; }
    public String getAssetType() { return assetType; }
    public void setAssetType(String assetType) { this.assetType = assetType; }
    public short getCriticality() { return criticality; }
    public void setCriticality(short criticality) { this.criticality = criticality; }
    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public Instant getLastSeenAt() { return lastSeenAt; }
    public void setLastSeenAt(Instant lastSeenAt) { this.lastSeenAt = lastSeenAt; }
    public boolean isSynthetic() { return synthetic; }
    public void setSynthetic(boolean synthetic) { this.synthetic = synthetic; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
