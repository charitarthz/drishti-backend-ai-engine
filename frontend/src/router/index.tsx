import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';

// Auth & Profile
import { LoginPage } from '../pages/auth/LoginPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Policymaker Routes
import { PolicymakerOverviewPage } from '../pages/policymaker/PolicymakerOverviewPage';
import { NationalRiskPage } from '../pages/policymaker/NationalRiskPage';
import { MinistriesSectorsPage } from '../pages/policymaker/MinistriesSectorsPage';
import { StatesUTsPage } from '../pages/policymaker/StatesUTsPage';
import { PriorityProjectsPage } from '../pages/policymaker/PriorityProjectsPage';
import { EmergingRisksPage } from '../pages/policymaker/EmergingRisksPage';

// Administrator Routes
import { AdministratorOverviewPage } from '../pages/administrator/AdministratorOverviewPage';
import { ProjectPortfolioPage } from '../pages/administrator/ProjectPortfolioPage';
import { AdminPriorityProjectsPage } from '../pages/administrator/AdminPriorityProjectsPage';
import { CostAnalysisPage } from '../pages/administrator/CostAnalysisPage';
import { PhysicalProgressPage } from '../pages/administrator/PhysicalProgressPage';
import { ScheduleSlippagePage } from '../pages/administrator/ScheduleSlippagePage';
import { ActionsInterventionsPage } from '../pages/administrator/ActionsInterventionsPage';
import { PortfolioRiskTrendsPage } from '../pages/administrator/PortfolioRiskTrendsPage';

// Monitoring Officer Routes
import { MonitoringDashboardPage } from '../pages/monitoring/MonitoringDashboardPage';
import { PriorityWatchlistPage } from '../pages/monitoring/PriorityWatchlistPage';
import { CurrentRiskSignalsPage } from '../pages/monitoring/CurrentRiskSignalsPage';
import { AlertCenterPage } from '../pages/monitoring/AlertCenterPage';
import { MonitoredProjectsPage } from '../pages/monitoring/MonitoredProjectsPage';
import { RiskExplanationsPage } from '../pages/monitoring/RiskExplanationsPage';
import { ActionLoggingPage } from '../pages/monitoring/ActionLoggingPage';
import { MonitoringRiskTrendsPage } from '../pages/monitoring/MonitoringRiskTrendsPage';

// Showcase Route
import { ProjectIntelligencePage } from '../pages/project/ProjectIntelligencePage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dedicated Login Gateway */}
        <Route path="/login" element={<LoginPage />} />

        {/* Application Shell Routes */}
        <Route element={<AppShell />}>
          {/* Default Root Redirect */}
          <Route path="/" element={<Navigate to="/monitoring/watchlist" replace />} />

          {/* Policymaker Multi-Page Routes */}
          <Route path="/policymaker" element={<PolicymakerOverviewPage />} />
          <Route path="/policymaker/national-risk" element={<NationalRiskPage />} />
          <Route path="/policymaker/ministries-sectors" element={<MinistriesSectorsPage />} />
          <Route path="/policymaker/states" element={<StatesUTsPage />} />
          <Route path="/policymaker/priority-projects" element={<PriorityProjectsPage />} />
          <Route path="/policymaker/emerging-risks" element={<EmergingRisksPage />} />

          {/* Administrator Multi-Page Routes */}
          <Route path="/administrator" element={<AdministratorOverviewPage />} />
          <Route path="/administrator/projects" element={<ProjectPortfolioPage />} />
          <Route path="/administrator/priority-projects" element={<AdminPriorityProjectsPage />} />
          <Route path="/administrator/cost" element={<CostAnalysisPage />} />
          <Route path="/administrator/progress" element={<PhysicalProgressPage />} />
          <Route path="/administrator/schedule" element={<ScheduleSlippagePage />} />
          <Route path="/administrator/actions" element={<ActionsInterventionsPage />} />
          <Route path="/administrator/risk-trends" element={<PortfolioRiskTrendsPage />} />

          {/* Monitoring Officer Multi-Page Routes */}
          <Route path="/monitoring" element={<MonitoringDashboardPage />} />
          <Route path="/monitoring/watchlist" element={<PriorityWatchlistPage />} />
          <Route path="/monitoring/signals" element={<CurrentRiskSignalsPage />} />
          <Route path="/monitoring/alerts" element={<AlertCenterPage />} />
          <Route path="/monitoring/projects" element={<MonitoredProjectsPage />} />
          <Route path="/monitoring/explanations" element={<RiskExplanationsPage />} />
          <Route path="/monitoring/actions" element={<ActionLoggingPage />} />
          <Route path="/monitoring/risk-trends" element={<MonitoringRiskTrendsPage />} />

          {/* Project Intelligence Showcase Dossier */}
          <Route path="/project/:id" element={<ProjectIntelligencePage />} />

          {/* Profile Route */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
