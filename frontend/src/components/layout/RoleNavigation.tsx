import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RoleNavigation: React.FC = () => {
  const { activeRole } = useAuth();

  interface NavItem {
    path: string;
    label: string;
    badge?: string;
    end?: boolean;
  }

  let navItems: NavItem[] = [];

  if (activeRole === 'POLICYMAKER') {
    navItems = [
      { path: '/policymaker', label: 'Dashboard', end: true },
      { path: '/policymaker/national-risk', label: 'National Risk' },
      { path: '/policymaker/ministries-sectors', label: 'Ministries / Sectors' },
      { path: '/policymaker/states', label: 'States / UTs' },
      { path: '/policymaker/priority-projects', label: 'Priority Projects' },
      { path: '/policymaker/emerging-risks', label: 'Emerging Risks' },
    ];
  } else if (activeRole === 'ADMINISTRATOR') {
    navItems = [
      { path: '/administrator', label: 'Dashboard', end: true },
      { path: '/administrator/projects', label: 'My Projects' },
      { path: '/administrator/priority-projects', label: 'Priority Projects' },
      { path: '/administrator/cost', label: 'Cost Monitoring' },
      { path: '/administrator/progress', label: 'Progress Monitoring' },
      { path: '/administrator/schedule', label: 'Schedule Monitoring' },
      { path: '/administrator/actions', label: 'Actions & Interventions' },
      { path: '/administrator/risk-trends', label: 'Risk Trends' },
    ];
  } else {
    // MONITORING_OFFICER
    navItems = [
      { path: '/monitoring', label: 'Dashboard', end: true },
      { path: '/monitoring/watchlist', label: 'Priority Watchlist', badge: 'HERO' },
      { path: '/monitoring/signals', label: 'Risk Signals' },
      { path: '/monitoring/alerts', label: 'Alerts' },
      { path: '/monitoring/projects', label: 'Projects' },
      { path: '/monitoring/explanations', label: 'Risk Explanations' },
      { path: '/monitoring/actions', label: 'Actions' },
      { path: '/monitoring/risk-trends', label: 'Risk Trends' },
    ];
  }

  return (
    <div className="bg-white border-b border-gov-border sticky top-0 z-30 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 py-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-gov-terracotta text-gov-terracotta bg-gov-terracotta/5 font-semibold'
                    : 'border-transparent text-ink-muted hover:text-ink hover:border-gov-border'
                }`
              }
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-red-100 text-red-800 rounded-xs font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Showcase Link to Demo Project */}
        <div className="hidden md:flex items-center pl-4 py-1 text-xs border-l border-gov-border shrink-0">
          <NavLink
            to="/project/615186"
            className={({ isActive }) =>
              `px-2.5 py-1 rounded-xs font-mono text-[11px] transition-colors ${
                isActive
                  ? 'bg-ink text-white font-bold'
                  : 'bg-paper-subtle text-ink-muted hover:text-ink border border-gov-border'
              }`
            }
          >
            Showcase: Project #615186
          </NavLink>
        </div>
      </div>
    </div>
  );
};
