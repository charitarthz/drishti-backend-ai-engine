import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ActionStatusBadge } from '../../components/common/ActionStatusBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';
import { useActions } from '../../context/ActionContext';

export const ProjectPortfolioPage: React.FC = () => {
  const { actions } = useActions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedActionStatus, setSelectedActionStatus] = useState<string>('ALL');

  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(MOCK_PROJECTS.map(p => p.sector)))], []);
  const ministries = useMemo(() => ['ALL', ...Array.from(new Set(MOCK_PROJECTS.map(p => p.ministry)))], []);
  const states = useMemo(() => ['ALL', ...Array.from(new Set(MOCK_PROJECTS.map(p => p.state)))], []);
  const agencies = useMemo(() => ['ALL', ...Array.from(new Set(MOCK_PROJECTS.map(p => p.implementingAgency)))], []);
  const statuses = useMemo(() => ['ALL', ...Array.from(new Set(MOCK_PROJECTS.map(p => p.status)))], []);

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      const matchSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.implementingAgency.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = selectedRisk === 'ALL' || p.riskLevel === selectedRisk;
      const matchSector = selectedSector === 'ALL' || p.sector === selectedSector;
      const matchMinistry = selectedMinistry === 'ALL' || p.ministry === selectedMinistry;
      const matchState = selectedState === 'ALL' || p.state === selectedState;
      const matchAgency = selectedAgency === 'ALL' || p.implementingAgency === selectedAgency;
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

      const projectActions = actions.filter(a => a.projectId === p.id);
      let matchAction = true;
      if (selectedActionStatus !== 'ALL') {
        if (selectedActionStatus === 'NO_ACTION') {
          matchAction = projectActions.length === 0;
        } else {
          matchAction = projectActions.some(a => a.status === selectedActionStatus);
        }
      }

      return matchSearch && matchRisk && matchSector && matchMinistry && matchState && matchAgency && matchStatus && matchAction;
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [searchTerm, selectedRisk, selectedSector, selectedMinistry, selectedState, selectedAgency, selectedStatus, selectedActionStatus, actions]);

  const total = MOCK_PROJECTS.length;
  const critical = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical').length;
  const delayed = MOCK_PROJECTS.filter(p => p.schedule.timeOverrun > 12).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Administrator Portfolio • Central Project Register"
        title="My Projects Portfolio Register"
        subtitle={`Master registry of central infrastructure works detailing multi-pillar baseline performance, risk scores, and active statutory review status (${MOCK_REPORTING_MONTH}).`}
        badge="PROJECT REGISTER"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Registered Projects', value: total, context: 'Active Portfolio' },
          { label: 'Critical Tier', value: critical, context: 'Score ≥ 80 / 100', emphasis: 'critical' },
          { label: 'Time Overrun > 12 Mos', value: delayed, context: 'Delayed Projects', emphasis: 'high' },
          { label: 'Active Statutory Reviews', value: actions.filter(a => a.status !== 'Completed').length, context: 'Open / In Progress', emphasis: 'high' },
          { label: 'Filtered Count', value: filteredProjects.length, context: 'Matching Criteria' },
        ]}
      />

      {/* Advanced Filter Toolbar */}
      <div className="bg-white border border-gov-border rounded-xs p-4 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by ID, project name, agency, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-paper-subtle border border-gov-border rounded-xs focus:outline-none focus:border-ink text-ink"
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

          {/* Risk Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
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

          {/* Action Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-ink-subtle uppercase">Action:</span>
            <select
              value={selectedActionStatus}
              onChange={(e) => setSelectedActionStatus(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink"
            >
              <option value="ALL">All Actions</option>
              <option value="Open">Has Open</option>
              <option value="In Progress">Has In Progress</option>
              <option value="Overdue">Has Overdue</option>
              <option value="Completed">Has Completed</option>
              <option value="NO_ACTION">No Actions</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-2.5 border-t border-gov-border/60 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-ink-subtle text-[11px]">Ministry:</span>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink max-w-[170px] truncate"
            >
              {ministries.map(m => <option key={m} value={m}>{m === 'ALL' ? 'All Ministries' : m}</option>)}
            </select>
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

          <div className="flex items-center gap-1.5">
            <span className="text-ink-subtle text-[11px]">State/UT:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink max-w-[150px] truncate"
            >
              {states.map(st => <option key={st} value={st}>{st === 'ALL' ? 'All States' : st}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-subtle text-[11px]">Agency:</span>
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink max-w-[160px] truncate"
            >
              {agencies.map(a => <option key={a} value={a}>{a === 'ALL' ? 'All Agencies' : a.split('(')[0].trim()}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-subtle text-[11px]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2 py-1 text-xs font-mono text-ink"
            >
              {statuses.map(st => <option key={st} value={st}>{st === 'ALL' ? 'All Statuses' : st}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 ml-auto text-[11px] text-ink-subtle">
            <span>Cycle:</span>
            <span className="font-semibold text-ink bg-paper-subtle px-1.5 py-0.5 border border-gov-border rounded-xs">
              {MOCK_REPORTING_MONTH}
            </span>
          </div>

          {(selectedRisk !== 'ALL' || selectedSector !== 'ALL' || selectedMinistry !== 'ALL' || selectedState !== 'ALL' || selectedAgency !== 'ALL' || selectedStatus !== 'ALL' || selectedActionStatus !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedRisk('ALL');
                setSelectedSector('ALL');
                setSelectedMinistry('ALL');
                setSelectedState('ALL');
                setSelectedAgency('ALL');
                setSelectedStatus('ALL');
                setSelectedActionStatus('ALL');
                setSearchTerm('');
              }}
              className="text-[11px] text-gov-terracotta hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Project Register Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project</th>
                <th>Ministry</th>
                <th>Sector</th>
                <th>State</th>
                <th>Progress</th>
                <th>Cost Overrun</th>
                <th>Time Overrun</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Action Status</th>
                <th className="text-right">Dossier</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(p => {
                const projectActions = actions.filter(a => a.projectId === p.id);
                const latestAction = projectActions[0];

                return (
                  <tr key={p.id} className="hover:bg-paper-subtle/50 transition-colors">
                    <td className="font-mono text-xs text-ink-subtle font-semibold">#{p.id}</td>
                    <td className="max-w-xs">
                      <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                        {p.name}
                      </Link>
                      <span className="text-[10px] text-ink-subtle font-mono block">
                        {p.implementingAgency}
                      </span>
                    </td>
                    <td className="text-xs text-ink-muted">
                      {p.ministry.replace('Ministry of ', '')}
                    </td>
                    <td className="text-xs text-ink">{p.sector}</td>
                    <td className="text-xs text-ink">{p.state}</td>
                    <td>
                      <div className="font-mono text-xs">
                        <span className="font-bold text-ink">{p.progress.physicalProgress}%</span>
                        <span className="text-[10px] text-ink-subtle ml-1">/ {p.progress.expectedProgress}%</span>
                      </div>
                      <div className="text-[10px] font-mono text-risk-critical-solid">
                        Gap: {p.progress.progressGap}% pts
                      </div>
                    </td>
                    <td>
                      <div className={`font-mono text-xs font-bold ${p.cost.costOverrunPercent > 10 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                        +{p.cost.costOverrunPercent}%
                      </div>
                      <div className="text-[10px] font-mono text-ink-subtle">
                        ₹{p.cost.revisedCost} Cr
                      </div>
                    </td>
                    <td>
                      <div className={`font-mono text-xs font-bold ${p.schedule.timeOverrun > 12 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                        +{p.schedule.timeOverrun} mos
                      </div>
                      <div className="text-[10px] font-mono text-ink-subtle">
                        {p.schedule.deadlineRevision} revisions
                      </div>
                    </td>
                    <td className="tabular-figure font-bold text-sm text-ink">{p.riskScore}</td>
                    <td>
                      <RiskBadge level={p.riskLevel} size="sm" />
                    </td>
                    <td>
                      {latestAction ? (
                        <div className="space-y-0.5">
                          <ActionStatusBadge status={latestAction.status} />
                          <div className="text-[9px] font-mono text-ink-subtle truncate max-w-[120px]">
                            {latestAction.actionType.split(' ')[0]} Review
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-ink-subtle">None</span>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
