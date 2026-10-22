-- Reference data: roles and permissions. Access is denied unless a permission is granted.
INSERT INTO roles (name, description) VALUES
  ('ADMINISTRATOR',      'Manage users, settings, integrations, and detection configuration'),
  ('SECURITY_ANALYST',   'Review events, investigate incidents, enrich evidence, create reports'),
  ('INCIDENT_RESPONDER', 'Execute authorized and approved response playbooks'),
  ('READ_ONLY_VIEWER',   'View dashboards, incidents, and reports');

INSERT INTO permissions (code, description) VALUES
  ('dashboard:read','View dashboards'),
  ('events:read','View and search security events'),
  ('alerts:read','View alerts'),
  ('alerts:write','Acknowledge, label, and suppress alerts'),
  ('incidents:read','View incidents'),
  ('incidents:write','Update, assign, and close incidents'),
  ('assets:read','View assets and identities'),
  ('assets:write','Edit assets and identities'),
  ('intel:read','View threat intelligence'),
  ('intel:write','Manage indicators and enrichment'),
  ('rules:read','View detection rules'),
  ('rules:write','Create, edit, enable, and roll back rules'),
  ('playbooks:read','View playbooks'),
  ('playbooks:request','Request a playbook execution'),
  ('playbooks:approve','Approve or reject playbook executions'),
  ('playbooks:execute','Run approved playbooks'),
  ('cases:write','Manage cases'),
  ('reports:read','View reports'),
  ('reports:export','Export reports and CSV'),
  ('audit:read','View audit logs'),
  ('integrations:manage','Manage data sources and connectors'),
  ('users:manage','Manage users and roles'),
  ('settings:manage','Change application settings');

-- Administrator: everything
INSERT INTO role_permissions SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'ADMINISTRATOR';

-- Security analyst
INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
  ('dashboard:read','events:read','alerts:read','alerts:write','incidents:read','incidents:write',
   'assets:read','intel:read','intel:write','rules:read','playbooks:read','playbooks:request',
   'cases:write','reports:read','reports:export')
WHERE r.name = 'SECURITY_ANALYST';

-- Incident responder
INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
  ('dashboard:read','events:read','alerts:read','incidents:read','assets:read','intel:read',
   'playbooks:read','playbooks:approve','playbooks:execute','cases:write','reports:read')
WHERE r.name = 'INCIDENT_RESPONDER';

-- Read-only viewer
INSERT INTO role_permissions SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN
  ('dashboard:read','alerts:read','incidents:read','assets:read','reports:read')
WHERE r.name = 'READ_ONLY_VIEWER';
