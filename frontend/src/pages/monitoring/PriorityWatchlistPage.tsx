import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const PriorityWatchlistPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedSignal, setSelectedSignal] = useState<string>('ALL');

  const warningSignals = [
    'ALL',
    'Progress Stall',
    'Progress Below Expected',
    'Time Overrun',
    'Cost Overrun'
  ];

  const filteredWatchlist = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      const matchSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.implementingAgency.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = selectedRisk === 'ALL' || p.riskLevel === selectedRisk;
      const matchSignal = selectedSignal === 'ALL' || p.keyWarningSignal === selectedSignal;
      return matchSearch && matchRisk && matchSignal;
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [searchTerm, selectedRisk, selectedSignal]);

  const criticalCount = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical').length;
  const highCount = MOCK_PROJECTS.filter(p => p.riskLevel === 'High').length;
  const stallCount = MOCK_PROJECTS.filter(p => p.progress.progressStall).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Monitoring Officer Workspace • Operational Prioritisation"
        title="Priority Monitoring Watchlist"
        subtitle={`The operational action queue answering: 'Which project should I review first?' Rank-ordered strictly by composite SANKET-AI risk scores and measurable physical/financial warning signals (${MOCK_REPORTING_MONTH}).`}
        badge="HERO FEATURE"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Assigned Portfolio', value: MOCK_PROJECTS.length, context: 'Monitored Works' },
          { label: 'Priority 1: Critical', value: criticalCount, context: 'Immediate Inspection Required', emphasis: 'critical' },
          { label: 'Priority 2: High Risk', value: highCount, context: 'Schedule Reviews Advised', emphasis: 'high' },
          { label: 'Active Progress Stalls', value: stallCount, context: 'Velocity < 0.35%/mo', emphasis: 'critical' },
          { label: 'Current Review Return', value: 'Oct 2025', context: 'PAIMANA Cycle' },
        ]}
      />

      {/* Core Answering Callout */}
      <div className="bg-white border-l-4 border-l-risk-critical-solid border-y border-r border-gov-border p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="section-eyebrow text-risk-critical-solid font-bold">OPERATIONAL DIRECTIVE</div>
          <h2 className="editorial-title text-base font-bold text-ink font-serif mt-0.5">
            Which project should I review first?
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed mt-1">
            <strong>Rank #1 ({filteredWatchlist[0]?.id} {filteredWatchlist[0]?.name})</strong> carries the highest national risk score of <strong>{filteredWatchlist[0]?.riskScore}/100</strong>, driven by severe progress stall and -45.6% points milestone lag.
          </p>
        </div>
        <Link
          to={`/project/${filteredWatchlist[0]?.id}`}
          className="px-4 py-2 bg-ink hover:bg-ink-light text-white text-xs font-mono font-bold rounded-xs transition-colors shadow-xs shrink-0"
        >
          Review Rank #1 Immediately →
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-gov-border rounded-xs p-4 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs font-mono">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by ID, project name, or agency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-paper-subtle border border-gov-border rounded-xs focus:outline-none focus:border-ink text-ink"
          />
          <span className="absolute left-2.5 top-2 text-ink-subtle">🔍</span>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1.5 text-ink-muted hover:text-ink">
              ✕
            </button>
          )}
        </div>

        {/* Risk Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] text-ink-subtle uppercase">Risk Tier:</span>
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
              {r === 'ALL' ? 'All' : r}
            </button>
          ))}
        </div>

        {/* Warning Signal Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-ink-subtle uppercase">Signal:</span>
          <select
            value={selectedSignal}
            onChange={(e) => setSelectedSignal(e.target.value)}
            className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink"
          >
            {warningSignals.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Signals' : s}</option>)}
          </select>
        </div>
      </div>

      {/* Hero Operational Priority Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="w-20 text-center">Priority</th>
                <th>Project & Identification</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Key Warning Signal</th>
                <th>Project Status</th>
                <th className="text-right">Operational Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWatchlist.map((p, idx) => (
                <tr key={p.id} className={idx === 0 ? 'bg-risk-critical-bg/25 font-medium' : 'hover:bg-paper-subtle/50 transition-colors'}>
                  <td className="text-center font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded-xs text-xs font-bold ${
                      idx === 0
                        ? 'bg-risk-critical-solid text-white shadow-xs'
                        : idx === 1
                        ? 'bg-risk-high-solid text-white'
                        : 'bg-paper-subtle text-ink border border-gov-border'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="max-w-xs">
                    <span className="font-mono text-[10px] text-ink-subtle block">#{p.id}</span>
                    <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                      {p.name}
                    </Link>
                    <span className="text-[10px] text-ink-subtle font-mono block">
                      {p.ministry} • {p.implementingAgency}
                    </span>
                  </td>
                  <td className="tabular-figure font-bold text-base text-ink">
                    {p.riskScore}
                    <span className="text-[10px] text-ink-subtle font-normal"> / 100</span>
                  </td>
                  <td>
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td>
                    <span className={`inline-block font-mono text-xs font-semibold px-2 py-0.5 rounded-xs border ${
                      p.keyWarningSignal === 'Progress Stall'
                        ? 'bg-risk-critical-bg text-risk-critical-solid border-risk-critical-border font-bold'
                        : 'bg-paper-subtle text-ink border-gov-border'
                    }`}>
                      {p.keyWarningSignal}
                    </span>
                  </td>
                  <td>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold border ${
                      p.status === 'Delayed' || p.status === 'Critical Delay'
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-risk-low-bg text-risk-low-solid border-risk-low-border'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                    <div className="text-[10px] font-mono text-ink-subtle mt-0.5">
                      +{p.schedule.timeOverrun} mos delay
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/monitoring/actions?project=${p.id}`}
                        className="px-2.5 py-1 text-xs font-mono bg-paper-subtle hover:bg-gov-border border border-gov-border text-ink rounded-xs transition-colors"
                      >
                        Log Action
                      </Link>
                      <Link
                        to={`/project/${p.id}`}
                        className="px-3 py-1 text-xs font-mono font-bold bg-ink hover:bg-ink-light text-white rounded-xs transition-colors shadow-xs"
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
    </div>
  );
};
