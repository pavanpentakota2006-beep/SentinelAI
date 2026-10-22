import {
  Activity, BellRing, BookOpenCheck, BriefcaseBusiness, Camera, ClipboardList, FileBarChart, FolderSearch, Gauge,
  HeartPulse, Network, PlugZap, ScrollText, Server, Settings, ShieldAlert, ShieldCheck, Siren, Target,
  Telescope, UserCog, Users, Workflow, type LucideIcon,
} from "lucide-react";

export interface NavItem { path: string; label: string; icon: LucideIcon; group: string }

export const NAV: NavItem[] = [
  { path: "/", label: "Overview", icon: Gauge, group: "Monitor" },
  { path: "/surveillance", label: "Visual surveillance", icon: Camera, group: "Monitor" },
  { path: "/events", label: "Live events", icon: Activity, group: "Monitor" },
  { path: "/alerts", label: "Alerts", icon: Siren, group: "Monitor" },
  { path: "/incidents", label: "Incidents", icon: ShieldAlert, group: "Investigate" },
  { path: "/attack-graph", label: "Attack graph", icon: Network, group: "Investigate" },
  { path: "/threat-intel", label: "Threat intelligence", icon: Telescope, group: "Investigate" },
  { path: "/mitre", label: "MITRE ATT&CK", icon: Target, group: "Investigate" },
  { path: "/assets", label: "Assets", icon: Server, group: "Environment" },
  { path: "/identities", label: "Identities", icon: Users, group: "Environment" },
  { path: "/rules", label: "Detection rules", icon: ShieldCheck, group: "Respond" },
  { path: "/playbooks", label: "Response playbooks", icon: Workflow, group: "Respond" },
  { path: "/cases", label: "Cases", icon: BriefcaseBusiness, group: "Respond" },
  { path: "/reports", label: "Reports", icon: FileBarChart, group: "Workspace" },
  { path: "/investigations", label: "Saved investigations", icon: FolderSearch, group: "Workspace" },
  { path: "/notifications", label: "Notifications", icon: BellRing, group: "Workspace" },
  { path: "/integrations", label: "Ingestion and integrations", icon: PlugZap, group: "Platform" },
  { path: "/health", label: "System health", icon: HeartPulse, group: "Platform" },
  { path: "/users", label: "Users and roles", icon: UserCog, group: "Admin" },
  { path: "/audit", label: "Audit logs", icon: ScrollText, group: "Admin" },
  { path: "/settings", label: "Settings", icon: Settings, group: "Admin" },
  { path: "/help", label: "Help and guided demo", icon: BookOpenCheck, group: "Admin" },
];

export const NAV_ICON_FALLBACK = ClipboardList;
