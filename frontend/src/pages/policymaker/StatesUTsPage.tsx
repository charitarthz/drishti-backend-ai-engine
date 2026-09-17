import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { IndiaMap } from '../../components/policymaker/IndiaMap';
import type { StateMapData } from '../../components/policymaker/IndiaMap';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const StatesUTsPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('Jammu & Kashmir');

  // Aggregate state statistics
  const uniqueStates = Array.from(new Set(MOCK_PROJECTS.map(p => p.state)));

  const stateDataMap: Record<string, StateMapData> = {};
  uniqueStates.forEach(st => {
    const list = MOCK_PROJECTS.filter(p => p.state.includes(st) || st.includes(p.state));
    const crit = list.filter(p => p.riskLevel === 'Critical').length;
    const high = list.filter(p => p.riskLevel === 'High').length;
    const avg = Math.round(list.reduce((acc, p) => acc + p.riskScore, 0) / (list.length || 1));
    const riskLevel: 'Critical' | 'High' | 'Low' | 'None' =
      crit > 0 ? 'Critical' : high > 0 ? 'High' : list.length > 0 ? 'Low' : 'None';

    stateDataMap[st] = {
      id: st,
      name: st,
      projectCount: list.length,
      criticalCount: crit,
      highCount: high,
      avgRisk: avg,
      riskLevel
    };
  });

  const activeStateData = stateDataMap[selectedState] || {
    id: selectedState,
    name: selectedState,
    projectCount: 0,
    criticalCount: 0,
    highCount: 0,
    avgRisk: 0,
    riskLevel: 'None'
  };

  const activeStateProjects = MOCK_PROJECTS.filter(
    p => p.state.includes(selectedState) || selectedState.includes(p.state)
  );

  // Ranked state list for the table below
  const rankedStates = Object.values(stateDataMap).sort((a, b) => b.avgRisk - a.avgRisk);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Policymaker Intelligence • Spatial Exposure"
        title="India States & Union Territories Risk Profile"
        subtitle={`Geographic risk concentration mapping major capital infrastructure undertakings across federal states and inter-state economic corridors (${MOCK_REPORTING_MONTH}).`}
        badge="SPATIAL INTELLIGENCE"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'States with Active Works', value: uniqueStates.length, context: 'Across All Regions' },
          { label: 'States with Critical Works', value: rankedStates.filter(s => s.criticalCount > 0).length, context: 'Score ≥ 80 / 100', emphasis: 'critical' },
          { label: 'Highest Risk State', value: rankedStates[0]?.name || 'J&K', context: `Avg Score ${rankedStates[0]?.avgRisk}/100`, emphasis: 'critical' },
          { label: 'Selected Territory', value: selectedState, context: `${activeStateData.projectCount} Works Active` },
          { label: 'Critical in Selected', value: activeStateData.criticalCount, context: `${activeStateData.highCount} High-Risk`, emphasis: activeStateData.criticalCount > 0 ? 'critical' : 'positive' },
        ]}
      />

      {/* Spatial Representation: Split Layout with Map as Supporting Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive India Map & Quick State Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gov-border rounded-xs p-5 shadow-subtle space-y-4">
            <div className="border-b border-gov-border pb-2 flex items-center justify-between">
              <div>
                <div className="section-eyebrow text-ink-subtle">Regional Heatmap</div>
                <h3 className="editorial-title text-sm text-ink font-semibold">
                  Geographic Risk Distribution
                </h3>
              </div>
              <span className="font-mono text-[10px] text-ink-subtle">
                Click map or chip to select
              </span>
            </div>

            {/* India Map Supporting Visualization */}
            <IndiaMap
              stateData={stateDataMap}
              selectedState={selectedState}
              onSelectState={setSelectedState}
            />

            {/* Quick State Selector Chips */}
            <div className="pt-2">
              <span className="text-[10px] font-mono text-ink-subtle block mb-1.5 uppercase tracking-wider">
                Jurisdiction Quick Selector:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {uniqueStates.map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-xs border transition-colors ${
                      selectedState === st
                        ? 'bg-ink text-white font-bold border-ink'
                        : 'bg-paper-subtle text-ink hover:bg-gov-border border-gov-border'
                    }`}
                  >
                    {st.split(' & ')[0]}
                    {stateDataMap[st]?.criticalCount > 0 && (
                      <span className="ml-1 text-[9px] text-red-500 font-bold">●</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected State Dossier & Active Projects (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gov-border rounded-xs p-6 shadow-subtle space-y-6">
          <div className="border-b border-gov-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="section-eyebrow text-ink-subtle">State Infrastructure Profile</div>
              <h2 className="editorial-title text-xl text-ink font-bold font-serif">
                {selectedState}
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-ink-subtle">Composite State Mean:</span>
              <span className="font-bold text-sm text-ink tabular-figure">{activeStateData.avgRisk} / 100</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold border ${
                activeStateData.riskLevel === 'Critical'
                  ? 'bg-risk-critical-bg text-risk-critical-solid border-risk-critical-border'
                  : activeStateData.riskLevel === 'High'
                  ? 'bg-risk-high-bg text-risk-high-solid border-risk-high-border'
                  : 'bg-risk-low-bg text-risk-low-solid border-risk-low-border'
              }`}>
                {activeStateData.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>

          {/* State Risk Metrics Breakdown */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
              <span className="text-[10px] text-ink-subtle uppercase block">Total Monitored</span>
              <span className="text-lg font-bold text-ink tabular-figure">{activeStateData.projectCount}</span>
              <span className="text-[10px] text-ink-muted block mt-0.5">Central Works</span>
            </div>
            <div className="p-3 bg-risk-critical-bg/40 border border-risk-critical-border rounded-xs">
              <span className="text-[10px] text-risk-critical-solid uppercase block font-semibold">Critical Risk</span>
              <span className="text-lg font-bold text-risk-critical-solid tabular-figure">{activeStateData.criticalCount}</span>
              <span className="text-[10px] text-risk-critical-solid/80 block mt-0.5">Score ≥ 80</span>
            </div>
            <div className="p-3 bg-risk-high-bg/40 border border-risk-high-border rounded-xs">
              <span className="text-[10px] text-risk-high-solid uppercase block font-semibold">High Risk</span>
              <span className="text-lg font-bold text-risk-high-solid tabular-figure">{activeStateData.highCount}</span>
              <span className="text-[10px] text-risk-high-solid/80 block mt-0.5">Score 60–79</span>
            </div>
          </div>

          {/* Risk Distribution Bar for Selected State */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-[11px] text-ink-muted">
              <span>Jurisdictional Risk Tier Composition</span>
              <span>{activeStateData.criticalCount} Critical | {activeStateData.highCount} High</span>
            </div>
            <div className="w-full h-2.5 rounded-xs overflow-hidden border border-gov-border bg-paper-subtle flex">
              {activeStateData.criticalCount > 0 && (
                <div
                  className="bg-risk-critical-solid h-full"
                  style={{ width: `${(activeStateData.criticalCount / activeStateData.projectCount) * 100}%` }}
                />
              )}
              {activeStateData.highCount > 0 && (
                <div
                  className="bg-risk-high-solid h-full"
                  style={{ width: `${(activeStateData.highCount / activeStateData.projectCount) * 100}%` }}
                />
              )}
              {activeStateData.projectCount - activeStateData.criticalCount - activeStateData.highCount > 0 && (
                <div
                  className="bg-risk-low-solid h-full"
                  style={{ width: `${((activeStateData.projectCount - activeStateData.criticalCount - activeStateData.highCount) / activeStateData.projectCount) * 100}%` }}
                />
              )}
            </div>
          </div>

          {/* Active Priority Projects in Selected State */}
          <div className="space-y-3 pt-2">
            <div className="section-eyebrow text-ink-subtle">
              Monitored Undertakings in {selectedState} ({activeStateProjects.length})
            </div>

            {activeStateProjects.length === 0 ? (
              <div className="p-4 bg-paper-subtle text-xs text-ink-subtle text-center rounded-xs border border-gov-border">
                No active projects tracked in this territory in the current PAIMANA review cycle.
              </div>
            ) : (
              <div className="space-y-3">
                {activeStateProjects.map(p => (
                  <div key={p.id} className="p-4 bg-paper-subtle border border-gov-border rounded-xs space-y-2 hover:border-ink/40 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-ink-subtle">#{p.id}</span>
                          <span className="font-mono text-[10px] text-ink-muted">• {p.district || p.state}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-ink">{p.name}</h4>
                        <div className="text-[11px] text-ink-muted mt-0.5">{p.ministry} • {p.sector}</div>
                      </div>
                      <RiskBadge level={p.riskLevel} size="sm" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gov-border/60 text-[11px] font-mono">
                      <div>
                        <span className="text-ink-subtle block text-[10px]">Physical Progress</span>
                        <span className="font-semibold text-ink">{p.progress.physicalProgress}% (Gap: {p.progress.progressGap}% pts)</span>
                      </div>
                      <div>
                        <span className="text-ink-subtle block text-[10px]">Time Overrun</span>
                        <span className="font-semibold text-ink">+{p.schedule.timeOverrun} months</span>
                      </div>
                      <div className="sm:text-right flex sm:flex-col justify-between items-end">
                        <span className="text-ink-subtle block text-[10px]">Cost Overrun</span>
                        <span className="font-semibold text-ink">+{p.cost.costOverrunPercent}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gov-border/40 text-xs font-mono">
                      <span className="text-[11px] text-ink-subtle">
                        Key Signal: <strong className="text-ink">{p.keyWarningSignal}</strong>
                      </span>
                      <Link
                        to={`/project/${p.id}`}
                        className="text-gov-terracotta hover:underline font-semibold text-xs"
                      >
                        Open Project Intelligence Dossier →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed State Table Below the Map */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-gov-border flex items-center justify-between">
          <div>
            <div className="section-eyebrow text-ink-subtle">Comprehensive Territory Index</div>
            <h3 className="editorial-title text-base text-ink font-semibold">
              Detailed State & UT Infrastructure Risk Table
            </h3>
          </div>
          <span className="font-mono text-xs text-ink-subtle">
            {rankedStates.length} Monitored States & UTs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>State / UT Jurisdiction</th>
                <th>Monitored Projects</th>
                <th>Critical Projects</th>
                <th>High Risk Projects</th>
                <th>Mean Risk Score</th>
                <th>Risk Tier</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rankedStates.map((st) => (
                <tr
                  key={st.name}
                  className={selectedState === st.name ? 'bg-paper-subtle/80 font-medium' : ''}
                >
                  <td className="font-semibold text-ink">
                    <span className="flex items-center gap-2">
                      {st.name}
                      {selectedState === st.name && (
                        <span className="text-[9px] font-mono bg-ink text-white px-1.5 py-0.2 rounded-xs">
                          Active Focus
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="tabular-figure">{st.projectCount}</td>
                  <td>
                    {st.criticalCount > 0 ? (
                      <span className="font-mono text-xs font-bold text-risk-critical-solid bg-risk-critical-bg px-2 py-0.5 border border-risk-critical-border rounded-xs">
                        {st.criticalCount} Critical
                      </span>
                    ) : (
                      <span className="text-ink-subtle text-xs font-mono">0</span>
                    )}
                  </td>
                  <td>
                    {st.highCount > 0 ? (
                      <span className="font-mono text-xs text-risk-high-solid font-semibold">
                        {st.highCount} High
                      </span>
                    ) : (
                      <span className="text-ink-subtle text-xs font-mono">0</span>
                    )}
                  </td>
                  <td className="tabular-figure font-bold text-sm text-ink">{st.avgRisk} / 100</td>
                  <td>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold border ${
                      st.riskLevel === 'Critical'
                        ? 'bg-risk-critical-bg text-risk-critical-solid border-risk-critical-border'
                        : st.riskLevel === 'High'
                        ? 'bg-risk-high-bg text-risk-high-solid border-risk-high-border'
                        : 'bg-risk-low-bg text-risk-low-solid border-risk-low-border'
                    }`}>
                      {st.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setSelectedState(st.name);
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 text-xs font-mono border border-gov-border bg-paper-subtle hover:bg-gov-border text-ink rounded-xs transition-colors"
                    >
                      Focus Map & Dossier →
                    </button>
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
