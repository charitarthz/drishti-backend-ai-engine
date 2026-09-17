import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

type ViewMode = 'MINISTRIES' | 'SECTORS';

export const MinistriesSectorsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('MINISTRIES');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group by Ministry
  const ministries = Array.from(new Set(MOCK_PROJECTS.map(p => p.ministry))).map(min => {
    const list = MOCK_PROJECTS.filter(p => p.ministry === min);
    const criticalCount = list.filter(p => p.riskLevel === 'Critical').length;
    const highCount = list.filter(p => p.riskLevel === 'High').length;
    const mediumCount = list.filter(p => p.riskLevel === 'Medium').length;
    const lowCount = list.filter(p => p.riskLevel === 'Low').length;
    const avgScore = Math.round(list.reduce((acc, p) => acc + p.riskScore, 0) / list.length);
    const signals = Array.from(new Set(list.map(p => p.keyWarningSignal))).join(', ');
    return {
      name: min,
      count: list.length,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      avgScore,
      signals,
      projects: list
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  // Group by Sector
  const sectors = Array.from(new Set(MOCK_PROJECTS.map(p => p.sector))).map(sec => {
    const list = MOCK_PROJECTS.filter(p => p.sector === sec);
    const criticalCount = list.filter(p => p.riskLevel === 'Critical').length;
    const highCount = list.filter(p => p.riskLevel === 'High').length;
    const mediumCount = list.filter(p => p.riskLevel === 'Medium').length;
    const lowCount = list.filter(p => p.riskLevel === 'Low').length;
    const avgScore = Math.round(list.reduce((acc, p) => acc + p.riskScore, 0) / list.length);
    const avgGap = +(list.reduce((acc, p) => acc + p.progress.progressGap, 0) / list.length).toFixed(1);
    const increasing = list.filter(p => p.trendDirection === 'Increasing').length;
    const trend = increasing > 0 ? 'Increasing' : 'Stable';
    return {
      name: sec,
      count: list.length,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      avgScore,
      avgGap,
      trend,
      projects: list
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Policymaker Intelligence • Sectoral & Ministerial Exposure"
        title="Cross-Ministerial & Sectoral Risk Intelligence"
        subtitle={`Comparative governance matrices delineating capital risk distribution, critical project volumes, and physical warning signals across Union Ministries and Infrastructure Sectors (${MOCK_REPORTING_MONTH}).`}
        badge="SECTOR MATRICES"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Active Ministries', value: ministries.length, context: 'Union Departments' },
          { label: 'Monitored Sectors', value: sectors.length, context: 'Core Infrastructure' },
          { label: 'Ministries with Critical Risk', value: ministries.filter(m => m.criticalCount > 0).length, context: 'Requiring Cabinet Focus', emphasis: 'critical' },
          { label: 'Sectors with Critical Risk', value: sectors.filter(s => s.criticalCount > 0).length, context: 'Linear & Process Works', emphasis: 'high' },
          { label: 'Highest Risk Sector', value: sectors[0]?.name || 'Railways', context: `Avg Score ${sectors[0]?.avgScore}/100` },
          { label: 'Lowest Risk Sector', value: sectors[sectors.length - 1]?.name || 'Power', context: `Avg Score ${sectors[sectors.length - 1]?.avgScore}/100`, emphasis: 'positive' },
        ]}
      />

      {/* Institutional View Switcher Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div className="flex items-center gap-1 bg-paper-subtle p-1 border border-gov-border rounded-xs">
          <button
            onClick={() => { setViewMode('MINISTRIES'); setExpandedId(null); }}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-xs transition-colors ${
              viewMode === 'MINISTRIES'
                ? 'bg-ink text-white font-bold shadow-xs'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            Union Ministries View ({ministries.length})
          </button>
          <button
            onClick={() => { setViewMode('SECTORS'); setExpandedId(null); }}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-xs transition-colors ${
              viewMode === 'SECTORS'
                ? 'bg-ink text-white font-bold shadow-xs'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            Infrastructure Sectors View ({sectors.length})
          </button>
        </div>

        <div className="text-xs font-mono text-ink-subtle">
          Showing {viewMode === 'MINISTRIES' ? 'Union Ministries' : 'Core Sectors'} ranked by SANKET-AI mean risk score
        </div>
      </div>

      {/* View 1: Union Ministries View */}
      {viewMode === 'MINISTRIES' && (
        <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden space-y-0">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Union Ministry</th>
                <th>Total Projects</th>
                <th>Risk Distribution (Crit / High / Med / Low)</th>
                <th>Critical / High Count</th>
                <th>Avg SANKET Score</th>
                <th>Notable Warning Signals</th>
                <th className="text-right">Project Dossiers</th>
              </tr>
            </thead>
            <tbody>
              {ministries.map((min) => {
                const isExpanded = expandedId === min.name;
                return (
                  <React.Fragment key={min.name}>
                    <tr className={isExpanded ? 'bg-paper-subtle/80' : ''}>
                      <td className="font-semibold text-ink max-w-xs">
                        <span className="block">{min.name}</span>
                        <span className="text-[10px] font-mono text-ink-subtle">
                          {min.projects.map(p => p.implementingAgency.split(' ')[0]).slice(0, 2).join(', ')}
                        </span>
                      </td>
                      <td className="tabular-figure font-bold">{min.count}</td>
                      <td>
                        {/* Stacked Risk Bar */}
                        <div className="w-36 flex h-2 rounded-xs overflow-hidden border border-gov-border bg-paper-subtle">
                          {min.criticalCount > 0 && (
                            <div
                              className="bg-risk-critical-solid h-full"
                              style={{ width: `${(min.criticalCount / min.count) * 100}%` }}
                              title={`${min.criticalCount} Critical`}
                            />
                          )}
                          {min.highCount > 0 && (
                            <div
                              className="bg-risk-high-solid h-full"
                              style={{ width: `${(min.highCount / min.count) * 100}%` }}
                              title={`${min.highCount} High`}
                            />
                          )}
                          {min.mediumCount > 0 && (
                            <div
                              className="bg-amber-400 h-full"
                              style={{ width: `${(min.mediumCount / min.count) * 100}%` }}
                              title={`${min.mediumCount} Medium`}
                            />
                          )}
                          {min.lowCount > 0 && (
                            <div
                              className="bg-risk-low-solid h-full"
                              style={{ width: `${(min.lowCount / min.count) * 100}%` }}
                              title={`${min.lowCount} Low`}
                            />
                          )}
                        </div>
                        <div className="flex gap-2 text-[10px] font-mono text-ink-subtle mt-1">
                          {min.criticalCount > 0 && <span className="text-risk-critical-solid font-semibold">{min.criticalCount}C</span>}
                          {min.highCount > 0 && <span className="text-risk-high-solid font-semibold">{min.highCount}H</span>}
                          {min.lowCount > 0 && <span className="text-risk-low-solid font-semibold">{min.lowCount}L</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs border ${
                          min.criticalCount > 0
                            ? 'bg-risk-critical-bg text-risk-critical-solid border-risk-critical-border'
                            : min.highCount > 0
                            ? 'bg-risk-high-bg text-risk-high-solid border-risk-high-border'
                            : 'bg-paper-subtle text-ink-subtle border-gov-border'
                        }`}>
                          {min.criticalCount + min.highCount} of {min.count} Elevated
                        </span>
                      </td>
                      <td className="tabular-figure font-bold text-sm text-ink">
                        {min.avgScore} / 100
                      </td>
                      <td className="text-xs text-ink max-w-xs font-mono">
                        <span className="bg-paper-subtle px-1.5 py-0.5 border border-gov-border rounded-xs">
                          {min.signals}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => toggleExpand(min.name)}
                          className="px-2.5 py-1 text-xs font-mono border border-gov-border bg-paper-subtle hover:bg-gov-border text-ink rounded-xs transition-colors"
                        >
                          {isExpanded ? 'Hide Works ▲' : `Inspect (${min.count}) ▼`}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Project Drilldown Row */}
                    {isExpanded && (
                      <tr className="bg-paper-subtle/50">
                        <td colSpan={7} className="p-4 pl-8 border-t border-gov-border/60">
                          <div className="space-y-2">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-ink-subtle font-semibold">
                              Monitored Infrastructure Undertakings under {min.name}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {min.projects.map(p => (
                                <div key={p.id} className="p-3 bg-white border border-gov-border rounded-xs space-y-1.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <span className="font-mono text-[10px] text-ink-subtle">#{p.id} • {p.state}</span>
                                      <h4 className="text-xs font-semibold text-ink line-clamp-1">{p.name}</h4>
                                    </div>
                                    <RiskBadge level={p.riskLevel} size="sm" />
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-ink-muted border-t border-gov-border/50">
                                    <span>Progress: {p.progress.physicalProgress}% (Gap: {p.progress.progressGap}% pts)</span>
                                    <Link to={`/project/${p.id}`} className="text-gov-terracotta font-semibold hover:underline">
                                      Open Dossier →
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View 2: Infrastructure Sectors View */}
      {viewMode === 'SECTORS' && (
        <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden space-y-0">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Infrastructure Sector</th>
                <th>Total Projects</th>
                <th>Risk Distribution</th>
                <th>Critical / High Count</th>
                <th>Avg SANKET Score</th>
                <th>Execution Gap Benchmark</th>
                <th>Sector Risk Trend</th>
                <th className="text-right">Project Dossiers</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((sec) => {
                const isExpanded = expandedId === sec.name;
                return (
                  <React.Fragment key={sec.name}>
                    <tr className={isExpanded ? 'bg-paper-subtle/80' : ''}>
                      <td className="font-semibold text-ink">{sec.name}</td>
                      <td className="tabular-figure font-bold">{sec.count}</td>
                      <td>
                        <div className="w-32 flex h-2 rounded-xs overflow-hidden border border-gov-border bg-paper-subtle">
                          {sec.criticalCount > 0 && (
                            <div
                              className="bg-risk-critical-solid h-full"
                              style={{ width: `${(sec.criticalCount / sec.count) * 100}%` }}
                            />
                          )}
                          {sec.highCount > 0 && (
                            <div
                              className="bg-risk-high-solid h-full"
                              style={{ width: `${(sec.highCount / sec.count) * 100}%` }}
                            />
                          )}
                          {sec.lowCount > 0 && (
                            <div
                              className="bg-risk-low-solid h-full"
                              style={{ width: `${(sec.lowCount / sec.count) * 100}%` }}
                            />
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs border ${
                          sec.criticalCount > 0
                            ? 'bg-risk-critical-bg text-risk-critical-solid border-risk-critical-border'
                            : 'bg-paper-subtle text-ink-subtle border-gov-border'
                        }`}>
                          {sec.criticalCount} Critical
                        </span>
                      </td>
                      <td className="tabular-figure font-bold text-sm text-ink">{sec.avgScore} / 100</td>
                      <td className="font-mono text-xs tabular-figure text-risk-critical-solid">
                        {sec.avgGap}% pts
                      </td>
                      <td>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold border ${
                          sec.trend === 'Increasing'
                            ? 'bg-risk-critical-bg text-risk-critical-solid border-risk-critical-border'
                            : 'bg-paper-subtle text-ink-subtle border-gov-border'
                        }`}>
                          {sec.trend.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => toggleExpand(sec.name)}
                          className="px-2.5 py-1 text-xs font-mono border border-gov-border bg-paper-subtle hover:bg-gov-border text-ink rounded-xs transition-colors"
                        >
                          {isExpanded ? 'Hide Works ▲' : `Inspect (${sec.count}) ▼`}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Sector Drilldown Row */}
                    {isExpanded && (
                      <tr className="bg-paper-subtle/50">
                        <td colSpan={8} className="p-4 pl-8 border-t border-gov-border/60">
                          <div className="space-y-2">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-ink-subtle font-semibold">
                              Monitored Works in Sector: {sec.name}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {sec.projects.map(p => (
                                <div key={p.id} className="p-3 bg-white border border-gov-border rounded-xs space-y-1.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <span className="font-mono text-[10px] text-ink-subtle">#{p.id} • {p.ministry}</span>
                                      <h4 className="text-xs font-semibold text-ink line-clamp-1">{p.name}</h4>
                                    </div>
                                    <RiskBadge level={p.riskLevel} size="sm" />
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-ink-muted border-t border-gov-border/50">
                                    <span>Overrun: +{p.schedule.timeOverrun} mos | Cost: +{p.cost.costOverrunPercent}%</span>
                                    <Link to={`/project/${p.id}`} className="text-gov-terracotta font-semibold hover:underline">
                                      Open Dossier →
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
