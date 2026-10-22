-- SentinelX AI core schema. PostgreSQL 13+ (gen_random_uuid is built in).
-- Every tenant-owned table carries organization_id for tenant isolation.

CREATE TABLE organizations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       varchar(120) NOT NULL,
  slug       varchar(60)  NOT NULL UNIQUE,
  created_at timestamptz  NOT NULL DEFAULT now()
);

-- ---------- RBAC ----------
CREATE TABLE roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        varchar(40) NOT NULL UNIQUE,
  description varchar(255)
);
CREATE TABLE permissions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        varchar(60) NOT NULL UNIQUE,
  description varchar(255)
);
CREATE TABLE role_permissions (
  role_id       uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   uuid NOT NULL REFERENCES organizations(id),
  email             varchar(254) NOT NULL,
  display_name      varchar(120) NOT NULL,
  password_hash     varchar(100) NOT NULL,            -- BCrypt/Argon2 hash only
  role_id           uuid NOT NULL REFERENCES roles(id),
  enabled           boolean NOT NULL DEFAULT true,
  failed_login_count integer NOT NULL DEFAULT 0,
  locked_until      timestamptz,
  last_login_at     timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, email)
);

-- ---------- Assets and identities ----------
CREATE TABLE assets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  hostname        varchar(255) NOT NULL,
  asset_type      varchar(40)  NOT NULL,              -- SERVER, WORKSTATION, DATABASE, NETWORK_DEVICE, CLOUD_RESOURCE
  criticality     smallint     NOT NULL CHECK (criticality BETWEEN 1 AND 5),
  environment     varchar(30)  NOT NULL DEFAULT 'production',
  ip_address      inet,
  owner_user_id   uuid REFERENCES users(id),
  last_seen_at    timestamptz,
  is_synthetic    boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, hostname)
);
CREATE TABLE identities (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  account_name    varchar(200) NOT NULL,
  department      varchar(100),
  privileged      boolean NOT NULL DEFAULT false,
  last_seen_at    timestamptz,
  is_synthetic    boolean NOT NULL DEFAULT false,
  UNIQUE (organization_id, account_name)
);

-- ---------- Ingestion ----------
CREATE TABLE data_sources (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid NOT NULL REFERENCES organizations(id),
  name             varchar(120) NOT NULL,
  source_type      varchar(40)  NOT NULL,              -- SIMULATOR, SYSLOG, HTTP_API, FILE_IMPORT
  status           varchar(20)  NOT NULL DEFAULT 'DISABLED',
  config           jsonb NOT NULL DEFAULT '{}'::jsonb, -- never store secrets here
  last_ingested_at timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE security_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  source_id       uuid REFERENCES data_sources(id),
  asset_id        uuid REFERENCES assets(id),
  identity_id     uuid REFERENCES identities(id),
  occurred_at     timestamptz NOT NULL,
  ingested_at     timestamptz NOT NULL DEFAULT now(),
  event_type      varchar(60) NOT NULL,               -- AUTH_FAILURE, AUTH_SUCCESS, PROCESS_START, NET_CONN, ...
  severity        varchar(10) NOT NULL CHECK (severity IN ('INFO','LOW','MEDIUM','HIGH','CRITICAL')),
  src_ip          inet,
  dst_ip          inet,
  message         text,
  raw             jsonb NOT NULL DEFAULT '{}'::jsonb, -- untrusted content: render escaped, never as instructions
  dedupe_hash     char(64),
  is_synthetic    boolean NOT NULL DEFAULT false
);
CREATE INDEX idx_events_org_time   ON security_events (organization_id, occurred_at DESC);
CREATE INDEX idx_events_org_sev    ON security_events (organization_id, severity, occurred_at DESC);
CREATE INDEX idx_events_asset      ON security_events (asset_id, occurred_at DESC);
CREATE INDEX idx_events_identity   ON security_events (identity_id, occurred_at DESC);
CREATE UNIQUE INDEX uq_events_dedupe ON security_events (organization_id, dedupe_hash) WHERE dedupe_hash IS NOT NULL;

-- ---------- Detection ----------
CREATE TABLE detection_rules (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name            varchar(160) NOT NULL,
  description     text,
  rule_type       varchar(20) NOT NULL CHECK (rule_type IN ('THRESHOLD','SEQUENCE','ML_ANOMALY')),
  severity        varchar(10) NOT NULL CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  enabled         boolean NOT NULL DEFAULT false,
  definition      jsonb NOT NULL,                      -- thresholds, window, suppression interval
  current_version integer NOT NULL DEFAULT 1,
  created_by      uuid REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);
