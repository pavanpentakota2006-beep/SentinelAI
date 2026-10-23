package com.sentinelx.service;

import com.sentinelx.model.SecurityEvent;
import com.sentinelx.repository.SecurityEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Transactional(readOnly = true)
public class SecurityEventService {

    private static final Logger log = LoggerFactory.getLogger(SecurityEventService.class);
    private final SecurityEventRepository securityEventRepository;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

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
            emitter.send(SseEmitter.event().name("INIT").data("Connected to SentinelX Event Stream"));
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
