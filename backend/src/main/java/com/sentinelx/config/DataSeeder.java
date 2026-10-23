package com.sentinelx.config;

import com.sentinelx.controller.IncidentController;
import com.sentinelx.model.*;
import com.sentinelx.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final OrganizationRepository orgRepo;
    private final AssetRepository assetRepo;
    private final IncidentRepository incidentRepo;
    private final AlertRepository alertRepo;
    private final SecurityEventRepository eventRepo;

    public DataSeeder(OrganizationRepository orgRepo,
                      AssetRepository assetRepo,
                      IncidentRepository incidentRepo,
                      AlertRepository alertRepo,
                      SecurityEventRepository eventRepo) {
        this.orgRepo = orgRepo;
        this.assetRepo = assetRepo;
        this.incidentRepo = incidentRepo;
        this.alertRepo = alertRepo;
        this.eventRepo = eventRepo;
    }

    @Override
    @Transactional
    public void run(String... args) {
        UUID orgId = IncidentController.DEFAULT_ORG_ID;

        if (orgRepo.findById(orgId).isEmpty()) {
            Organization org = new Organization(orgId, "SentinelX Global SOC", "sentinelx-global");
            orgRepo.save(org);
            log.info("Initialized primary organization: {}", org.getName());
        }

        if (assetRepo.countByOrganizationId(orgId) == 0) {
            Asset dbAsset = new Asset();
            dbAsset.setOrganizationId(orgId);
            dbAsset.setHostname("srv-prod-db-01.corp");
            dbAsset.setAssetType("DATABASE");
            dbAsset.setCriticality((short) 5);
            dbAsset.setEnvironment("production");
            dbAsset.setIpAddress("10.0.12.45");
            dbAsset.setLastSeenAt(Instant.now());
            dbAsset.setSynthetic(true);
            assetRepo.save(dbAsset);

            Asset dcAsset = new Asset();
            dcAsset.setOrganizationId(orgId);
            dcAsset.setHostname("dc-corp-01.corp");
            dcAsset.setAssetType("SERVER");
            dcAsset.setCriticality((short) 5);
            dcAsset.setEnvironment("production");
            dcAsset.setIpAddress("10.0.10.2");
            dcAsset.setLastSeenAt(Instant.now());
            dcAsset.setSynthetic(true);
            assetRepo.save(dcAsset);

            Asset gwAsset = new Asset();
            gwAsset.setOrganizationId(orgId);
            gwAsset.setHostname("gw-dmz-ext-02.corp");
            gwAsset.setAssetType("NETWORK_DEVICE");
            gwAsset.setCriticality((short) 4);
            gwAsset.setEnvironment("production");
            gwAsset.setIpAddress("198.51.100.1");
            gwAsset.setLastSeenAt(Instant.now());
            gwAsset.setSynthetic(true);
            assetRepo.save(gwAsset);
            log.info("Seeded monitored infrastructure assets.");
        }

        if (incidentRepo.count() == 0) {
            Incident inc1 = new Incident();
            inc1.setOrganizationId(orgId);
            inc1.setPublicId("INC-2026-CRIT-0042");
            inc1.setTitle("Multi-stage APT Ransomware Attack Chain with Exfiltration");
            inc1.setCategory("RANSOMWARE");
            inc1.setSeverity("CRITICAL");
            inc1.setStatus("INVESTIGATING");
            inc1.setConfidence(BigDecimal.valueOf(0.985));
            inc1.setRiskScore(BigDecimal.valueOf(98.50));
            inc1.setSummary("High-confidence correlation of adversary initial compromise moving laterally to core database cluster with scheduled exfiltration via encrypted tunnel.");
            inc1.setFirstSeenAt(Instant.now().minus(2, ChronoUnit.HOURS));
            inc1.setLastSeenAt(Instant.now().minus(4, ChronoUnit.MINUTES));
            incidentRepo.save(inc1);

            Incident inc2 = new Incident();
            inc2.setOrganizationId(orgId);
            inc2.setPublicId("INC-2026-HIGH-0109");
            inc2.setTitle("Distributed Credential Stuffing & Kerberoasting Vector");
            inc2.setCategory("CREDENTIAL_ACCESS");
            inc2.setSeverity("HIGH");
            inc2.setStatus("TRIAGED");
            inc2.setConfidence(BigDecimal.valueOf(0.920));
            inc2.setRiskScore(BigDecimal.valueOf(82.00));
            inc2.setSummary("Anomalous Kerberos ticket requests detected across 14 service accounts originating from untrusted subnet.");
            inc2.setFirstSeenAt(Instant.now().minus(5, ChronoUnit.HOURS));
            inc2.setLastSeenAt(Instant.now().minus(18, ChronoUnit.MINUTES));
            incidentRepo.save(inc2);

            log.info("Seeded live security incidents.");
        }

        if (alertRepo.count() == 0) {
            Alert a1 = new Alert();
            a1.setOrganizationId(orgId);
            a1.setTitle("Beaconing to Suspected Cobalt Strike C2 (194.26.29.112)");
            a1.setSeverity("CRITICAL");
            a1.setConfidence(BigDecimal.valueOf(0.970));
            a1.setRiskScore(BigDecimal.valueOf(95.00));
            a1.setStatus("NEW");
            a1.setExplanation("Repetitive outbound TLS connections on non-standard jitter interval matching APT29 signature.");
            a1.setDedupeKey("cobalt-strike-beacon-194.26.29.112");
            alertRepo.save(a1);

            Alert a2 = new Alert();
            a2.setOrganizationId(orgId);
            a2.setTitle("Shadow Copy Deletion Attempt Detected (vssadmin.exe)");
            a2.setSeverity("HIGH");
            a2.setConfidence(BigDecimal.valueOf(0.990));
            a2.setRiskScore(BigDecimal.valueOf(88.00));
            a2.setStatus("NEW");
            a2.setExplanation("Process spawned cmd.exe with arguments 'vssadmin delete shadows /all /quiet'.");
            a2.setDedupeKey("vssadmin-shadow-delete-dc01");
            alertRepo.save(a2);

            log.info("Seeded baseline detection alerts.");
        }
    }
}
