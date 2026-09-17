import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const MonitoringRiskTrendsPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('615186');
  const [selectedTrajectory, setSelectedTrajectory] = useState<'ALL' | 'Increasing' | 'Stable' | 'Decreasing'>('ALL');

  const selectedProj = MOCK_PROJECTS.find(p => p.id === selectedId) || MOCK_PROJECTS[0];

  const filteredProjects = MOCK_PROJECTS.filter(
    p => selectedTrajectory === 'ALL' || p.trendDirection === selectedTrajectory
  ).sort((a, b) => b.riskScore - a.riskScore);

  const history = selectedProj.riskHistory;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Monitoring Desk • Trajectory Tracking"
        title="Historical Risk Movement & Velocity Desk"
        subtitle={`Audit of 6-cycle empirical risk score drift across field-monitored projects (${MOCK_REPORTING_MONTH}). Grounded strictly in past physical and financial reporting returns with zero synthetic future extrapolations.`}
        badge="RISK TRENDS"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Monitored Works', value: MOCK_PROJECTS.length, context: 'Active Desk' },
          { label: 'Escalating Score Trajectory', value: MOCK_PROJECTS.filter(p => p.trendDirection === 'Increasing').length, context: 'Worsening Trend', emphasis: 'critical' },
          { label: 'Stable Score Trajectory', value: MOCK_PROJECTS.filter(p => p.trendDirection === 'Stable').length, context: 'No Net Shift' },
          { label: 'De-escalating Works', value: MOCK_PROJECTS.filter(p => p.trendDirection === 'Decreasing').length, context: 'Improving Milestones', emphasis: 'positive' },
          { label: 'Historical Observation Window', value: '6 Cycles', context: 'May 2025 to Oct 2025' },
        ]}
      />

      {/* Selected Project Historical Progression Banner */}
      <div className="bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
        <div className="border-b border-gov-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="section-eyebrow text-ink-subtle">Empirical Observation History</div>
            <h3 className="editorial-title text-base font-semibold text-ink">
              Trajectory Progression: {selectedProj.name}
            </h3>
            <span className="text-xs text-ink-muted">
              #{selectedProj.id} • {selectedProj.implementingAgency}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-ink-subtle">Focus Project:</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2.5 py-1.5 text-xs font-mono text-ink max-w-xs truncate focus:outline-none"
            >
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.id} — {p.name.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 6 Monthly Data Cells */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs font-mono">
          {history.map((h, i) => (
            <div key={i} className={`p-3 rounded-xs border ${
              i === history.length - 1
                ? 'bg-ink text-white border-ink'
                : 'bg-paper-subtle border-gov-border text-ink'
            }`}>
              <span className={`text-[10px] block uppercase ${i === history.length - 1 ? 'text-white/70' : 'text-ink-subtle'}`}>
                {h.month}
              </span>
              <span className="text-lg font-bold block tabular-figure mt-1">
                {h.score} <span className="text-[10px] font-normal">/ 100</span>
              </span>
              <span className={`text-[9px] uppercase font-bold block mt-0.5 ${
                h.level === 'Critical' ? 'text-red-400' : h.level === 'High' ? 'text-amber-400' : 'text-teal-400'
              }`}>
                {h.level} Tier
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-ink-subtle pt-2 border-t border-gov-border">
          <span>Observed 6-Cycle Score Shift: <strong className="text-ink">{history[0]?.score} → {history[history.length - 1]?.score} ({selectedProj.riskScore - history[0]?.score >= 0 ? '+' : ''}{selectedProj.riskScore - history[0]?.score} pts)</strong></span>
          <Link to={`/project/${selectedProj.id}`} className="text-gov-terracotta hover:underline font-bold">
            Inspect Project Intelligence Dossier →
          </Link>
        </div>
      </div>

      {/* Trajectory Filter Tabs */}
      <div className="flex items-center justify-between border-b border-gov-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-ink-subtle text-[10px] uppercase">Filter Trajectory:</span>
          {[
            { id: 'ALL', label: `All Projects (${MOCK_PROJECTS.length})` },
            { id: 'Increasing', label: 'Increasing Trend' },
            { id: 'Stable', label: 'Stable Trend' },
            { id: 'Decreasing', label: 'Decreasing Trend' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTrajectory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xs border transition-colors ${
                selectedTrajectory === tab.id
                  ? 'bg-ink text-white font-bold border-ink'
                  : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="font-mono text-xs text-ink-subtle">
          Showing {filteredProjects.length} projects
        </span>
      </div>

      {/* Master Movement Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID & Name</th>
                <th>Sector</th>
                <th>Current Risk</th>
                <th>Trend Direction</th>
                <th>May '25</th>
                <th>Jun '25</th>
                <th>Jul '25</th>
                <th>Aug '25</th>
                <th>Sep '25</th>
                <th>Oct '25</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(p => (
                <tr key={p.id} className={p.id === selectedId ? 'bg-paper-subtle/80 font-medium' : 'hover:bg-paper-subtle/50 transition-colors'}>
                  <td className="max-w-xs">
                    <span className="font-mono text-[10px] text-ink-subtle block">#{p.id}</span>
                    <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                      {p.name}
                    </Link>
                    <span className="text-[10px] text-ink-subtle font-mono">{p.implementingAgency}</span>
                  </td>
                  <td className="text-xs text-ink-muted">{p.sector}</td>
                  <td>
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs border ${
                      p.trendDirection === 'Increasing'
                        ? 'bg-risk-critical-bg text-risk-critical-solid border-risk-critical-border'
                        : p.trendDirection === 'Decreasing'
                        ? 'bg-risk-low-bg text-risk-low-solid border-risk-low-border'
                        : 'bg-paper-subtle text-ink-subtle border-gov-border'
                    }`}>
                      {p.trendDirection.toUpperCase()}
                    </span>
                  </td>
                  {p.riskHistory.map((h, i) => (
                    <td key={i} className="tabular-figure font-mono text-xs text-ink">
                      {h.score}
                    </td>
                  ))}
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setSelectedId(p.id);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`px-2 py-1 text-xs font-mono border rounded-xs transition-colors ${
                        p.id === selectedId
                          ? 'bg-ink text-white font-bold border-ink'
                          : 'bg-paper-subtle hover:bg-gov-border text-ink border-gov-border'
                      }`}
                    >
                      {p.id === selectedId ? 'Viewing' : 'Focus →'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
