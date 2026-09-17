import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const NationalRiskPage: React.FC = () => {

  const total = MOCK_PROJECTS.length;
  const criticalProjects = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical');
  const highProjects = MOCK_PROJECTS.filter(p => p.riskLevel === 'High');
  const lowProjects = MOCK_PROJECTS.filter(p => p.riskLevel === 'Low');
  const avgNationalRisk = Math.round(MOCK_PROJECTS.reduce((acc, p) => acc + p.riskScore, 0) / total);

  // Sector aggregated data
  const sectorList = Array.from(new Set(MOCK_PROJECTS.map(p => p.sector))).map(sec => {
    const list = MOCK_PROJECTS.filter(p => p.sector === sec);
    const avgScore = Math.round(list.reduce((acc, p) => acc + p.riskScore, 0) / list.length);
    const critCount = list.filter(p => p.riskLevel === 'Critical').length;
    const avgOverrunMonths = Math.round(list.reduce((acc, p) => acc + p.schedule.timeOverrun, 0) / list.length);
    const avgCostOverrun = +(list.reduce((acc, p) => acc + p.cost.costOverrunPercent, 0) / list.length).toFixed(1);
    const dominantSignal = list[0]?.keyWarningSignal || 'Progress Below Expected';
    return {
      sector: sec,
      count: list.length,
      avgScore,
      critCount,
      avgOverrunMonths,
      avgCostOverrun,
      dominantSignal,
      projects: list
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  // Ministry aggregated data
  const ministryList = Array.from(new Set(MOCK_PROJECTS.map(p => p.ministry))).map(min => {
    const list = MOCK_PROJECTS.filter(p => p.ministry === min);
    const avgScore = Math.round(list.reduce((acc, p) => acc + p.riskScore, 0) / list.length);
    const critCount = list.filter(p => p.riskLevel === 'Critical').length;
    const increasingCount = list.filter(p => p.trendDirection === 'Increasing').length;
    return {
      ministry: min,
      count: list.length,
      avgScore,
      critCount,
      increasingCount,
      projects: list
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  // Risk movement breakdown
  const increasingProjects = MOCK_PROJECTS.filter(p => p.trendDirection === 'Increasing');
  const stableProjects = MOCK_PROJECTS.filter(p => p.trendDirection === 'Stable');
  const decreasingProjects = MOCK_PROJECTS.filter(p => p.trendDirection === 'Decreasing');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Policymaker Intelligence • National Macro Exposure"
        title="National Risk Distribution & Trajectory Dynamics"
        subtitle={`Exhaustive institutional assessment of project risk concentration, sector-level vulnerabilities, and multi-cycle risk movement across major central infrastructure works (${MOCK_REPORTING_MONTH}).`}
        badge="MACRO INTELLIGENCE"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Evaluated Projects', value: total, context: 'Central Sector Works' },
          { label: 'Composite National Mean', value: `${avgNationalRisk}/100`, context: 'Weighted SANKET Index' },
          { label: 'Critical Risk Cluster', value: criticalProjects.length, context: `${Math.round((criticalProjects.length / total) * 100)}% of Monitored Works`, emphasis: 'critical' },
          { label: 'Time Overrun > 36 Mos', value: MOCK_PROJECTS.filter(p => p.schedule.timeOverrun >= 36).length, context: 'Prolonged Slippage', emphasis: 'high' },
          { label: 'Cost Escalation > 25%', value: MOCK_PROJECTS.filter(p => p.cost.costOverrunPercent >= 25).length, context: 'Financial Revision' },
          { label: 'Deteriorating Trend', value: increasingProjects.length, context: 'Escalating This Cycle', emphasis: 'critical' },
        ]}
      />

      {/* 1. Overall Risk Distribution & Concentration Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Risk Distribution Quartiles */}
        <div className="lg:col-span-6 bg-white border border-gov-border rounded-xs p-6 space-y-4 shadow-subtle">
          <div className="border-b border-gov-border pb-3">
            <div className="section-eyebrow text-ink-subtle">Distribution Curve</div>
            <h3 className="editorial-title text-base text-ink font-semibold">
              1. SANKET-AI Risk Band Composition
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-risk-critical-solid flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-risk-critical-solid rounded-xs inline-block" />
                  Tier 1: Critical Risk (80–100)
                </span>
                <span className="font-bold tabular-figure text-ink">
                  {criticalProjects.length} projects ({Math.round((criticalProjects.length / total) * 100)}%)
                </span>
              </div>
              <p className="text-[11px] font-sans text-ink-muted">
                Characterized by severe progress stall (&lt;0.5%/month), progress deficit exceeding -25% points, and multi-year time slips.
              </p>
            </div>

            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-risk-high-solid flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-risk-high-solid rounded-xs inline-block" />
                  Tier 2: High Risk (60–79)
                </span>
                <span className="font-bold tabular-figure text-ink">
                  {highProjects.length} projects ({Math.round((highProjects.length / total) * 100)}%)
                </span>
              </div>
              <p className="text-[11px] font-sans text-ink-muted">
                Active execution with significant schedule or cost overrun; vulnerability to contractor performance or geotechnical constraints.
              </p>
            </div>

            <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-risk-low-solid flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-risk-low-solid rounded-xs inline-block" />
                  Tier 3: Low Risk (&lt;40)
                </span>
                <span className="font-bold tabular-figure text-ink">
                  {lowProjects.length} projects ({Math.round((lowProjects.length / total) * 100)}%)
                </span>
              </div>
              <p className="text-[11px] font-sans text-ink-muted">
                Completed or on-schedule transmission and highway works maintaining steady monthly progress velocities.
              </p>
            </div>
          </div>
        </div>

        {/* Risk Concentration Core Analysis */}
        <div className="lg:col-span-6 bg-white border border-gov-border rounded-xs p-6 space-y-4 shadow-subtle">
          <div className="border-b border-gov-border pb-3">
            <div className="section-eyebrow text-ink-subtle">Root Cause Attributions</div>
            <h3 className="editorial-title text-base text-ink font-semibold">
              2. Structural Risk Concentration Findings
            </h3>
          </div>

          <div className="space-y-3 text-xs text-ink leading-relaxed">
            <div className="border-l-2 border-l-risk-critical-solid pl-3 py-1">
              <span className="font-semibold block text-ink">Physical Progress Stalls in Linear Transport</span>
              <p className="text-ink-muted text-[11px] mt-0.5">
                Over 60% of critical risk is driven by linear works (Freight corridors, expressways) where land availability and structure interfaces stall continuous laying.
              </p>
            </div>

            <div className="border-l-2 border-l-risk-high-solid pl-3 py-1">
              <span className="font-semibold block text-ink">Compounding Schedule Slippages in Mountainous / Tunneling Works</span>
              <p className="text-ink-muted text-[11px] mt-0.5">
                Projects with high geological complexity (Katra-Banihal rail, Awantipora AIIMS) demonstrate repeated milestone revisions averaging 47+ months.
              </p>
            </div>

            <div className="border-l-2 border-l-gov-teal pl-3 py-1">
              <span className="font-semibold block text-ink">Refinery and Industrial Process Revisions</span>
              <p className="text-ink-muted text-[11px] mt-0.5">
                Petrochemical complexes and fertilizer units account for the largest single-project cost escalations (&gt; ₹25,000 Cr additions) driven by unit engineering modifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sector-Level Comparison Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-gov-border flex items-center justify-between">
          <div>
            <div className="section-eyebrow text-ink-subtle">Comparative Sector Analysis</div>
            <h3 className="editorial-title text-base text-ink font-semibold">
              3. Sector-Level Risk & Overrun Comparison
            </h3>
          </div>
          <span className="font-mono text-xs text-ink-subtle">
            {sectorList.length} Monitored Infrastructure Sectors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Infrastructure Sector</th>
                <th>Monitored Projects</th>
                <th>Critical Projects</th>
                <th>Avg SANKET Score</th>
                <th>Avg Delay (Months)</th>
                <th>Avg Cost Overrun</th>
                <th>Dominant Warning Signal</th>
                <th className="text-right">Risk Bar</th>
              </tr>
            </thead>
            <tbody>
              {sectorList.map((sec) => (
                <tr key={sec.sector}>
                  <td className="font-medium text-ink">{sec.sector}</td>
                  <td className="tabular-figure">{sec.count}</td>
                  <td>
                    {sec.critCount > 0 ? (
                      <span className="font-mono text-xs font-bold text-risk-critical-solid bg-risk-critical-bg px-2 py-0.5 border border-risk-critical-border rounded-xs">
                        {sec.critCount} Critical
                      </span>
                    ) : (
                      <span className="text-ink-subtle text-xs font-mono">0</span>
                    )}
                  </td>
                  <td className="tabular-figure font-bold text-sm text-ink">{sec.avgScore} / 100</td>
                  <td className="tabular-figure font-mono text-xs">{sec.avgOverrunMonths} mos</td>
                  <td className="tabular-figure font-mono text-xs">+{sec.avgCostOverrun}%</td>
                  <td>
                    <span className="font-mono text-[11px] bg-paper-subtle px-1.5 py-0.5 border border-gov-border rounded-xs text-ink">
                      {sec.dominantSignal}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="inline-block w-24 bg-paper-subtle h-2 rounded-xs overflow-hidden border border-gov-border align-middle">
                      <div
                        className={`h-full ${sec.avgScore >= 80 ? 'bg-risk-critical-solid' : sec.avgScore >= 60 ? 'bg-risk-high-solid' : 'bg-risk-low-solid'}`}
                        style={{ width: `${sec.avgScore}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Ministry-Level Comparison Table */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-gov-border flex items-center justify-between">
          <div>
            <div className="section-eyebrow text-ink-subtle">Union Governance Exposure</div>
            <h3 className="editorial-title text-base text-ink font-semibold">
              4. Ministry-Level Risk Comparison
            </h3>
          </div>
          <span className="font-mono text-xs text-ink-subtle">
            {ministryList.length} Union Ministries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Union Ministry</th>
                <th>Monitored Projects</th>
                <th>Critical Projects</th>
                <th>Escalating Trends</th>
                <th>Mean Risk Score</th>
                <th>Key Implementing Bodies</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {ministryList.map((min) => (
                <tr key={min.ministry}>
                  <td className="font-semibold text-ink">{min.ministry}</td>
                  <td className="tabular-figure">{min.count}</td>
                  <td>
                    {min.critCount > 0 ? (
                      <span className="font-mono text-xs font-bold text-risk-critical-solid">
                        {min.critCount} Critical
                      </span>
                    ) : (
                      <span className="text-ink-subtle text-xs font-mono">0</span>
                    )}
                  </td>
                  <td>
                    {min.increasingCount > 0 ? (
                      <span className="font-mono text-xs text-gov-terracotta font-semibold">
                        {min.increasingCount} Worsening
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-ink-subtle">Stable</span>
                    )}
                  </td>
                  <td className="tabular-figure font-bold text-sm text-ink">{min.avgScore} / 100</td>
                  <td className="text-xs text-ink-muted">
                    {min.projects.map(p => p.implementingAgency.split(' ')[0]).join(', ')}
                  </td>
                  <td className="text-right">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-xs font-bold border ${
                      min.avgScore >= 80
                        ? 'bg-risk-critical-bg text-risk-critical-solid border-risk-critical-border'
                        : min.avgScore >= 60
                        ? 'bg-risk-high-bg text-risk-high-solid border-risk-high-border'
                        : 'bg-risk-low-bg text-risk-low-solid border-risk-low-border'
                    }`}>
                      {min.avgScore >= 80 ? 'CRITICAL' : min.avgScore >= 60 ? 'HIGH' : 'STABLE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Risk Movement / Trajectory Migration Across Cycles */}
      <div className="bg-white border border-gov-border rounded-xs p-6 space-y-4 shadow-subtle">
        <div className="border-b border-gov-border pb-3 flex items-center justify-between">
          <div>
            <div className="section-eyebrow text-ink-subtle">Multi-Cycle Dynamics</div>
            <h3 className="editorial-title text-base text-ink font-semibold">
              5. Risk Movement & Velocity (Past 6 Review Cycles)
            </h3>
          </div>
          <span className="font-mono text-xs text-ink-muted">
            Tracking MoSPI PAIMANA monthly cycle variations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Escalating Trajectory Column */}
          <div className="bg-risk-critical-bg/30 border border-risk-critical-border rounded-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-risk-critical-solid flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-risk-critical-solid animate-pulse" />
                Escalating Risk ({increasingProjects.length})
              </span>
              <span className="text-[10px] font-mono text-risk-critical-solid">Trend: Increasing</span>
            </div>
            <div className="space-y-2 text-xs">
              {increasingProjects.map(p => (
                <div key={p.id} className="bg-white p-2.5 rounded-xs border border-risk-critical-border/50">
                  <div className="flex justify-between font-mono text-[10px] text-ink-subtle">
                    <span>#{p.id}</span>
                    <span className="font-bold text-risk-critical-solid">{p.riskScore}/100</span>
                  </div>
                  <Link to={`/project/${p.id}`} className="font-medium text-ink hover:text-gov-terracotta line-clamp-1 block text-xs">
                    {p.name}
                  </Link>
                  <div className="text-[10px] text-ink-muted mt-1 font-mono">
                    Signal: {p.keyWarningSignal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stable Trajectory Column */}
          <div className="bg-paper-subtle border border-gov-border rounded-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-ink flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-ink-subtle" />
                Persistent High Risk ({stableProjects.length})
              </span>
              <span className="text-[10px] font-mono text-ink-subtle">Trend: Stable</span>
            </div>
            <div className="space-y-2 text-xs">
              {stableProjects.map(p => (
                <div key={p.id} className="bg-white p-2.5 rounded-xs border border-gov-border">
                  <div className="flex justify-between font-mono text-[10px] text-ink-subtle">
                    <span>#{p.id}</span>
                    <span className="font-semibold text-ink">{p.riskScore}/100</span>
                  </div>
                  <Link to={`/project/${p.id}`} className="font-medium text-ink hover:text-gov-terracotta line-clamp-1 block text-xs">
                    {p.name}
                  </Link>
                  <div className="text-[10px] text-ink-muted mt-1 font-mono">
                    Signal: {p.keyWarningSignal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decreasing Trajectory Column */}
          <div className="bg-risk-low-bg/30 border border-risk-low-border rounded-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-risk-low-solid flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-risk-low-solid" />
                De-escalating Works ({decreasingProjects.length})
              </span>
              <span className="text-[10px] font-mono text-risk-low-solid">Trend: Decreasing</span>
            </div>
            <div className="space-y-2 text-xs">
              {decreasingProjects.map(p => (
                <div key={p.id} className="bg-white p-2.5 rounded-xs border border-risk-low-border/50">
                  <div className="flex justify-between font-mono text-[10px] text-ink-subtle">
                    <span>#{p.id}</span>
                    <span className="font-semibold text-risk-low-solid">{p.riskScore}/100</span>
                  </div>
                  <Link to={`/project/${p.id}`} className="font-medium text-ink hover:text-gov-teal line-clamp-1 block text-xs">
                    {p.name}
                  </Link>
                  <div className="text-[10px] text-ink-muted mt-1 font-mono">
                    Signal: {p.keyWarningSignal} (Approaching commissioning)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
