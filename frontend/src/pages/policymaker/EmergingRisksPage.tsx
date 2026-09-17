import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../../components/common/EditorialHeader';
import { InformationBand } from '../../components/common/InformationBand';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MOCK_PROJECTS, MOCK_REPORTING_MONTH } from '../../data/mockProjects';

type SignalCategory = 'ALL' | 'ESCALATING' | 'PROGRESS_STALL' | 'EXECUTION_GAP' | 'SCHEDULE_SLIP' | 'COST_VARIATION';

export const EmergingRisksPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SignalCategory>('ALL');

  // Filter criteria strictly based on measurable physical and financial signals:
  const newlyCritical = MOCK_PROJECTS.filter(p => p.riskLevel === 'Critical' && p.trendDirection === 'Increasing');
  const escalatingTrajectory = MOCK_PROJECTS.filter(p => p.trendDirection === 'Increasing');
  const progressStalls = MOCK_PROJECTS.filter(p => p.progress.progressStall);
  const wideningGaps = MOCK_PROJECTS.filter(p => p.progress.progressGap <= -20.0);
  const severeScheduleSlips = MOCK_PROJECTS.filter(p => p.schedule.timeOverrun >= 36);
  const highCostVariations = MOCK_PROJECTS.filter(p => p.cost.costOverrunPercent >= 25.0);

  // Active items based on category
  const activeProjects = MOCK_PROJECTS.filter(p => {
    if (activeCategory === 'ESCALATING') return p.trendDirection === 'Increasing';
    if (activeCategory === 'PROGRESS_STALL') return p.progress.progressStall;
    if (activeCategory === 'EXECUTION_GAP') return p.progress.progressGap <= -20.0;
    if (activeCategory === 'SCHEDULE_SLIP') return p.schedule.timeOverrun >= 36;
    if (activeCategory === 'COST_VARIATION') return p.cost.costOverrunPercent >= 25.0;
    // ALL: show any project that has at least one acute signal
    return (
      p.trendDirection === 'Increasing' ||
      p.progress.progressStall ||
      p.progress.progressGap <= -20.0 ||
      p.schedule.timeOverrun >= 36 ||
      p.cost.costOverrunPercent >= 25.0
    );
  }).sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <EditorialHeader
        eyebrow="Policymaker Intelligence • Early Warning Radar"
        title="Emerging Infrastructure Risks & Trajectory Deteriorations"
        subtitle={`Early-warning detection system flagging measurable deterioration in project execution velocity, multi-cycle score accelerations, and compounding cost variances (${MOCK_REPORTING_MONTH}).`}
        badge="EARLY WARNING RADAR"
      />

      {/* Information Band */}
      <InformationBand
        cells={[
          { label: 'Active Early Warnings', value: activeProjects.length, context: 'Triggered Thresholds' },
          { label: 'Newly Critical / Escalating', value: newlyCritical.length, context: `${escalatingTrajectory.length} Total Accelerating`, emphasis: 'critical' },
          { label: 'Severe Progress Stalls', value: progressStalls.length, context: 'Rate < 0.50% / Month', emphasis: 'critical' },
          { label: 'Widening Execution Gaps', value: wideningGaps.length, context: 'Deficit ≤ -20% Points', emphasis: 'high' },
          { label: 'Severe Schedule Slips', value: severeScheduleSlips.length, context: 'Delay ≥ 36 Months', emphasis: 'high' },
          { label: 'High Cost Variances', value: highCostVariations.length, context: 'Overrun ≥ +25.0%' },
        ]}
      />

      {/* Signal Category Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-paper-subtle p-1 border border-gov-border rounded-xs">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
              activeCategory === 'ALL'
                ? 'bg-ink text-white font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            All Signals ({activeProjects.length})
          </button>
          <button
            onClick={() => setActiveCategory('ESCALATING')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
              activeCategory === 'ESCALATING'
                ? 'bg-ink text-white font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            Escalating Trajectory ({escalatingTrajectory.length})
          </button>
          <button
            onClick={() => setActiveCategory('PROGRESS_STALL')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
              activeCategory === 'PROGRESS_STALL'
                ? 'bg-ink text-white font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            Progress Stalls ({progressStalls.length})
          </button>
          <button
            onClick={() => setActiveCategory('EXECUTION_GAP')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
              activeCategory === 'EXECUTION_GAP'
                ? 'bg-ink text-white font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            Execution Gap ≤ -20% ({wideningGaps.length})
          </button>
          <button
            onClick={() => setActiveCategory('SCHEDULE_SLIP')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
              activeCategory === 'SCHEDULE_SLIP'
                ? 'bg-ink text-white font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            Delay ≥ 36 Mos ({severeScheduleSlips.length})
          </button>
          <button
            onClick={() => setActiveCategory('COST_VARIATION')}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
              activeCategory === 'COST_VARIATION'
                ? 'bg-ink text-white font-bold'
                : 'text-ink-muted hover:text-ink hover:bg-gov-border/40'
            }`}
          >
            Cost Overrun ≥ 25% ({highCostVariations.length})
          </button>
        </div>

        <span className="text-[11px] font-mono text-ink-subtle">
          Signals derived from PAIMANA field filings
        </span>
      </div>

      {/* Grid of Structured Early Warning Dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeProjects.map((p) => {
          const prevScore = p.riskHistory[p.riskHistory.length - 2]?.score || p.riskScore;
          const scoreDelta = p.riskScore - prevScore;
          const topDriver = p.shapDrivers[0];

          return (
            <div
              key={p.id}
              className="bg-white border border-gov-border rounded-xs p-6 space-y-4 shadow-subtle hover:border-ink/50 transition-colors"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-gov-border pb-3">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-ink-subtle">
                    <span>#{p.id}</span>
                    <span>•</span>
                    <span>{p.ministry}</span>
                  </div>
                  <h3 className="editorial-title text-base font-semibold text-ink mt-0.5">
                    {p.name}
                  </h3>
                  <div className="text-[11px] text-ink-muted mt-0.5">
                    {p.sector} • {p.state}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <RiskBadge level={p.riskLevel} size="sm" />
                  <span className="font-mono text-xs font-bold text-ink tabular-figure">
                    Score: {p.riskScore}/100
                  </span>
                </div>
              </div>

              {/* Measurable Early Warning Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className={`p-2 rounded-xs border ${p.trendDirection === 'Increasing' ? 'bg-red-50 border-red-200' : 'bg-paper-subtle border-gov-border'}`}>
                  <span className="text-[10px] text-ink-subtle block">Trajectory</span>
                  <span className={`font-bold ${p.trendDirection === 'Increasing' ? 'text-risk-critical-solid' : 'text-ink'}`}>
                    {p.trendDirection} {scoreDelta > 0 && `(+${scoreDelta})`}
                  </span>
                </div>

                <div className={`p-2 rounded-xs border ${p.progress.progressStall ? 'bg-red-50 border-red-200' : 'bg-paper-subtle border-gov-border'}`}>
                  <span className="text-[10px] text-ink-subtle block">Progress Rate</span>
                  <span className={`font-bold ${p.progress.progressStall ? 'text-risk-critical-solid' : 'text-ink'}`}>
                    {p.progress.progressRate}% / mo
                  </span>
                </div>

                <div className={`p-2 rounded-xs border ${p.progress.progressGap <= -20 ? 'bg-red-50 border-red-200' : 'bg-paper-subtle border-gov-border'}`}>
                  <span className="text-[10px] text-ink-subtle block">Execution Gap</span>
                  <span className={`font-bold ${p.progress.progressGap <= -20 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                    {p.progress.progressGap}% pts
                  </span>
                </div>

                <div className={`p-2 rounded-xs border ${p.schedule.timeOverrun >= 36 ? 'bg-red-50 border-red-200' : 'bg-paper-subtle border-gov-border'}`}>
                  <span className="text-[10px] text-ink-subtle block">Time Overrun</span>
                  <span className={`font-bold ${p.schedule.timeOverrun >= 36 ? 'text-risk-critical-solid' : 'text-ink'}`}>
                    +{p.schedule.timeOverrun} mos
                  </span>
                </div>
              </div>

              {/* Verifiable Explanation Panel */}
              <div className="p-3 bg-paper-subtle border border-gov-border rounded-xs space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-semibold text-ink">PRIMARY MEASURABLE SIGNAL:</span>
                  <span className="text-gov-terracotta font-semibold">{p.keyWarningSignal}</span>
                </div>
                {topDriver && (
                  <p className="text-ink text-[11px] leading-relaxed font-sans">
                    <strong>Algorithmic Attribution:</strong> {topDriver.evidence}
                  </p>
                )}
                <div className="font-mono text-[10px] text-ink-subtle pt-1 border-t border-gov-border/60">
                  Source: {p.evidence.sourceReport} ({p.evidence.sourcePage})
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-gov-border text-xs font-mono">
                <span className="text-ink-subtle text-[11px]">
                  Reported Milestone Target: {p.evidence.verifiableFacts[0]?.value || 'Verified'}
                </span>
                <Link
                  to={`/project/${p.id}`}
                  className="text-gov-terracotta hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Inspect Complete Intelligence Dossier</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
