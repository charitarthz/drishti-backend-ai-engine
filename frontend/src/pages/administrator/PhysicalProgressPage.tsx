import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const PhysicalProgressPage: React.FC = () => {
  const [filterStallsOnly, setFilterStallsOnly] = useState<boolean>(false);

  const stalled = MOCK_PROJECTS.filter(p => p.progress.progressStall);
  const severeGaps = MOCK_PROJECTS.filter(p => p.progress.progressGap <= -20.0);

  const total = MOCK_PROJECTS.length;
  const avgPhysical = +(MOCK_PROJECTS.reduce((acc, p) => acc + p.progress.physicalProgress, 0) / total).toFixed(1);
  const avgExpected = +(MOCK_PROJECTS.reduce((acc, p) => acc + p.progress.expectedProgress, 0) / total).toFixed(1);
  const avgGap = +(avgPhysical - avgExpected).toFixed(1);

  const displayedProjects = (filterStallsOnly ? stalled : MOCK_PROJECTS).sort(
    (a, b) => a.progress.progressGap - b.progress.progressGap
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Administrator Portfolio • Physical Execution Parameters"
        title="Physical Progress Monitoring & Execution Velocity Stalls"
        subtitle={`Comparative tracking of physical execution percentages against sanctioned milestone schedules, net execution gaps, and monthly run-rate velocities (${MOCK_REPORTING_MONTH}).`}
        badge="PROGRESS MONITORING"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Evaluated Projects', value: total, context: 'Active Portfolio' },
          { label: 'Severe Execution Stalls', value: stalled.length, context: 'Velocity < 0.35%/mo', emphasis: 'critical' },
          { label: 'Progress Deficit ≤ -20%', value: severeGaps.length, context: 'Lagging Milestone', emphasis: 'high' },
          { label: 'Mean Physical Execution', value: `${avgPhysical}%`, context: 'Actual Cumulative' },
          { label: 'Mean Expected Target', value: `${avgExpected}%`, context: 'Sanction Milestone' },
          { label: 'Net Execution Deficit', value: `${avgGap}% pts`, context: 'Portfolio Gap', emphasis: 'critical' },
        ]}
      />

      {/* Physical Progress Visual Gap Comparison Matrix */}
      <div className="bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
        <div className="border-b border-gov-border pb-3 flex items-center justify-between">
          <div>
            <div className="section-eyebrow text-ink-subtle">Milestone Comparison</div>
            <h3 className="editorial-title text-base font-semibold text-ink">
              Actual Execution vs Sanctioned Milestone Target
            </h3>
          </div>
          <span className="font-mono text-xs text-ink-subtle">
            Sorted by largest execution deficit
          </span>
        </div>

        <div className="space-y-3.5 pt-1">
          {displayedProjects.slice(0, 5).map(p => (
            <div key={p.id} className="p-3 bg-paper-subtle border border-gov-border rounded-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-ink-subtle">#{p.id}</span>
                  <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta">
                    {p.name}
                  </Link>
                  <span className="font-mono text-[10px] text-ink-subtle">({p.sector})</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span>Actual: <strong>{p.progress.physicalProgress}%</strong></span>
                  <span className="text-ink-subtle">Target: {p.progress.expectedProgress}%</span>
                  <span className="font-bold text-risk-critical-solid">
                    {p.progress.progressGap}% pts
                  </span>
                </div>
              </div>

              {/* Progress Comparison Visual Bar */}
              <div className="relative w-full h-3 bg-white border border-gov-border rounded-xs overflow-hidden">
                {/* Expected Target Range Marker */}
                <div
                  className="absolute top-0 bottom-0 bg-stone-200"
                  style={{ width: `${p.progress.expectedProgress}%` }}
                />
                {/* Actual Physical Progress Bar */}
                <div
                  className={`relative h-full ${p.progress.progressStall ? 'bg-risk-critical-solid' : 'bg-gov-teal'}`}
                  style={{ width: `${p.progress.physicalProgress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toggle Strip */}
      <div className="flex items-center justify-between border-b border-gov-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setFilterStallsOnly(false)}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              !filterStallsOnly
                ? 'bg-ink text-white font-bold border-ink'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            All Projects ({total})
          </button>
          <button
            onClick={() => setFilterStallsOnly(true)}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              filterStallsOnly
                ? 'bg-ink text-white font-bold border-ink'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            Flagged Progress Stalls Only ({stalled.length})
          </button>
        </div>

        <span className="font-mono text-xs text-ink-subtle">
          Showing {displayedProjects.length} projects
        </span>
      </div>

      {/* Progress Monitoring Register Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID & Name</th>
                <th>Sector</th>
                <th>Physical Progress</th>
                <th>Expected Target</th>
                <th>Progress Gap</th>
                <th>Monthly Run-Rate</th>
                <th>Execution State</th>
                <th className="text-right">Inspection</th>
              </tr>
            </thead>
            <tbody>
              {displayedProjects.map(p => (
                <tr key={p.id} className="hover:bg-paper-subtle/50 transition-colors">
                  <td className="max-w-xs">
                    <span className="font-mono text-[10px] text-ink-subtle block">#{p.id}</span>
                    <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                      {p.name}
                    </Link>
                    <span className="text-[10px] text-ink-subtle font-mono">{p.implementingAgency}</span>
                  </td>
                  <td className="text-xs text-ink-muted">{p.sector}</td>
                  <td>
                    <div className="font-mono text-xs font-bold text-ink">
                      {p.progress.physicalProgress}%
                    </div>
                  </td>
                  <td>
                    <div className="font-mono text-xs text-ink-muted">
                      {p.progress.expectedProgress}%
                    </div>
                  </td>
                  <td>
                    <span className={`font-mono text-xs font-bold ${
                      p.progress.progressGap <= -20
                        ? 'text-risk-critical-solid'
                        : p.progress.progressGap < -5
                        ? 'text-risk-high-solid'
                        : 'text-risk-low-solid'
                    }`}>
                      {p.progress.progressGap}% pts
                    </span>
                  </td>
                  <td className="font-mono text-xs tabular-figure">
                    {p.progress.progressRate}% / mo
                  </td>
                  <td>
                    {p.progress.progressStall ? (
                      <span className="font-mono text-[10px] uppercase font-bold text-risk-critical-solid bg-risk-critical-bg px-2 py-0.5 border border-risk-critical-border rounded-xs">
                        Stall Flagged
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase text-gov-teal bg-gov-teal/10 px-2 py-0.5 border border-gov-teal/30 rounded-xs font-semibold">
                        Progressing
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    <Link
                      to={`/project/${p.id}`}
                      className="inline-block text-xs font-mono font-medium text-gov-terracotta hover:underline px-2 py-1 bg-paper-subtle border border-gov-border rounded-xs"
                    >
                      Inspect →
                    </Link>
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
