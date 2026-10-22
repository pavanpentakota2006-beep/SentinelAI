import { Route, Routes } from "react-router-dom";
import AppShell from "@/layout/AppShell";
import Overview from "@/pages/Overview";
import SurveillancePage from "@/pages/SurveillancePage";
import LiveEvents from "@/pages/LiveEvents";
import Alerts from "@/pages/Alerts";
import Incidents from "@/pages/Incidents";
import AttackGraph from "@/pages/AttackGraph";
import MitreMatrix from "@/pages/MitreMatrix";
import ThreatIntel from "@/pages/ThreatIntel";
import AssetsPage from "@/pages/AssetsPage";
import IdentitiesPage from "@/pages/IdentitiesPage";
import DetectionRules from "@/pages/DetectionRules";
import PlaybooksPage from "@/pages/PlaybooksPage";
import CasesPage from "@/pages/CasesPage";
import ReportsPage from "@/pages/ReportsPage";
import InvestigationsPage from "@/pages/InvestigationsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import IntegrationsPage from "@/pages/IntegrationsPage";
import HealthPage from "@/pages/HealthPage";
import UsersRolesPage from "@/pages/UsersRolesPage";
import AuditLogsPage from "@/pages/AuditLogsPage";
import SettingsPage from "@/pages/SettingsPage";
import HelpPage from "@/pages/HelpPage";
import Placeholder from "@/pages/Placeholder";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Overview />} />
        <Route path="/surveillance" element={<SurveillancePage />} />
        <Route path="/events" element={<LiveEvents />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/attack-graph" element={<AttackGraph />} />
        <Route path="/mitre" element={<MitreMatrix />} />
        <Route path="/threat-intel" element={<ThreatIntel />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/identities" element={<IdentitiesPage />} />
        <Route path="/rules" element={<DetectionRules />} />
        <Route path="/playbooks" element={<PlaybooksPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/investigations" element={<InvestigationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/users" element={<UsersRolesPage />} />
        <Route path="/audit" element={<AuditLogsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<Placeholder />} />
      </Route>
    </Routes>
  );
}
