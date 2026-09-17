import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_PROJECTS, INITIAL_ALERTS, INITIAL_RISK_SIGNALS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';
import { useActions } from '../../context/ActionContext';

export const MonitoringDashboardPage: React.FC = () => {
  const { overdueCount } = useActions();

  const total = MOCK_PROJECTS.length;
  const critical = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical');
  const high = MOCK_PROJECTS.filter(p => p.riskLevel === 'High');
  const newHighRisk = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical' || (p.riskLevel === 'High' && p.trendDirection === 'Increasing')).slice(0, 2);
  const riskIncreased = MOCK_PROJECTS.filter(p => p.trendDirection === 'Increasing');

  // Priority Watchlist sorted by SANKET-AI Risk Score
  const watchlist = [...MOCK_PROJECTS].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Monitoring Officer Workspace • Operational Vigilance"
        title="Infrastructure Project Monitoring & Risk Desk"
        subtitle={`Real-time field monitoring desk for central sector projects, prioritizing immediate physical verification audits, stall inspections, and schedule slippage investigations (${MOCK_REPORTING_MONTH}).`}
        badge="MONITORING DESK"
      />

      {/* Editorial Information Band */}
      <InformationBand
        cells={[
          { label: 'Monitored Works', value: total, context: 'Active Field Desk' },
          { label: 'Critical Tier', value: critical.length, context: 'Immediate Intervention', emphasis: 'critical' },
          { label: 'High Risk Tier', value: high.length, context: 'Close Surveillance', emphasis: 'high' },
          { label: 'New High Risk', value: newHighRisk.length, context: 'Escalated This Cycle', emphasis: 'critical' },
          { label: 'Risk Increased', value: riskIncreased.length, context: 'Worsening Trajectory', emphasis: 'high' },
          { label: 'Overdue Actions', value: overdueCount, context: 'Action Required', emphasis: overdueCount > 0 ? 'critical' : 'positive' },
        ]}
      />

      {/* Main Operational Mandate Question */}
      <div className="bg-white border-l-4 border-l-risk-critical-solid border-y border-r border-gov-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-3xl">
          <div className="section-eyebrow text-ink-subtle">
            Operational Field Priority Mandate
          </div>
          <h2 className="editorial-title text-xl text-ink font-serif font-bold">
            Which project needs my attention right now?
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Immediate attention is required on <strong>#{watchlist[0]?.id} {watchlist[0]?.name}</strong> (Score {watchlist[0]?.riskScore}/100) and <strong>#{watchlist[1]?.id} {watchlist[1]?.name}</strong> (Score {watchlist[1]?.riskScore}/100) due to consecutive progress stalls and widening execution gaps against sanctioned targets.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            to="/monitoring/watchlist"
            className="px-3.5 py-2 bg-ink hover:bg-ink-light text-white text-xs font-mono font-medium transition-colors rounded-xs shadow-xs"
          >
            Full Priority Watchlist ({total}) →
          </Link>
          <Link
            to="/monitoring/signals"
            className="px-3.5 py-2 bg-paper-subtle hover:bg-gov-border border border-gov-border text-xs font-mono font-medium text-ink transition-colors rounded-xs"
          >
            View Active Signals ({INITIAL_RISK_SIGNALS.length}) →
          </Link>
        </div>
      </div>

      {/* HERO FEATURE: PRIORITY WATCHLIST EMBEDDED PROMINENTLY */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-gov-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-paper-subtle/50">
          <div>
            <div className="section-eyebrow text-risk-critical-solid font-semibold">
              HERO OPERATIONAL REGISTER
            </div>
            <h3 className="editorial-title text-base text-ink font-bold font-serif">
              Priority Watchlist — Immediate Review Required
            </h3>
          </div>
          <Link
            to="/monitoring/watchlist"
            className="text-xs font-mono font-bold text-gov-terracotta hover:underline"
          >
            Open Dedicated Watchlist Workspace →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Project & Identification</th>
                <th>Risk Score</th>
                <th>Risk Tier</th>
                <th>Key Warning Signal</th>
                <th>Physical / Schedule Status</th>
                <th className="text-right">Action Directives</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((p, idx) => (
                <tr key={p.id} className={idx === 0 ? 'bg-risk-critical-bg/20' : 'hover:bg-paper-subtle/50 transition-colors'}>
                  <td>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs border ${
                      idx === 0
                        ? 'bg-risk-critical-solid text-white border-risk-critical-solid'
                        : idx === 1
                        ? 'bg-risk-high-solid text-white border-risk-high-solid'
                        : 'bg-paper-subtle text-ink border-gov-border'
                    }`}>
                      #{idx + 1} Priority
                    </span>
                  </td>
                  <td className="max-w-xs">
                    <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                      {p.name}
                    </Link>
                    <span className="text-[10px] font-mono text-ink-subtle block">
                      #{p.id} • {p.implementingAgency}
                    </span>
                  </td>
                  <td className="tabular-figure font-bold text-base text-ink">
                    {p.riskScore}
                  </td>
                  <td>
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td>
                    <span className="font-mono text-xs font-semibold text-risk-critical-solid bg-risk-critical-bg px-2 py-0.5 border border-risk-critical-border rounded-xs inline-block">
                      {p.keyWarningSignal}
                    </span>
                  </td>
                  <td className="font-mono text-xs">
                    <div>Progress: <strong>{p.progress.physicalProgress}%</strong> (Gap: {p.progress.progressGap}% pts)</div>
                    <div className="text-[10px] text-ink-subtle">Delay: +{p.schedule.timeOverrun} mos ({p.status})</div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/monitoring/actions?project=${p.id}`}
                        className="px-2 py-1 text-xs font-mono bg-paper-subtle hover:bg-gov-border border border-gov-border text-ink rounded-xs transition-colors"
                      >
                        Log Review
                      </Link>
                      <Link
                        to={`/project/${p.id}`}
                        className="px-2.5 py-1 text-xs font-mono font-bold text-gov-terracotta hover:underline"
                      >
                        Inspect Dossier →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Bottom Section: Active Risk Signals & Urgent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Risk Signals (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Field Warning Board</div>
              <h3 className="editorial-title text-base text-ink font-semibold">
                Current Risk Signals ({INITIAL_RISK_SIGNALS.length})
              </h3>
            </div>
            <Link to="/monitoring/signals" className="text-xs font-mono text-gov-terracotta hover:underline">
              All Signals →
            </Link>
          </div>

          <div className="space-y-3">
            {INITIAL_RISK_SIGNALS.map(sig => (
              <div key={sig.id} className="p-3 bg-paper-subtle border border-gov-border rounded-xs space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-ink-subtle">#{sig.projectId} • {sig.ministry}</span>
                    <h4 className="text-xs font-semibold text-ink">{sig.projectName}</h4>
                  </div>
                  <RiskBadge level={sig.severity} size="sm" />
                </div>
                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  {sig.summary}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-gov-border/60 text-[10px] font-mono text-ink-subtle">
                  <span>Signal: <strong>{sig.signalType}</strong></span>
                  <Link to={`/project/${sig.projectId}`} className="text-gov-terracotta font-semibold hover:underline">
                    Dossier →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Urgent Operational Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Critical Notifications</div>
              <h3 className="editorial-title text-base text-ink font-semibold">
                Urgent Alerts ({INITIAL_ALERTS.length})
              </h3>
            </div>
            <Link to="/monitoring/alerts" className="text-xs font-mono text-gov-terracotta hover:underline">
              Alert Center →
            </Link>
          </div>

          <div className="space-y-3">
            {INITIAL_ALERTS.slice(0, 4).map(alt => (
              <div key={alt.id} className="p-3 bg-paper-subtle border border-gov-border rounded-xs space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 bg-ink text-white rounded-xs">
                      {alt.alertType}
                    </span>
                    <span className="font-mono text-[10px] text-ink-subtle">#{alt.projectId}</span>
                  </div>
                  <span className="font-mono text-[10px] text-ink-subtle">{alt.timestamp}</span>
                </div>
                <h4 className="text-xs font-semibold text-ink">{alt.projectName}</h4>
                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  <strong className="text-ink font-medium">What:</strong> {alt.whatHappened}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-gov-border/60 text-[10px] font-mono text-ink-subtle">
                  <span className="text-risk-critical-solid font-semibold">Severity: {alt.severity}</span>
                  <Link to={`/project/${alt.projectId}`} className="text-gov-terracotta font-semibold hover:underline">
                    Inspect Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
