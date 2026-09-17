import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ActionStatusBadge } from '../../components/common/ActionStatusBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';
import { useActions } from '../../context/ActionContext';

export const AdminPriorityProjectsPage: React.FC = () => {
  const { actions } = useActions();
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const priorityProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      const matchSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.implementingAgency.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = selectedRisk === 'ALL' || p.riskLevel === selectedRisk;
      return matchSearch && matchRisk;
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [searchTerm, selectedRisk]);

  const criticalCount = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical').length;
  const highCount = MOCK_PROJECTS.filter(p => p.riskLevel === 'High').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <EditorialHeader
        eyebrow="Administrator Portfolio Oversight • Intervention Radar"
        title="Priority Projects Requiring Executive Follow-Up"
        subtitle={`Rank-ordered portfolio view mapping composite risk scores to active statutory interventions and administrative reviews (${MOCK_REPORTING_MONTH}).`}
        badge="ADMINISTRATOR PRIORITY"
      />

      <InformationBand
        cells={[
          { label: 'Priority Portfolio', value: MOCK_PROJECTS.length, context: 'Monitored Works' },
          { label: 'Critical Tier', value: criticalCount, context: 'Score ≥ 80 / 100', emphasis: 'critical' },
          { label: 'High Tier', value: highCount, context: 'Score 60–79', emphasis: 'high' },
          { label: 'Active Interventions', value: actions.filter(a => a.status !== 'Completed').length, context: 'Across Portfolio', emphasis: 'high' },
          { label: 'Overdue Reviews', value: actions.filter(a => a.status === 'Overdue').length, context: 'Action Required', emphasis: 'critical' },
        ]}
      />

      {/* Filter Bar */}
      <div className="bg-white border border-gov-border rounded-xs p-4 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Filter by ID, project name, or agency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-paper-subtle border border-gov-border rounded-xs focus:outline-none focus:border-ink text-ink"
          />
          <span className="absolute left-2.5 top-2 text-ink-subtle">🔍</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-ink-subtle uppercase">Risk Filter:</span>
          {['ALL', 'Critical', 'High', 'Low'].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRisk(r)}
              className={`px-2.5 py-1 rounded-xs border transition-colors ${
                selectedRisk === r
                  ? 'bg-ink text-white font-bold border-ink'
                  : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
              }`}
            >
              {r === 'ALL' ? 'All Tiers' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Project Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name & Agency</th>
                <th>Sector & State</th>
                <th>SANKET Score</th>
                <th>Risk Tier</th>
                <th>Physical / Schedule Gap</th>
                <th>Statutory Interventions</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {priorityProjects.map(p => {
                const projectActions = actions.filter(a => a.projectId === p.id);
                const latestAction = projectActions[0];

                return (
                  <tr key={p.id}>
                    <td className="font-mono text-xs text-ink-subtle font-semibold">#{p.id}</td>
                    <td className="max-w-xs">
                      <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                        {p.name}
                      </Link>
                      <span className="text-[10px] text-ink-subtle font-mono block">
                        {p.implementingAgency}
                      </span>
                    </td>
                    <td className="text-xs text-ink">
                      <div>{p.sector}</div>
                      <div className="text-[10px] text-ink-subtle">{p.state}</div>
                    </td>
                    <td className="tabular-figure font-bold text-sm text-ink">{p.riskScore}</td>
                    <td>
                      <RiskBadge level={p.riskLevel} size="sm" />
                    </td>
                    <td className="font-mono text-xs">
                      <div>Gap: <strong className="text-risk-critical-solid">{p.progress.progressGap}% pts</strong></div>
                      <div className="text-[10px] text-ink-subtle">Overrun: +{p.schedule.timeOverrun} mos</div>
                    </td>
                    <td>
                      {latestAction ? (
                        <div className="space-y-1">
                          <ActionStatusBadge status={latestAction.status} />
                          <div className="text-[10px] text-ink-muted font-mono truncate max-w-[180px]">
                            {latestAction.actionType}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-ink-subtle">No Active Action</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/administrator/actions?project=${p.id}`}
                          className="px-2 py-1 text-xs font-mono bg-paper-subtle hover:bg-gov-border border border-gov-border rounded-xs text-ink transition-colors"
                        >
                          Log Action
                        </Link>
                        <Link
                          to={`/project/${p.id}`}
                          className="px-2 py-1 text-xs font-mono text-gov-terracotta hover:underline font-semibold"
                        >
                          Dossier →
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
