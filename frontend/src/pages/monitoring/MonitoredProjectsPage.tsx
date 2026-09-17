import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const MonitoredProjectsPage: React.FC = () => {
  const [filterNeedsReviewOnly, setFilterNeedsReviewOnly] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');

  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(MOCK_PROJECTS.map(p => p.sector)))], []);

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      const matchSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.implementingAgency.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSector = selectedSector === 'ALL' || p.sector === selectedSector;
      const needsReview = p.riskLevel === 'Critical' || p.progress.progressStall || p.progress.progressGap <= -15 || p.suggestedReviews.length > 0;
      const matchReview = !filterNeedsReviewOnly || needsReview;

      return matchSearch && matchSector && matchReview;
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [searchTerm, selectedSector, filterNeedsReviewOnly]);

  const reviewCount = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical' || p.progress.progressStall || p.suggestedReviews.length > 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Monitoring Desk • Field Register"
        title="Monitored Projects — Review Queue"
        subtitle={`Field inspection register focusing explicitly on 'What needs review right now?' — evaluating physical execution stalls, financial overruns, and milestone slippages (${MOCK_REPORTING_MONTH}).`}
        badge="PROJECT MONITORING"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Assigned Portfolio', value: MOCK_PROJECTS.length, context: 'Central Works' },
          { label: 'Immediate Review Needed', value: reviewCount, context: 'Stall / Critical Score', emphasis: 'critical' },
          { label: 'Execution Gap ≤ -15%', value: MOCK_PROJECTS.filter(p => p.progress.progressGap <= -15).length, context: 'Lagging Sanction', emphasis: 'high' },
          { label: 'Time Overrun > 24 Mos', value: MOCK_PROJECTS.filter(p => p.schedule.timeOverrun > 24).length, context: 'Multi-Year Delays' },
          { label: 'Displaying', value: filteredProjects.length, context: 'Filtered Queue' },
        ]}
      />

      {/* Operational Focus Filter Strip */}
      <div className="bg-white border border-gov-border rounded-xs p-4 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs font-mono">
        {/* Toggle Focus: What Needs Review vs All */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterNeedsReviewOnly(true)}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              filterNeedsReviewOnly
                ? 'bg-risk-critical-solid text-white font-bold border-risk-critical-solid'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            What Needs Review ({reviewCount})
          </button>
          <button
            onClick={() => setFilterNeedsReviewOnly(false)}
            className={`px-3 py-1.5 rounded-xs border transition-colors ${
              !filterNeedsReviewOnly
                ? 'bg-ink text-white font-bold border-ink'
                : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
            }`}
          >
            All Monitored Projects ({MOCK_PROJECTS.length})
          </button>
        </div>

        {/* Search & Sector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search project, agency, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1 bg-paper-subtle border border-gov-border rounded-xs text-xs font-mono text-ink focus:outline-none focus:border-ink w-64"
            />
            <span className="absolute left-2 top-1.5 text-xs text-ink-subtle">🔍</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-subtle text-[11px]">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink"
            >
              {sectors.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Sectors' : s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID & Name</th>
                <th>Physical Progress</th>
                <th>Progress Gap</th>
                <th>Cost Overrun</th>
                <th>Time Overrun</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Warning Signal</th>
                <th className="text-right">Inspection</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(p => (
                <tr key={p.id} className="hover:bg-paper-subtle/50 transition-colors">
                  <td className="max-w-xs">
                    <span className="font-mono text-[10px] text-ink-subtle block">#{p.id}</span>
                    <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                      {p.name}
                    </Link>
                    <span className="text-[10px] text-ink-subtle font-mono block">
                      {p.implementingAgency}
                    </span>
                  </td>
                  <td>
                    <div className="font-mono text-xs font-bold text-ink">
                      {p.progress.physicalProgress}%
                    </div>
                    <div className="text-[10px] text-ink-subtle font-mono">
                      Target: {p.progress.expectedProgress}%
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
                  <td>
                    <div className={`font-mono text-xs font-bold ${p.cost.costOverrunPercent > 10 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                      +{p.cost.costOverrunPercent}%
                    </div>
                    <div className="text-[10px] text-ink-subtle font-mono">
                      ₹{p.cost.revisedCost} Cr
                    </div>
                  </td>
                  <td>
                    <div className={`font-mono text-xs font-bold ${p.schedule.timeOverrun > 12 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                      +{p.schedule.timeOverrun} mos
                    </div>
                    <div className="text-[10px] text-ink-subtle font-mono">
                      COD: {p.schedule.revisedCompletion}
                    </div>
                  </td>
                  <td className="tabular-figure font-bold text-sm text-ink">{p.riskScore}</td>
                  <td>
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td>
                    <span className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded-xs border ${
                      p.keyWarningSignal === 'Progress Stall'
                        ? 'bg-risk-critical-bg text-risk-critical-solid border-risk-critical-border font-bold'
                        : 'bg-paper-subtle text-ink border-gov-border font-medium'
                    }`}>
                      {p.keyWarningSignal}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/monitoring/actions?project=${p.id}`}
                        className="px-2 py-1 text-xs font-mono bg-paper-subtle hover:bg-gov-border border border-gov-border text-ink rounded-xs transition-colors"
                      >
                        Action
                      </Link>
                      <Link
                        to={`/project/${p.id}`}
                        className="px-2 py-1 text-xs font-mono font-bold text-gov-terracotta hover:underline"
                      >
                        Dossier →
                      </Link>
                    </div>
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
