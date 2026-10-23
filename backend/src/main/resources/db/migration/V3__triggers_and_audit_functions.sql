-- ============================================================================
-- SentinelX AI - Migration V3: Automated Timestamps & Forensic Audit Triggers
-- ============================================================================

-- Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all mutable entity tables
DROP TRIGGER IF EXISTS trg_incidents_updated_at ON incidents;
CREATE TRIGGER trg_incidents_updated_at
    BEFORE UPDATE ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_alerts_updated_at ON alerts;
CREATE TRIGGER trg_alerts_updated_at
    BEFORE UPDATE ON alerts
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_detection_rules_updated_at ON detection_rules;
CREATE TRIGGER trg_detection_rules_updated_at
    BEFORE UPDATE ON detection_rules
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_cases_updated_at ON cases;
CREATE TRIGGER trg_cases_updated_at
    BEFORE UPDATE ON cases
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Immutable Forensic Audit Trigger Function for Incident Updates
CREATE OR REPLACE FUNCTION audit_incident_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) OR (OLD.severity IS DISTINCT FROM NEW.severity) THEN
        INSERT INTO audit_logs (
            organization_id,
            action,
            entity_type,
            entity_id,
            actor_id,
            ip_address,
            details,
            created_at
        ) VALUES (
            NEW.organization_id,
            'INCIDENT_UPDATED',
            'INCIDENT',
            NEW.id::text,
            NEW.assigned_to,
            '127.0.0.1'::inet,
            jsonb_build_object(
                'public_id', NEW.public_id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'old_severity', OLD.severity,
                'new_severity', NEW.severity
            ),
            CURRENT_TIMESTAMP
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_incident_change ON incidents;
CREATE TRIGGER trg_audit_incident_change
    AFTER UPDATE ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION audit_incident_status_change();
