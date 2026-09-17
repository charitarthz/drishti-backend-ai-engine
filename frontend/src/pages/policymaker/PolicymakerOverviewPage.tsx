import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

export const PolicymakerOverviewPage: React.FC = () => {
  const total = MOCK_PROJECTS.length;
  const critical = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical');
  const high = MOCK_PROJECTS.filter(p => p.riskLevel === 'High');
  const medium = MOCK_PROJECTS.filter(p => p.riskLevel === 'Medium');
  const low = MOCK_PROJECTS.filter(p => p.riskLevel === 'Low');

  const criticalPct = Math.round((critical.length / total) * 100);
  const highPct = Math.round((high.length / total) * 100);
  const mediumPct = Math.round((medium.length / total) * 100);
  const lowPct = Math.round((low.length / total) * 100);

  // Sector analysis
  const sectorMap: Record<string, { count: number; avgRisk: number; criticalCount: number; highCount: number }> = {};
  MOCK_PROJECTS.forEach(p => {
    if (!sectorMap[p.sector]) {
      sectorMap[p.sector] = { count: 0, avgRisk: 0, criticalCount: 0, highCount: 0 };
    }
    sectorMap[p.sector].count += 1;
    sectorMap[p.sector].avgRisk += p.riskScore;
    if (p.riskLevel === 'Critical') sectorMap[p.sector].criticalCount += 1;
    if (p.riskLevel === 'High') sectorMap[p.sector].highCount += 1;
  });

  const sectors = Object.entries(sectorMap).map(([name, data]) => ({
    name,
    count: data.count,
    avgRisk: Math.round(data.avgRisk / data.count),
    criticalCount: data.criticalCount,
    highCount: data.highCount
  })).sort((a, b) => b.avgRisk - a.avgRisk);

  // Priority projects: top 5 highest risk
  const topPriority = [...MOCK_PROJECTS].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  // State overview summary
  const stateSummary = Array.from(new Set(MOCK_PROJECTS.map(p => p.state))).map(st => {
    const list = MOCK_PROJECTS.filter(p => p.state === st);
    const crit = list.filter(p => p.riskLevel === 'Critical').length;
    const avg = Math.round(list.reduce((acc, p) => acc + p.riskScore, 0) / list.length);
    return { state: st, count: list.length, criticalCount: crit, avgRisk: avg };
  }).sort((a, b) => b.avgRisk - a.avgRisk);

  // Emerging risk signals
  const acuteSignals = MOCK_PROJECTS.filter(p => p.progress.progressStall || p.trendDirection === 'Increasing').slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Central Infrastructure Strategy • Cabinet Oversight Perspective"
        title="National Infrastructure Risk Posture"
        subtitle={`Consolidated strategic intelligence on major central sector projects across India, tracking risk concentration across sectors, jurisdictions, and reporting cycles (${MOCK_REPORTING_MONTH}).`}
        badge="STRATEGIC OVERVIEW"
      />

      {/* Primary Strategic Information Band - Sophisticated Metric Hierarchy (No generic cards) */}
      <InformationBand
        cells={[
          { label: 'Monitored Capital Works', value: total, context: 'Ongoing Union Projects' },
          { label: 'Critical Risk', value: critical.length, context: `${criticalPct}% of portfolio (Score ≥ 80)`, emphasis: 'critical' },
          { label: 'High Risk', value: high.length, context: `${highPct}% of portfolio (Score 60–79)`, emphasis: 'high' },
          { label: 'Medium Risk', value: medium.length, context: `${mediumPct}% of portfolio (Score 40–59)` },
          { label: 'Low Risk', value: low.length, context: `${lowPct}% of portfolio (On Track)`, emphasis: 'positive' },
          { label: 'Escalating Trajectory', value: MOCK_PROJECTS.filter(p => p.trendDirection === 'Increasing').length, context: 'Worsening vs Last Cycle', emphasis: 'critical' },
        ]}
      />

      {/* Strategic Core Question Callout */}
      <div className="bg-white border-l-4 border-l-gov-terracotta border-y border-r border-gov-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-3xl">
          <div className="section-eyebrow text-ink-subtle">
            Key Inquiry for Union Policymakers & Cabinet Committees
          </div>
          <h2 className="editorial-title text-xl text-ink font-serif font-bold">
            Where is infrastructure project risk concentrated?
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Composite machine-learning evaluation identifies acute exposure in <strong>Railways, Power & Petrochemicals, and Northern corridor highways</strong>, where consecutive physical execution stalls and legacy schedule revisions compound fiscal risks.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            to="/policymaker/national-risk"
            className="px-3.5 py-2 bg-paper-subtle hover:bg-gov-border border border-gov-border text-xs font-mono font-medium text-ink transition-colors rounded-xs"
          >
            National Risk Analytics →
          </Link>
          <Link
            to="/policymaker/priority-projects"
            className="px-3.5 py-2 bg-ink hover:bg-ink-light text-white text-xs font-mono font-medium transition-colors rounded-xs"
          >
            Priority Watchlist ({critical.length}) →
          </Link>
        </div>
      </div>

      {/* Section 1 & 2: Split Layout - National Risk Distribution & Sector Concentration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: National Risk Distribution Breakdown */}
        <div className="lg:col-span-5 bg-white border border-gov-border rounded-xs p-6 space-y-5 shadow-subtle">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Portfolio Breakdown</div>
              <h3 className="editorial-title text-base text-ink font-semibold">1. National Risk Distribution</h3>
            </div>
            <Link to="/policymaker/national-risk" className="text-xs font-mono text-gov-terracotta hover:underline">
              Full Exposure →
            </Link>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-ink mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-risk-critical-solid rounded-xs inline-block" />
                  Critical Tier (Score 80–100)
                </span>
                <span className="tabular-figure font-bold text-risk-critical-solid">{critical.length} works ({criticalPct}%)</span>
              </div>
              <div className="w-full bg-paper-subtle h-2 rounded-xs overflow-hidden border border-gov-border">
                <div className="bg-risk-critical-solid h-full" style={{ width: `${criticalPct}%` }} />
              </div>
              <p className="text-[11px] text-ink-subtle mt-1 font-sans">
                Immediate intervention required; multiple compounding physical stalls and schedule delays.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-ink mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-risk-high-solid rounded-xs inline-block" />
                  High Risk Tier (Score 60–79)
                </span>
                <span className="tabular-figure font-bold text-risk-high-solid">{high.length} works ({highPct}%)</span>
              </div>
              <div className="w-full bg-paper-subtle h-2 rounded-xs overflow-hidden border border-gov-border">
                <div className="bg-risk-high-solid h-full" style={{ width: `${highPct}%` }} />
              </div>
              <p className="text-[11px] text-ink-subtle mt-1 font-sans">
                Elevated execution gap or time slippage; close administrative monitoring advised.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-ink mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-risk-low-solid rounded-xs inline-block" />
                  Low Risk Tier (Score &lt; 40)
                </span>
                <span className="tabular-figure font-bold text-risk-low-solid">{low.length} works ({lowPct}%)</span>
              </div>
              <div className="w-full bg-paper-subtle h-2 rounded-xs overflow-hidden border border-gov-border">
                <div className="bg-risk-low-solid h-full" style={{ width: `${lowPct}%` }} />
              </div>
              <p className="text-[11px] text-ink-subtle mt-1 font-sans">
                On-schedule milestones with minimal cost or milestone variances.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-gov-border text-[11px] text-ink-muted bg-paper-subtle p-3 rounded-xs">
            <span className="font-semibold text-ink">MoSPI PAIMANA Baseline Note:</span> Risk distribution reflects measurable physical progress rates, time overrun months, and cost revisions verified in the {MOCK_REPORTING_MONTH} cycle.
          </div>
        </div>

        {/* Right: Sector Risk Concentration Matrix */}
        <div className="lg:col-span-7 bg-white border border-gov-border rounded-xs p-6 space-y-4 shadow-subtle">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Sectoral Exposure</div>
              <h3 className="editorial-title text-base text-ink font-semibold">2. Risk Concentration by Sector</h3>
            </div>
            <Link to="/policymaker/ministries-sectors" className="text-xs font-mono text-gov-terracotta hover:underline">
              Sector Matrices →
            </Link>
          </div>

          <div className="space-y-3">
            {sectors.map((sec) => (
              <div key={sec.name} className="p-3 bg-paper-subtle border border-gov-border rounded-xs hover:border-ink/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink">{sec.name}</span>
                    <span className="font-mono text-[10px] text-ink-subtle">({sec.count} {sec.count === 1 ? 'project' : 'projects'})</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    {sec.criticalCount > 0 && (
                      <span className="text-[10px] text-risk-critical-solid font-bold">
                        {sec.criticalCount} Critical
                      </span>
                    )}
                    <span className="text-xs font-bold tabular-figure text-ink">
                      Avg Score: {sec.avgRisk}/100
                    </span>
                  </div>
                </div>

                {/* Progress bar representing sector risk score */}
                <div className="w-full bg-white h-2 rounded-xs overflow-hidden border border-gov-border">
                  <div
                    className={`h-full ${sec.avgRisk >= 80 ? 'bg-risk-critical-solid' : sec.avgRisk >= 60 ? 'bg-risk-high-solid' : 'bg-risk-low-solid'}`}
                    style={{ width: `${sec.avgRisk}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Priority Projects (Immediate Strategic Table) */}
      <div className="bg-white border border-gov-border rounded-xs shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-gov-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="section-eyebrow text-ink-subtle">Strategic Focus</div>
            <h3 className="editorial-title text-base text-ink font-semibold">3. Priority Capital Projects Under Review</h3>
          </div>
          <Link
            to="/policymaker/priority-projects"
            className="text-xs font-mono text-gov-terracotta hover:underline font-medium"
          >
            View All Priority Projects ({total}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Ministry & Sector</th>
                <th>State / UT</th>
                <th>SANKET Score</th>
                <th>Risk Tier</th>
                <th>Key Warning Signal</th>
                <th className="text-right">Inspection</th>
              </tr>
            </thead>
            <tbody>
              {topPriority.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono text-xs text-ink-subtle">#{p.id}</td>
                  <td className="font-medium text-ink max-w-xs">
                    <Link to={`/project/${p.id}`} className="hover:text-gov-terracotta transition-colors">
                      {p.name}
                    </Link>
                  </td>
                  <td className="text-xs text-ink-muted">
                    <div>{p.ministry}</div>
                    <div className="text-[10px] text-ink-subtle">{p.sector}</div>
                  </td>
                  <td className="text-xs text-ink">{p.state}</td>
                  <td className="tabular-figure font-bold text-sm text-ink">{p.riskScore}</td>
                  <td>
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td>
                    <span className="font-mono text-[11px] bg-paper-subtle px-2 py-0.5 border border-gov-border rounded-xs text-ink">
                      {p.keyWarningSignal}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link
                      to={`/project/${p.id}`}
                      className="text-xs font-mono font-medium text-gov-terracotta hover:underline"
                    >
                      Dossier →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4 & 5: Split Bottom Layout - Emerging Risk Signals & State / UT Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Emerging Risk Signals */}
        <div className="lg:col-span-6 bg-white border border-gov-border rounded-xs p-6 space-y-4 shadow-subtle">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Early Warnings</div>
              <h3 className="editorial-title text-base text-ink font-semibold">4. Emerging Risk Signals</h3>
            </div>
            <Link to="/policymaker/emerging-risks" className="text-xs font-mono text-gov-terracotta hover:underline">
              All Signals →
            </Link>
          </div>

          <div className="space-y-3">
            {acuteSignals.map((p) => (
              <div key={p.id} className="p-3.5 bg-paper-subtle border border-gov-border rounded-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-ink-subtle">#{p.id} • {p.sector}</span>
                    <h4 className="text-xs font-semibold text-ink">{p.name}</h4>
                  </div>
                  <RiskBadge level={p.riskLevel} size="sm" />
                </div>
                <div className="text-xs text-ink-muted flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gov-border/60 font-mono text-[11px]">
                  <span>
                    {p.progress.progressStall
                      ? `Execution stall: ${p.progress.progressRate}% / month run-rate`
                      : `Trajectory escalating: ${p.riskScore}/100 (+${p.riskScore - p.riskHistory[p.riskHistory.length - 2]?.score || 2} pts)`}
                  </span>
                  <Link to={`/project/${p.id}`} className="text-gov-terracotta font-semibold hover:underline">
                    Inspect →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: State / UT Geographic Overview */}
        <div className="lg:col-span-6 bg-white border border-gov-border rounded-xs p-6 space-y-4 shadow-subtle">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <div>
              <div className="section-eyebrow text-ink-subtle">Geographic Spread</div>
              <h3 className="editorial-title text-base text-ink font-semibold">5. State & Regional Overview</h3>
            </div>
            <Link to="/policymaker/states" className="text-xs font-mono text-gov-terracotta hover:underline">
              India Map & Matrix →
            </Link>
          </div>

          <div className="space-y-2.5">
            {stateSummary.slice(0, 5).map((st) => (
              <div key={st.state} className="p-3 bg-paper-subtle border border-gov-border rounded-xs flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-ink block">{st.state}</span>
                  <span className="font-mono text-[10px] text-ink-subtle">
                    {st.count} {st.count === 1 ? 'project' : 'projects'} monitored
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  {st.criticalCount > 0 ? (
                    <span className="text-[10px] font-bold text-risk-critical-solid bg-risk-critical-bg px-2 py-0.5 border border-risk-critical-border rounded-xs">
                      {st.criticalCount} Critical
                    </span>
                  ) : (
                    <span className="text-[10px] text-ink-subtle">0 Critical</span>
                  )}
                  <span className="font-semibold text-ink tabular-figure">
                    Avg: {st.avgRisk}/100
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/policymaker/states"
              className="inline-block text-xs font-mono text-gov-terracotta font-medium hover:underline"
            >
              Explore Interactive India States Map & Detailed Rankings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
