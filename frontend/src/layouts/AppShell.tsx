import React from 'react';
import { Outlet } from 'react-router-dom';
import { InstitutionalHeader } from '../components/layout/InstitutionalHeader';
import { RoleNavigation } from '../components/layout/RoleNavigation';
import { InstitutionalFooter } from '../components/layout/InstitutionalFooter';
import { GlobalSearchModal } from '../components/common/GlobalSearchModal';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-amber-100 selection:text-amber-900">
      {/* Institutional Top Strip & Role Switcher */}
      <InstitutionalHeader />

      {/* Role-Specific Navigation Bar */}
      <RoleNavigation />

      {/* Multi-Page Route Content */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* Government Institutional Footer */}
      <InstitutionalFooter />

      {/* Project Search Modal (Ctrl+K) */}
      <GlobalSearchModal />
    </div>
  );
};
