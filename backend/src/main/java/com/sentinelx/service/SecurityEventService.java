package com.sentinelx.service;

import com.sentinelx.model.SecurityEvent;
import com.sentinelx.repository.SecurityEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.sentinelx.controller.IncidentController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Transactional(readOnly = true)
public class SecurityEventService {

    private static final Logger log = LoggerFactory.getLogger(SecurityEventService.class);
    private final SecurityEventRepository securityEventRepository;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @Value("${sentinelx.demo-mode:false}")
    private boolean demoMode;

    private static final String[][] SIMULATED_ATTACKS = {
        {"AUTH_FAILURE", "medium", "194.26.29.112", "10.0.1.5", "Repeated authentication failure: Kerberos pre-auth invalid password"},
        {"PROCESS_START", "critical", "10.0.4.15", "10.0.4.15", "powershell.exe -enc JAB3AGgAbwBhAG0AaQA= (Base64 encoded recon command)"},
        {"NET_CONN", "high", "10.0.2.80", "198.51.100.44", "HTTPS C2 outbound connection callback to updates-cdn-auth.com:443"},
        {"DNS_QUERY", "low", "10.0.3.11", "10.0.0.2", "Standard corporate DNS resolution for github.com"},
        {"DATA_EXFIL", "critical", "10.0.4.15", "185.220.101.5", "Chunked transfer stream detected to bulletproof storage server"}
    };

    public SecurityEventService(SecurityEventRepository securityEventRepository) {
        this.securityEventRepository = securityEventRepository;
    }

    public List<SecurityEvent> getRecentEvents(UUID orgId) {
        return securityEventRepository.findTop20ByOrganizationIdOrderByOccurredAtDesc(orgId);
    }

    public SseEmitter subscribeToEventStream() {
        SseEmitter emitter = new SseEmitter(180_000L); // 3-minute timeout
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connected to SentinelX Real-time Event Stream"));
        } catch (IOException e) {
            emitters.remove(emitter);
        }

        return emitter;
    }

    @Transactional
    public SecurityEvent ingestEvent(SecurityEvent event) {
        SecurityEvent saved = securityEventRepository.save(event);
        broadcastEvent(saved);
        return saved;
    }

    @Scheduled(fixedDelay = 4000)
    public void generateLiveTelemetryStream() {
        if (!demoMode || emitters.isEmpty()) {
            return;
        }

        int idx = ThreadLocalRandom.current().nextInt(SIMULATED_ATTACKS.length);
        String[] template = SIMULATED_ATTACKS[idx];

        SecurityEvent evt = new SecurityEvent();
        evt.setId(UUID.randomUUID());
        evt.setOrganizationId(IncidentController.DEFAULT_ORG_ID);
        evt.setOccurredAt(Instant.now());
        evt.setEventType(template[0]);
        evt.setSeverity(template[1]);
        evt.setSrcIp(template[2]);
        evt.setDstIp(template[3]);
        evt.setMessage(template[4]);
        evt.setSynthetic(true);
        evt.setDedupeHash(UUID.randomUUID().toString().replace("-", ""));

        broadcastEvent(evt);
    }

    private void broadcastEvent(SecurityEvent event) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("SECURITY_EVENT").data(event));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}

