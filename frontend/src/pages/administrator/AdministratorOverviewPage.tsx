import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ActionStatusBadge } from '../../components/common/ActionStatusBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';
import { useActions } from '../../context/ActionContext';

export const AdministratorOverviewPage: React.FC = () => {
  const { actions, openCount, overdueCount, inProgressCount, completedCount } = useActions();

  const total = MOCK_PROJECTS.length;
  const critical = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical');
  const high = MOCK_PROJECTS.filter(p => p.riskLevel === 'High');
  const medium = MOCK_PROJECTS.filter(p => p.riskLevel === 'Medium');
  const low = MOCK_PROJECTS.filter(p => p.riskLevel === 'Low');
  const increasing = MOCK_PROJECTS.filter(p => p.trendDirection === 'Increasing');

  // Priority projects: highest risk
  const topPriority = [...MOCK_PROJECTS].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  // Projects requiring review: those with suggested reviews or unaddressed stalls
  const requiringReview = MOCK_PROJECTS.filter(p => p.suggestedReviews.length > 0 || p.progress.progressStall).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Central Portfolio Administration • Executive Follow-Up Workspace"
        title="Infrastructure Portfolio Status & Statutory Interventions"
        subtitle={`Active operational oversight tracking project execution baselines, multi-cycle risk movement, and formal compliance reviews (${MOCK_REPORTING_MONTH}).`}
        badge="ADMINISTRATOR WORKSPACE"
      />

      {/* Editorial Portfolio Information Band */}
      <InformationBand
        cells={[
          { label: 'Total Portfolio Works', value: total, context: 'Central Sector Projects' },
          { label: 'Critical Tier', value: critical.length, context: 'Score ≥ 80 / 100', emphasis: 'critical' },
          { label: 'High Tier', value: high.length, context: 'Score 60–79', emphasis: 'high' },
          { label: 'Medium / Low Tier', value: medium.length + low.length, context: 'Scores < 60', emphasis: 'positive' },
          { label: 'Escalating Risk', value: increasing.length, context: 'Worsening Trajectory', emphasis: 'critical' },
          { label: 'Open Actions', value: openCount + inProgressCount, context: `${overdueCount} Overdue`, emphasis: overdueCount > 0 ? 'critical' : 'high' },
        ]}
      />

      {/* Core Question & Direct Portfolio Action Strip */}
      <div className="bg-white border-l-4 border-l-gov-teal border-y border-r border-gov-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-3xl">
          <div className="section-eyebrow text-ink-subtle">
            Administrator Portfolio Mandate
          </div>
          <h2 className="editorial-title text-xl text-ink font-serif font-bold">
            What is happening in my project portfolio and what follow-up has happened?
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Composite monitoring combines 3-pillar physical/financial baselines with direct statutory action enforcement. Of <strong>{total} monitored projects</strong>, <strong>{critical.length} carry critical risk</strong> and <strong>{openCount + inProgressCount} follow-up interventions</strong> are currently active across field agencies.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            to="/administrator/projects"
            className="px-3.5 py-2 bg-paper-subtle hover:bg-gov-border border border-gov-border text-xs font-mono font-medium text-ink transition-colors rounded-xs"
          >
            My Project Register ({total}) →
          </Link>
          <Link
            to="/administrator/actions"
            className="px-3.5 py-2 bg-ink hover:bg-ink-light text-white text-xs font-mono font-medium transition-colors rounded-xs"
          >
            Manage Interventions ({openCount + inProgressCount}) →
          </Link>
        </div>
      </div>

      {/* Section 1 & 2 Split: Priority Projects & Action Status Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Priority Projects Requiring Attention (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-gov-border flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Strategic Priority</div>
              <h3 className="editorial-title text-base text-ink font-semibold">
                1. Priority Portfolio Projects
              </h3>
            </div>
            <Link to="/administrator/priority-projects" className="text-xs font-mono text-gov-terracotta hover:underline">
              View All Priority →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Sector</th>
                  <th>Risk Score</th>
                  <th>Overrun Gap</th>
                  <th>Action Status</th>
                  <th className="text-right">Dossier</th>
                </tr>
              </thead>
              <tbody>
                {topPriority.map(p => {
                  const pActions = actions.filter(a => a.projectId === p.id);
                  const latestAction = pActions[0];

                  return (
                    <tr key={p.id}>
                      <td className="max-w-xs">
                        <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                          {p.name}
                        </Link>
                        <span className="text-[10px] font-mono text-ink-subtle block">
                          #{p.id} • {p.implementingAgency}
                        </span>
                      </td>
                      <td className="text-xs text-ink-muted">{p.sector}</td>
                      <td className="tabular-figure font-bold text-sm text-ink">{p.riskScore}</td>
                      <td className="font-mono text-xs">
                        <span className="text-risk-critical-solid">{p.progress.progressGap}% pts</span>
                      </td>
                      <td>
                        {latestAction ? (
                          <ActionStatusBadge status={latestAction.status} />
                        ) : (
                          <span className="text-[10px] font-mono text-ink-subtle">Unassigned</span>
                        )}
                      </td>
                      <td className="text-right">
                        <Link
                          to={`/project/${p.id}`}
                          className="text-xs font-mono font-medium text-gov-terracotta hover:underline"
                        >
                          Inspect →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Statutory Action Status Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-5">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Compliance Enforcement</div>
              <h3 className="editorial-title text-base text-ink font-semibold">
                2. Intervention Action Status
              </h3>
            </div>
            <Link to="/administrator/actions" className="text-xs font-mono text-gov-terracotta hover:underline">
              All Actions →
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-ink block">Open Actions</span>
                <span className="text-[10px] text-ink-subtle font-sans">Awaiting field officer review initiation</span>
              </div>
              <span className="text-base font-bold tabular-figure text-ink">{openCount}</span>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-900 block">In Progress</span>
                <span className="text-[10px] text-amber-700 font-sans">Field verification or inter-agency sessions active</span>
              </div>
              <span className="text-base font-bold tabular-figure text-amber-900">{inProgressCount}</span>
            </div>

            <div className="p-3 bg-risk-critical-bg/40 border border-risk-critical-border rounded-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-risk-critical-solid block">Overdue Reviews</span>
                <span className="text-[10px] text-risk-critical-solid/80 font-sans">Elapsed past targeted statutory deadline</span>
              </div>
              <span className="text-base font-bold tabular-figure text-risk-critical-solid">{overdueCount}</span>
            </div>

            <div className="p-3 bg-risk-low-bg/40 border border-risk-low-border rounded-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-risk-low-solid block">Completed Interventions</span>
                <span className="text-[10px] text-risk-low-solid/80 font-sans">Formally verified & logged this quarter</span>
              </div>
              <span className="text-base font-bold tabular-figure text-risk-low-solid">{completedCount}</span>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-gov-border">
            <Link
              to="/administrator/actions"
              className="text-xs font-mono text-gov-terracotta hover:underline font-semibold"
            >
              + Create New Statutory Action Item →
            </Link>
          </div>
        </div>
      </div>

      {/* Section 3 & 4 Split: Portfolio Risk Movement & Projects Requiring Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Portfolio Risk Movement (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Trajectory Analysis</div>
              <h3 className="editorial-title text-base text-ink font-semibold">
                3. Portfolio Risk Movement (Past 6 Cycles)
              </h3>
            </div>
            <Link to="/administrator/risk-trends" className="text-xs font-mono text-gov-terracotta hover:underline">
              Risk Trends →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
            <div className="p-3 bg-risk-critical-bg/30 border border-risk-critical-border rounded-xs">
              <span className="text-[10px] text-risk-critical-solid uppercase block font-semibold">Increasing</span>
              <span className="text-xl font-bold text-risk-critical-solid tabular-figure">{increasing.length}</span>
              <span className="text-[10px] text-ink-muted block mt-0.5">Worsening</span>
            </div>

            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
              <span className="text-[10px] text-ink uppercase block font-semibold">Stable</span>
              <span className="text-xl font-bold text-ink tabular-figure">
                {MOCK_PROJECTS.filter(p => p.trendDirection === 'Stable').length}
              </span>
              <span className="text-[10px] text-ink-muted block mt-0.5">No Net Change</span>
            </div>

            <div className="p-3 bg-risk-low-bg/30 border border-risk-low-border rounded-xs">
              <span className="text-[10px] text-risk-low-solid uppercase block font-semibold">Decreasing</span>
              <span className="text-xl font-bold text-risk-low-solid tabular-figure">
                {MOCK_PROJECTS.filter(p => p.trendDirection === 'Decreasing').length}
              </span>
              <span className="text-[10px] text-ink-muted block mt-0.5">De-escalating</span>
            </div>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed font-sans">
            Score escalations in the current review cycle are driven primarily by consecutive progress stalls in railway corridors and high-percentage civil cost variations.
          </p>
        </div>

        {/* Right: Projects Flagged Requiring Immediate Review (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Operational Alerts</div>
              <h3 className="editorial-title text-base text-ink font-semibold">
                4. Projects Requiring Executive Review
              </h3>
            </div>
            <span className="font-mono text-xs text-ink-subtle">
              Flagged by ML Drivers
            </span>
          </div>

          <div className="space-y-3">
            {requiringReview.map(p => {
              const suggested = p.suggestedReviews[0];
              return (
                <div key={p.id} className="p-3.5 bg-paper-subtle border border-gov-border rounded-xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-ink-subtle">#{p.id} • {p.sector}</span>
                      <h4 className="text-xs font-semibold text-ink">{p.name}</h4>
                    </div>
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </div>
                  {suggested && (
                    <div className="text-[11px] font-mono text-gov-terracotta bg-gov-terracotta/5 px-2 py-1 rounded-xs border border-gov-terracotta/20">
                      <strong>Recommended:</strong> {suggested.suggestedActionType} — {suggested.triggerSignal}
                    </div>
                  )}
                  <div className="flex justify-end pt-1">
                    <Link
                      to={`/administrator/actions?project=${p.id}`}
                      className="text-xs font-mono text-gov-terracotta hover:underline font-semibold"
                    >
                      Assign Review Action →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
