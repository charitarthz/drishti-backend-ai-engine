import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const CostAnalysisPage: React.FC = () => {
  const [filterThreshold, setFilterThreshold] = useState<'ALL' | 'OVERRUN_20' | 'MULTIPLE_REVISIONS' | 'HIGH_ABSORPTION'>('ALL');

  const totalOriginal = MOCK_PROJECTS.reduce((acc, p) => acc + p.cost.originalApprovedCost, 0);
  const totalRevised = MOCK_PROJECTS.reduce((acc, p) => acc + p.cost.revisedCost, 0);
  const totalSpent = MOCK_PROJECTS.reduce((acc, p) => acc + p.cost.cumulativeExpenditure, 0);
  const netOverrunPercent = +(((totalRevised - totalOriginal) / totalOriginal) * 100).toFixed(1);

  const severeCostOverruns = MOCK_PROJECTS.filter(p => p.cost.costOverrunPercent >= 20.0);
  const multipleRevisions = MOCK_PROJECTS.filter(p => p.cost.costRevisionCount >= 2);

  const displayedProjects = MOCK_PROJECTS.filter(p => {
    if (filterThreshold === 'OVERRUN_20') return p.cost.costOverrunPercent >= 20.0;
    if (filterThreshold === 'MULTIPLE_REVISIONS') return p.cost.costRevisionCount >= 2;
    if (filterThreshold === 'HIGH_ABSORPTION') {
      const absorption = (p.cost.cumulativeExpenditure / p.cost.revisedCost) * 100;
      return absorption >= 80 && p.progress.physicalProgress < 75;
    }
    return true;
  }).sort((a, b) => b.cost.costOverrunPercent - a.cost.costOverrunPercent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Administrator Portfolio • Financial Baseline Parameters"
        title="Cost Monitoring & Capital Outlay Variations"
        subtitle={`Dedicated financial intelligence tracking sanctioned baselines, formal administrative approvals, cumulative disbursements, and cost-escalation risk signals (${MOCK_REPORTING_MONTH}).`}
        badge="COST MONITORING"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Sanction Baseline', value: `₹${(totalOriginal / 1000).toFixed(1)}k Cr`, context: 'Original Approved' },
          { label: 'Revised Approved', value: `₹${(totalRevised / 1000).toFixed(1)}k Cr`, context: 'Current Sanction' },
          { label: 'Cumulative Disbursed', value: `₹${(totalSpent / 1000).toFixed(1)}k Cr`, context: 'Fund Utilization' },
          { label: 'Net Portfolio Drift', value: `+${netOverrunPercent}%`, context: 'Aggregate Escalation', emphasis: 'critical' },
          { label: 'Cost Overrun ≥ 20%', value: severeCostOverruns.length, context: 'Severe Drift Works', emphasis: 'high' },
          { label: 'Multiple Cost Revisions', value: multipleRevisions.length, context: '≥ 2 Formal Revisions', emphasis: 'high' },
        ]}
      />

      {/* Cost Warning Signal Radar Box */}
      <div className="bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-4">
        <div className="border-b border-gov-border pb-3 flex items-center justify-between">
          <div>
            <div className="section-eyebrow text-ink-subtle">Early-Warning Indicator</div>
            <h3 className="editorial-title text-base font-semibold text-ink">
              Projects with Cost-Related Risk Signals
            </h3>
          </div>
          <span className="font-mono text-xs text-ink-subtle">
            Expenditure Mismatches vs Physical Milestones
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-risk-critical-bg/30 border border-risk-critical-border rounded-xs space-y-1">
            <span className="font-bold text-risk-critical-solid block text-[11px]">Acute Cost Escalation (&gt;40%)</span>
            <p className="text-ink text-[11px] font-sans">
              <strong>{MOCK_PROJECTS.filter(p => p.cost.costOverrunPercent >= 40).length} projects</strong> carry major cost drift, led by Katra-Banihal (+808%) and Barmer Refinery (+69.1%).
            </p>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xs space-y-1">
            <span className="font-bold text-amber-900 block text-[11px]">High Absorption vs Low Physical Progress</span>
            <p className="text-ink text-[11px] font-sans">
              Cumulative disbursements exceeding 75% of revised cost while physical execution remains below 60%.
            </p>
          </div>

          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs space-y-1">
            <span className="font-bold text-ink block text-[11px]">Repeated Revision Loops</span>
            <p className="text-ink text-[11px] font-sans">
              <strong>{multipleRevisions.length} projects</strong> have undergone 2 or more formal Standing Committee cost revisions.
            </p>
          </div>
        </div>
      </div>

      {/* Threshold Filter Strip */}
      <div className="flex items-center justify-between border-b border-gov-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-ink-subtle text-[10px] uppercase">Filter View:</span>
          {[
            { id: 'ALL', label: 'All Monitored Projects' },
            { id: 'OVERRUN_20', label: 'Overrun ≥ 20%' },
            { id: 'MULTIPLE_REVISIONS', label: 'Multiple Revisions (≥2)' },
            { id: 'HIGH_ABSORPTION', label: 'High Absorption / Low Progress' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterThreshold(tab.id as any)}
              className={`px-3 py-1.5 rounded-xs border transition-colors ${
                filterThreshold === tab.id
                  ? 'bg-ink text-white font-bold border-ink'
                  : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="font-mono text-xs text-ink-subtle">
          Showing {displayedProjects.length} projects
        </span>
      </div>

      {/* Comprehensive Cost Comparison Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID & Title</th>
                <th>Ministry</th>
                <th>Original Approved</th>
                <th>Revised Sanction</th>
                <th>Net Cost Drift</th>
                <th>Cost Overrun %</th>
                <th>Cumulative Spent</th>
                <th>Absorption Ratio</th>
                <th>Revisions</th>
                <th className="text-right">Dossier</th>
              </tr>
            </thead>
            <tbody>
              {displayedProjects.map(p => {
                const varianceCr = p.cost.revisedCost - p.cost.originalApprovedCost;
                const absorptionPct = +((p.cost.cumulativeExpenditure / p.cost.revisedCost) * 100).toFixed(1);

                return (
                  <tr key={p.id} className="hover:bg-paper-subtle/50 transition-colors">
                    <td className="max-w-xs">
                      <span className="font-mono text-[10px] text-ink-subtle block">#{p.id}</span>
                      <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                        {p.name}
                      </Link>
                      <span className="text-[10px] text-ink-subtle font-mono">{p.implementingAgency}</span>
                    </td>
                    <td className="text-xs text-ink-muted">
                      {p.ministry.replace('Ministry of ', '')}
                    </td>
                    <td className="tabular-figure font-mono text-xs">
                      ₹{p.cost.originalApprovedCost.toLocaleString()} Cr
                    </td>
                    <td className="tabular-figure font-mono text-xs font-bold text-ink">
                      ₹{p.cost.revisedCost.toLocaleString()} Cr
                    </td>
                    <td className="tabular-figure font-mono text-xs">
                      {varianceCr > 0 ? `+₹${varianceCr.toLocaleString()} Cr` : '₹0 Cr'}
                    </td>
                    <td>
                      <span className={`tabular-figure font-mono text-xs font-bold ${
                        p.cost.costOverrunPercent >= 20
                          ? 'text-risk-critical-solid'
                          : p.cost.costOverrunPercent > 5
                          ? 'text-risk-high-solid'
                          : 'text-risk-low-solid'
                      }`}>
                        +{p.cost.costOverrunPercent}%
                      </span>
                    </td>
                    <td className="tabular-figure font-mono text-xs text-ink">
                      ₹{p.cost.cumulativeExpenditure.toLocaleString()} Cr
                    </td>
                    <td>
                      <div className="font-mono text-xs">
                        <span className="font-semibold text-ink">{absorptionPct}%</span>
                        <div className="w-16 bg-paper-subtle h-1.5 rounded-xs overflow-hidden border border-gov-border mt-0.5">
                          <div
                            className={`h-full ${absorptionPct >= 85 ? 'bg-risk-critical-solid' : 'bg-gov-teal'}`}
                            style={{ width: `${Math.min(absorptionPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="tabular-figure font-mono text-xs text-center font-semibold">
                      {p.cost.costRevisionCount}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
