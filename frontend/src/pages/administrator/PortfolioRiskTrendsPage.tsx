import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const PortfolioRiskTrendsPage: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('615186');
  const [trendFilter, setTrendFilter] = useState<'ALL' | 'Increasing' | 'Stable' | 'Decreasing'>('ALL');

  const increasingCount = MOCK_PROJECTS.filter(p => p.trendDirection === 'Increasing').length;
  const stableCount = MOCK_PROJECTS.filter(p => p.trendDirection === 'Stable').length;
  const decreasingCount = MOCK_PROJECTS.filter(p => p.trendDirection === 'Decreasing').length;

  const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedProjectId) || MOCK_PROJECTS[0];

  const filteredProjects = MOCK_PROJECTS.filter(p => {
    if (trendFilter === 'ALL') return true;
    return p.trendDirection === trendFilter;
  }).sort((a, b) => b.riskScore - a.riskScore);

  // SVG Chart Dimensions for Selected Project Trend
  const history = selectedProject.riskHistory;
  const svgWidth = 560;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const minScore = 0;
  const maxScore = 100;

  const points = history.map((pt, i) => {
    const x = paddingX + (i / (history.length - 1)) * chartW;
    const y = paddingY + chartH - ((pt.score - minScore) / (maxScore - minScore)) * chartH;
    return { x, y, score: pt.score, month: pt.month, level: pt.level };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Administrator Portfolio • Trajectory Dynamics"
        title="Historical Risk Trends & Movement Trajectories"
        subtitle={`Multi-cycle historical score movement tracking empirical SANKET-AI index progression across the past 6 PAIMANA review periods (${MOCK_REPORTING_MONTH}). Strictly verifiable past observations with zero synthetic future projections.`}
        badge="RISK TRENDS"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Monitored Works', value: MOCK_PROJECTS.length, context: 'Active Portfolio' },
          { label: 'Increasing Risk', value: increasingCount, context: 'Worsening Trajectory', emphasis: 'critical' },
          { label: 'Stable Trajectory', value: stableCount, context: 'Persistent Risk Tier' },
          { label: 'Decreasing Risk', value: decreasingCount, context: 'De-escalating Works', emphasis: 'positive' },
          { label: 'Review Cycle Span', value: '6 Cycles', context: 'May 2025 to Oct 2025' },
        ]}
      />

      {/* Selected Project Historical Trend Visualizer */}
      <div className="bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-5">
        <div className="border-b border-gov-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="section-eyebrow text-ink-subtle">Empirical Trajectory Visualizer</div>
            <h3 className="editorial-title text-base font-semibold text-ink">
              Multi-Cycle Risk Evolution: {selectedProject.name}
            </h3>
            <span className="text-xs text-ink-muted">
              #{selectedProject.id} • {selectedProject.ministry} • {selectedProject.sector}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink-subtle">Focus Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-paper-subtle border border-gov-border rounded-xs px-2.5 py-1.5 text-xs font-mono text-ink focus:outline-none max-w-xs truncate"
            >
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.id} - {p.name.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trajectory Status Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="text-[10px] text-ink-subtle uppercase block">Current Score</span>
            <span className="text-lg font-bold text-ink tabular-figure">{selectedProject.riskScore} / 100</span>
          </div>
          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="text-[10px] text-ink-subtle uppercase block">Risk Tier</span>
            <div className="mt-1"><RiskBadge level={selectedProject.riskLevel} size="sm" /></div>
          </div>
          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="text-[10px] text-ink-subtle uppercase block">Trend Vector</span>
            <span className={`text-sm font-bold block mt-0.5 ${
              selectedProject.trendDirection === 'Increasing' ? 'text-risk-critical-solid' :
              selectedProject.trendDirection === 'Decreasing' ? 'text-risk-low-solid' : 'text-ink'
            }`}>
              {selectedProject.trendDirection}
            </span>
          </div>
          <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
            <span className="text-[10px] text-ink-subtle uppercase block">6-Cycle Movement</span>
            <span className="text-sm font-bold text-ink block mt-0.5">
              {history[0]?.score} → {history[history.length - 1]?.score} ({selectedProject.riskScore - history[0]?.score >= 0 ? '+' : ''}{selectedProject.riskScore - history[0]?.score} pts)
            </span>
          </div>
        </div>

        {/* SVG Step/Line Chart */}
        <div className="w-full overflow-x-auto bg-paper-subtle/50 p-4 border border-gov-border rounded-xs">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-2xl mx-auto h-40">
            {/* Grid Lines */}
            {[20, 40, 60, 80, 100].map(val => {
              const y = paddingY + chartH - (val / 100) * chartH;
              return (
                <g key={val}>
                  <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="3 3" />
                  <text x={paddingX - 8} y={y + 3} textAnchor="end" fontSize="9" fontFamily="monospace" fill="#94A3B8">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Threshold line at score 80 (Critical) */}
            <line
              x1={paddingX}
              y1={paddingY + chartH - (80 / 100) * chartH}
              x2={svgWidth - paddingX}
              y2={paddingY + chartH - (80 / 100) * chartH}
              stroke="#EF4444"
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.6"
            />
            <text x={svgWidth - paddingX - 4} y={paddingY + chartH - (80 / 100) * chartH - 4} textAnchor="end" fontSize="8" fontFamily="monospace" fill="#DC2626">
              Critical Threshold (80)
            </text>

            {/* Area Fill */}
            <path
              d={`${pathD} L ${points[points.length - 1].x} ${paddingY + chartH} L ${points[0].x} ${paddingY + chartH} Z`}
              fill={selectedProject.trendDirection === 'Increasing' ? '#FEE2E2' : '#E0F2FE'}
              opacity="0.4"
            />

            {/* Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke={selectedProject.trendDirection === 'Increasing' ? '#DC2626' : '#0F172A'}
              strokeWidth="2.5"
            />

            {/* Points and Score Badges */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill={selectedProject.trendDirection === 'Increasing' ? '#DC2626' : '#0F172A'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <text
                  x={pt.x}
                  y={pt.y - 9}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill="#0F172A"
                >
                  {pt.score}
                </text>
                <text
                  x={pt.x}
                  y={paddingY + chartH + 15}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fill="#64748B"
                >
                  {pt.month.split(' ')[0]}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-ink-subtle pt-2 border-t border-gov-border">
          <span>Primary Driving Signal: <strong className="text-ink">{selectedProject.keyWarningSignal}</strong></span>
          <Link to={`/project/${selectedProject.id}`} className="text-gov-terracotta hover:underline font-semibold">
            Inspect Full Machine Learning Explainability Dossier →
          </Link>
        </div>
      </div>

      {/* Trajectory Filter Strip */}
      <div className="flex items-center justify-between border-b border-gov-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-ink-subtle text-[10px] uppercase">Filter Trajectory:</span>
          {[
            { id: 'ALL', label: `All Projects (${MOCK_PROJECTS.length})` },
            { id: 'Increasing', label: `Increasing (${increasingCount})` },
            { id: 'Stable', label: `Stable (${stableCount})` },
            { id: 'Decreasing', label: `Decreasing (${decreasingCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTrendFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xs border transition-colors ${
                trendFilter === tab.id
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

      {/* Historical Evolution Master Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID & Name</th>
                <th>Sector</th>
                <th>Trend Direction</th>
                <th>May '25</th>
                <th>Jun '25</th>
                <th>Jul '25</th>
                <th>Aug '25</th>
                <th>Sep '25</th>
                <th>Oct '25</th>
                <th>6-Mo Drift</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(p => {
                const hist = p.riskHistory;
                const delta = p.riskScore - (hist[0]?.score || p.riskScore);
                const isSelected = p.id === selectedProjectId;

                return (
                  <tr key={p.id} className={isSelected ? 'bg-paper-subtle/80 font-medium' : 'hover:bg-paper-subtle/50 transition-colors'}>
                    <td className="max-w-xs">
                      <span className="font-mono text-[10px] text-ink-subtle block">#{p.id}</span>
                      <Link to={`/project/${p.id}`} className="font-semibold text-ink hover:text-gov-terracotta text-xs block">
                        {p.name}
                      </Link>
                      <span className="text-[10px] text-ink-subtle font-mono">{p.implementingAgency}</span>
                    </td>
                    <td className="text-xs text-ink-muted">{p.sector}</td>
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
                    {hist.map((h, i) => (
                      <td key={i} className="tabular-figure font-mono text-xs text-ink">
                        {h.score}
                      </td>
                    ))}
                    <td className="tabular-figure font-mono text-xs font-bold">
                      <span className={delta > 0 ? 'text-risk-critical-solid' : delta < 0 ? 'text-risk-low-solid' : 'text-ink-subtle'}>
                        {delta > 0 ? `+${delta}` : delta} pts
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className={`px-2 py-1 text-xs font-mono border rounded-xs transition-colors ${
                          isSelected
                            ? 'bg-ink text-white font-bold border-ink'
                            : 'bg-paper-subtle hover:bg-gov-border text-ink border-gov-border'
                        }`}
                      >
                        {isSelected ? 'Viewing' : 'Chart →'}
                      </button>
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
