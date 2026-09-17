import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const PriorityProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'time' | 'cost'>('score');

  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(MOCK_PROJECTS.map(p => p.sector)))], []);
  const ministries = useMemo(() => ['ALL', ...Array.from(new Set(MOCK_PROJECTS.map(p => p.ministry)))], []);

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      const matchSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = selectedRisk === 'ALL' || p.riskLevel === selectedRisk;
      const matchSector = selectedSector === 'ALL' || p.sector === selectedSector;
      const matchMinistry = selectedMinistry === 'ALL' || p.ministry === selectedMinistry;
      return matchSearch && matchRisk && matchSector && matchMinistry;
    }).sort((a, b) => {
      if (sortBy === 'score') return b.riskScore - a.riskScore;
      if (sortBy === 'time') return b.schedule.timeOverrun - a.schedule.timeOverrun;
      if (sortBy === 'cost') return b.cost.costOverrunPercent - a.cost.costOverrunPercent;
      return 0;
    });
  }, [searchTerm, selectedRisk, selectedSector, selectedMinistry, sortBy]);

  const criticalCount = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical').length;
  const highCount = MOCK_PROJECTS.filter(p => p.riskLevel === 'High').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Policymaker Intelligence • Strategic Oversight"
        title="National Priority Infrastructure Projects"
        subtitle={`Rank-ordered inventory of major capital undertakings based on SANKET-AI composite risk index, designed for high-level ministerial intervention and cabinet committee review (${MOCK_REPORTING_MONTH}).`}
        badge="PRIORITY WATCHLIST"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Priority Inventory', value: MOCK_PROJECTS.length, context: 'Monitored Mega Works' },
          { label: 'Critical Tier Priority', value: criticalCount, context: 'Immediate Intervention (Score ≥ 80)', emphasis: 'critical' },
          { label: 'High Tier Priority', value: highCount, context: 'Close Oversight (Score 60–79)', emphasis: 'high' },
          { label: 'Filtered Count', value: filteredProjects.length, context: 'Matching Criteria' },
          { label: 'Avg Schedule Slippage', value: '47.8 mos', context: 'Across Priority Works' },
          { label: 'Avg Cost Variance', value: '+39.4%', context: 'Against Sanction Baseline' },
        ]}
      />

      {/* Institutional Filter & Search Bar */}
      <div className="bg-white border border-gov-border rounded-xs p-4 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Project ID (#), name, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-paper-subtle border border-gov-border rounded-xs focus:outline-none focus:border-ink"
            />
            <span className="absolute left-2.5 top-2 text-xs text-ink-subtle">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1.5 text-xs text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Risk Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            <span className="text-[10px] text-ink-subtle uppercase">Risk Tier:</span>
            {['ALL', 'Critical', 'High', 'Low'].map((r) => (
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

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-ink-subtle uppercase">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink focus:outline-none"
            >
              <option value="score">Risk Score (High to Low)</option>
              <option value="time">Time Overrun (Max to Min)</option>
              <option value="cost">Cost Overrun (Max to Min)</option>
            </select>
          </div>
        </div>

        {/* Secondary Dropdown Filter Strip */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gov-border/60 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-ink-subtle text-[11px]">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink"
            >
              {sectors.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Sectors' : s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-ink-subtle text-[11px]">Ministry:</span>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink max-w-xs truncate"
            >
              {ministries.map(m => <option key={m} value={m}>{m === 'ALL' ? 'All Ministries' : m}</option>)}
            </select>
          </div>

          {(selectedRisk !== 'ALL' || selectedSector !== 'ALL' || selectedMinistry !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedRisk('ALL');
                setSelectedSector('ALL');
                setSelectedMinistry('ALL');
                setSearchTerm('');
              }}
              className="text-[11px] text-gov-terracotta hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Serious Priority Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="px-6 py-3.5 border-b border-gov-border flex items-center justify-between">
          <span className="font-mono text-xs text-ink">
            Showing <strong className="font-bold">{filteredProjects.length}</strong> prioritized undertakings
          </span>
          <span className="font-mono text-[11px] text-ink-subtle">
            Select any project to inspect full machine learning explainability dossier
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Ministry</th>
                <th>Sector</th>
                <th>State / UT</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Key Warning Signal</th>
                <th className="text-right">Intelligence Dossier</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-paper-subtle/50 transition-colors">
                  <td className="font-mono text-xs text-ink-subtle font-semibold">#{p.id}</td>
                  <td className="max-w-xs">
                    <Link
                      to={`/project/${p.id}`}
                      className="font-semibold text-ink hover:text-gov-terracotta transition-colors block text-xs"
                    >
                      {p.name}
                    </Link>
                    <span className="text-[10px] text-ink-subtle font-mono block">
                      {p.implementingAgency}
                    </span>
                  </td>
                  <td className="text-xs text-ink-muted">
                    {p.ministry}
                  </td>
                  <td className="text-xs text-ink">
                    <span className="font-medium">{p.sector}</span>
                  </td>
                  <td className="text-xs text-ink">
                    <div>{p.state}</div>
                    {p.district && <div className="text-[10px] text-ink-subtle">{p.district}</div>}
                  </td>
                  <td className="tabular-figure font-bold text-sm text-ink">
                    {p.riskScore} <span className="text-[10px] text-ink-subtle font-normal">/ 100</span>
                  </td>
                  <td>
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td>
                    <span className="font-mono text-[11px] bg-paper-subtle px-2 py-0.5 border border-gov-border rounded-xs text-ink inline-block">
                      {p.keyWarningSignal}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link
                      to={`/project/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-medium text-gov-terracotta hover:underline px-2 py-1 bg-paper-subtle border border-gov-border hover:bg-gov-border rounded-xs transition-colors"
                    >
                      <span>Inspect Dossier</span>
                      <span>→</span>
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