CREATE TABLE rule_versions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id     uuid NOT NULL REFERENCES detection_rules(id) ON DELETE CASCADE,
  version     integer NOT NULL,
  definition  jsonb NOT NULL,
  changed_by  uuid REFERENCES users(id),
  change_note varchar(500),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rule_id, version)
);
CREATE TABLE suppression_rules (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  rule_id         uuid REFERENCES detection_rules(id) ON DELETE CASCADE,
  asset_id        uuid REFERENCES assets(id),
  reason          varchar(500) NOT NULL,
  expires_at      timestamptz NOT NULL,                -- suppression must always expire
  created_by      uuid NOT NULL REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE alerts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  rule_id         uuid REFERENCES detection_rules(id),
  asset_id        uuid REFERENCES assets(id),
  title           varchar(250) NOT NULL,
  severity        varchar(10) NOT NULL CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  confidence      numeric(4,3) CHECK (confidence BETWEEN 0 AND 1),   -- model/rule confidence, separate from severity
  risk_score      numeric(5,2) CHECK (risk_score BETWEEN 0 AND 100),
  status          varchar(20) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','ACKNOWLEDGED','INVESTIGATING','RESOLVED','FALSE_POSITIVE','SUPPRESSED')),
  explanation     text,                                -- plain-language reason it was flagged
  dedupe_key      varchar(200),
  event_count     integer NOT NULL DEFAULT 1,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_alerts_org_status ON alerts (organization_id, status, created_at DESC);
CREATE UNIQUE INDEX uq_alerts_open_dedupe ON alerts (organization_id, dedupe_key)
  WHERE dedupe_key IS NOT NULL AND status IN ('NEW','ACKNOWLEDGED','INVESTIGATING');
CREATE TABLE alert_events (
  alert_id uuid NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES security_events(id) ON DELETE CASCADE,
  PRIMARY KEY (alert_id, event_id)
);

-- ---------- ML predictions and analyst feedback ----------
CREATE TABLE model_predictions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      uuid NOT NULL REFERENCES security_events(id) ON DELETE CASCADE,
  alert_id      uuid REFERENCES alerts(id) ON DELETE SET NULL,
  model_name    varchar(80) NOT NULL,
  model_version varchar(40) NOT NULL,
  anomaly_score numeric(6,5) NOT NULL,
  confidence    numeric(4,3),
  features      jsonb NOT NULL DEFAULT '{}'::jsonb,    -- feature contributions for explainability
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE analyst_feedback (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id      uuid NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  prediction_id uuid REFERENCES model_predictions(id) ON DELETE SET NULL,
  user_id       uuid NOT NULL REFERENCES users(id),
  label         varchar(20) NOT NULL CHECK (label IN ('FALSE_POSITIVE','CONFIRMED_THREAT','NEEDS_REVIEW')),
  comment       varchar(1000),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------- Incidents and cases ----------
CREATE TABLE incidents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  public_id       varchar(20) NOT NULL,                -- human-friendly, e.g. INC-2026-0001
  title           varchar(250) NOT NULL,
  category        varchar(60)  NOT NULL,
  severity        varchar(10)  NOT NULL CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  status          varchar(20)  NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','TRIAGED','INVESTIGATING','CONTAINED','CLOSED','FALSE_POSITIVE')),
  confidence      numeric(4,3) CHECK (confidence BETWEEN 0 AND 1),
  risk_score      numeric(5,2) CHECK (risk_score BETWEEN 0 AND 100),
  summary         text,
  assigned_to     uuid REFERENCES users(id),
  primary_asset_id uuid REFERENCES assets(id),
  first_seen_at   timestamptz NOT NULL,
  last_seen_at    timestamptz NOT NULL,
  closed_at       timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, public_id)
);
CREATE INDEX idx_incidents_org_status ON incidents (organization_id, status, last_seen_at DESC);
CREATE TABLE incident_alerts (
  incident_id uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  alert_id    uuid NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  PRIMARY KEY (incident_id, alert_id)
);
CREATE TABLE incident_events (
  incident_id        uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  event_id           uuid NOT NULL REFERENCES security_events(id) ON DELETE CASCADE,
  correlation_reason varchar(300) NOT NULL,            -- evidence for why this event was grouped
  relation_kind      varchar(10) NOT NULL DEFAULT 'OBSERVED' CHECK (relation_kind IN ('OBSERVED','INFERRED')),
  PRIMARY KEY (incident_id, event_id)
);
CREATE TABLE investigation_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  author_id   uuid NOT NULL REFERENCES users(id),
  body        text NOT NULL,
  version     integer NOT NULL DEFAULT 1,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE cases (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  incident_id     uuid REFERENCES incidents(id) ON DELETE SET NULL,
  title           varchar(250) NOT NULL,
  priority        varchar(10) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW','MEDIUM','HIGH','URGENT')),
  status          varchar(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','IN_PROGRESS','WAITING','CLOSED')),
  assignee_id     uuid REFERENCES users(id),
  created_by      uuid NOT NULL REFERENCES users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE case_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id    uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES users(id),
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- MITRE ATT&CK ----------
CREATE TABLE attack_techniques (
  id             varchar(20) PRIMARY KEY,              -- e.g. T1110 or T1110.001
  tactic         varchar(60) NOT NULL,
  name           varchar(200) NOT NULL,
  description    text,
  dataset_version varchar(20) NOT NULL                 -- ATT&CK release the row came from
);
CREATE TABLE incident_techniques (
  incident_id  uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  technique_id varchar(20) NOT NULL REFERENCES attack_techniques(id),
  mapping_kind varchar(10) NOT NULL CHECK (mapping_kind IN ('OBSERVED','INFERRED')),
  event_id     uuid REFERENCES security_events(id) ON DELETE SET NULL, -- supporting evidence
  PRIMARY KEY (incident_id, technique_id, mapping_kind)
);

-- ---------- Threat intelligence ----------
CREATE TABLE threat_indicators (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  indicator_type  varchar(10) NOT NULL CHECK (indicator_type IN ('IP','DOMAIN','URL','HASH')),
  value           varchar(2048) NOT NULL,
  source          varchar(120) NOT NULL,
  confidence      numeric(4,3) CHECK (confidence BETWEEN 0 AND 1),
  first_seen_at   timestamptz,
  last_seen_at    timestamptz,
  expires_at      timestamptz,                          -- cache/freshness expiry
  is_synthetic    boolean NOT NULL DEFAULT false,
  UNIQUE (organization_id, indicator_type, value, source)
);
CREATE TABLE indicator_observations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id uuid NOT NULL REFERENCES threat_indicators(id) ON DELETE CASCADE,
  event_id     uuid NOT NULL REFERENCES security_events(id) ON DELETE CASCADE,
  observed_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------- Response playbooks ----------
CREATE TABLE playbooks (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid NOT NULL REFERENCES organizations(id),
  name             varchar(160) NOT NULL,
  description      text,
  steps            jsonb NOT NULL,
  requires_approval boolean NOT NULL DEFAULT true,
  enabled          boolean NOT NULL DEFAULT false,
  created_by       uuid REFERENCES users(id),
  UNIQUE (organization_id, name)
);
CREATE TABLE playbook_executions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id   uuid NOT NULL REFERENCES playbooks(id),
  incident_id   uuid REFERENCES incidents(id),
  mode          varchar(10) NOT NULL DEFAULT 'DRY_RUN' CHECK (mode IN ('DRY_RUN','MOCK_LIVE')),
  status        varchar(20) NOT NULL DEFAULT 'PENDING_APPROVAL'
                CHECK (status IN ('PENDING_APPROVAL','APPROVED','REJECTED','RUNNING','COMPLETED','FAILED')),
  requested_by  uuid NOT NULL REFERENCES users(id),
  execution_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at    timestamptz,
  finished_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE playbook_approvals (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id uuid NOT NULL REFERENCES playbook_executions(id) ON DELETE CASCADE,
  approver_id  uuid NOT NULL REFERENCES users(id),
  decision     varchar(10) NOT NULL CHECK (decision IN ('APPROVED','REJECTED')),
  comment      varchar(500),
  decided_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------- User workspace ----------
CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       varchar(40) NOT NULL,
  title      varchar(200) NOT NULL,
  body       varchar(1000),
  link       varchar(300),
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, created_at DESC) WHERE read_at IS NULL;
CREATE TABLE saved_filters (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope      varchar(40) NOT NULL,
  name       varchar(120) NOT NULL,
  filters    jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE saved_investigations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         varchar(160) NOT NULL,
  filters      jsonb NOT NULL DEFAULT '{}'::jsonb,
  event_ids    uuid[] NOT NULL DEFAULT '{}',
  notes        text,
  progress     varchar(20) NOT NULL DEFAULT 'IN_PROGRESS',
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE dashboards (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       varchar(120) NOT NULL,
  layout     jsonb NOT NULL,
  is_default boolean NOT NULL DEFAULT false
);

-- ---------- Governance ----------
CREATE TABLE retention_policies (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  entity          varchar(40) NOT NULL,                 -- security_events, alerts, audit_logs, ...
  retain_days     integer NOT NULL CHECK (retain_days > 0),
  UNIQUE (organization_id, entity)
);
CREATE TABLE audit_logs (
  id              bigserial PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id),
  actor_id        uuid REFERENCES users(id),
  action          varchar(80) NOT NULL,                 -- LOGIN_SUCCESS, RULE_UPDATED, EXPORT_CREATED, ...
  entity_type     varchar(60),
  entity_id       varchar(80),
  ip_address      inet,
  details         jsonb NOT NULL DEFAULT '{}'::jsonb,   -- must be redacted before insert
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_org_time ON audit_logs (organization_id, created_at DESC);

-- The audit trail is append-only at the database level.
CREATE FUNCTION audit_logs_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_audit_logs_no_update BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION audit_logs_immutable();
