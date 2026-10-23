package com.sentinelx.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "security_events")
public class SecurityEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "asset_id")
    private UUID assetId;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(name = "ingested_at", nullable = false)
    private Instant ingestedAt = Instant.now();

    @Column(name = "event_type", nullable = false, length = 60)
    private String eventType;

    @Column(nullable = false, length = 10)
    private String severity;

    @Column(name = "src_ip", columnDefinition = "inet")
    private String srcIp;

    @Column(name = "dst_ip", columnDefinition = "inet")
    private String dstIp;

    @Column(columnDefinition = "text")
    private String message;

    @Column(name = "raw", columnDefinition = "jsonb")
    private String raw = "{}";

    @Column(name = "dedupe_hash", length = 64)
    private String dedupeHash;

    @Column(name = "is_synthetic", nullable = false)
    private boolean synthetic = false;

    public SecurityEvent() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOrganizationId() { return organizationId; }
    public void setOrganizationId(UUID organizationId) { this.organizationId = organizationId; }
    public UUID getAssetId() { return assetId; }
    public void setAssetId(UUID assetId) { this.assetId = assetId; }
    public Instant getOccurredAt() { return occurredAt; }
    public void setOccurredAt(Instant occurredAt) { this.occurredAt = occurredAt; }
    public Instant getIngestedAt() { return ingestedAt; }
    public void setIngestedAt(Instant ingestedAt) { this.ingestedAt = ingestedAt; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getSrcIp() { return srcIp; }
    public void setSrcIp(String srcIp) { this.srcIp = srcIp; }
    public String getDstIp() { return dstIp; }
    public void setDstIp(String dstIp) { this.dstIp = dstIp; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getRaw() { return raw; }
    public void setRaw(String raw) { this.raw = raw; }
    public String getDedupeHash() { return dedupeHash; }
    public void setDedupeHash(String dedupeHash) { this.dedupeHash = dedupeHash; }
    public boolean isSynthetic() { return synthetic; }
    public void setSynthetic(boolean synthetic) { this.synthetic = synthetic; }
}
