import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { INITIAL_ALERTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const AlertCenterPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const alertTypes = [
    'ALL',
    'Critical Risk',
    'New High Risk',
    'Risk Increased',
    'Progress Risk Signal',
    'Deadline Risk Signal',
    'Cost Risk Signal'
  ];

  const filteredAlerts = INITIAL_ALERTS.filter(
    a => selectedType === 'ALL' || a.alertType === selectedType
  );

  const criticalAlerts = INITIAL_ALERTS.filter(a => a.severity === 'Critical');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Monitoring Desk • Incident Alert Radar"
        title="Operational Infrastructure Alert Center"
        subtitle={`Actionable operational notifications answering: What happened? Which project? Why does it matter? Filtered strictly to eliminate notification noise and alert fatigue (${MOCK_REPORTING_MONTH}).`}
        badge="ALERT CENTER"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Logged Alerts', value: INITIAL_ALERTS.length, context: 'Active Incidents' },
          { label: 'Critical Tier Alerts', value: criticalAlerts.length, context: 'Immediate Action', emphasis: 'critical' },
          { label: 'Risk Escalations', value: INITIAL_ALERTS.filter(a => a.alertType === 'Risk Increased' || a.alertType === 'New High Risk').length, context: 'Trajectory Shifts', emphasis: 'high' },
          { label: 'Milestone Slips', value: INITIAL_ALERTS.filter(a => a.alertType === 'Deadline Risk Signal' || a.alertType === 'Progress Risk Signal').length, context: 'Execution Lag' },
          { label: 'Notification Hygiene', value: 'Zero Spam', context: 'Threshold Gated', emphasis: 'positive' },
        ]}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-paper-subtle p-1 border border-gov-border rounded-xs text-xs font-mono">
        {alertTypes.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-xs transition-colors ${
              selectedType === t
                ? 'bg-ink text-white font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            {t === 'ALL' ? 'All Alerts' : t} ({t === 'ALL' ? INITIAL_ALERTS.length : INITIAL_ALERTS.filter(a => a.alertType === t).length})
          </button>
        ))}
      </div>

      {/* Meaningful Alerts Register */}
      <div className="space-y-4">
        {filteredAlerts.map(alt => (
          <div
            key={alt.id}
            className="bg-white border border-gov-border rounded-xs p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-ink/50 transition-colors"
          >
            <div className="space-y-2.5 max-w-3xl">
              {/* Badge & Identification Strip */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <RiskBadge level={alt.severity} size="sm" />
                <span className="font-bold text-ink bg-paper-subtle px-2 py-0.5 border border-gov-border rounded-xs">
                  {alt.alertType}
                </span>
                <span className="text-ink-subtle">•</span>
                <span className="text-ink-subtle">#{alt.projectId}</span>
                <span className="text-ink-subtle">•</span>
                <span className="text-ink-subtle">{alt.timestamp}</span>
              </div>

              {/* Project Name */}
              <h3 className="editorial-title text-base font-semibold text-ink">
                {alt.projectName}
              </h3>

              {/* What Happened */}
              <div className="text-xs text-ink leading-relaxed">
                <span className="font-mono text-[11px] font-bold text-ink uppercase tracking-wider block text-ink-subtle">
                  What Happened:
                </span>
                <p className="mt-0.5 text-ink font-medium">
                  {alt.whatHappened}
                </p>
              </div>

              {/* Why Does It Matter */}
              <div className="text-xs text-ink-muted leading-relaxed bg-paper-subtle p-2.5 rounded-xs border border-gov-border">
                <span className="font-mono text-[10px] font-bold text-gov-terracotta uppercase tracking-wider block">
                  Why Does It Matter to the Monitoring Officer:
                </span>
                <p className="mt-0.5 text-ink-muted italic font-serif">
                  {alt.whyCare}
                </p>
              </div>
            </div>

            {/* Direct Action Column */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2 shrink-0 w-full sm:w-auto">
              <Link
                to={`/project/${alt.projectId}`}
                className="px-4 py-2 bg-ink hover:bg-ink-light text-white text-xs font-mono font-bold rounded-xs transition-colors shadow-xs text-center"
              >
                Inspect Project Dossier →
              </Link>
              <Link
                to={`/monitoring/actions?project=${alt.projectId}`}
                className="px-4 py-1.5 bg-paper-subtle hover:bg-gov-border border border-gov-border text-ink text-xs font-mono rounded-xs transition-colors text-center"
              >
                Log Statutory Action
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
